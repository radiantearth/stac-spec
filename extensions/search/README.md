# Search API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Proposal**

This extension in intended to augment the core ItemCollection object when the ItemCollection is the result of a 
search, for example, from calling the `/stac/search` API endpoint.  object

### ItemCollection fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| `search:meta`  | SearchMeta | **REQUIRED.** The search-related metadata for the ItemCollection |

### SearchMeta fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| next         | string \| null | **REQUIRED.** The value to set the `next` query parameter in order to get  |
| limit        | number \| null | max number of results requested or defaulted, or null if no limit       |
| found        | number         | estimated count of total number of results for this query.   |
| returned     | number         | **REQUIRED*** count of results returned by this response. equal to the cardinality of features array   |
| properties   | Properties Object | A dictionary of additional metadata related to the search. |
  
```json
{
  "type": "FeatureCollection",
  "features": [ ],
  "search:meta": {
    "next": "2", 
    "limit": 10, 
    "found": 1092873, 
    "returned": 9,
    "properties": {
     "elasticsearch_query": {
          "endpoint": "https://vpc-asset-catalog-prod-xyz.us-east-1.es.amazonaws.com:443",
          "executionDuration": 782,
          "index": "items_prod",
          "path": "POST:/items_prod/item/_search?",
          "query": "{\"query\":{\"bool\":{}},\"size\":10}"
        }
    }
  }
}
```
