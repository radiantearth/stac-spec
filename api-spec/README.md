
# STAC API Specification

## Overview

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns [STAC Items](../item-spec/item-spec.md) 
(GeoJSON objects with required links time stamp and links to assets) from search queries on a RESTful endpoint, and also
offers an endpoint to return STAC Items as a compliant [Catalog](../catalog-spec/) for discovery.

The core of the spec is a single endpoint:

```
/stac/search
```

It takes a JSON object that can filter on date and time:

```

{
  "bbox": [ 5.5, 46, 8, 47.4 ],
  "time": "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
}
```

This tells the server to return all the catalog items it has that are from the second half of March, 2018 and 
that fall within this area:

![swiss_bbox](https://user-images.githubusercontent.com/407017/38382405-b5e69344-38be-11e8-90dc-35738678356d.png)

*map © OpenStreetMap contributors*

The return format is a [GeoJSON](http://geojson.org) feature collection with features compliant with the 
[Item spec]((../item-spec/item-spec.md) for STAC. It returns to a limit optionally requested by the client, and includes 
pageable links to iterate through any results past that limit.

### Dynamic Catalog API

The other endpoint that is included as an option in STAC API is `/stac/`, which implements the [STAC Catalog Spec](../catalog-spec/). 
See the [Dynamic Catalog](https://github.com/radiantearth/stac-spec/blob/structure_and_cleanup/catalog-spec/catalog-spec.md#dynamic-catalogs) 
section of that spec for more information. Implementing this enables tools like 
[STAC Browser](https://medium.com/@mojodna/a-stac-browser-348a60674061) to use the dynamic catalog, to enable better 
discovery through people browsing and search engines crawling. 

The OpenAPI spec in this directory documents the endpoint, and refer to the STAC Catalog and [STAC Collection](../collection-spec) for more information about the full content and link structure.

## API Fragments

The STAC API should be simple to implement and extensible. To support that goal, we are breaking the extensions out into fragments.
These fragments should allow an implementor to layer on additional functionality as needed.

We have structured our OpenAPI yaml files so that that can be joined together with import statements to prevent copying the 
extensions into every possibly combination. In the api-spec folder you can expect to find complete OpenAPI definitions that are
useable as is. For developers who want to author your own extension or combine extensions into a new OpenAPI defintion file see below.

### Definitions

The definitions folder contains the yaml files that will import fragments and output a complete definition. These are not directly usable in OpenAPI as they have import directives that need to be resolved.

See [yaml-files](https://www.npmjs.com/package/yaml-files) for the syntax to import yaml fragments.

### Fragments

The fragments folder contains valid yaml that is intended to be merged into an openapi document. It should be possible to import one or more fragments at the same time to create a new STAC+extensions definition. 

### Building OpenAPI Definitions

To rebuild all definitions run the included nodejs scripts.

```
npm install
npm run generate-all
```

## Specification

The definitive specification for STAC is the [OpenAPI](http://openapis.org) 3.0 yaml document. This is available
in several forms. The most straightforward for an implementor new to STAC is the [STAC-standalone.yaml](STAC-standalone.yaml).
This gives a complete service with the main STAC endpoint. See the [online documentation](https://app.swaggerhub.com/apis/cholmesgeo/STAC-standalone/) for the api rendered interactively.

### Filtering

The core STAC API includes two filters - Bounding Box and time. All STAC Items require space and time, and thus any STAC
client can expect to be able to filter on them. Most data will include additional data that users would like to query on,
so there is a mechanism to also specify more filters. See the [Filtering](filters.md) document for additional information
on the core filters as well as how to extend them. It is anticipated that 'extensions' for domains (like earth observation
imagery) will require additional fields to query their common fields.

### WFS 3.0 Integration

At the [Ft Collins Sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co) the
decision was made to integrate STAC with the [WFS 3 specification](https://github.com/opengeospatial/WFS_FES), as
they are quite similar in spirit and intention. It is anticipated that most STAC implementations will also implement 
WFS, and indeed most additional functionality that extends STAC will be done as WFS extensions. 

This folder thus also provides an [openapi fragment](STAC-fragment.yaml), as well as an [example service](https://app.swaggerhub.com/apis/cholmesgeo/STAC_WFS-example/) ([yaml](WFS3core+STAC.yaml))
for those interested in what a server that implements both STAC and WFS would look like. Those interested in learning more
can read the [deeper discussion of WFS integration](wfs-stac.md).


### GET requests

The POST endpoint is required for all STAC API implementations. The fields of the JSON object can also be used
for a GET endpoint, which are included in the openapi specifications. The GET requests are designed to reflect the same
fields as the POST fields, and are based on WFS 3 requests. It is recommended for implementations to implement both, but 
only POST is required. 


