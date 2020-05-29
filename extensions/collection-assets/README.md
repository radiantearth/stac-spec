# Collection Assets Extension Specification

- **Title: Collection Assets**
- **Identifier: collection-assets**
- **Field Name Prefix: -**
- **Scope: Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

A Collection extension to provide a way to specify assets available on the collection-level.

- [Example](examples/example-esm.json)
- [JSON Schema](json-schema/schema.json)

This extension introduces a single new field, `assets` at the top level of a collection.
An Asset Object defined at the Collection level is the same as the [Asset Object in Items](../../item-spec/item-spec.md#asset-object).

Collection-level assets SHOULD NOT list any files also available in items.
If possible, item-level assets are always the preferable way to expose assets.
To list what assets are available in items see the [Item Assets Definition Extension](../item-assets/README.md).

Collection-level assets can be useful in some scenarios, for example:
1. Exposing additional data that applies collection-wide and you don't want to expose it in each Item. This can be collection-level metadata or a thumbnail for visualization purposes.
2. Individual items can't properly be distinguished for some data structures, e.g. [Zarr](https://zarr.readthedocs.io/) as it's a data structure not contained in single files.
3. Exposing assets for "[Standalone Collections](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#standalone-collections)".

## Collection fields

| Field Name | Type                                                                   | Description |
| ---------- | ---------------------------------------------------------------------- | ----------- |
| assets     | Map<string, [Asset Object](../../item-spec/item-spec.md#asset-object)> | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key. |

**assets**: In general, the keys don't have any meaning and are considered to be non-descriptive unique identifiers.
Providers may assign any meaning to the keys for their respective use cases, but must not expect that clients understand them.
To communicate the purpose of an asset better use the `roles` field in the [Asset Object](../../item-spec/item-spec.md#asset-object).

## Implementations

- The [ESM collection spec](https://github.com/NCAR/esm-collection-spec) uses this extension to expose Zarr archives.
