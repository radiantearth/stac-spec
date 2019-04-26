# Query API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/stac/search`, by default only accepts the core filter parameters given in the *[api-spec](../../api-spec.md)*. The Query API extension adds additional filters for searching on the properties of Items.

The syntax for the `query` filter is:

```json
{
  "query": {
    "<property_name>": {
      "<operator>": <value>
    }
  }
}
```

Each property to search is an entry in the `query` filter. <operator> can be one of: eq, neq, lt, lte, gt, gte, startsWith, endsWith, contains. Multiple operators can be provided for each property which is treated as a logical AND, all conditions must be met.

### Examples

Find scenes with cloud cover between 0 and 10%:

```json
{
  "query": {
    "<o:cloud_cover": {
      "gte": 0,
      "lte": 10
    }
  }
}
```
