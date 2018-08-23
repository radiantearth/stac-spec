# Implementations

This document lists the various implementations of the SpatioTemporal Asset Catalog specification. Contributions 
to the spec should be based on experience building API's for imagery and other geo-asset catalogs, so suggested
changes / improvements to the spec should be based on some software listed here. All listed implementations 
should have a link to a live server or static catalog that indexes real data, though they do not have to 
production ready or have any guarantee of uptime. If a live server is not possible then a link to open source code 
is also acceptable. 

## Catalog Links
This section is links to live catalogs (both static and active) that have data.

#### Boundless STAC Server

Items call: http://stac.boundlessgeo.io/stac/search/stac
OpenAPI Document: https://app.swaggerhub.com/apis/joshfix/STAC/1.0.0-RC34

#### Harris STAC Server

Contains a number of Landsat records:

Item call: http://35.160.175.42:8081/items/?limit=10 
Can see a particular Landsat item at: http://35.160.175.42:8081/items/LC08_L1TP_040032_20170415_20170501_01_T1

#### Planet disaster data static catalog

A small set of data released publicly, pulled from https://www.planet.com/disaster/hurricane-harvey-2017-08-28/ in a hand created catalog (hope to update to something programmatic soon).

Root catalog: https://storage.googleapis.com/pdd-stac/disasters/catalog.json 
Sample Item: https://storage.googleapis.com/pdd-stac/disasters/hurricane-harvey/0831/20170831_162740_ssc1d1.json
If you login with google you should be able to browse the directories at: https://console.cloud.google.com/storage/browser/pdd-stac/disasters

Github repo of the Items: https://github.com/cholmes/pdd-stac

#### IServ static catalog from Radiant Earth

NASA data stood up by Radiant Earth, created by Azavea.

Root catalog: https://s3-us-west-2.amazonaws.com/radiant-nasa-iserv/iserv.json
S3 Bucket: https://s3-us-west-2.amazonaws.com/radiant-nasa-iserv/
(note that as of this writing the leaf Items don't have the right permissions)


## Static Catalog Implementations

These are pieces of software that can crawl and/or produce static catalogs.

[py-stac](https://github.com/raster-foundry/pystac) was used to create the iserv catalog. It is still pretty tied to that data type.

[go-stac](https://github.com/planetlabs/go-stac) does validation of static catalogs, will likely expand.

The [Catalog Crawler](https://github.com/radiantearth/boulder-sprint/tree/master/catalog-crawler) was done during the
[Boulder Sprint](https://github.com/radiantearth/boulder-sprint/), as an early proof of concept.


## Active Catalog Implementations

[Geocatalogo](https://github.com/go-spatial/geocatalogo) is a Go implementation of STAC.

Element84 made a [clojure implementation](https://github.com/Element84/catalog-api-spec/tree/dev/implementations/e84) of the spec
that serves as a lightweight proxy to NASA's CMR, constrained to just data in USGS EROS. 

Josh Fix's [open-catalog](https://github.com/joshfix/open-catalog) demonstrates generating code from the core swagger spec.

### Proto-software

Information about the software implementations that have been informing the evolution of the specification can be found at
https://github.com/radiantearth/catalog-implementor-survey

### Proto-catalogs
[Open Imagery Network](https://openimagerynetwork.github.io/) was the first attempt at a static catalog. The OpenAerialMap 
bucket is in active use. It is planned to evolve OIN and OAM architectures to use static catalogs.

[AWS Public Datasets](http://aws.amazon.com/public-datasets/), particularly [Landsat](http://aws.amazon.com/public-datasets/landsat/), 
[NAIP](https://aws.amazon.com/public-datasets/naip/) and [Sentinel](http://sentinel-pds.s3-website.eu-central-1.amazonaws.com/) all
get close to the ideas of STAC static catalogs, and hopefully will evolve to implement the standard.
