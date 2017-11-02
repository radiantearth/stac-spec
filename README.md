## About

The SpatioTemporal Asset Catalog (STAC) specification aims to standardize the way geospatial assets are exposed online and queried. A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain space and 
time. The initial focus is primarily remotely-sensed imagery (from satellites, but also planes, drones, balloons, etc), but 
the core is designed to be extensible to SAR, full motion video, point clouds, hyperspectral, LiDAR and derived data like
NDVI, Digital Elevation Models, mosaics, etc. 

The goal is for all major providers of imagery and other earth data to expose their data as spatiotemporal asset catalogs,
so that new code doesn't need to be written whenever a new JSON-based REST API comes out that makes its data available in a slightly different way. This will enable standard library components in many languages.

## WARNING

The specification is currently in a fairly incomplete state, as there were a few open questions from the 
[boulder sprint](https://github.com/radiantearth/boulder-sprint) that need to be resolved, with the various related
specifications moved over, updated and synchronized. 

The top things to be done are:

* Move static catalog work from [boulder sprint repo](https://github.com/radiantearth/boulder-sprint/tree/master/specs/flat_file) to this repo. - [#26](https://github.com/radiantearth/stac-spec/issues/26)
* Compare [core-api-examples](https://github.com/radiantearth/boulder-sprint/tree/master/specs/core-api) with each other 
to get to a final decision on Item & Asset JSON - [#24](https://github.com/radiantearth/stac-spec/issues/24)
* Finalize link structure between assets & items - [#22](https://github.com/radiantearth/stac-spec/issues/22)
* Decide how to describe "Product" level information for Assets and Items - [#23](https://github.com/radiantearth/stac-spec/issues/23)
* Update specs & json examples to the 'Items'/'Item'/'Asset', as well as updates from previous items - [#27](https://github.com/radiantearth/stac-spec/issues/27)
* Align catalog API swagger spec with static catalog / stam JSON and return types. - [#29](https://github.com/radiantearth/stac-spec/issues/29)

Once the core things are done we can release a named version and then aim to get many more people to implement. 

If you did not participate in the boulder sprint but want to help out with the above tasks then join us 
on [our gitter](https://gitter.im/Imagery-Catalog-API-Team/Lobby)



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

#### Core Metadata and Profiles

The SpatioTemporal Asset Metadata specification defines the core fields that all assets must make available for searching
in a catalog. Vendors can extend those core fields for the metadata they want to make available, and the community is 
starting to define shared profiles, with 'earth observation' (satellite imagery) being the first one. This repo has the
json profile of STAM, so it can evolve with the rest of the STAC spec more easily.

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate. Our goal is to be a collaboration of developers, not [architecture astronauts](http://www.joelonsoftware.com/articles/fog0000000018.html). A 
number of developers met in person and [sprinted on specs](https://github.com/radiantearth/boulder-sprint/) and made a number
of key decisions. 

The best way to contribute is to try to implement the specification and give feedback on what worked well and what could be
improved. Currently there are a few major things to still work out, so if you are interested in implementing you should
jump on our [gitter channel](https://gitter.im/Imagery-Catalog-API-Team/Lobby#) (TODO: update this link?) and check in 
on how ready the spec is and how you can support it. For the next bit of time you'll probably be encouraged to just do what
feels best in some areas, so we can capture best practices and standardize.

TODO: more on project management, etc.


## In this repo

This repository contains the core [Principles](principles.md) that govern the collaboration. There is also a [Design Discussion](design-discuss.md) on some of the bigger questions.

Once a number of implementations are evaluated work will begin on draft specification. 
