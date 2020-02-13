# Asset Definition Specification

- **Title: Asset Definition**
- **Identifier: asset**
- **Field Name Prefix: -**
- **Scope: Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

A Collection extension to provide details about assets that are available in member Items.

- [Example](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

 This extension serves two purposes:

 1. Provide a human-readable definition of assets available in any Items belonging to this Collection so that the user can determine the key(s) of assets they are interested in.
 2. Provide a way to programmatically determine what assets are available in any member Item. Otherwise a random Item needs to be examined to determine assets available, but a random Item may not be representative of the set.

## Collection fields

This extension introduces a single new field, `assets` at the top level of a collection.
An Asset Object defined at the Collection level is nearly the same as the [Asset Object in Items](../../item-spec/item-spec.md#asset-object), except for two differences.
The `href` field is not required, because collections don't point to any data by themselves.
Additioanlly the remaining fields, `title` and `type` are required in the Asset Definition, in order for it to adequately describe Item assets.

| Field Name | Type                                       | Description |
| ---------- | ------------------------------------------ | ----------- |
| assets     | Map<string, [Asset Object](#asset-object)> | **REQUIRED.** A dictionary of assets that can be found in member Items |

### Asset Object

An asset is an object that contains details about the datafiles that will be included in member Items. Assets included at the Collection level do not imply that all assets are available from all Items. However, it is recommended that the Asset Definition is a complete set of all assets that may be available from any member Items.

| Field Name  | Type     | Description |
| ----------- | -------- | ----------- |
| title       | string   | The displayed title for clients and users. |
| description | string   | A description of the Asset providing additional details, such as how it was processed or created. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| type        | string   | [Media type](../../item-spec/item-spec.md#media-types) of the asset. |
| roles       | [string] | The [semantic roles](../../item-spec/item-spec.md#asset-role-types) of the asset, similar to the use of `rel` in links. |

Other custom fields, or fields from other extensions may also be included in the Asset object.

## Implementations

- AWS Public Dataset catalogs, [landsat-8](http://landsat-stac.s3.amazonaws.com/landsat-8-l1/catalog.json) and [sentinel-2](http://sentinel-stac.s3.amazonaws.com/sentinel-2-l1c/catalog.json) define an Asset definition at the collection level.
