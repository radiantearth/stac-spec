# STAC Best Practices

## Table of Contents

* [Field and ID formatting](#field-and-id-formatting)
* [Field selection and Metadata Linking](#field-selection-and-metadata-linking)
* [Datetime selection](#datetime-selection)
* [Representing Vector Layers in STAC](#representing-vector-layers-in-stac)
* [Common Use Cases of Additional Fields for Assets](#common-use-cases-of-additional-fields-for-assets)
* [Static and Dynamic Catalogs](#static-and-dynamic-catalogs)
* [Catalog Layout](#catalog-layout)
* [Use of Links](#use-of-links)
* [Versioning for Catalogs](#versioning-for-catalogs)
* [STAC on the Web](#stac-on-the-web)

---------

This document makes a number of recommendations for creating real world SpatioTemporal Asset Catalogs. None of them 
are required to meet the core specification, but following these practices will make life easier for client tooling
and for users. They come about from practical experience of implementors, and introduce a bit more 'constraint' for
those who are creating new catalogs or new tools to work with STAC. 

In time some of these may evolve to become part of the core specification, but while the current goal of the core is to remain 
quite flexible and simple to meet a wide variety of use cases.

## Field and ID formatting

When defining one's STAC properties and fields there are many choices to make on how to name various aspects of one's
data. One of the key properties is the ID. The specification is quite flexible on ID's, primarily so that existing
providers can easily use their same ID when they translate their data into STAC - they just need to be sure it is globally
unique, so may need a prefix. But the use of URI reserved characters such as `:` or `/` is discouraged since this will 
result in [percented encoded](https://tools.ietf.org/html/rfc3986#section-2) [STAC API](https://github.com/radiantearth/stac-api-spec) 
endpoints. This isn't a blocker, it just makes the ID's served through API's a bit less parsable. 

When defining unique fields for search, like constellation or platform, it is recommended that 
the value consist of only lowercase characters, numbers, `_`, and `-`. Examples include `sentinel-1a` (Sentinel-1), 
`landsat-8` (Landsat-8) and `envisat` (Envisat). This is to provide consistency for search across collections, so that
people can just search for 'landsat-8', instead of thinking through all the ways providers might have chosen to name it.

## Field selection and Metadata Linking

In general STAC aims to be oriented around **search**, centered on the core fields that users will want to search on to find 
imagery. The core is space and time, but there are often other metadata attributes that are useful. While the specification is 
flexible enough that providers can fill it with tens or even hundreds of fields of metadata, that is not recommended. If 
providers have lots of metadata then that can be linked to in the [Asset Object](item-spec/item-spec.md#asset-object) 
(recommended) or in a [Link Object](item-spec/item-spec.md#link-object). There is a lot of metadata that is only of relevance 
to loading and processing data, and while STAC does not prohibit providers from putting those type of fields in their items, 
it is not recommended. For very large 
catalogs (hundreds of millions of records), every additional field that is indexed will cost substantial money, so data
providers are advised to just put the fields to be searched in STAC, so [STAC API](https://github.com/radiantearth/stac-api-spec)
providers don't have bloated indices that no one actually uses.

## Datetime selection

The `datetime` field in a STAC Item's properties is one of the most important parts of a STAC Item, providing the T (temporal) of 
STAC. And it can also be one of the most confusing, especially for data that covers a range of times. For many types of data it
is straightforward - it is the capture or acquisition time. But often data is processed from a range of captures - drones usually
gather a set of images over an hour and put them into a single image, mosaics combine data from several months, and data cubes
represent slices of data over a range of time. For all these cases the recommended path is to use `start_datetime` and 
`end_datetime` fields from [common metadata](item-spec/common-metadata.md#date-and-time-range). The specification does allow one to set the 
`datetime` field to `null`, but it is strongly recommended to populate the single `datetime` field, as that is what many clients 
will search on. If it is at all possible to pick a nominal or representative datetime then that should be used. But sometimes that 
is not possible, like a data cube that covers a time range from 1900 to 2000. Setting the datetime as 1950 would lead to it not
being found if you searched 1990 to 2000.

Extensions that describe particular types of data can and should define their `datetime` field to be more specific. For example
a MODIS 8 day composite image can define the `datetime` to be the nominal date halfway between the two ranges. Another data type
might choose to have `datetime` be the start. The key is to put in a date and time that will be useful for search, as that is
the focus of STAC. If `datetime` is set to `null` then it is strongly recommended to use it in conjunction with a content extension
that explains why it should not be set for that type of data. 

## Representing Vector Layers in STAC

Many implementors are tempted to try to use STAC for 'everything', using it as a universal catalog of all their 'stuff'.
The main route considered is to use STAC to describe vector layers, putting a shapefile or [geopackage](http://geopackage.org)
as the `asset`. Though there is nothing in the specification that *prevents* this, it is not really the right level of 
abstraction. A shapefile or geopackage corresponds to a collection, not a single item. The ideal thing to do with
one of those is to serve it with [OGC API - Features](https://github.com/opengeospatial/ogcapi-features) standard. This
allows each feature in the shapefile/geopackage to be represented online, and enables querying of the actual data. If
that is not possible then the appropriate way to handle collection-level search is with the 
[OGC API - Records](https://github.com/opengeospatial/ogcapi-records) standard, which is a 'brother' specification of STAC API. 
Both are compliant with OGC API - Features, adding richer search capabilities to enable finding of data. 

## Common Use Cases of Additional Fields for Assets

As [described in the Item spec](item-spec/item-spec.md#additional-fields-for-assets), it is possible to use fields typically
found in Item properties at the asset level. This mechanism of overriding or providing Item Properties only in the Assets 
makes discovery more difficult and should generally be avoided. However, there are some core and extension fields for which 
providing them at at the Asset level can prove to be very useful for using the data.

- `datetime`: Provide individual timestamp on an Item, in case the Item has a `start_datetime` and `end_datetime`, but an Asset is for one specific time.
- `gsd` ([Common Metadata](item-spec/common-metadata.md#instrument)): Specify some assets with different spatial resolution 
than the overall best resolution.
- `eo:bands` ([EO extension](extensions/eo/)): Provide spectral band information, and order of bands, within an individual asset.
- `proj:epsg`/`proj:wkt2`/`proj:projjson` ([projection extension](extensions/projection/)): Specify different projection for some assets. If the projection is different
 for all assets it should probably not be provided as an Item property. If most assets are one projection, and there is 
 a single reprojected version (such as a Web Mercator preview image), it is sensible to specify the main projection in the 
 Item and the alternate projection for the affected asset(s).
- `proj:shape`/`proj:transform` ([projection extension](extensions/projection/)): If assets have different spatial resolutions and slightly different exact bounding boxes, specify these per asset to indicate the size of the asset in pixels and it's exact GeoTranform in the native projection.
- `sar:polarizations` ([sar extension](extensions/sar/)): Provide the polarization content and ordering of a specific asset, similar to `eo:bands`.
- `sar:product_type` ([sar extension](extensions/sar/)): If mixing multiple product types within a single Item, this can be used to specify the product_type for each asset.

## Static and Dynamic Catalogs

As mentioned in the main [overview](overview.md), there are two main types of catalogs - static
and dynamic. This section explains each of them in more depth and shares some best practices on each.

### Static Catalogs

A static catalog is an implementation of the STAC specification that does not respond dynamically to requests. It is simply
a set of files on a web server that link to one another in a way that can be crawled, often stored in an cloud storage
service like [Amazon S3](https://aws.amazon.com/s3/), [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) and
[Google Cloud Storage](https://cloud.google.com/storage/). But any http server could expose a static catalog as files.
The core JSON documents and link structures are encoded in the file, and work as long as things are structured properly.
A static catalog can only really be crawled by search engines and active catalogs; it can not respond to queries.
But it is incredibly reliable, as there are no moving parts, no clusters or databases to maintain.
The goal of STAC is to expose as much asset metadata online as possible, so the static catalog offers a very low
barrier to entry for anyone with geospatial assets to make their data searchable.

Static Catalogs tend to make extensive use of *sub-catalogs* to organize their Items in to sensible browsing structures, 
as they can only have a single representation of their catalog, since the static nature means the structure is baked in.
While it is up to the implementor to organize the catalog, it is recommended to arrange it in a way that would make sense 
for a human to browse a set of STAC Items in an intuitive matter.

The recommendation for static catalogs is to define them using the file name `catalog.json` or `collection.json` to distinguish 
the catalog from other JSON type files. In order to support multiple catalogs, the recommended practice 
is to place the catalog file in namespaces "directories". For example:

- current/catalog.json
- archive/catalog.json

### Dynamic Catalogs

A dynamic catalog is implemented in software as an HTTP-based API, following the same specified JSON structure for Items, Catalogs
and Collections. Its structure and responses are usually generated dynamically, instead of relying on a set of
already defined files. But the result is the same, enabling the same discovery from people browsing and search engines crawling. 
It generally indexes data for efficient responses, and aims to be easy for existing APIs to implement as a more standard interface 
for clients to consume. A dynamic catalog will sometimes be populated by a static catalog, or at least may have a 'backup' of its 
fields stored as a cached static catalog.

Dynamic Catalogs often also implement the [STAC API](https://github.com/radiantearth/stac-api-spec/) specification, that 
responds to search queries (like give me all imagery in Oahu gathered on January 15, 2017). But they are not required to, one
can have a dynamic service that only implements the core STAC specification, and is crawled by STAC API implementations that
provide 'search'. For example a Content Management Service like Drupal or an Open Data Catalog like CKAN could choose to expose 
its content as linked STAC Items by implementing a dynamic catalog. 

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same `Items` in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another by
providers, and users could browse down to both. The leaf Items should just be linked to in a single canonical location
(or at least use a `rel` link that indicates the location of the canonical one.

## Catalog Layout

Creating a catalog involves a number of decisions as to what folder structure to use to represent sub-catalogs, items
and assets, and how to name them. The specification leaves this totally open, and you can link things as you want. But 
it is recommended to be thoughtful about the organization of sub-catalogs, putting them into a structure that a person
might reasonably browse (since they likely will with [STAC on the Web](#stac-on-the-web) recommendations). For example
start with location, like a normal grid (path+row in Landsat) or administrative boundaries (country -> state-level) and 
then year, month, day. Or do the opposite - date and then location. Making a huge unordered list is technically allowed,
but not helpful for discovery of data. Thus it is generally considered a best practice to make use of sub-catalogs to 
keep the size of each sub-catalog under a megabyte. If your sub-catalog lists tens of thousands of child items then you
should consider an additional way to break it up. 

We encourage people to explore new structures of linking data, but the following list is what a number of implementors 
ended up doing. Following these recommendations makes for more legible catalogs.

1. Root documents (catalogs / collections) should be at the root of a directory tree containing the static catalog.
2. Catalogs should be named `catalog.json` (cf. `index.html`).
3. Collections that are distinct from catalogs should be named `collection.json`.
4. Items should be named `<id>.json`.
5. Sub-catalogs should be stored in subdirectories of their parent (and only 1 subdirectory deeper than a document's parent) (e.g. `.../sample/sub1/catalog.json`).
6. Items should be stored in subdirectories of their parent catalog. 
This means that each item and its assets are contained in a unique subdirectory.
7. Limit the number of items in a catalog or sub-catalog, grouping / partitioning as relevant to the dataset.

### Dynamic Catalog Layout

While these recommendations were primarily written for [static catalogs](#static-catalogs), they apply
equally well to [dynamic catalogs](#dynamic-catalogs). Subdirectories of course would just be URL paths 
generated dynamically, but the structure would be the same as is recommended.

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same Items in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another 
by providers, and users could browse down to both. The leaf Items should just be linked to in a single canonical location 
(or at least use a rel link that indicates the location of the canonical one). It is recommended that dynamic catalogs 
provide multiple 'views' to allow users to navigate in a way that makes sense to them, providing multiple 'sub-catalogs'
from the root catalog that enable different paths to browse (country/state, date/time, constellation/satellite, etc). But the 
canonical 'rel' link should be used to designate the primary location of the item to search engine crawlers.

### Mixing STAC Versions

Although it is allowed to mix STAC versions, it should be used carefully as clients may not support all versions so that 
the catalog could be of limited use to users. A Catalog or Collection linking to differently versioned Sub-Catalogs or Sub-Collections
is a common use case when multiple data source are combined. Client developers should be aware of this use case. Nevertheless, it 
is strongly recommended that Catalogs don't contain differently versioned Items so that users/clients can at least use and/or download
consistent (Sub-)Catalogs containing either all or no data. Collections that are referenced from Items should always use the same
STAC version. Otherwise some behaviour of functionality may be unpredictable (e.g. merging common fields into Items or reading summaries).

## Use of links

The main catalog specification allows both relative and absolute links, and says that `self` links are not required, but are 
strongly recommended. This is what the spec must say to enable the various use cases, but there is more subtlety for when it 
is essential to use different link types. The best practice is to use one of the below 
catalog types, applying the link recommendations consistently, instead of just haphazardly applying anything the spec allows.

### Self-contained Catalogs

A 'self-contained catalog' is one that is designed for portability. Users may want to download a catalog from online and be
able to use it on their local computer, so all links need to be relative. Or a tool that creates catalogs may need to work 
without knowing the final location that it will live at online, so it isn't possible to set absolute 'self' URL's. These use
cases should utilize a catalog that follows the listed principles:

* **Only relative href's in structural `links`**: The full catalog structure of links down to sub-catalogs and items, and their 
links back to their parents and roots, should be done with relative URL's. The structural rel types include `root`, `parent`, 
`child`, `item`, and `collection`. Other links can be absolute, especially if they describe a resource that makes less sense in
the catalog, like [sci:doi](extensions/scientific/README.md#item-and-collection-fields), 
`derived_from` or even `license` (it can be nice to include the license in the catalog, but some licenses live at a canonical 
online location which makes more sense to refer to directly). This enables the full catalog to be downloaded or
copy to another location and to still be valid. This also implies no `self` link, as that link must be absolute.

* **Use Asset `href` links consistently**: The links to the actual assets are allowed to be either relative or absolute. There
are two types of 'self-contained catalogs'. The first is just the metadata, and use absolute href links to refer to the 
online locations of the assets. The second uses relative href links for the assets, and includes them in the folder structure.
This enables offline use of a catalog, by including all the actual data.

Self-contained catalogs tend to be used more as static catalogs, where they can be easily passed around. But often they will
be generated by a more dynamic STAC service, enabling a subset of a catalog or a portion of a search criteria to be downloaded
and used in other contexts. That catalog could be used offline, or even published in another location.

Self-contained catalogs are not just for offline use, however - they are designed to be able to be published online and to live
on the cloud in object storage. They just aim to ease the burden of publishing, by not requiring lots of updating of links. 
Adding a single `self` link at the root is recommended for online catalogs, turning it into a 'relative published catalog', as detailed below. This anchors it in an online location and enable provenance tracking.

### Published Catalogs

While STAC is useful as a portable format to move between systems, the goal is really to enable search. While any combination
of absolute and relative links is technically allowed by the specification, it is strongly recommended to follow one of the 
patterns described below when publishing online. Many clients will not properly handle arbitrary mixes of absolute and relative
href's. 

We refer to a 'published catalog' as one that lives online in a stable location, and uses `self` links to establish its location and 
enable easy provenance tracking. There are two types of published catalogs:

* **Absolute Published Catalog** is a catalog that uses absolute links for everything, both in the `links` objects and in the
`asset` hrefs. It includes `self` links for every item. Generally these are implemented by dynamic catalogs, as it is quite
easy for them to generate the proper links dynamically. But a static catalog that knows its published location could easily
implement it.
* **Relative Published Catalog** is a self-contained catalog as described above, except it includes an absolute `self` link at
the root catalog, to identify its online location. This is designed so that a self-contained catalog can be 'published' online
by just adding one field (the self link) to its root catalog. All the other links should remain the same. The resulting catalog
is no longer compliant with the self-contained catalog recommendations, but instead transforms into a 'relative published catalog'. 
With this, a client may resolve item and sub-catalog self links by traversing parent and root links, but requires reading 
multiple sources to achieve this. 

So if you are writing a STAC client it is recommended to start with just supporting these two types of published catalogs. In 
turn, if your data is published online publicly or for use on an intranet then following these recommendations will ensure
that a wider range of clients will work with it. 

## Versioning for Catalogs

In the Item and Collection STAC JSON, versions and deprecation can be indicated with the [Versioning Indicators Extension](./extensions/version).

The [Items and Collections API Version Extension](https://github.com/radiantearth/stac-api-spec/tree/master/extensions/version/README.md) provides endpoints and semantics for keeping and accessing previous versions of Collections and Items. The same semantics can be used in static catalogs to preserve previous versions of the documents and link them together.

In order to achieve this, the static catalog must make sure that for every record created, a copy of the record is also created in a separate location and it is named with the version id adopted by the catalog. See [here](https://github.com/radiantearth/stac-api-spec/tree/master/extensions/version/README.md#version-id) for recommendations on versioning schema.

The main record should also provide a link to the versioned record following the linking patterns described [here](./extensions/version/README.md#relation-types). For every update to the record, the same cycle is repeated:

1. Add link from the updated record to the previous version
2. Create a copy of the updated record and name it correctly

### Example

When the record `my_item.json` is created, a copy of it is also created. `my_item.json` includes `permalink` to `my_item_01.json`. The version suffix of the file name is taken from the version field of the record when it is available.

- `root / collections / example_collection / items / my_item / my_item.json`
- `root / collections / example_collection / items / my_item / my_item_01.json`

When `my_item.json` is updated, the new `my_item.json` includes a link to `my_item_01.json` and is also copied to `my_item_02.json`. This ensures that `my_item_02.json` includes a link to `my_item_01.json`

- `root / collections / example_collection / items / my_item / my_item.json`
- `root / collections / example_collection / items / my_item / my_item_01.json`
- `root / collections / example_collection / items / my_item / my_item_02.json`

## STAC on the Web

One of the primary goals of STAC is to make spatiotemporal data more accessible on the web. One would have a right to be 
surprised that there is nothing about HTML in the entire specification. This is because it is difficult to specify what 
should be on web pages without ending up with very bad looking pages. But the importance of having web-accessible versions
of every STAC Item is paramount.

The main recommendation is to have an HTML page for every single STAC `Item` and `Catalog`. They should be visually pleasing, 
crawlable by search engines and ideally interactive. The current best practice is to use a tool in the STAC ecosystem called
[STAC Browser](https://github.com/radiantearth/stac-browser/). It can crawl most any valid catalog and generate unique web
pages for each `Item` and `Catalog` (or `Collection`). While it has a default look and feel, the design can easily be 
modified to match an existing web presence. And it will automatically turn any Item with a [Cloud Optimized 
GeoTIFF](http://cogeo.org) asset into an interactive, zoomable web map (using [tiles.rdnt.io](http://tiles.rdnt.io/) to render
the tiles on a [leaflet](https://leafletjs.com/) map). It also attempts to encapsulate a number of best practices that enable 
STAC Items to show up in search engines, though that part is still a work in progress - contributions to STAC Browser to help
are welcome!

Implementors are welcome to generate their own web pages, and additional tools that automatically transform STAC JSON into 
html sites are encouraged. In time there will likely emerge a set of best practices from an array of tools, and we may be
able to specify in the core standard how to make the right HTML pages. But for now it is useful for catalogs to focus on 
making data available as JSON, and then leverage tools that can evolve at the same time to make the best HTML experience. This
enables innovation on the web generation and search engine optimization to evolve independently of the catalogs themseleves.

### Schema.org, JSON-LD, DCAT, microformats, etc

There is a strong desire to align STAC with the various web standards for data. These include [schema.org](http://schema.org) 
tags, [JSON-LD](https://json-ld.org/) (particularly for Google's [dataset 
search](https://developers.google.com/search/docs/data-types/dataset)), [DCAT](https://www.w3.org/TR/vocab-dcat/)
and [microformats](http://microformats.org/wiki/about). STAC aims to work with with as many as possible. Thusfar it has not seemed
to make sense to include any of them directly in the core STAC standard. They are all more intended to be a part of the HTML
pages that search engines crawl, so the logical place to do the integration is by leveraging a tool that generates HTML 
from STAC like [STAC Browser](https://github.com/radiantearth/stac-browser/). STAC Browser has implemented a [mapping to 
schema.org](https://github.com/radiantearth/stac-spec/issues/378) fields using JSON-LD, but the exact output is still being
refined. It is on the roadmap to add in more mapping and do more testing of search engines crawling the HTML pages. 

### Deploying STAC Browser & stac.cloud

There are a number of STAC Browser [examples on stacspec.org](https://stacspec.org/#examples), that are all deployed on 
the [stac.cloud](http://stac.cloud) domain. Anyone with a public catalog is welcome to have a STAC Browser instance hosted
for free. But the stronger recommendation is to host your catalog's STAC Browser on your own domain, and to customize its 
design to look and feel like your main web presence. The goal of stac.cloud is to bootstrap live web pages for catalogs, but
not to be *the* central hub. STAC aims to be decentralized, so each catalog should have its own location and just be
part of the wider web. 

## Static to Dynamic best practices

Many implementors are using static catalogs to be the reliable core of their dynamic services, or layering their STAC API
on top of any static catalog that is published. These are some recommendations on how to handle this:

### Ingestion and links

Implementors have found that it's best to 'ingest' a static STAC into an internal datastore (often elasticsearch, but a 
traditional database could work fine too) and then generate the full STAC API responses from that internal representation.
There are instances that have the API refer directly to the static STAC Items, but this only works well if the static STAC 
catalog is an 'absolute published catalog'. So the recommendation is to always use absolute links - either in the static 
published catalog, or to create new absolute links for the STAC search/ endpoint 
responses, with the API's location at the base url. The `/` endpoint with the catalog could either link directly
to the static catalog, or can follow the 'dynamic catalog layout' recommendations above with a new set of URL's.

Ideally each `Item` would use its `links` to provide a reference back to the static location. The location of the static
item should be treated as the canonical location, as the generated API is more likely to move or be temporarily down. The
spec provides the `derived_from` rel attribute, which fits well enough, but `canonical` is likely the more appropriate one
as everything but the links should be the same.

### Keep catalogs in sync with cloud notification and queue services

There is a set of emerging practices to use services like Amazon's Simple Queue Service (SQS) and Simple Notification Service
(SNS) to keep catalogs in sync. There is a great [blog post on the CBERS STAC implementation on AWS](https://aws.amazon.com/blogs/publicsector/keeping-a-spatiotemporal-asset-catalog-stac-up-to-date-with-sns-sqs/). The core 
idea is that a static catalog should emit a notification whenever it changes. The recommendation for SNS is to use the STAC 
item JSON as the message body, with some attributes such as a scene’s datetime and geographic bounding box that allows 
basic geographic filtering from listeners. 

The dynamic STAC API would then listen to the notifications and update its internal datastore whenever new data comes into
the static catalog. Implementors have had success using AWS Lambda to do a full 'serverless' updating of the elasticsearch
database, but it could just as easily be a server-based process.
