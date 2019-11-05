# CRUD API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The core API doesn't support adding, editing, or removing items. The CRUD API extension supports the creation, editing, and deleting of items through POST, PUT, PATCH, and DELETE requests.

The PUT, PATCH, and DELETE methods **may** support optimistic locking through use of ETags to solve the [Lost Update Problem](https://www.w3.org/1999/04/Editing/). See also: [ETags and Optimistic Concurrency Control](https://fideloper.com/etags-and-optimistic-concurrency-control).

## Single Item CRUD Methods

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionId}/items`              | `application/json`  | Adds a new [Item](../item-spec/item-spec.md), to a collection. |
| `PUT /collections/{collectionId}/items/{featureId}`   | `application/json`  | Updates an existing item by ID using a complete item description. The request **may** contain an If-Match: ETag header to support optimistic locking. |
| `PATCH /collections/{collectionId}/items/{featureId}` | `application/json`  | Updates an existing item by ID using a partial item description, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). The request **may** contain an If-Match: ETag header to support optimistic locking. |
| `DELETE /collections/{collectionId}/items/{featureId}`| n/a                 | Deletes an existing item by ID. The request **may** contain an If-Match: ETag header to support optimistic locking. |

## Bulk CRUD Methods

Note: this API is **not** transactional. That is, updates are not rolled back if one of the operations fails. Each operation in a bulk update succeeds or fails independently.

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionId}/items`              | `application/json`  | Adds a number of items to a collection. |
| `DELETE /collections/{collectionId}/items`            | `application/json`  | Deletes all the items in the collection (convenient, but potentially susceptible to lost updates). |

The request body for a bulk POST request is an [ItemCollection](../../../item-spec/itemcollection-spec.md).

A bulk POST operation returns an HTTP 207 Multi-Status response with a `multistatus` array of individual response objects, and a `metadata` object. See: [RFC 4918 Multi-Status Response](https://tools.ietf.org/html/rfc4918#section-13).

The order of the response objects in the `multistatus` array corresponds to the order of the `features` array in the request body's [ItemCollection](../../../item-spec/itemcollection-spec.md). This way a client can correlate a specific item in the request body with its corresponding response.

The `metadata` object in the Multi-Status response gives the client a quick way to determine if everything succeeded or not, so it only needs to inspect the `multistatus` array for details if there was an error.

### Bulk POST Example

POST an [ItemCollection](../../../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionId}/items`:

Example Response:
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

### Bulk DELETE Example

DELETE `/collections/{collectionId}/items`:

Example Responses:
```
HTTP 204 No content (Successful delete of all items in the collection)
or
HTTP 500 An error occurred (One or more items in the collection was not deleted)
