# Search Extension Specification

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Proposal**

This extension is intended to augment the core ItemCollection object when the ItemCollection is the result of a 
search, for example, from calling the `/stac/search` API endpoint.

- [Example](examples/example.json)
- [JSON Schema](json-schema/schema.json)

### ItemCollection fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| `search:metadata` | SearchMetadata Object | **REQUIRED.** The search-related metadata for the [ItemCollection](../itemcollection-spec/README.md). |

### SearchMetadata Object

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| next         | string\|null  | **REQUIRED.** The value to set for the `next` query parameter in order to get the next page of results |
| returned     | integer       | **REQUIRED*** count of results returned by this response. equal to the cardinality of features array |
| limit        | integer\|null | Max number of results requested explicitly or the default limit used if no parameter was provide, or null if no limit placed on the results |
| found        | integer       | Count of total number of results for this query, possibly estimated, particularly in the context of NoSQL data stores |
| properties   | Map<string,any> | A dictionary of additional metadata related to the search. |

The ability to implement meaningful semantics for the `next` query parameter and `next` SearchMeta field is related to the use of a stable sort over query result items.  The default sort of query results should be stable, but may not be depending on the data store's sorting performance.  It is recommended that the [Sort API Extension](../../api-spec/extensions/sort/README.md) be implemented in conjunction with this extension and that fields conducive to stable sorting have sorting enabled over them.  
