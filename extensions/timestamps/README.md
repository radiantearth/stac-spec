# Timestamps Extension Specification

- **Title: Timestamps**
- **Identifier: timestamps**
- **Field Name Prefix: -**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Timestamps Extension to a STAC Item.
Allows to specify numerous timestamps for assets and metadata in addition to [`created`, `updated` and `datetime` (incl. start and end)](../../item-spec/common-metadata.md#date-and-time).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name  | Type   | Description |
| ----------- | ------ | ----------- |
| published   | string | Date and time the corresponding data (see below) was published the first time. |
| expires     | string | Date and time the corresponding data (see below) expires (is not valid any longer). |
| unpublished | string | Date and time the corresponding data (see below) was unpublished. |

*At least one of the fields must be specified.*

All timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).

The timestamps have different meaning depending on where they are used.
If those fields are available in the Item `properties`, it's referencing to the timestamps valid for of the metadata.
Having those fields in the Item `assets` refers to the timestamps valid for the actual data linked to in the Asset Object.

### Lifecycle

An overview over the lifecycle of data and their corresponding timestamps:

1. Data capture, start: `start_datetime`
2. Data capture, often center: `datetime`
3. Data capture, end: `end_datetime`
4. Data first modified (stored): `created`
5. Data last modified: `updated`
6. Data first published: `published`
7. Data last published: N/A
8. Data valid until: `expires`
9. Data removed / unpublished: `unpublished`

## Implementations

- [openEO](https://api.openeo.org) implements the `expires` field.

## Outlook

Once these fields get broadly adopted, it is planned to move them to Common Metadata and place them together with `created` and `updated`.
As this extension doesn't have a prefix, it doesn't lead to any breaking changes and the thus it is only a structural change for the specification.

This fields - together with `created` and `updated` - also seem relevant for STAC Collections and may be adopted there, too, for both metadata and [collection-level assets](../collection-assets/README.md).
