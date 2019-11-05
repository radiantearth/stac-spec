# Sort API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/items`, by default returns results in descending order using the datetime property. The sort API extension adds a new parameter, `sort` that allows the user to define fields to sort results by. Only properties may be used to sort results. The syntax for the `sort` parameter is:

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

where <direction> is either "asc" (ascending) or "desc" (descending). The `sort` value is an array, so multiple sort fields can be defined which will be used to sort the data in the order provided (e.g., first by `datetime`, then by `eo:cloud_cover`).
