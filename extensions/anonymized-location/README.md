# Anonymized Location Extension Specification

- **Title: Anonymized Location**
- **Identifier: anonymized-location**
- **Field Name Prefix: anon**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Some imagery can not be shared with precise location information either due to provider requirements or for privacy concerns.
In these cases, the imagery can be assigned to a bounding box contained in a grid of arbritrary size.
Larger bounding boxes are more anonymized but the usefulness of the data diminishes as the bounding box grows.
To allow for the size of this bounding box to match the privacy and usefulness requirements of the data, a precision property can be defined.

This extension applies to STAC Items and STAC Collections.
As these anonymized location information are often closely bound to the collection level and therefore are shared across all items,
it is recommended adding the fields to the corresponding [STAC Collection](../../collection-spec/README.md).

- Examples: [Collection](examples/collection.json), [Item](examples/item.json)
- [JSON Schema](json-schema/schema.json)

## Item and Collection Fields

For Items, the fields are placed in the `properties`. For Collections, the fields are placed on the top level of the Collection.

| Field Name       | Type                 | Description |
| ---------------- | -------------------- | ----------- |
| anon:size        | number               | **REQUIRED.** The size of one side of the anonymized bounding box in degrees. For example, if this value is set to 2 then the bounding box for the items should be 2 degrees latitude by 2 degrees longitude.   |
| anon:warning     | string               | **REQUIRED.** A brief warning that the geometry of the item is not accurate and a description of how it has been anonymized. |

## Implementations

None yet, still in proposal stage.
