# Sort API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/stac/search`, by default returns results in descending order using the datetime property. The Sor API Extension adds a new field, `sort`, that allows the user to define fields by which to sort results. Only string and numeric attributes of Item or Item Properties may be used to sort results.  It is not required that implements support sorting over all attributes. 

Two value for direction are supported, "asc" (ascending) or "desc" (descending). The `sort` value is an array, so multiple sort fields can be defined which will be used to sort the data in the order provided (e.g., first by `properties.datetime`, then by `properties.eo:cloud_cover`).

## GET or POST Form

When calling `/stac/search` using GET or POST with `Content-Type: application/x-www-form-urlencoded` or `Content-Type: multipart/form-data`, the semantics are the same, except the syntax is a single parameter `sort` with a comma-separated list of "<name>|<direction>" definitions.

The syntax for the `sort` parameter is:

    GET /stac/search?sort=properties.created|asc,id|desc

# POST JSON Entity

When calling `/stac/search` using POST with`Content-Type: application/json`, this extension adds an attribute `sort` with an object value to the core JSON search request body.

The syntax for the `sort` attribute is:

```json
{
    "sort": [
        {
            "field": "<property_name>",
            "direction": "<direction>"
        }
    ]
}
```

```json
{
    "sort": [
        {
            "field": "properties.created",
            "direction": "asc"
        },
        {
            "field": "id",
            "direction": "desc"
        }
    ]
}
```

