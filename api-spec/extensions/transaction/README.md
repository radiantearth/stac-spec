# Transaction API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The core API doesn't support adding, editing, or removing items. The transaction API extension supports the creation, editing, and deleting of items through POST, PUT, PATCH, and DELETE requests.

Transactions support optimistic locking through use of the ETag header.

## Methods

| Path                                                  | Content-Type Header | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| `POST /collections/{collectionID}/items`              | `application/json`  | Adds a new item to a collection. |
| `PUT /collections/{collectionId}/items/{featureId}`   | `application/json`  | Updates an existing item by ID using a complete item description. |
| `PATCH /collections/{collectionId}/items/{featureId}` | `application/json`  | Updates an existing item by ID using a partial item description, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). |
| `DELETE /collections/{collectionID}/items/{featureId}`| n/a                 | Deletes an existing item by ID. |