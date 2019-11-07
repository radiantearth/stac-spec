# Context Extension Specification

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Proposal**

This extension is intended to augment the core [ItemCollection](../../../item-spec/itemcollection-spec.md) object when the ItemCollection is the result of a 
search, for example, from calling the `/search` API endpoint.

- [Example](examples/example.json)
- [JSON Schema](json-schema/schema.json)

### ItemCollection fields

| Element           | Type                  | Description                                                  |
| ----------------- | --------------------- | ------------------------------------------------------------ |
| `context` | [Context Object](#context-object) | **REQUIRED.** The search-related metadata for the [ItemCollection](../../../item-spec/itemcollection-spec.md). |

### Context Object

| Element      | Type            | Description                                                  |
| ------------ | --------------- | ------------------------------------------------------------ |
| returned     | integer         | **REQUIRED** The count of results returned by this response. equal to the cardinality of features array |
| limit        | integer \| null | The maximum number of results to which the result was limited |
| matched        | integer         | The count of total number of results that match for this query, possibly estimated, particularly in the context of NoSQL data stores |

  The default sort of query results should be stable, but may not be depending on the data store's sorting performance.  It is recommended that the [Sort API Extension](../sort/README.md) be implemented in conjunction with this extension and that fields conducive to stable sorting have sorting enabled over them.  

**limit** - The maximum number of results requested explicitly, the default limit used by the service implementation if no parameter was provided, or the maximum limit used by the service implementation if the limit parameter was larger. `null` if no limit was placed on the query that retrieved these results, which should be a rare case in practice.

## Example ItemCollection augmented with Context field
  
```json
{
  "type": "FeatureCollection",
  "features": [ ],
  "context": {
    "limit": 10, 
    "matched": 1092873, 
    "returned": 9
  }
}
```
