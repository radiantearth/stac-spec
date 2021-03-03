# STAC Overview

There are three component specifications that together make up the core SpatioTemporal Asset Catalog specification.
Each can be used alone, but they work best in concert with one another. The [STAC API specification](https://github.com/radiantearth/stac-api-spec) 
builds on top of that core, but is out of scope for this overview. An [Item](item-spec/item-spec.md) represents a 
single [spatiotemporal asset](#what-is-a-spatiotemporal-asset) as GeoJSON so it can be searched. 
The [Catalog](catalog-spec/catalog-spec.md) specification provides structural elements, to group Items
and [Collections](collection-spec/collection-spec.md). Collections *are* catalogs, that add more required metadata and 
describe a group of related Items. For more on the differences see the [section below](#catalogs-vs-collections).

## Item Overview

Fundamental to any SpatioTemporal Asset Catalog, an [Item](item-spec/item-spec.md) object represents a unit of
data and metadata, typically representing a single scene of data at one place and time.   A STAC Item is a 
[GeoJSON](http://geojson.org/) [Feature](https://tools.ietf.org/html/rfc7946#section-3.2)
and can be easily read by any modern GIS or geospatial library, and it describes a 
[SpatioTemporal Asset](#what-is-a-spatiotemporal-asset). 
The STAC Item JSON specification uses the GeoJSON geometry to describe the location of the asset, and 
then includes additional information:

* the time the asset represents;
* a thumbnail for quick browsing;
* asset links, to enable direct download or streaming access of the asset;
* relationship links, allowing users to traverse other related resources and STAC Items.

A STAC Item can contain additional fields and JSON structures to communicate more information about the
asset, so it can be easily searched. STAC provides a core set of 
[Common Metadata](item-spec/common-metadata.md)
and there is a wider community working on a variety of [STAC Extensions](extensions/) that provide shared metadata for 
more specific domains. Both aim to describe data with well known, well
defined terms to enable consistent publishing and better search. For more recommendations on selecting fields
for an Item see [this section](best-practices.md#field-selection-and-metadata-linking) of the best practices document.

### What is a SpatioTemporal Asset

A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain 
space and time. Examples include Imagery (from satellites, planes and drones), SAR, Point Clouds (from
LiDAR, Structure from Motion, etc), Data Cubes, Full Motion Video, and data derived from any of those.
The key is that the GeoJSON is not the actual 'thing', but instead references files and serves as an
index to the 'assets'. It is [not recommended](best-practices.md#representing-vector-layers-in-stac) 
to use STAC to refer to traditional vector data layers (shapefile, geopackage) as assets, as they
don't quite fit conceptually. 

## Catalogs vs Collections

Before we go deep into the Catalogs and Collections, it is worth explaining the relationship 
between the two and when you might want to use one or the other. 

A Catalog is a very simple construct - it just provides links to Items or to other Catalogs. 
The closest analog is a folder in a file structure, it is the container for Items, but it can 
also hold other containers (folders / catalogs). 

The Collection specification shares some fields with the catalog spec but has a number of additional fields:
license, extent (spatial and temporal), providers, keywords and summaries. Every Item in a Collection links
back to their Collection, so clients can easily find fields like the license. Thus every Item implicitly 
shares the fields described in their parent Collection.

But what *should* go in a Collection, versus just in a Catalog?  A Collection will generally consist of
a set of assets that are defined with the same properties and share higher level metadata. In the 
satellite world these would typically all come from the same sensor or constellation. It corresponds
directly to what others call a "dataset series" (ESA, ISO 19115), "collection" (CNES, NASA), and 
"dataset" (JAXA, DCAT). So if all your Items have the same properties, they probably belong in 
the same Collection. But the construct is deliberately flexible, as there may be good reasons
to break the recommendation.

Catalogs in turn are used for two main things:

* Split overly large collections into groups
* Group collections into a catalog of Collections (e.g. as entry point for navigation to several Collections).

The first case allows users to browse down into the Items of large collections. A collection like
Landsat usually would start with path and row Catalogs to group by geography, and then year, 
month and day groups to enable deeper grouping. [Dynamic catalogs](best-practices.md#dynamic-catalogs) can
provide multiple grouping paths, serving as a sort of faceted search.

The second case is used when one wants to represent diverse data in a single place. If an organization
has an internal catalog with Landsat 8, Sentinel 2, NAIP data and several commercial imagery providers
then they'd have a root catalog that would link to a number of different Collections. 

So in conclusion it's best to use Collections for what you want user to find as starting point, and then
catalogs are just for structuring and grouping the data. Future work includes a mechanism to actually
search Collection-level data, hopefully in concert with other specifications.

## Catalog Overview

There are two required element types of a Catalog: Catalog and Item. A STAC Catalog
points to [STAC Items](item-spec/README.md), or to other STAC catalogs. It provides a simple
linking structure that can be used recursively so that many Items can be included in 
a single Catalog, organized however the implementor desires. 

STAC makes no formal distinction between a "root" catalog and the "child" catalogs. A root catalog
is simply the top-most catalog -- it has no parent. A nested catalog structure is useful (and
recommended) for breaking up massive numbers of catalog Items into logical groupings. For example,
it might make sense to organize a catalog by date (year, month, day), or geography (continent,
country, state/prov). See the [Catalog Layout](best-practices.md#catalog-layout) best practices
section for more.

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

This example might be considered a somewhat "typical" structure. However, Catalogs and Items can
describe a number of different relationships. The following shows various relationships between
catalogs and items:

- `Catalog` -> `Item` (this is a common structure for a catalog to list links to Items)
- `Catalog` -> `Catalog` (this is a common tree structure to group sets of Items. Each catalog in
  this relationship may also include Item links as well as catalog links)

The relationships are all described by a common `links` object structure, making use of
the `rel` field to further describe the relationship. 

There are a few types of catalogs that implementors occasionally refer to. These get defined by the `links` structure.

- A **sub-catalog** is a Catalog that is linked to from another Catalog that is used to better organize data. For example a Landsat collection
  might have sub-catalogs for each Path and Row, so as to create a nice tree structure for users to follow.
- A **root catalog** is a Catalog that only links to sub-catalogs. These are typically entry points for browsing data. Often
  they will contain the [STAC Collection](collection-spec/) definition, but in implementations that publish diverse information it may
  contain sub-catalogs that provide a variety of Collections.
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
recommendations in [this section](best-practices.md#static-and-dynamic-catalogs) of the best practices document, 
along with how to keep a [dynamic catalog in sync](best-practices.md#static-to-dynamic-best-practices) with a static one.

### Catalog Best Practices

In addition to information about different catalog types, the [best practices document](best-practices.md) has
a number of suggestions on how to organize and implement good catalogs. The [catalog specification](catalog-spec/catalog-spec.md)
is designed for maximum flexbility, so none of these are required, but they provide guidance for implementors who
want to follow what most of the STAC community is doing.

- [Catalog Layout](best-practices.md#catalog-layout) is likely the most important section, as following its 
recommendations will enable catalogs to work better with client tooling that optimizes for known layouts.
- [Use of Links](best-practices.md#use-of-links) articulates practices for making catalogs that are portable (with
relative links through out) and ones that are published in stable locations (with absolute self links).
- [Versioning for Catalogs](best-practices.md#versioning-for-catalogs) explains how to use STAC's structure to
keep a history of changes made to Items and catalogs.
- [STAC on the Web](best-practices.md#stac-on-the-web) explains how catalogs should have html versions for 
each Item and Catalog, as well as ways to achieve that.

## Collection Overview

A STAC Collection extends the core fields of the Catalog construct to provide additional metadata to describe the set of Items it
contains. The required fields are fairly 
minimal - it includes the 4 required Catalog fields (id, description, stac_version and links), and adds license 
and extents. But there are a number of other common fields defined in the spec, and more common fields are also 
defined in [STAC extensions](extensions/). These serve as basic metadata, and ideally Collections also link to 
fuller metadata (ISO 19115, etc) when it is available.

As Collections contain all of Catalogs' core fields, they can be used just as flexibly. They can have both parent Catalogs and Collections
as well as child Items, Catalogs and Collections. Items are strongly recommended to have a link to the Collection
they are a part of. Items can only belong to one Collection, so if an Item is in a Collection that is the child of 
another Collection, then it must pick which one to refer to. Generally the 'closer' Collection, the more specific
one, should be the one linked to.

The Collection specification is used standalone quite easily - it is used to describe an aggregation of data, 
and doesn't require links down to sub-catalogs and Items. This is most often used when the software
does operations at the layer / coverage level, letting users manipulate a whole collection of assets at once. They often
have an optimized internal format that doesn't make sense to expose as Items. [OpenEO](https://openeo.org/) and 
[Google Earth Engine](https://earthengine.google.com/) are two examples that only use STAC collections, and
both would be hardpressed to expose individual Items due to their architectures. For others implementing STAC
Collections can also be a nice way to start and achieve some level of interoperability. 
