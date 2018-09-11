# Implementations

This document lists the various implementations of the SpatioTemporal Asset Catalog specification. Contributions 
to the spec should be based on experience building API's for imagery and other geo-asset catalogs, so suggested
changes / improvements to the spec should be based on some software listed here. All listed implementations should have a link to a live server or static catalog that indexes real data, though they do not have to be production ready or have any guarantee of uptime. If a live server is not possible then a link to open source code is also acceptable. 

Browsable online version are usually powered by [stac-browser](https://github.com/radiantearth/stac-browser/) unless otherwise stated.

## Static Catalog Examples

### Spacenet (STAC 0.5)

[Spacenet](https://spacenetchallenge.github.io/) has made all their imagery available as STAC.

- Catalog: https://s3.amazonaws.com/spacenet-stac/spacenet-dataset.json
- Browsable online version: https://vigilant-heyrovsky-0d9af8.netlify.com/
- Source code: https://github.com/SpaceNetChallenge/stac-implementation

### CBERS (STAC 0.5)

[CBERS](https://en.wikipedia.org/wiki/China%E2%80%93Brazil_Earth_Resources_Satellite_program) is maintaining 
a full STAC Catalog, and keeping it up to date with the spec.

- Catalog: https://cbers-stac.s3.amazonaws.com/catalog.json
- Browsable online version: http://cbers-stac.netlify.com/
- Source code: https://github.com/fredliporace/cbers-2-stac

### ISERV (STAC 0.4.1)

[ISERV](https://www.nasa.gov/mission_pages/station/research/experiments/867.html) data is hosted by
[Radiant.Earth](http://radiant.earth), created by [Azavea](http://azavea.com).

- Catalog: https://s3-us-west-2.amazonaws.com/radiant-nasa-iserv/iserv.json
- Browsable online version: http://iserv-stac.netlify.com/
- Source code: https://github.com/raster-foundry/pystac

### Planet Disaster Data (STAC 0.5)

[Planet](http://planet.com) maintains a very small, hand-built catalog to serve as a reference example
of the spec.

- Catalog: https://storage.googleapis.com/pdd-stac/disasters/catalog.json
- Browsable online version: http://planet-stac.netlify.com/
- Raw catalog files: https://console.cloud.google.com/storage/browser/pdd-stac/disasters/hurricane-harvey/0831/
- Source code: https://github.com/cholmes/pdd-stac/tree/master/disasters/hurricane-harvey

### DigitalGlobe (STAC 0.4.1)

[DigitalGlobe](http://digitalglobe.com) has a few examples of how they represent their data as STAC Items.

- Examples: https://github.com/TDG-Platform/dg-stac/tree/master/examples

## API (Active Catalog) Examples
### Boundless STAC Server

* Items call: http://stac.boundlessgeo.io/stac/search/stac
* OpenAPI Document: https://app.swaggerhub.com/apis/joshfix/STAC/1.0.0-RC34

### Harris STAC Server

Contains a number of Landsat records:

* Items call: http://35.160.175.42:8081/items/?limit=10 
* Can see a particular Landsat item at: http://35.160.175.42:8081/items/LC08_L1TP_040032_20170415_20170501_01_T1

### Other implementations

* [Geocatalogo](https://github.com/go-spatial/geocatalogo) is a Go implementation of STAC.

## Ecosystem

Other software related to STAC like validators, crawlers etc.

 * [Serverless STAC Crawler](https://github.com/fredliporace/stac-crawler) is a static STAC crawler that runs on Lambda and SQS integration.

## Early prototypes / outdated

A list of software developed as early prototypes for the proof of concept or seem to be outdated (no activity in more than six months).

* [Catalog Crawler](https://github.com/radiantearth/community-sprints/tree/master/10252017-boulder-co/catalog-crawler) was done during the [Boulder Sprint](https://github.com/radiantearth/community-sprints/tree/master/10252017-boulder-co), as an early proof of concept.
* [py-stac](https://github.com/raster-foundry/pystac) was used to create the ISERV catalog. It is still pretty tied to that data type.
* [go-stac](https://github.com/planetlabs/go-stac) does validation of static catalogs.
* [Open Imagery Network](https://openimagerynetwork.github.io/) was the first attempt at a static catalog. The OpenAerialMap 
  bucket is in active use. It is planned to evolve OIN and OAM architectures to use static catalogs.
* [AWS Public Datasets](http://aws.amazon.com/public-datasets/), particularly [Landsat](http://aws.amazon.com/public-datasets/landsat/), 
  [NAIP](https://aws.amazon.com/public-datasets/naip/) and [Sentinel](http://sentinel-pds.s3-website.eu-central-1.amazonaws.com/) all
  get close to the ideas of STAC static catalogs, and hopefully will evolve to implement the standard.
* Josh Fix's [open-catalog](https://github.com/joshfix/open-catalog) demonstrates generating code from the core swagger spec.
* Element84 made a [clojure implementation](https://github.com/Element84/catalog-api-spec/tree/dev/implementations/e84) of the spec that serves as a lightweight proxy to NASA's CMR, constrained to just data in USGS EROS. 

Information about the software implementations that have been informing the evolution of the specification can be found at
https://github.com/radiantearth/catalog-implementor-survey
