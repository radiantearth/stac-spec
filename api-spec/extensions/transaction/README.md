# Transaction API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Electro-Optical (EO) Extension to a STAC Item. EO
data is considered to be data that represents a snapshot of the earth for a single date and time. It
could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO
data include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on
Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8).

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