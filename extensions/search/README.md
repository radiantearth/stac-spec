# Search Extension Specification

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Proposal**

This extension is intended to augment the core ItemCollection object when the ItemCollection is the result of a 
search, for example, from calling the `/stac/search` API endpoint.  

## ItemCollection Properties Search fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| search:next         | string \| null | **REQUIRED.** The value to set for the `next` query parameter in order to get the next page of results |
| search:returned     | number         | **REQUIRED*** count of results returned by this response. equal to the cardinality of features array |
| search:limit        | number \| null | Max number of results requested explicitly or the default limit used if no parameter was provide, or null if no limit placed on the results|
| search:found        | number         | Count of total number of results for this query, possibly estimated, particularly in the context of NoSQL data stores |

The ability to implement meaningful semantics for the `next` query parameter and `next` Search Extension field is related to the use of a stable sort over query result items.  The default sort of query results should be stable, but may not be depending on the data store's sorting performance.  It is recommended that the [Sort API Extension](../../api-spec/extensions/sort/README.md) be implemented in conjunction with this extension and that fields conducive to stable sorting have sorting enabled over them.  

## Example ItemCollection augmented with Search Extension attributes
  
```json
{
  "type": "FeatureCollection",
  "features": [ ],
  "properties" : {
      "search:next": "2",
      "search:limit": 10,
      "search:found": 1092873,
      "search:returned": 9
  }
}
```
