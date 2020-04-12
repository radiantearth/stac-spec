# Sort API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

By default, the STAC search endpoint `/search` returns results in no specified order.  Whatever order the results are in 
is up to the implementor, and will typically default to an arbitrary order that is fastest for the underlying data store 
to retrieve results.
 
The Sort API Extension adds a new parameter, `sortby`, that allows the user to define fields by which to sort results. 
Only string, numeric, and datetime attributes of Item (`id` and `collection` only) or Item Properties (any attributes) 
may be used to sort results.  It is not required that implementations support sorting over all attributes, but 
implementations should return an error when attempting to sort over a field that does not support sorting. 

Fields may be sorted in ascending or descending order.  The syntax between GET requests and POST requests with a JSON 
body vary.  The `sortby` value is an array, so multiple sort fields can be defined which will be used to sort 
the data in the order provided (e.g., first by `datetime`, then by `eo:cloud_cover`).

## HTTP GET (or POST Form)

When calling `/search` using GET (or POST with `Content-Type: application/x-www-form-urlencoded` or 
`Content-Type: multipart/form-data)`, a single parameter `sortby` with a comma-separated list of item field names should 
be provided. The field names may be prefixed with either "+" for ascending, or "-" for descending.  If no sign is 
provided before the field name, it will be assumed to be "+". 

Examples of `sortby` parameter:

    1. GET /search?sortby=properties.published
    
    2. GET /search?sortby=+properties.published
    
    3. GET /search?sortby=properties.published,-id
    
    4. GET /search?sortby=+properties.published,-id
    
    5. GET /search?sortby=-properties.eo:cloud_cover
    
Note that examples 1 and 2 are symantically equivalent, as well as examples 3 and 4.
ß
# HTTP POST JSON Entity

When calling `/search` using POST with`Content-Type: application/json`, this extension adds an attribute `sortby` with 
an object value to the core JSON search request body.

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
            "field": "properties.published",
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

