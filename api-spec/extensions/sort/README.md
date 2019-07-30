# Sort API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

By default, the STAC search endpoint `/stac/search` returns results in no specified order.  Whatever order the results are in is up to the implementor, and will typically default to an arbitrary that is fastest for the underlying data store to retrieve results.
 
 The Sort API Extension adds a new field, `sort`, that allows the user to define fields by which to sort results. Only string, numeric, and datetime attributes of Item or Item Properties may be used to sort results.  It is not required that implementations support sorting over all attributes, but implementations should return an error when attempting to sort over a field that does not support sorting. 

Two value for direction are supported, "asc" (ascending) or "desc" (descending). The `sort` value is an array, so multiple sort fields can be defined which will be used to sort the data in the order provided (e.g., first by `properties.datetime`, then by `properties.eo:cloud_cover`).

## GET or POST Form

When calling `/stac/search` using GET or POST with `Content-Type: application/x-www-form-urlencoded` or `Content-Type: multipart/form-data`, the semantics are the same, except the syntax is a single parameter `sort` with a comma-separated list of "<name>|<direction>" definitions.  The sort order must be specified.

Examples of `sort` parameter:

    GET /stac/search?sort=properties.created|asc,id|desc
    
    GET /stac/search?sort=properties.eo:cloud_cover|desc

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

