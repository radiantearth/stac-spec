# Sort API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

By default, the STAC search endpoint `/stac/search` returns results in no specified order.  Whatever order the results are in is up to the implementor, and will typically default to an arbitrary that is fastest for the underlying data store to retrieve results.
 
 The Sort API Extension adds a new parameter, `sortby`, that allows the user to define fields by which to sort results. Only string, numeric, and datetime attributes of Item (`id` and `collection` only) or Item Properties (any attributes) may be used to sort results.  It is not required that implementations support sorting over all attributes, but implementations should return an error when attempting to sort over a field that does not support sorting. 

Two values for direction are supported: "asc" (ascending) or "desc" (descending). If the direction is not specified, the value is ascending. The `sortby` value is an array, so multiple sort fields can be defined which will be used to sort the data in the order provided (e.g., first by `datetime`, then by `eo:cloud_cover`).

## GET or POST Form

When calling `/stac/search` using GET or POST with `Content-Type: application/x-www-form-urlencoded` or `Content-Type: multipart/form-data`, the semantics are the same, except the syntax is a single parameter `sortby` with a comma-separated list of "<name>|<direction>" definitions.  It is recommended that in implementations, direction be mandatory, and that an error should result from not specifying a direction.

Examples of `sortby` parameter:

    GET /stac/search?sortby=created|asc
    
    GET /stac/search?sortby=created|asc,id|desc
    
    GET /stac/search?sortby=properties.eo:cloud_cover|desc

# POST JSON Entity

When calling `/stac/search` using POST with`Content-Type: application/json`, this extension adds an attribute `sortby` with an object value to the core JSON search request body.

The syntax for the `sortby` attribute is:

```json
{
    "sortby": [
        {
            "field": "<property_name>",
            "direction": "<direction>"
        }
    ]
}
```

```json
{
    "sortby": [
        {
            "field": "created",
            "direction": "asc"
        },
        {
            "field": "properties.eo:cloud_cover",
            "direction": "desc"
        },
        {
            "field": "id",
            "direction": "desc"
        },
        {
            "field": "collection",
            "direction": "desc"
        }
    ]
}
```

