# Single File STAC Specification

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

An extension to provide a set of Collections and Items as a single file catalog.

- [Example](examples/example.json)
- [JSON Schema](json-schema/schema.json)

## Catalog fields

A Single File STAC is a complete STAC catalog contained in a single file. It is sometimes useful to save a portion of a catalog (such as gained through a search) as single file so it is more portable than a set of linked files.

A Single File STAC is an [ItemCollection Object](../../item-spec/itemcollection-spec.md). This GeoJSON FeatureCollection has Features which are Items, but the Collections are still needed.

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| collections | [Collection](../../collection-spec/collection-spec.md#collection-fields)] | An array of Collections that are used by any of the Items in the ItemCollection.
| search | [Search Object](#search-object) | An optional field containing a search endpoint and parameters used to generate this Single File STAC |

## Search Object

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| endpoint | string | The root endpoint of a STAC API used for this search.
| parameters | map<string, Object> | A dictionary of all the parameters used for the search |

## Implementations

- [sat-search](https://github.com/sat-utils/sat-search) uses the Single File Catalog to save and load search results.
