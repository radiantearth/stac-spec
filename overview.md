# STAC Overview

TODO: Overall introductin of the three elements and how they fit together.



## Item Overview

An  is the core atomic unit, representing a single spatiotemporal asset 
as a , plus datetime and links.

Fundamental to any STAC, a [Item](item-spec/item-spec.md) represents an atomic collection of inseparable 
data and metadata. A STAC Item is a [GeoJSON](http://geojson.org/) [Feature](https://tools.ietf.org/html/rfc7946#section-3.2)
and can be easily read by any modern GIS or geospatial  library. The STAC Item JSON specification includes 
additional fields for:

* the time the asset represents;
* a thumbnail for quick browsing;
* asset links, links to the described data;
* relationship links, allowing users to traverse other related STAC Items.

A STAC Item can contain additional fields and JSON structures to enable data providers to expose rich 
metadata and software developers to create intuitive tools.

### What is a SpatioTemporal Asset?

A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain 
space and time. Examples include Imagery (from satellites, planes and drones), SAR, Point Clouds (from
LiDAR, Structure from Motion, etc), Data Cubes, Full Motion Video, and data derived from any of those.
The key is that the GeoJSON is not the actual 'thing', but instead references files and serves as an
index to the 'assets'. It is not recommended to use stac to refer to traditional vector data layers
(shapefile, geopackage) as rasters. (TODO: Create something in 'best practices' and link there)


## Catalog Overview

There are two required element types of a Catalog: Catalog and Item. A STAC Catalog
points to [STAC Items](../item-spec/README.md), or to other STAC catalogs. It provides a simple
linking structure that can be used recursively so that many Items can be included in 
a single Catalog, organized however the implementor desires. 

STAC makes no formal distinction between a "root" catalog and the "child" catalogs. A root catalog
is simply a top-most catalog (which has no parent). A nested catalog structure is useful (and
recommended) for breaking up massive numbers of catalog items into logical groupings. For example,
it might make sense to organize a catalog by date (year, month, day), or geography (continent,
country, state/prov). Any scheme may be used, but it's considered a best practice to keep the size
of each catalog under a megabyte.

A simple Catalog structure might look like this:

- catalog (root)
  - catalog
    - catalog
      - item
        - asset
      - item
        - asset
    - item
      - asset
      - asset

This example might be considered a somewhat "typical" structure. However, catalogs and items can
describe a number of different relationships. The following shows various relationships between
catalogs and items:

- `Catalog` -> `Item` (this is a common structure for a catalog to list links to items)
- `Catalog` -> `Catalog` (this is a common tree structure to group sets of items. Each catalog in
  this relationship may also include item links as well as catalog links)

As all STAC Collections are also valid STAC Catalogs, all Catalogs described here could also be Collections.

The relationships are all described by a common `links` object structure, making use of
the `rel` attribute to further describe the relationship. 

There are a few types of catalogs that implementors occasionally refer to. These get defined by the `links` structure.

- A **sub-catalog** is a Catalog that is linked to from another Catalog that is used to better organize data. For example a Landsat collection
  might have sub-catalogs for each Path and Row, so as to create a nice tree structure for users to follow.
- A **root catalog** is a Catalog that only links to sub-catalogs. These are typically entry points for browsing data. Often
  they will contain the [STAC Collection](../collection-spec) definition, but in implementations that publish diverse information it may
  contain sub-catalogs that provide a variety of collections.
- A **parent catalog** is the Catalog that sits directly above a sub-catalog. Following parent catalog links continuously
  will naturally end up at a root catalog definition.
 
It should be noted that a Catalog does not have to link back to all the other Catalogs that point to it. Thus a published 
root catalog might be a sub-catalog of someone else's structure. The goal is for data providers to publish all the 
information and links they want to, while also encouraging a natural web of information to arise as Catalogs and Items are
linked to across the web.

### Static and Dynamic Catalogs

The Catalog specification is designed so it can be implemented as easily as possibly. This can be as simple as
simply putting linked json files on a file server or an object storage service (like [AWS S3](https://aws.amazon.com/s3/)),
or it can be generated on the fly by a live server. The first type of implementation is often called a 'static catalog',
and any catalog that is not just files is called a 'dynamic catalog'. You can read more about the two types along with
recommendations in [this section](../best-practices.md#static-and-dynamic-catalogs) of the best practices document, 
along with how to keep a [dynamic catalog in sync](../best-practices.md#static-to-dynamic-best-practices) with a static one.

### Best Practices

In addition to information about different catalog types, the [best practices document](../best-practices.md) has
a number of suggestions on how to organize and implement good catalogs. The [catalog specification](catalog-spec.md)
is designed for maximum flexbility, so none of these are required, but they provide guidance for implementors who
want to follow what most of the STAC community is doing.

- [Catalog Layout](../best-practices.md#catalog-layout) is likely the most important section, as following its 
recommendations will enable catalogs to work better with client tooling that optimizes for known layouts.
- [Use of Links](../best-practices.md#use-of-links) articulates practices for making catalogs that are portable (with
relative links through out) and ones that are published in stable locations (with absolute self links).
- [Versioning for Catalogs](../best-practices.md#versioning-for-catalogs) explains how to use STAC's structure to
keep a history of changes made to items and catalogs.
- [STAC on the Web](../best-practices.md#stac-on-the-web) explains how catalogs should have html versions for 
each item and catalog, as well as ways to achieve that.
