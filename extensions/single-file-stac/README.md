# Single File STAC Specification

- **Title: Single File STAC**
- **Identifier: single-file-stac**
- **Field Name Prefix: -**
- **Scope: Catalog**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

An extension to provide a set of Collections and Items within a single file catalog. The single file is a STAC catalog that contains everything that would normally be in a linked set of STAC files. This format is useful to save a portion of a catalog, or when creating a small catalog from derived data that should remain portable. It is most useful for saving the results of a search from a STAC API, as the Items, Collections, and optionally the search parameters are all saved within the single file. Hierarchical links have no meaning in a single file STAC, and so, if present, should be removed when creating a single file catalog.

- [Example](examples/example-search.json)
- [JSON Schema](json-schema/schema.json)

## Catalog fields

A Single File STAC is a complete [Catalog Object](../../catalog-spec/catalog-spec.md) presented as a [GeoJSON FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) contained in a single file.

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| type               | string | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `FeatureCollection`. |
| collections | \[[Collection](../../collection-spec/collection-spec.md#collection-fields)] | An array of STAC Collections that are used by any of the Items in the catalog. |
| features    | **REQUIRED.** \[[Item](../../item-spec/item-spec.md#item-fields)] | An array of STAC Items |

## Implementations

- [sat-search](https://github.com/sat-utils/sat-search) uses the Single File Catalog to save and load search results.
