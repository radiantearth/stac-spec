## About

The SpatioTemporal Asset Catalog (STAC) specification aims to standardize the way geospatial assets are exposed online and queried. 
A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain space and 
time. The initial focus is primarily remotely-sensed imagery (from satellites, but also planes, drones, balloons, etc), but 
the core is designed to be extensible to SAR, full motion video, point clouds, hyperspectral, LiDAR and derived data like
NDVI, Digital Elevation Models, mosaics, etc. 

The goal is for all major providers of imagery and other earth observation data to expose their data as spatiotemporal asset catalogs,
so that new code doesn't need to be written whenever a new JSON-based REST API comes out that makes its data available in a slightly 
different way. This will enable standard library components in many languages.

## WARNING

The specification is currently still an early version, with the potential for some major things to change. The core is now
fleshed out, so implementors are encouraged to try it out and give feedback. But the goal is to actually be able to act
on that feedback, which will mean changes are quite possible. 

But efforts will be made to maintain the core fields established in the central [JSON Spec](json-spec/). The minimal amount
is specified right now, but best practices should emerge with implementation and more will likely be specified.

## Current version and branches

The master branch (that you are looking at) is the 'stable' version of the spec. It is currently version 
[0.4.0](https://github.com/radiantearth/stac-spec/milestone/3) of the specification. The 
[dev](https://github.com/radiantearth/stac-spec/tree/dev) branch is where active development takes place, and may have inconsistent examples. 
Whenever dev stabilizes a release is cut and we merge dev in to master. So master should be stable at any given time.
It is possible that there may be small releases in quick succession, especially if they are nice improvements that do 
not require lots of updating. 

## In this Repository

This repository contains the core specifications, along with examples and JSON schemas for validation. Also included are a
few documents that provide more context and plans for the evolution of the specification.

**[json-spec/](json-spec/)** defines a SpatioTemporal Asset Catalog `Item`, which is a [GeoJSON](http://geojson.org) Feature
with additional fields for the time range, links to related entities and resources, including thumbnails. The folder contains
a [minimal](json-spec/sample.json) and [expanded](json-spec/sample-full.json) samples, validating [schemas](json-spec/json-schema), 
an additional folder of [examples](json-spec/examples/) and of course the main [specification](json-spec/json-spec.md).

**[static-catalog/](static-catalog)** specifies how to utilize `Items` as ordered files on a web server or object store
like S3, without the need for any dynamic code. These static catalogs are designed to expose the data to be crawled by
other tools.

**[api-spec/](api-spec/)** defines a dynamic API, specified as a [yaml](api-spec/spec.yaml) file in [OpenAPI](http://openapis.org) 
2.0 (swagger). 

**Extensions:** The *[extensions/](extensions/)* folder is where profiles and extensions live. Profiles are recommendations for
adding fields for specific domains (like Earth Observation). Extensions bring additional functionality to the core specs.

**Additional documents** include the current [roadmap](roadmap.md) and a complementary [how to help](how-to-help.md)
document, a [list of implementations](implementations.md), 
and a discussion of the collaboration [principles](principles.md) and specification approach.

## Design Overview

An important core principle of the STAC design is to embrace best practices of making data available on the web (like 
[HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) and [W3C Spatial Data on the Web](https://www.w3.org/TR/sdw-bp/)), and 
to leverage the reliability of flat files on object stores like [AWS S3](https://aws.amazon.com/s3/) and [Google Cloud Storage](https://cloud.google.com/storage/). This leads to putting the 'static catalog' at the core of the STAC spec.

#### Static Catalog

A static catalog is an implementation of the STAC specification that does not respond dynamically to requests - it is simply
a set of files on a web server that link to one another in a way that can be crawled. A static catalog can only really be
crawled by search engines and active catalogs; it can not respond to queries. But it is incredibly reliable, as there are
no moving parts, no clusters or databases to maintain. The goal of STAC is to expose as much asset metadata online as 
possible, so the static catalog offers a very lower barrier to entry for anyone with geospatial assets to make their data 
searchable.

#### Catalog API

A catalog API is a RESTful API that responds to queries (like give me all imagery in Oahu gathered on January 15, 2017). 
But its structure and responses are designed to mirror the static catalog, so the same client and crawler tools can consume
it. It generally indexes data for efficient responses, and aims to be easy for existing API's to implement as a more standard
interface for clients to consume. It is specified in OpenAPI 2.0 (swagger), and will move to OpenAPI 3.0 once the codegen
tooling is stronger there. An active catalog will often be populated by a static catalog, or at least may have a 'backup' of
its fields stored as a cached static catalog.

#### Core Metadata and Profiles

The [SpatioTemporal Asset Metadata](https://github.com/radiantearth/stam-spec) specification defines the core fields that all 
assets must make available for searching in a catalog. Vendors can extend those core fields for the metadata they want to 
make available, and the community is starting to define shared profiles, with 'earth observation' (satellite imagery) being 
the first one. This repo contains the [STAC Item](json-spec/json-spec.md) definition, which is the primary json profile of STAM, 
so it can evolve with the rest of the STAC spec more easily. The STAM repo retains the abstract definition, and may evolve 
to contain other profiles.

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate. Our goal is to be a collaboration of developers, not [architecture astronauts](http://www.joelonsoftware.com/articles/fog0000000018.html). A 
number of developers met in person and [sprinted on specs](https://github.com/radiantearth/boulder-sprint/) and made a number
of key decisions. 

The best way to contribute is to try to implement the specification and give feedback on what worked well and what could be
improved. Currently there are a few major things to still work out, so if you are interested in implementing you should
jump on our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) and check in 
on how ready the spec is and how you can support it. For the next bit of time you'll probably be encouraged to just do what
feels best in some areas, so we can capture best practices and standardize.

Any proposed changes to the specification should be done as pull requests. Please make these requests against the 
[dev](https://github.com/radiantearth/stac-spec/tree/dev) branch (this will require you to switch from the default of 'master',
which we keep so it displays first). Ideally a proposed change would also update
all of the examples, but for now that is not required - the team can validate and update all examples before a release.
But it is recommended to update at least a couple examples to reflect the change. 




