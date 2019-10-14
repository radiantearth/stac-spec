# CRUD API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The core API doesn't support adding, editing, or removing items. The CRUD API extension supports the creation, editing, and deleting of items through POST, PUT, PATCH, and DELETE requests.

The PUT and DELETE methods support optimistic locking through use of an If-Match: ETag header.

## Methods

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionID}/items`              | `application/json`  | Adds a new [Item](../item-spec/item-spec.md), or [ItemCollection](../item-spec/itemcollection-spec.md) to a collection. |
| `PUT /collections/{collectionId}/items/{featureId}`   | `application/json`  | Updates an existing item by ID using a complete item description. |
| `PATCH /collections/{collectionId}/items/{featureId}` | `application/json`  | Updates an existing item by ID using a partial item description, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). |
| `DELETE /collections/{collectionID}/items/{featureId}`| n/a                 | Deletes an existing item by ID. |

## Bulk POST Example

POST an [ItemCollection](../item-spec/itemcollection-spec.md) with 3 items to `/collections/{collectionID}/items`:

Example Response:
See: [RFC 4918 Multi-Status Response](https://tools.ietf.org/html/rfc4918#section-13)
```
HTTP 207
{
  "multistatus": [
    {
      "status": 200
      "message": "OK",
      "href": "<link to newly created item>"
    },
    {
      "status": 400
      "message": "Bad Request, invalid STAC item",
      "href": null
    },
    {
      "status": 200
      "message": "OK",
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

The order of the response objects in the `multistatus` array corresponds to the order of the features array in the POST'ed [ItemCollection](../item-spec/itemcollection-spec.md).

The metadata object gives the client a quick way to determine if everything succeeded or not, so it only needs to inspect the multistatus array if there was an error.
