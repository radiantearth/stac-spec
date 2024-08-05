<!--lint disable no-html-->
<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

[![CircleCI](https://circleci.com/gh/radiantearth/stac-spec.svg?style=svg)](https://circleci.com/gh/radiantearth/stac-spec)

## About

The SpatioTemporal Asset Catalog (STAC) family of specifications aim to 
standardize the way geospatial asset metadata is structured and queried. 
A "spatiotemporal asset" is any file that represents information about 
the Earth at a certain place and time. The original focus was on scenes 
of satellite imagery, but the specifications now cover a broad variety of uses, 
including sources such as aircraft and drone and data such as hyperspectral optical, 
synthetic aperture radar (SAR), video, point clouds, lidar, digital elevation 
models (DEM), vector, machine learning labels, and composites like NDVI and 
mosaics. STAC is intentionally designed with a minimal core and flexible 
extension mechanism to support a broad set of use cases. This specification 
has matured over the past several years, and is used in [numerous production 
deployments](https://stacindex.org/catalogs). 

This is advantageous to providers of geospatial data, as they can simply use a
well-designed, standard format and API without needing to design their own proprietary one.
This is advantageous to consumers  of geospatial data, as they can use existing libraries 
and tools to access metadata, instead of needing to write new code to interact 
with each data provider's proprietary formats and APIs. 

The STAC specifications define related JSON object types connected by link 
relations to support a [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)-style traversable
interface and a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) API
providing additional browse and search interfaces.
Typically, several STAC specifications are composed together to create an implementation. 
The **Item**, **Catalog**, and **Collection** specifications define a minimal core 
of the most frequently used JSON object types. Because of the hierarchical structure 
between these objects, a STAC catalog can be implemented in a completely 'static' 
manner as a group of hyperlinked Catalog, Collection, and Item URLs, enabling data 
publishers to expose their data as a browsable set of files. If more complex query 
abilities are desired, such as spatial or temporal predicates, the 
**STAC API** [specification](https://github.com/radiantearth/stac-api-spec/) can be 
implemented as a web service interface to query over a group of STAC objects, usually 
held in a database.

To the greatest extent possible, STAC uses and extends existing specifications. 
The most important object in STAC is an **Item**, which is simply a [GeoJSON](http://geojson.org) **Feature** 
with a well-defined set of additional attributes ("foreign members"). The **STAC API** 
extends the **[OGC API - Features - Part 1: Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html)** 
with additional web service endpoints and object attributes.

## Current version and branches

The [master branch](https://github.com/radiantearth/stac-spec/tree/master) is the 'stable' 
version of the spec. It is currently version **1.1.0-beta.1** of the specification. The STAC specification 
follows [Semantic Versioning](https://semver.org/), so any breaking change will require the spec to 
go to 2.0.0. 

The [dev](https://github.com/radiantearth/stac-spec/tree/dev) branch is where active development 
takes place, and may have inconsistent examples. Whenever dev stabilizes, a release is cut and we 
merge `dev` in to `master`. So `master` should be stable at any given time. 
More information on how the STAC development process works can be found in 
[process.md](process.md).

## Communication

Our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) is 
the best place to ask questions or provide feedback. The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-spec/pulls).

## In this Repository

This repository contains the core object type specifications, [examples](examples/), 
validation schemas, and documentation about the context and plans for the evolution of the 
specification. Each folder contains a README explaining the layout of the folder, 
the main specification document, examples, and validating schemas. 

Additionally, the [STAC API specification](https://github.com/radiantearth/stac-api-spec/) 
provides API endpoints, based on the [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) standard,
that enable clients to search for Item objects that match their filtering criteria. 

The **Item**, **Catalog**, **Collection**, and **STAC API** specifications are intended to be 
used together, but are designed so each piece is small, self-contained, and reusable in other contexts.

- **[Overview](overview.md)** describes the three core object type specifications and how they relate to one another.
- **[Item Specification](item-spec/)** defines a STAC **Item**, which is a [GeoJSON](http://geojson.org) **Feature**
  with additional fields ("foreign members") for attributes like time and links to related entities and assets 
  (including thumbnails). This is the core entity that describes the data to be discovered.
- **[Catalog Specification](catalog-spec/)** specifies a structure to link various STAC Items together to be crawled or browsed. It is a
  simple, flexible JSON file of links to Items, Catalogs or Collections that can be used in a variety of ways.
- **[Collection Specification](collection-spec/)** provides additional information about a spatio-temporal collection of data.
  In the context of STAC it is most likely a related group of STAC Items that is made available by a data provider.
  It includes things like the spatial and temporal extent of the data, the license, keywords, etc.
  It enables discovery at a higher level than individual Item objects, providing a simple way to describe sets of data.
- **[Examples](examples/):** The *[examples/](examples/)* folder contains examples for all three specifications, linked together to form two 
  complete examples. Each spec and extension links in to highlight particular files that demonstrate key concepts.
- **[Extensions](extensions/README.md)** describe how STAC can use extensions that extend the functionality of the core spec or 
  add fields for specific domains. Extensions can be published anywhere,
  although the preferred location for public extensions is in the [GitHub `stac-extensions` organization](https://github.com/stac-extensions).
- **Additional documents:** The supporting documents include a complementary [best practices](best-practices.md) 
  document, and information on contributing (links in the next section). We also maintain a [changelog](CHANGELOG.md) of
  what was modified in each version. 

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Beforehand, please review our [guidelines for contributions](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md). 
You may also be interested in our overall [process](process.md), and the [principles](principles.md) that guide our 
collaboration
