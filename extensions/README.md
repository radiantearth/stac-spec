# Extensions

This folder contains extensions to the core SpatioTemporal Asset Catalog specification. The core
spec is designed for extension, defining just a minimal core. It is expected that most real world
implementations will use several extensions to fully describe their data and API. 


Extensions can be changes in functionality or new fields. This can include new JSON files that are
linked to from the core `links`, as well as new OpenAPI fragments. Extensions should include
narrative explaining the fields, a comprehensive example and a JSON-Schema to validate compliance.
Any data provider can create an extension, and when providers work together to share fields between
them they can create a shared extension and include it in the STAC repository.

Anyone is welcome to create an extension, and is encouraged to at least link to the extension from 
here. The third-party / vendor extension section is for the sharing of extensions. As third 
parties create useful extensions for their implementation it is expected that others will make use 
of it, and then evolve to make it a 'community extension', that several providers maintain 
together. For now anyone from the community is welcome to use this extensions/ folder of the 
stac-spec repository to collaborate.

## Extension Maturity

Extensions in this directory are meant to evolve to maturity, and thus may be in different states
in terms of stability and number of implementations. All extensions included must include a 
maturity classification, so that STAC spec users can easily get a sense of how much they can count
on the extension. 

| Maturity Classification |  Min Impl # | Description | Stability |
| ----------------------- | ----------- | ----------- | --------- | 
| Proposal | 0 | An idea put forward by a community member to gather feedback | Not stable - breaking changes almost guaranteed as implementors try out the idea. |
| Pilot | 1 | Idea is fleshed out and implemented in one or more catalogs. Additional implementations encouraged to help give feedback | Approaching stability - breaking changes are not anticipated but can easily come from additional feedback |
| Candidate | 3 | A number of implementors are using it and are standing behind it as a solid extension. Can generally count on an extension at this maturity level | Mostly stable, breaking changes require a new version and minor changes are unlikely. |
| Stable | 6 | Highest current level of maturity. The community of extension maintainers commits to a STAC review process for any changes, which are not made lightly. | Completely stable, all changes require a new version number and review process. |
| Deprecated | N/A | A previous extension that has likely been superceded by a newer one or did not work out for some reason. | DO NOT USE, is not supported |

Maturity mostly comes through diverse implementations, so the minimum number of implementations
column is the main gating function for an extension to mature. But extension authors can also
choose to hold back the maturity advancement if they don't feel they are yet ready to commit to
the less breaking changes of the next level.

A 'mature' classification level will likely be added once there are extensions that have been 
stable for over a year and are used in twenty or more implementations.


## List of community extensions

| Extension Name (Prefix)                                      | Scope            | Description                                                  | Maturity |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ | -------- |
| [Collection](stac-collection-spec.md) (`c`)                  | Item             | Provides a way to specify data fields that are common across a collection of STAC Items, so that each does not need to repeat all the same information. | *Proposal* |
| [EO](stac-eo-spec.md) (`eo`)                                 | Item             | Covers data that represents a snapshot of the earth for a single date and time. It could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO data include sensors with visible bands, infrared bands (near and shortwave), red edge bands and panchromatic bands. The extension provides common fields like bands, cloud cover, off nadir, sun angle + elevation, gsd and more. | *Pilot* |
| [Scientific](scientific/) (`sci`)                            | Collection       | Scientific metadata is considered to be data that indicate from which publication a collection originates and how the collection itself should be cited or referenced. | *Proposal* |
| [Start end datetime](stac-start-end-datetime-spec.md) (`set`) | Item             | An extension to provide start and end datetime stamps in a consistent way. | *Proposal* |
| [Transaction](transaction/)                                  | API              | Provides an API extension to support the creation, editing, and deleting of items on a specific WFS3 collection. | *Pilot* |

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
- [Storage Extensions](https://github.com/radiantearth/stac-spec/issues/148)
