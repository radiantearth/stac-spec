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

TODO: Give an overview of the main WFS endpoints

### Strongly Typed STAC data

TODO: explain the advantages of using WFS to provide schema information at a collection level, for stronger typing
of data. Plus transactions.