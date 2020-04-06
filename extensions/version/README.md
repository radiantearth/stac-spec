# Versioning Indicators Extension Specification

- **Title: Versioning Indicators**
- **Identifier: version**
- **Field Name Prefix: -**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension allows to version STAC Collections and STAC Items. Therefore, it also allows to deprecate legacy versions. Only fields and possible link relation types are defined in this extension, but it does NOT suggest any versioning best practices to structure static or dynamic catalogs. Instead check the [Versioning Best Practices for Catalogs](../../best-practices.md#versioning-for-catalogs).

This extension applies to STAC Items and STAC Collections.

- Examples: [Collection](examples/collection.json), [Item](examples/item.json)
- [JSON Schema](json-schema/schema.json)

## Item Properties and Collection Fields

For Items, the fields are placed in the `properties`. For Collections, the fields are placed on the top level of the Collection.

| Field Name | Type    | Description |
| ---------- | ------- | ----------- |
| version    | string  | **REQUIRED**. Version of the Collection or Item. |
| deprecated | boolean | Specifies that the Collection or Item is deprecated with the potential to be removed. Defaults to `false`. It should be transitioned out of usage as soon as possible and users should refrain from using it in new projects. A link with relation type `latest-version` SHOULD be added to the links and MUST refer to the resource that can be used instead. |

## Relation types

The following types should be used as applicable `rel` types for the [Link Object](../../item-spec/item-spec.md#link-object) to reference the latest version, the predecessor version and successor versions. These are all following [RFC 5829](https://tools.ietf.org/html/rfc5829).

| Type                | Description |
| ------------------- | ----------- |
| latest-version      | This link points to a resource containing the latest (e.g., current) version. |
| predecessor-version | This link points to a resource containing the predecessor version in the version history. |
| successor-version   | This link points to a resource containing the successor version in the version history. |

## Implementations

None yet, still in proposal stage.
