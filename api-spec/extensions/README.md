# API Extensions

This folder contains extensions to the SpatioTemporal Asset Catalog API specification by providing  new OpenAPI fragments.


Anyone is welcome to create an extension (see section 'Extending STAC'), and is encouraged to at least link to the extension from here. The third-party / vendor extension section is for the sharing of extensions. As third parties create useful extensions for their implementation it is expected that others will make use of it, and then evolve to make it a 'community extension', that several providers maintain together. For now anyone from the community is welcome to use this extensions/ folder of the stac-spec repository to collaborate.

API Extensions given follow the same guidelines for Extension Maturity as given in the *[Content Extensions README](../../extensions/README.md)*.

## List of community extensions

| Extension Name (Prefix)                                      | Description                                                  | Maturity |
| ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| [Fields](fields/README.md) | Adds parameter to constrol which fields are returned in the response. | *Pilot* |
| [Query](query/README.md) | Adds paraemter to search Item and Collection properties. | *Pilot* |
| [Sort](sort/README.md) | Adds Parameter to control sorting of returns results. | *Pilot* |
| [Transaction](transaction/README.md) | Adds PUT and DELETE endpoints for the creation, editing, and deleting of items and Collections. | *Pilot* |

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name     | Scope | Description | Vendor |
| -------- | ----- | ----------- | ------ |
| None yet |       |             |        |

## Proposed extensions

The following extensions are proposed through the
[STAC issue tracker](https://github.com/radiantearth/stac-spec/issues) and are considered to be
implemented. If you would find any of these helpful or are considering to implement a similar
extension, please get in touch through the referenced issues:

- None yet
