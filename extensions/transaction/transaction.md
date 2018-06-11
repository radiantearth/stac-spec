# Transaction Extensions for WFS3 Core / STAC

This folder contains an API extension to support the creation, editing, and deleting of items on a specific WFS3 collection. 

## Methods

| Path             | Description               |
|----------------------|---------------------------|
| POST /collections/{collectionID}/items | adds a new item to a collection |
| PUT /collections/{collectionId}/items/{featureId} | updates an existing item by ID using a complete item description |
| PATCH /collections/{collectionId}/items/{featureId} | updates an existing item by ID using a partial item description, compliant with RFC 7386 |
| DELETE /collections/{collectionID}/items | deletes an existing item by ID |
| | |

## Items

As defined here, these methods operate on STAC items and item collections. However, apart from the body schema defining the STAC item "payload", these API methods are completely generic and could be reused as an extension for WFS3 Core.

## Swagger 2

The [WFS3core+STAC+extensions.yaml](WFS3core+STAC+extensions.yaml) and [transaction-fragment.yaml](transaction-fragment.yaml) documents are defined as OpenAPI3-compliant. However, the [Swagger2-compliant](WFS3core+STAC+extensions-swagger2.yaml) document differs slightly on the POST method, supporting only itemCollections. 
