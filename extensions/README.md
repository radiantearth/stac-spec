# Extensions

This folder contains extensions (profiles) to the core SpatioTemporal Asset Catalog JSON
specification.

Extensions can be changes in functionality or new fields. This can include new JSON files that are
linked to from the core `links`, as well as new OpenAPI fragments. Extensions should include
narrative explaining the fields, a comprehensive example and a JSON-Schema to validate compliance.
Any data provider can create an extension, and when providers work together to share fields between
them they can create a shared extension and include it in the STAC repository.

## List of official extensions

| Extension Name (Prefix)                                      | Scope            | Description                                                  |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| [Collection](stac-collection-spec.md) (`c`)                  | Item             | Provides a way to specify data fields that are common across a collection of STAC Items, so that each does not need to repeat all the same information. |
| [EO](stac-eo-spec.md) (`eo`)                                 | Item             | Covers data that represents a snapshot of the earth for a single date and time. It could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO data include sensors with visible bands, IR bands as well as SAR instruments. The extension provides common fields like bands, cloud cover, off nadir, sun angle + elevation, gsd and more. |
| [Scientific](scientific/) (`sci`)                            | Catalog +Dataset | Scientific metadata is considered to be data that indicate from which publication a dataset originates and how the dataset itself should be cited or referenced. |
| [Start end datetime](stac-start-end-datetime-spec.md) (`set`) | Item             | An extension to provide start and end datetime stamps in a consistent way. |
| [Transaction](transaction/)                                  | API              | Provides an API extension to support the creation, editing, and deleting of items on a specific WFS3 collection. |

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer to add your extension to this table.

| Name     | Scope | Description | Vendor |
| -------- | ----- | ----------- | ------ |
| None yet |       |             |        |

## Proposed extensions

The following extensions are proposed through the
[STAC issue tracker](https://github.com/radiantearth/stac-spec/issues) and are considered to be
implemented. If you would find any of these helpful or are considering to implement a similar
extension, please get in touch through the referenced issues:

- [Drone content Extension](https://github.com/radiantearth/stac-spec/issues/149)
- [Full Motion Video Content Extension](https://github.com/radiantearth/stac-spec/issues/156)
- [Point Cloud Extension](https://github.com/radiantearth/stac-spec/issues/157)
- [Provenance Extension](https://github.com/radiantearth/stac-spec/issues/179)
- [Storage Extensions](https://github.com/radiantearth/stac-spec/issues/148)
