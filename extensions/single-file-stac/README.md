# Single File STAC Specification

- **Title: Single File STAC**
- **Identifier: single-file-stac**
- **Field Name Prefix: -**
- **Scope: ItemCollection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

An extension to provide a set of Collections and Items as a single file catalog. The single file is a self contained catalog that contains everything that would normally be in a linked set of STAC files. This format is useful to save a portion of a catalog, or when creating a small catalog from derived data that should remain portable. It is most useful for saving the results of a search from a STAC API, as the Items, Collections, and optionally the search parameters are all saved within the single file. Hierarchical links have no meaning in a single file STAC, and so, if present, should be removed when creating a single file catalog.

The Items in the single file catalog should not be merged with the Collection properties (i.e., common properties). The Collections are all included in the file as well, so there is no need to duplicate the common properties for every Item in the catalog.

- [Example](examples/example-search.json)
- [JSON Schema](json-schema/schema.json)

## Catalog fields

A Single File STAC is a complete STAC catalog contained in a single file. 

A Single File STAC is an [ItemCollection Object](../../item-spec/itemcollection-spec.md). This GeoJSON FeatureCollection has Features which are Items, but the Collections are still needed.

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| collections | [[Collection](../../collection-spec/collection-spec.md#collection-fields)] | An array of Collections that are used by any of the Items in the ItemCollection. |
| search | [Search Object](#search-object) | An optional field containing a search endpoint and parameters used to generate this Single File STAC |

## Search Object

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| endpoint | string | The root endpoint of a STAC API used for this search.                  |
| parameters | Map<string, Object> | A dictionary of all the parameters used for the search. |

## Implementations

- [sat-search](https://github.com/sat-utils/sat-search) uses the Single File Catalog to save and load search results.
