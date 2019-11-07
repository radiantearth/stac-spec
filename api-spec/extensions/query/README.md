# Query API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/search`, by default only accepts the core filter parameters given in the *[api-spec](../../api-spec.md)*. The Query API extension adds additional filters for searching on the properties of Items.

The syntax for the `query` filter is:

<!-- use unflavored code here, as <value> is not valid JSON and is highlighted as an error -->
```
{
  "query": {
    "<property_name>": {
      "<operator>": <value>
    }
  }
}
```

Each property to search is an entry in the `query` filter. <operator> can be one of: `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `startsWith`, `endsWith`, `contains`, `in`. 
Multiple operators may be provided for each property and are treated as a logical AND, where all conditions must be met.

### Examples

Find scenes with cloud cover between 0 and 10%:

```json
{
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
