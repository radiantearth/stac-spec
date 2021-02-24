<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

[![CircleCI](https://circleci.com/gh/radiantearth/stac-spec.svg?style=svg)](https://circleci.com/gh/radiantearth/stac-spec)

## About

The SpatioTemporal Asset Catalog (STAC) specification aims to standardize the way geospatial assets are exposed online and queried. 
A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain space and 
time. The initial focus is primarily remotely-sensed imagery (from satellites, but also planes, drones, balloons, etc), but 
the core is designed to be extensible to SAR, full motion video, point clouds, hyperspectral, LiDAR and derived data like
NDVI, Digital Elevation Models, mosaics, etc. 

The goal is for all major providers of imagery and other earth observation data to expose their data as SpatioTemporal Asset 
Catalogs, so that new code doesn't need to be written whenever a new JSON-based REST API comes out that makes its data 
available in a slightly different way. This will enable standard library components in many languages. STAC can also be
implemented in a completely 'static' manner, enabling data publishers to expose their data by simply publishing linked JSON
files online.

## Stability Note

This specification has evolved over the past couple years, and is used in production in a variety of deployments. It is currently
in a 'beta' state, with no major changes anticipated, so implementors can expect that most things will stay fairly stable. So 
at this point we don't anticipate any major changes, but reserve the right to make them if we get feedback that something just doesn't 
work. Which is to say the next couple months are a great time to implement STAC, as your changes will be head. After 1.0 our goal
is to not change the core in any backwards incompatible way for a very long time, if ever, so that people can build on this until 
JSON is no longer relevant. The STAC specification follows [Semantic Versioning](https://semver.org/), so once 1.0.0 is reached any breaking
change will require the spec to go to 2.0.0. 

## Current version and branches

The [master branch](https://github.com/radiantearth/stac-spec/tree/master) is the 'stable' version of the spec. It is currently version 
**1.0.0-beta.2** of the specification. The 
[dev](https://github.com/radiantearth/stac-spec/tree/dev) branch is where active development takes place, and may have inconsistent examples. 
Whenever dev stabilizes a release is cut and we merge dev in to master. So master should be stable at any given time.
It is possible that there may be small releases in quick succession, especially if they are nice improvements that do 
not require lots of updating. More information on how the STAC development process works can be found in 
[process.md](process.md).

## Communication

For any questions feel free to jump on our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) or email 
our [google group](https://groups.google.com/forum/#!forum/stac-spec). The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-spec/pulls).

## In this Repository

This repository contains the core specifications plus [examples](examples/) and validation schemas. Also included are a
few documents that provide more context and plans for the evolution of the specification. Each spec folder contains a
README explaining the layout of the folder, the main specification document, examples, and validating schemas. And 
there is one more specification in the STAC 'family', which is
the [STAC API specification](https://github.com/radiantearth/stac-api-spec/), now living in its own repository. It
provides API endpoints, based on the [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) standard,
that enable clients to search for `item`s that match their filtering criteria. The four specifications are meant to be used 
together, but are designed so each piece is small, self-contained and reusable in other contexts.

The **[Overview](overview.md)** describes the three core specifications and how they relate to one another.

The **[Item Specification](item-spec/)** defines a STAC Item, which is a [GeoJSON](http://geojson.org) Feature
with additional fields for things like time, links to related entities and assets (including thumbnails). This is the 
atomic unit that describes the data to be discovered.

The **[Catalog Specification](catalog-spec/)** specifies a structure to link various STAC Items together to be crawled or browsed. It is a
simple, flexible JSON file of links to Items, Catalogs or Collections that can be used in a variety of ways.

The **[Collection Specification](collection-spec/)** provides additional information about a spatio-temporal collection of data.
In the context of STAC it is most likely a collection of STAC Items that is made available by a data provider.
It includes things like the spatial and temporal extent of the data, the license, keywords, etc.
It enables discovery at a higher level than individual items, providing a simple way to describe sets of data.

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
