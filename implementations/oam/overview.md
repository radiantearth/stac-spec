Current API docs: https://hotosm.github.io/oam-catalog/

## Introduction

[Open Aerial Map](map.openaerialmap.org) (OAM) came into existence as a response to the [Humanitarian
Open Street Map Team](https://www.hotosm.org/)'s need for aerial imagery to create vectorised maps for humanitarian purposes, for example; disaster relief and economic development.

## Overview

### Imagery spec

Because of OAM's humanitarian focus it is able to initiate, promote and embrace open standards. This has led to the creation of the [Open Imagery Netowrk](https://github.com/openimagerynetwork) (OIN), a simple specification for describing and sharing aerial imagery. The spec currently stands as follows:

| element           | type   | name                    | description                                                                                 | 
|-------------------|--------|-------------------------|---------------------------------------------------------------------------------------------| 
| uuid              | string | File                    | unique URI to file                                                                          | 
| projection        | string | Projection              | CRS of the datasource in full WKT format                                                    | 
| bbox              | array  | Bounding Box            | Pair of min and max coordinates in CRS units, (min_x, min_y, max_x, max_y)                  | 
| footprint         | string | Datasource footprint    | WKT format, describing the actual footprint of the imagery                                  | 
| gsd               | number | Ground Spatial Distance | Average ground spatial distance (resolution) of the datasource imagery, expressed in meters | 
| file_size         | number | File Size               | File size on disk in bytes                                                                  | 
| acquisition_start | string | Acquisition Date Start  | First date of acquisition in UTC (Combined date and time representation)                    | 
| acquisition_end   | string | Acquisition Date End    | Last date of acquisition in UTC (Combined date and time representation) (optional)          | 
| title             | string | Title                   | Human friendly title of the image                                                           | 
| platform          | string | Type of imagery         | List of possible platform sources limited to satellite, aircraft, UAV, balloon, kite, helikite, pole, and rover       | 
| provider          | string | Imagery Provider        | Provider/owner of the OIN bucket                                                            | 
| contact           | string | Contact                 | Name and email address of the data provider                                                 | 
| properties        | object | Properties              | Additional properties about the image (optional)                                            | 

Although OAM implements OIN it strives to be distinct from it.

### API endpoints

There is nothing exceptional about the API, it essentially provides CRUD and search endpoints for imagery.

### Serving imagery

OAM is currently using a [dynamic tiler](https://github.com/hotosm/oam-dynamic-tiler) that dynamically creates TMS tiles per web request. Added imagery must first be processed in a manner similar to that expected by Cloud Optimized GeoTiffs, however the dynamic tiler is yet to actually support the COG format.
