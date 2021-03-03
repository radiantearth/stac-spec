<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

[![CircleCI](https://circleci.com/gh/radiantearth/stac-spec.svg?style=svg)](https://circleci.com/gh/radiantearth/stac-spec)

## About

The SpatioTemporal Asset Catalog (STAC) specification defines a standard structure for geospatial asset metadata. 
A 'spatiotemporal asset' is any URL resource that represents information about the Earth at a certain place and 
time. The original focus was primarily for scenes of satellite imagery, but 
the minimal core of STAC is designed intentionally to support extensions for a broad variety of uses, including hyperspectral optical, synthetic aperture radar, video, point clouds, lidar, digital elevation models, vector data, and composites like NDVI and mosaics, and from a variety of remote sensing sources, including aircraft and drones.  

The purpose of STAC is for providers of imagery and other Earth observation data to expose their data as STAC metadata, in order to provide a well-defined and standard interface to interacting with it.  This is advantageous to the provider, as they can simply use a well-designed, standard format without needing to re-invent their own proprietary one. Consumers of the data benefit because they can use standard libraries and tools to access the STAC metadata, instead of needing to write new code to interact with each data provider's proprietary formats and APIs. 

This specification defines only the structure of STAC content objects. These objects are connected together through
links, providing a consumer with a way to browse a group of STAC objects, for example, by starting with link to
a root **Catalog** or **Collection** object and traversing to leaf **Item** objects. This allows a STAC catalog to be implemented in a completely static manner by simply publishing files on the web without the need for a web service backend.  For more dynamic query capability, the [STAC API specification](https://github.com/radiantearth/stac-api-spec/) extends these object definitions by defining a web service interface to query over a group of STAC objects, e.g., to search with spatial or temporal constraints.


## Stability Note

This specification has matured over the past several years, and is used in numerous production deployments. 
With the 1.0 release, implementors should expect that most definitions will remain stable. Our goal
is to not change the core in any backwards-incompatible way for a long time. The STAC specification follows [Semantic Versioning](https://semver.org/), so once 1.0.0 is reached, any breaking change will require the spec to go to 2.0.0. 


## Current version and branches

The [master branch](https://github.com/radiantearth/stac-spec/tree/master) is the 'stable' version of the spec. It is currently version 
**1.0.0-beta.2** of the specification. The 
[dev](https://github.com/radiantearth/stac-spec/tree/dev) branch is where active development takes place, and may have inconsistent examples. 
Whenever dev stabilizes, a release is cut and we merge dev in to master. So master should be stable at any given time.
It is possible that there may be small releases in quick succession, especially if they are nice improvements that do 
not require lots of updating. More information on how the STAC development process works can be found in 
[process.md](process.md).

## Communication

Our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) is the best place to ask questions or provide feedback. The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-spec/pulls).

## In this Repository

This repository contains the core specifications, [examples](examples/), validation schemas, and documentation about the context and plans for the evolution of the specification. Each folder contains a
README explaining the layout of the folder, the main specification document, examples, and validating schemas. 

Additionally, the [STAC API specification](https://github.com/radiantearth/stac-api-spec/) provides API endpoints, based on the [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) standard,
that enable clients to search for Item objects that match their filtering criteria. The **Item**, **Catalog**, **Collection**, and **STAC API** specifications are meant to be used 
together, but are designed so each piece is small, self-contained, and reusable in other contexts.

The **[Overview](overview.md)** describes the three core specifications and how they relate to one another.

The **[Item Specification](item-spec/)** defines a STAC **Item**, which is a [GeoJSON](http://geojson.org) **Feature**
with additional fields ("foreign members") for attributes like time and links to related entities and assets 
(including thumbnails). This is the core entity that describes the data to be discovered.

The **[Catalog Specification](catalog-spec/)** specifies a structure to link various STAC Items together to be crawled or browsed. It is a
simple, flexible JSON file of links to Items, Catalogs or Collections that can be used in a variety of ways.

The **[Collection Specification](collection-spec/)** provides additional information about a spatio-temporal collection of data.
In the context of STAC it is most likely a related group of STAC Items that is made available by a data provider.
It includes things like the spatial and temporal extent of the data, the license, keywords, etc.
It enables discovery at a higher level than individual Item objects, providing a simple way to describe sets of data.

**Examples:** The *[examples/](examples)* folder contains examples for all three specifications, linked together to form two 
complete examples. Each spec and extension links in to highlight particular files that demonstrate key concepts.

**Extensions:** The *[extensions/](extensions/)* folder is where extensions live. Extensions can extend the 
functionality of the core spec or add fields for specific domains. Each extension has at least one *owner*. You can find extension owners in each extension's README or in the [`CODEOWNERS`](.github/CODEOWNERS) file.

**Additional documents:** The supporting documents include a complementary [best practices](best-practices.md) 
document, and information on contributing (links in the next section). We also maintain a [changelog](CHANGELOG.md) of
what was modified in each version, as well as a [UML overview](STAC-UML.pdf) (and [source](STAC-UML.drawio)). 

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Beforehand, please review our [guidelines for contributions](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md). 
You may also be interested in our overall [process](process.md), and the [principles](principles.md) that guide our 
collaboration
