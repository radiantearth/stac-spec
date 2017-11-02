# Implementations

This document lists the various implementations of the SpatioTemporal Asset Catalog specification. Contributions 
to the spec should be based on experience building API's for imagery and other geo-asset catalogs, so suggested
changes / improvements to the spec should be based on some software listed here. All listed implementations 
should have a link to a live server or static catalog that indexes real data, though they do not have to 
production ready or have any guarantee of uptime. If a live server is not possible then a link to open source code 
is also acceptable. 

## Catalog Links
This section is links to live catalogs (both static and active) that have data.

* None available yet - spec is too new.

#### Proto-catalogs
[Open Imagery Network](https://openimagerynetwork.github.io/) was the first attempt at a static catalog. The OpenAerialMap 
bucket is in active use. It is planned to evolve OIN and OAM architectures to use static catalogs.

[AWS Public Datasets](aws.amazon.com/public-datasets/), particularly [Landsat](aws.amazon.com/public-datasets/landsat/), 
[NAIP](https://aws.amazon.com/public-datasets/naip/) and [Sentinel](http://sentinel-pds.s3-website.eu-central-1.amazonaws.com/) all
get close to the ideas of STAC static catalogs, and hopefully will evolve to implement the standard.


## Static Catalog Implementations

These are pieces of software that can crawl and/or produce static catalogs.

The [Catalog Crawler](https://github.com/radiantearth/boulder-sprint/tree/master/catalog-crawler) was done during the
[Boulder Sprint](https://github.com/radiantearth/boulder-sprint/), as an early proof of concept.

## Active Catalog Implementations

Element84 made a [clojure implementation](https://github.com/Element84/catalog-api-spec/tree/dev/implementations/e84) of the spec
that serves as a lightweight proxy to NASA's CMR, constrained to just data in USGS EROS. 

Josh Fix's [open-catalog](https://github.com/joshfix/open-catalog) demonstrates generating code from the core swagger spec.

### Proto-software

Information about the software implementations that have been informing the evolution of the specification can be found at
https://github.com/radiantearth/catalog-implementor-survey