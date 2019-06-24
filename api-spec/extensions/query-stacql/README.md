# STACQL Query API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/stac/search`, by default only accepts the core filter parameters given in the *[api-spec](../../api-spec.md)*. The STACQL Query API extension adds additional filters for searching on the properties of Items.

The intentional with this query language is to provide a standard option that is straightforward to understand,
implement, and use, at the expense of limited expressiveness.

The value for the `query_profile` parameter is `stacql`.

The syntax for the `query` filter is:

<!-- use unflavored code here, as <value> is not valid JSON and is highlighted as an error -->
```
{
  "query_profile": "stacql",
  "query": {
    "<property_name>": {
      "<operator>": <value>
    }
  }
}
```

Each property to search is an field in the `query` filter object. <operator> must be one 
of: `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `startsWith`, `endsWith`, `contains`, `in`. 

Multiple operators may be provided for each property and are treated as a logical AND, where all conditions must be met.

## Examples

Find scenes with cloud cover between 0 and 10%:

```json
{
  "query_profile": "stacql",
  "query": {
    "eo:cloud_cover": {
      "gte": 0,
      "lte": 10
    },
    "stringAttr1": {
      "startsWith": "abc",
      "endsWith": "xyz"
    },
    "stringAttr2": {
      "contains": "mnop"
    },
    "stringAttr3": {
      "in": ["landsat", "modis", "naip"]
    }
  }
}
```

## Design Note

An alternative approach, and somewhat more conventional for JSON, would be to represent the predicates as an array of
objects each representing a single predicate:

```json
{
  "query_profile": "stacql",
  "query": [
    { 
      "field": "eo:cloud_cover",
      "operator": "gte",
      "value": 0
    },
    { 
      "field": "eo:cloud_cover",
      "operator": "lte",
      "value": 10
    }
  ]
}
``` 

However, this syntax results in larger strings, which are more difficult to write correctly when constructing simple
GET requests. 
