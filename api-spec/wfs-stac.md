# WFS and STAC integration

At the [Ft Collins Sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co) the
decision was made to integrate STAC with the [Web Feature Service 3 specification](https://github.com/opengeospatial/WFS_FES). 
This document gives more details on what that practically means and how it all works.

## What is WFS?

WFS stands for Web Feature Service, and is the specification from the [Open Geospatial Consortium](http://opengeospatial.org) 
that specifies how to search for geospatial vector data online. The specifications have traditionally been quite
heavyweight, but the new 3.0 version of WFS is actually very in line with what the SpatioTemporal Asset Catalog group has done.
It provides a RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any
'feature', which is basically any type of geospatial object that can be represented by points, lines or polygons. So one
might have a WFS of all the buildings for a city, or the locations of ships, or all the electricity lines.

## WFS + STAC API

The STAC API has developed as a RESTful interface to query geospatial assets, with GeoJSON as return type. While STAC
is much more about the 'assets' - another piece of data that is linked to - each STAC Item fits in to the definition of
a 'feature', where the geometry is basically the footprint of the asset. So the data in a catalog could easily be
represented as a WFS, with just some extensions for linking to the assets, and fixing the `datetime` field.

So the decision was made to combine efforts. The key piece that STAC needs that WFS does not provide is the ability
to search across 'collections', so the `/search/stac/` endpoint is made to be an 'extension' to WFS that provides
that capability. So any WFS that is providing data that can be represented as STAC Items can choose to add the 
STAC endpoint.

### WFS Structure

A Web Feature Service is a standard API that represents collections of geospatial data. 

```
GET /collections
```

Lists the collections of data on the server that can be queried ([7.11](https://rawgit.com/opengeospatial/WFS_FES/master/docs/17-069.html#_feature_collections_metadata)), 
and each describes basic information about the geospatial data collection, like its name and description, as well as the 
spatial and temporal extents of all the data contained. A STAC search extension would only query those collections which
have data that validates as STAC `Items` - with a datetime field and references to assets. But a STAC can live alongside
other WFS collections, like an organization might choose to have their building and road data in WFS collections, alongside
their STAC-compatible imagery data.

```
GET /collections/{name}/items?bbox=160.6,-55.95,-170,-25.89
```

Requests all the data in the collection that is in New Zealand. The filtering is made to be compatible with the STAC API, 
and the two specs seek to share the general query and filtering patterns. The key difference is that a STAC search endpoint
will do cross collection search. A typical WFS will have multiple collections, and each will just offer search for its particular
collection.


### Strongly Typed STAC data

The scenario that using a WFS with a STAC search endpoint that makes the most sense is when a data provider wants to provide more
insight in to heterogenous data that is exposed on a STAC search. For example they might have imagery data from different satellite providers
and even some drone data. These will all have different fields. A single STAC endpoint can be used to expose them all. But it can be quite
useful to let users inspect a particular data type. That area of the `/collections/{name}` hierarchy can be used to expose additional
metadata and validation schemas that give more insight in to that data, as well as a place to query just that data.

In general it is recommended to provide as much information about different types of data as possible, so using WFS is recommended. But
the standalone option is there for those who just want to expose their data as quickly and easily as possible. Note a WFS can 
provide heterogenous data from any of its collections endpoints, but the STAC API recommendation is to use one collection per 
logical data type.

### Potential Transaction Extension

The other benefit of individual collection endpoints is that it gives a logical location for simple RESTful transactions

```
POST /collections/landsat/items/
```

There have been a couple implementations that have done transactions, and soon will contribute an extension.
