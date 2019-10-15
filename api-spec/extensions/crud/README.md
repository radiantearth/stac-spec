# CRUD API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The core API doesn't support adding, editing, or removing items. The CRUD API extension supports the creation, editing, and deleting of items through POST, PUT, PATCH, and DELETE requests.

The PUT and DELETE methods support optimistic locking through use of an If-Match: ETag header.

## Single Item CRUD Methods

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionID}/items`              | `application/json`  | Adds a new [Item](../item-spec/item-spec.md), to a collection. |
| `PUT /collections/{collectionId}/items/{featureId}`   | `application/json`  | Updates an existing item by ID using a complete item description. The request *must* contain an If-Match: ETag header to support optimistic locking. |
| `PATCH /collections/{collectionId}/items/{featureId}` | `application/json`  | Updates an existing item by ID using a partial item description, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). The request *may* contain an If-Match: ETag header to support optimistic locking. |
| `DELETE /collections/{collectionID}/items/{featureId}`| n/a                 | Deletes an existing item by ID. The request *must* contain an If-Match: ETag header to support optimistic locking. |

## Bulk CRUD Methods

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionID}/items`              | `application/json`  | Adds an [ItemCollection](../item-spec/itemcollection-spec.md) to a collection. |
| `PUT /collections/{collectionId}/items/`              | `application/json`  | Updates a number of items by their IDs using complete item descriptions. The items in the request body *must* contain an id and an etag field to support optimistic locking. |
| `PATCH /collections/{collectionId}/items/`            | `application/json`  | Updates a number of items by their IDs using partial item descriptions, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). The items in the request body *must* contain an id and *may* contain an etag field to support optimistic locking. |
| `DELETE /collections/{collectionID}/items/`           | `application/json`  | Deletes a collection of existing items by their IDs. The items in the request body *must* contain an id and an etag field to support optimistic locking. |

### Bulk POST Example

POST an [ItemCollection](../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionID}/items`:

Example Response:
See: [RFC 4918 Multi-Status Response](https://tools.ietf.org/html/rfc4918#section-13)
```
HTTP 207
{
  "multistatus": [
    {
      "status": 201
      "message": "Created",
      "href": "<link to newly created item>"
    },
    {
      "status": 400
      "message": "Bad Request, invalid STAC item",
      "href": null
    },
    {
      "status": 201
      "message": "Created",
      "href": "<link to newly created item>"
    }
  ],
  "metadata": {
    "succeeded": 2,
    "failed": 1,
    "total": 3
  }
}
```

The order of the response objects in the `multistatus` array corresponds to the order of the `features` array in the POST'ed [ItemCollection](../item-spec/itemcollection-spec.md).

The metadata object in the response gives the client a quick way to determine if everything succeeded or not, so it only needs to inspect the multistatus array if there was an error.

### Bulk PUT Example

PUT an [ItemCollection](../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionID}/items`:
E.g. PUT request body
```
{
  "type": "FeatureCollection",
  "features": [{
    "id": "id1",
    "etag": "etag1",
    ... // a full item description
  },
  {
    "id": "id2",
    "etag": "etag2",
    ... // a full item description
  },
  {
    "id": "id3",
    "etag": "etag2",
    ... // a full item description
  }]
}
```

Example Response:
```
HTTP 207
{
  "multistatus": [
    {
      "status": 200
      "message": "OK",
      "href": "<link to newly replaced item: id1>"
    },
    {
      "status": 400
      "message": "Bad Request, invalid STAC item",
      "href": null
    },
    {
      "status": 412
      "message": "Precondition Failed, ETag does not match",
      "href": null
    }
  ],
  "metadata": {
    "succeeded": 1,
    "failed": 2,
    "total": 3
  }
}
```

### Bulk PATCH Example

PATCH an [ItemCollection](../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionID}/items`:
E.g. PATCH request body
```
{
  "type": "FeatureCollection",
  "features": [{
    "id": "id1",
    ... // a partial item description
  },
  {
    "id": "id2",
    ... // a partial item description
  },
  {
    "id": "id3",
    ... // a partial item description
  }]
}
```

Example Response:
```
HTTP 207
{
  "multistatus": [
    {
      "status": 200
      "message": "OK",
      "href": "<link to newly patched item: id1>"
    },
    {
      "status": 404
      "message": "Not Found",
      "href": null
    },
    {
      "status": 400
      "message": "Bad Request, invalid patch",
      "href": null
    }
  ],
  "metadata": {
    "succeeded": 1,
    "failed": 2,
    "total": 3
  }
}
```

### Bulk DELETE Example

DELETE an [ItemCollection](../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionID}/items`:
E.g. DELETE request body
```
{
  "type": "FeatureCollection",
  "features": [{
    "id": "id1",
    "etag": "etag1"
  },
  {
    "id": "id2",
    "etag": "etag2"
  },
  {
    "id": "id3",
    "etag": "etag2"
  }]
}
```

Example Response:
```
HTTP 207
{
  "multistatus": [
    {
      "status": 204
      "message": "No Content"
    },
    {
      "status": 404
      "message": "Not Found"
    },
    {
      "status": 412
      "message": "Precondition Failed, ETag does not match"
    }
  ],
  "metadata": {
    "succeeded": 1,
    "failed": 2,
    "total": 3
  }
}
```
