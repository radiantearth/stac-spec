# Transaction Extension Specification for WFS3 Core / STAC

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This folder contains an API extension to support the creation, editing, and deleting of items on a
specific WFS3 collection.

## Methods

| Path                                                  | Description                                                                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `POST /collections/{collectionID}/items`              | Adds a new item to a collection.                                                                                                 |
| `PUT /collections/{collectionId}/items/{featureId}`   | Updates an existing item by ID using a complete item description.                                                                |
| `PATCH /collections/{collectionId}/items/{featureId}` | Updates an existing item by ID using a partial item description, compliant with [RFC 7386](https://tools.ietf.org/html/rfc7386). |
| `DELETE /collections/{collectionID}/items`            | Deletes an existing item by ID.                                                                                                  |

## Items

As defined here, these methods operate on STAC Items and both STAC and WFS3 Collections. However, apart from the
body schema defining the STAC Item "payload", these API methods are completely generic and could be
reused as an extension for WFS3 Core.

## Implementations

Both Boundless and Harris servers have sample [implementations](../../implementations.md) of this transaction extension.