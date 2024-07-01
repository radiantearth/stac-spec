# STAC Best Practices

## Table of Contents

- **[Web Best Practices](#web-practices)**
  - [Enable Cross-origin resource sharing (CORS)](#enable-cross-origin-resource-sharing-cors)
  - [STAC on the Web](#stac-on-the-web)
    - [Schema.org, JSON-LD, DCAT, microformats, etc](#schemaorg-json-ld-dcat-microformats-etc)
    - [Deploying STAC Browser](#deploying-stac-browser)
  - [Requester Pays](#requester-pays)
  - [Consistent URIs](#consistent-uris)
- **[Item Best Practices](#item-practices)**
  - [Field and ID formatting](#item-ids)
  - [Searchable Identifiers](#searchable-identifiers)
  - [Field selection and Metadata Linking](#field-selection-and-metadata-linking)
  - [Datetime selection](#datetime-selection)
  - [Unlocated Items](#unlocated-items)
    - [Unrectified Satellite Data](#unrectified-satellite-data)
    - [Data that is not spatial](#data-that-is-not-spatial)
  - [Representing Vector Layers in STAC](#representing-vector-layers-in-stac)
- **[Asset and Link Best Practices](#asset-and-link-best-practices)**
  - [Common Use Cases of Additional Fields for Assets](#common-use-cases-of-additional-fields-for-assets)
  - [Working with Media Types](#working-with-media-types)
    - [Common Media Types in STAC](#common-media-types-in-stac)
    - [Formats with no registered media type](#formats-with-no-registered-media-type)
  - [Asset Roles](#asset-roles)
    - [List of Asset Roles](#list-of-asset-roles)
- **[Catalog & Collection Best Practices](#catalog--collection-practices)**
  - [Static and Dynamic Catalogs](#static-and-dynamic-catalogs)
    - [Static Catalogs](#static-catalogs)
    - [Dynamic Catalogs](#dynamic-catalogs)
  - [Catalog Layout](#catalog-layout)
    - [Dynamic Catalog Layout](#dynamic-catalog-layout)
    - [Mixing STAC Versions](#mixing-stac-versions)
  - [Using Summaries in Collections](#using-summaries-in-collections)
  - [Use of links](#use-of-links)
    - [Self-contained Catalogs](#self-contained-catalogs)
    - [Published Catalogs](#published-catalogs)
  - [Using Relation Types](#using-relation-types)
  - [Versioning for Catalogs](#versioning-for-catalogs)
    - [Example](#example)
  - [Static to Dynamic best practices](#static-to-dynamic-best-practices)
    - [Ingestion and links](#ingestion-and-links)
    - [Keep catalogs in sync with cloud notification and queue services](#keep-catalogs-in-sync-with-cloud-notification-and-queue-services)
  - [How to Differentiate STAC Files](#how-to-differentiate-stac-files)
  

This document makes a number of recommendations for creating real world SpatioTemporal Asset Catalogs. None of them 
are required to meet the core specification, but following these practices will make life easier for client tooling
and for users. They come about from practical experience of implementors and introduce a bit more 'constraint' for
those who are creating STAC objects representing their data or creating tools to work with STAC. 

While the current goal of the core is to remain quite flexible and simple to meet a wide variety of use cases,
in time some of these may evolve to become part of the core specification.

## Web Practices

### Enable Cross-origin resource sharing (CORS)

STAC strives to make geospatial information more accessible, by putting it on the web. Fundamental to STAC's vision is that
different tools will be able to load and display public-facing STAC data. But the web runs on a [Same origin 
policy](https://en.wikipedia.org/wiki/Same-origin_policy), preventing web pages from loading information from other web locations
to prevent malicious scripts from accessing sensitive data. This means that by default a web page would only be able to load STAC
[Item](item-spec/item-spec.md) objects from the same server the page is on.
[Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing),
also known as 'CORS' is a protocol to enable safe communication across origins. But most web services turn it off by default. This
is generally a good thing, but unfortunately if CORS is not enabled then any browser-based STAC tool will not work. 

So to enable all the great web tools (like [stacindex.org](http://stacindex.org)) to work with your STAC implementation it is essential to
'enable CORS'. Most services have good resources on how to do this, like on [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html),
[Google Cloud Storage](https://cloud.google.com/storage/docs/cross-origin), or [Apache Server](https://enable-cors.org/server_apache.html). 
Many more are listed on [enable-cors.org](https://enable-cors.org/server.html). We recommend enabling CORS for all requests ('\*'),
so that diverse online tools can access your data. If you aren't sure if your server has CORS enabled you can use 
[test-cors.org](https://www.test-cors.org/). Enter the URL of your STAC root [Catalog](catalog-spec/catalog-spec.md) or
[Collection](collection-spec/collection-spec.md) JSON and make sure it gets a response.

### STAC on the Web

One of the primary goals of STAC is to make spatiotemporal data more accessible on the web. One would have a right to be 
surprised that there is nothing about HTML in the entire specification. This is because it is difficult to specify what 
should be on web pages without ending up with very bad looking pages. But the importance of having web-accessible versions
of every STAC Item is paramount.

The main recommendation is to have an HTML page for every single STAC Item, Catalog and Collection. They should be visually pleasing, 
crawlable by search engines and ideally interactive. The current best practice is to use a tool in the STAC ecosystem called
[STAC Browser](https://github.com/radiantearth/stac-browser/). It can crawl most any valid STAC implementation and generate unique web
pages for each Item and Catalog (or Collection). While it has a default look and feel, the design can easily be 
modified to match an existing web presence. And it will automatically turn any Item with a [Cloud Optimized 
GeoTIFF](http://cogeo.org) asset into an interactive, zoomable web map (using [tiles.rdnt.io](http://tiles.rdnt.io/) to render
the tiles on a [leaflet](https://leafletjs.com/) map). It also attempts to encapsulate a number of best practices that enable 
STAC Items to show up in search engines, though that part is still a work in progress - contributions to STAC Browser to help
are welcome!

Implementors are welcome to generate their own web pages, and additional tools that automatically transform STAC JSON into 
html sites are encouraged. In time there will likely emerge a set of best practices from an array of tools, and we may be
able to specify in the core standard how to make the right HTML pages. But for now it is useful for STAC implementations to focus on 
making data available as JSON, and then leverage tools that can evolve at the same time to make the best HTML experience. This
enables innovation on the web generation and search engine optimization to evolve independently from the core data.

#### Schema.org, JSON-LD, DCAT, microformats, etc

There is a strong desire to align STAC with the various web standards for data. These include [schema.org](http://schema.org) 
tags, [JSON-LD](https://json-ld.org/) (particularly for Google's [dataset 
search](https://developers.google.com/search/docs/data-types/dataset)), [DCAT](https://www.w3.org/TR/vocab-dcat/)
and [microformats](http://microformats.org/wiki/about). STAC aims to work with as many as possible. Thusfar it has not seemed
to make sense to include any of them directly in the core STAC standard. They are all more intended to be a part of the HTML
pages that search engines crawl, so the logical place to do the integration is by leveraging a tool that generates HTML 
from STAC like [STAC Browser](https://github.com/radiantearth/stac-browser/). STAC Browser has implemented a [mapping to 
schema.org](https://github.com/radiantearth/stac-spec/issues/378) fields using JSON-LD, but the exact output is still being
refined. It is on the roadmap to add in more mapping and do more testing of search engines crawling the HTML pages. 

#### Deploying STAC Browser

Most public STAC implementations have a STAC Browser hosted at [stacindex.org](https://stacindex.org/catalogs).
Anyone with a public STAC implementation is welcome to have a STAC Browser instance hosted for free,
just submit it to [stacindex.org](https://stacindex.org/add).
But the stronger recommendation is to host a STAC Browser on your own domain, and to customize its 
design to look and feel like your main web presence. STAC aims to be decentralized, so each STAC-compliant data catalog 
should have its own location and just be part of the wider web.

### Requester Pays

It is very common that large, freely available datasets are set up with a 'requester pays' configuration. This is an option 
[on AWS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RequesterPaysBuckets.html) and [on 
Google Cloud](https://cloud.google.com/storage/docs/requester-pays), that enables data providers to make their data
available to everyone, while the cloud platform charges access costs
(such as per-request and data '[egress](https://www.hostdime.com/blog/data-egress-fees-cloud/)') to the user accessing the data.
For popular datasets that are large in size the egress costs can be substantial, to the point where much
less data would be available if the cost of distribution was always on the data provider.

For data providers using STAC with requester pays buckets, there are two main recommendations:

1. Put the STAC JSON in a separate bucket that is public for everyone and **not** requestor pays. This enables the STAC metadata
   to be far more crawlable and searchable, but the cost of the egress of STAC files should be miniscule compared to that of
   the actual data. The STAC community can help you work with cloud providers for potential free hosting if you are doing open
   data as requestor pays and aren't able to pay the costs of a completely open STAC bucket, as they are most all supportive of
   STAC (but no guarantees and it may be on an alternate cloud).
2. For Asset href values to resources in a requestor pays bucket, use the cloud provider-specific protocol
   (e.g., `s3://` on AWS and `gs://` on Google Cloud) instead of an `https://` url.
   Most clients do not have special handling for `https://` links to cloud provider resources that require a requestor pays flag and authentication,
   so they simply fail. Many clients have special handling for `s3://` or `gs://` URLs
   that will add a requestor pays parameter and will apply appropriate authentication to the request.
   Using cloud-specific protocols will at least give users an option to register a paid account and
   allow the data provider to properly charge for access. 
   STAC-specific tools in turn can look for the cloud-specific protocols and know to use the requestor pays feature for that specific cloud platform.

### Consistent URIs

Links in STAC can be [absolute or relative](#use-of-links).
Relative links must be resolved against the absolute URI given in the link with the relation type `self` (or in some cases `root`).
To resolve relative URIs the base URIs must be precise and consistent: Having or not having a trailing slash is significant.
Without it, the last path component is identified as a "file" name which will be removed to get to the "directory" that is used as the base.
API endpoints usually behave like directories.
This means that if the trailing slash is missing for a folder,
a relative link would need to include the last path component again to resolve correctly.

**Examples:**
- We have a `self` link `https://example.com/folder/catalog.json` and a relative link `./item.json`.
  This resolves to `https://example.com/folder/item.json` as expected as the last path component is actually a file.
- We have a `self` link `https://example.com/collections/S2/items/123` and a relative link `./band1.tif`.
  This resolves to `https://example.com/collections/S2/items/band1.tif`, which is likely unexpected and unintended.
  There are two ways to solve this issue so that the URLs resolve correctly to `https://example.com/collections/S2/items/123/band1.tif`:
  1. Add a slash at the end of the `self` link: `https://example.com/collections/S2/items/123/`, *OR*
  2. Add the last path element to the relative link: `./123/band1.tif`

To avoid these issues it is recommended to consistently add a slash at the end of the URL if it doesn't point to a file.

## Item Practices

### Item IDs

When defining one's STAC properties and fields there are many choices to make on how to name various aspects of one's
data. One of the key properties is the ID. The specification is quite flexible on ID's, primarily so that existing
providers can easily use their same ID when they translate their data into STAC - they just need to be sure it is globally
unique, so may need a prefix. But the use of URI or file path reserved characters such as `:` or `/` is discouraged since this will 
result in [percented encoded](https://tools.ietf.org/html/rfc3986#section-2) [STAC API](https://github.com/radiantearth/stac-api-spec) 
endpoints and it prevents the use of IDs as file names as recommended in the [catalog layout](#catalog-layout) best practices.

### Searchable Identifiers

When coming up with values for fields that contain searchable identifiers of some sort, like `constellation` or `platform`,
it is recommended that the identifiers consist of only lowercase characters, numbers, `_`, and `-`.
Examples include `sentinel-1a` (Sentinel-1), `landsat-8` (Landsat-8) and `envisat` (Envisat).
This is to provide consistency for search across Collections, so that people can just search for `landsat-8`,
instead of thinking through all the ways providers might have chosen to name it.

### Field selection and Metadata Linking

In general STAC aims to be oriented around **search**, centered on the core fields that users will want to search on to find 
imagery. The core is space and time, but there are often other metadata fields that are useful. While the specification is 
flexible enough that providers can fill it with tens or even hundreds of fields of metadata, that is not recommended. If 
providers have lots of metadata then that can be linked to in the [Asset Object](item-spec/item-spec.md#asset-object) 
(recommended) or in a [Link Object](item-spec/item-spec.md#link-object). There is a lot of metadata that is only of relevance 
to loading and processing data, and while STAC does not prohibit providers from putting those type of fields in their items, 
it is not recommended. For very large catalogs (hundreds of millions of records),
every additional field that is indexed will cost substantial money, so data providers are advised to just put the fields to be searched in STAC and
[STAC API](https://github.com/radiantearth/stac-api-spec) providers don't have bloated indices that no one actually uses.

### Datetime selection

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
the focus of STAC. If `datetime` is set to `null` then it is strongly recommended to use it in conjunction with an extension
that explains why it should not be set for that type of data. 

### Unlocated Items

Though the [GeoJSON standard](https://tools.ietf.org/html/rfc7946) allows null geometries, in STAC we strongly recommend
that every item have a geometry, since the general expectation of someone using a SpatioTemporal Catalog is to be able to query
all data by space and time. But there are some use cases where it can make sense to create a STAC Item before it gets
a geometry. The most common of these is 'level 1' satellite data, where an image is downlinked and cataloged before it has 
been geospatially located. 

The recommendation for data that does not yet have a location is to follow the GeoJSON concept that it is an ['unlocated' 
feature](https://tools.ietf.org/html/rfc7946#section-3.2). So if the catalog has data that is not located then it can follow 
GeoJSON and set the geometry to null. Though normally required, in this case the `bbox` field should not be included.

Note that this recommendation is only for cases where data does not yet have a geometry and it cannot be estimated. There
are further details on the two most commonly requested desired use cases for setting geometry to null:

#### Unrectified Satellite Data

Most satellite data is downlinked without information that precisely describes where it is located on Earth. A satellite 
imagery processing pipeline will always attempt to locate it, but often that process takes a number of hours, or never
quite completes (like when it is too cloudy). It can be useful to start to populate the Item before it has a geometry. 
In this case the recommendation is to use the 'estimated' position from the satellite, to populate at least the bounding box,
and use the same broad bounds for the geometry (or leaving it null) until there is precise ground lock. This estimation is 
usually done by onboard equipment, like GPS or star trackers, but can be off by kilometers or more. But it is very useful for 
STAC users to be able to at least find approximate area in their searches. A commonly used field for communicating ground lock 
is not yet established, but likely should be (an extension proposal would be appreciated).  If there is no way to provide an 
estimate then the data can be assigned a null geometry and no `bbox`, as described above. But the data will likely not
show up in STAC API searches, as most will at least implicitly use a geometry. Though this section is written with 
satellite data in mind, one can easily imagine other data types that start with a less precise geometry but have it 
refined after processing.

#### Data that is not spatial

The other case that often comes up is people who love STAC and want to use it to catalog everything they have, even if it is
not spatial. This use case is not currently supported by STAC, as we are focused on data that is both temporal and spatial
in nature. The [OGC API - Records](https://github.com/opengeospatial/ogcapi-records) is an emerging standard that likely
will be able to handle a wider range of data than STAC. It builds on [OGC API - 
Features](https://github.com/opengeospatial/ogcapi-features) just like [STAC API](https://github.com/radiantearth/stac-api-spec/)
does. Using [Collection Assets](collection-spec/collection-spec.md#asset-object) may also provide an option for some 
use cases.

### Representing Vector Layers in STAC

Many implementors are tempted to try to use STAC for 'everything', using it as a universal catalog of all their 'stuff'.
The main route considered is to use STAC to describe vector layers, putting a shapefile or [geopackage](http://geopackage.org)
as the `asset`. Though there is nothing in the specification that *prevents* this, it is not really the right level of 
abstraction. A shapefile or geopackage corresponds to a Collection, not a single Item. The ideal thing to do with
one of those is to serve it with [OGC API - Features](https://github.com/opengeospatial/ogcapi-features) standard. This
allows each feature in the shapefile/geopackage to be represented online, and enables querying of the actual data. If
that is not possible then the appropriate way to handle Collection-level search is with the 
[OGC API - Records](https://github.com/opengeospatial/ogcapi-records) standard, which is a 'brother' specification of STAC API. 
Both are compliant with OGC API - Features, adding richer search capabilities to enable finding of data. 

## Asset and Link Best Practices

### Common Use Cases of Additional Fields for Assets

As [described in the Item spec](item-spec/item-spec.md#additional-fields-for-assets), it is possible to use fields typically
found in Item properties at the asset level. This mechanism of overriding or providing Item Properties only in the Assets 
makes discovery more difficult and should generally be avoided. However, there are some core and extension fields for which 
providing them at the Asset level can prove to be very useful for using the data.

- `datetime`: Provide individual timestamp on an Item, in case the Item has a `start_datetime` and `end_datetime`,
  but an Asset is for one specific time.
- `gsd` ([Common Metadata](item-spec/common-metadata.md#instrument)): Specify some assets that represent instruments 
  with different spatial resolution than the overall best resolution. Note this should not be used for different 
  spatial resolutions due to specific processing of assets - look into the [raster 
  extension](https://github.com/stac-extensions/raster) for that use case.
- `eo:bands` ([EO extension](https://github.com/stac-extensions/eo/)):
  Provide spectral band information, and order of bands, within an individual asset.
- `proj:epsg`/`proj:wkt2`/`proj:projjson` ([projection extension](https://github.com/stac-extensions/projection/)):
  Specify different projection for some assets. If the projection is different
  for all assets it should probably not be provided as an Item property. If most assets are one projection, and there is 
  a single reprojected version (such as a Web Mercator preview image), it is sensible to specify the main projection in the 
  Item and the alternate projection for the affected asset(s).
- `proj:shape`/`proj:transform` ([projection extension](https://github.com/stac-extensions/projection/)):
  If assets have different spatial resolutions and slightly different exact bounding boxes,
  specify these per asset to indicate the size of the asset in pixels and its exact GeoTransform in the native projection.
- `sar:polarizations` ([sar extension](https://github.com/stac-extensions/sar)):
  Provide the polarization content and ordering of a specific asset, similar to `eo:bands`.
- `sar:product_type` ([sar extension](https://github.com/stac-extensions/sar)):
  If mixing multiple product types within a single Item, this can be used to specify the product_type for each asset.

### Titles

It is recommended to always provide link titles.
The link titles should always reflect the title of the entity it refers to.
For example, if a STAC Item links to a STAC Collection, the value of the `title` property in the link with relation type `collection`
should **exactly** match the value of the `title` property in the STAC Collection.
Implementations should ensure that link titles are always synchronized so that inconsistencies don't occur.

Providing titles enables users to search and navigate more easily through STAC catalogs,
makes the links more predictable, and may prevent "flickering" in user-interfaces such as STAC Browser.

If the entity that a link refers to has no title, the value of the `id` can be considered as an alternative.

### Working with Media Types

[Media Types](https://en.wikipedia.org/wiki/Media_type) are a key element that enables STAC to be a rich source of information for
clients. The best practice is to use as specific of a media type as possible (so if a file is a GeoJSON then don't use a JSON
media type), and to use [registered](https://www.iana.org/assignments/media-types/media-types.xhtml) IANA types as much as possible.

For hierarchical links (e.g. relation types `root`, `parent`, `child`, `item`) it is important that
clients filter for the corresponding STAC media types
(e.g. `application/json` for all relation types and/or `application/geo+json` for relation type `item`). 
Hierarchical links with other media types (e.g. `text/html`) may be present for hierarchical links,
especially in STAC implementations that are also implementing OGC API - Records.

#### Common Media Types in STAC

The following table lists a number of commonly used media types in STAC. The first two (GeoTIFF and COG) are not fully standardized 
yet, but reflect the community consensus direction. There are many IANA registered types that commonly show up in STAC. The 
following table lists some of the most common ones you may encounter or use.

| Media Type                                                 | Description                                                                                                                                                                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image/tiff; application=geotiff`                          | GeoTIFF with standardized georeferencing metadata                                                                                                                                                                                         |
| `image/tiff; application=geotiff; profile=cloud-optimized` | [Cloud Optimized GeoTIFF](https://www.cogeo.org/) (unofficial). Once there is an [official media type](http://osgeo-org.1560.x6.nabble.com/Media-type-tc5411498.html) it will be added and the custom media type here will be deprecated. |
| `image/jp2`                                                | JPEG 2000                                                                                                                                                                                                                                 |
| `image/png`                                                | Visual PNGs (e.g. thumbnails)                                                                                                                                                                                                             |
| `image/jpeg`                                               | Visual JPEGs (e.g. thumbnails, oblique)                                                                                                                                                                                                   |
| `text/xml` or `application/xml`                            | XML metadata [RFC 7303](https://www.ietf.org/rfc/rfc7303.txt)                                                                                                                                                                             |
| `application/json`                                         | A JSON file (often metadata, or [labels](https://github.com/radiantearth/stac-spec/tree/master/extensions/label#labels-required))                                                                                                         |
| `text/plain`                                               | Plain text (often metadata)                                                                                                                                                                                                               |
| `application/geo+json`                                     | [GeoJSON](https://geojson.org/)                                                                                                                                                                                                           |
| `application/geopackage+sqlite3`                           | [GeoPackage](https://www.geopackage.org/)                                                                                                                                                                                                 |
| `application/x-hdf5`                                       | Hierarchical Data Format version 5                                                                                                                                                                                                        |
| `application/x-hdf`                                        | Hierarchical Data Format versions 4 and earlier.                                                                                                                                                                                          |

*Deprecation notice: GeoTiff previously used the media type `image/vnd.stac.geotiff` and
Cloud Optimized GeoTiffs used `image/vnd.stac.geotiff; profile=cloud-optimized`.
Both can still appear in old STAC implementations, but are deprecated and should be replaced.

#### Formats with no registered media type

This section gives recommendations on what to do if you have a format in your links or assets
that does not have an IANA registered type.
Ideally every media type used is on the [IANA registry](https://www.iana.org/assignments/media-types/media-types.xhtml). If
you are using a format that is not on that list we recommend you use
[custom content type](https://restcookbook.com/Resources/using-custom-content-types/).
These typically use the `vnd.` prefix, see [RFC 6838 section-3.2](https://tools.ietf.org/html/rfc6838#section-3.2).
Ideally the format provider will actually
register the media type with IANA, so that other STAC clients can find it easily. But if you are only using it internally it is 
[acceptable to not register](https://stackoverflow.com/questions/29121241/custom-content-type-is-registering-with-iana-mandatory) 
it. It is relatively easy to [register](https://www.iana.org/form/media-types) a `vnd` media type.

### Asset Roles

[Asset roles](item-spec/item-spec.md#asset-roles) are used to describe what each asset is used for. They are particular useful 
when several assets have the same media type, such as when an Item has a multispectral analytic asset, a 3-band full resolution 
visual asset, a down-sampled preview asset, and a cloud mask asset, all stored as Cloud Optimized GeoTIFF (COG) images. It is 
recommended to use at least one role for every asset available, and using multiple roles often makes sense. For example you'd use
both `data` and `reflectance` if your main data asset is processed to reflectance, or `metadata` and `cloud` for an asset that 
is a cloud mask, since a mask is considered a form of metadata (it's information about the data). Or if a single asset represents
several types of 'unusable data' it might include `metadata`, `cloud`, `cloud-shadow` and `snow-ice`. If there is not a clear
role then just pick a sensible name for the role. You are encouraged to add it to the list below and/or
in an extension if you think the new role will have broader applicability. 

#### List of Asset Roles

There are a number of roles that are commonly used in practice, which we recommend to reuse as much as possible.
If you can't find suitable roles, feel free to suggest more.

| Role Name  | Description                                                                                                                                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data       | The data itself, excluding the metadata.                                                                                                                                                                                                                                                        |
| metadata   | Metadata sidecar files describing the data, for example a Landsat-8 MTL file.                                                                                                                                                                                                                   |
| thumbnail  | An asset that represents a thumbnail of the Item or Collection, typically a RGB or grayscale image primarily for human consumption, low resolution, restricted spatial extent, and displayable in a web browser without scripts or extensions.                                                  |
| overview   | An asset that represents a more detailed overview of the Item or Collection, typically a RGB or grayscale image primarily for human consumption, medium resolution, full spatial extent, in a file format that's can be visualized easily (e.g., Cloud-Optimized GeoTiff).                      |
| visual     | An asset that represents a detailed overview of the Item or Collection, typically a RGB or grayscale image primarily for human consumption, high or native resolution (often sharpened), full spatial extent, in a file format that's can be visualized easily (e.g., Cloud-Optimized GeoTiff). |
| date       | An asset that provides per-pixel acquisition timestamps, typically serving as metadata to another asset                                                                                                                                                                                         |
| graphic    | Supporting plot, illustration, or graph associated with the Item                                                                                                                                                                                                                                |
| data-mask  | File indicating if corresponding pixels have Valid data and various types of invalid data                                                                                                                                                                                                       |
| snow-ice   | Points to a file that indicates whether a pixel is assessed as being snow/ice or not.                                                                                                                                                                                                           |
| land-water | Points to a file that indicates whether a pixel is assessed as being land or water.                                                                                                                                                                                                             |
| water-mask | Points to a file that indicates whether a pixel is assessed as being water (e.g. flooding map).                                                                                                                                                                                                 |
| iso-19115  | Points to an [ISO 19115](https://www.iso.org/standard/53798.html) metadata file                                                                                                                                                                                                                 |

Additional roles are defined in the various extensions, for example:

- [EO Extension](https://github.com/stac-extensions/eo/blob/main/README.md#best-practices)
- [View Extension](https://github.com/stac-extensions/view/blob/main/README.md#best-practices)
- [SAR Extension](https://github.com/stac-extensions/sar/blob/main/README.md#best-practices)

The roles `thumbnail`, `overview` and `visual` are very similar. To make choosing the right role easier, please consult the table below.

They should usually be a RGB or grayscale image, which are primarily intended for human consumption, e.g., through a web browser.
It can complement assets where one band is per file (like Landsat), by providing the key display bands combined,
or can complement assets where many non-visible bands are included, by being a lighter weight file that just has the bands needed for display.

Roles should also be combined, e.g., `thumbnail` and `overview` if the recommendations are all met.

If your data for the Item does not come with a thumbnail already we do recommend generating one, which can be done quite easily with [GDAL](https://gdal.org/) or [Rasterio](https://rasterio.readthedocs.io/en/latest/).

| Role                           | thumbnail                                           | overview                                                           | visual                                                                                       |
| ------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Resolution                     | Low                                                 | Medium                                                             | Native / High                                                                                |
| *Recommended* Image dimensions | < 600x600 px                                        | < 5000x500 px                                                      | any size                                                                                     |
| *Recommended* File Formats     | PNG, JPEG, GIF, WebP                                | PNG, JPEG, WebP, COG                                               | COG, other cloud-native and/or tiled file formats with pyramids, ...                         |
| Spatial extent                 | Limited                                             | Full                                                               | Full                                                                                         |
| Use case                       | Quick overview, often in lists of items/collections | Display for a single Item/Collection, sometimes shown on a web map | Display for a single Item/Collection, often shown on a map, may be displayed in GIS software |

## Catalog & Collection Practices

*Note: This section uses the term 'Catalog' (with an uppercase C) to refer to the JSON entity specified in the 
[Catalog spec](catalog-spec/catalog-spec.md), and 'catalog' (with a lowercase c) to refer to any full STAC implementation, 
which can be any mix of Catalogs, Collections, and Items.*

### Static and Dynamic Catalogs

As mentioned in the main [overview](overview.md), there are two main types of catalogs - static
and dynamic. This section explains each of them in more depth and shares some best practices on each.

#### Static Catalogs

A static catalog is an implementation of the STAC specification that does not respond dynamically to requests. It is simply
a set of files on a web server that link to one another in a way that can be crawled, often stored in an cloud storage
service like [Amazon S3](https://aws.amazon.com/s3/), [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) and
[Google Cloud Storage](https://cloud.google.com/storage/). But any http server could expose a static catalog as files.
The core JSON documents and link structures are encoded in the file, and work as long as things are structured properly.
A static catalog can only really be crawled by search engines and active catalogs; it can not respond to queries.
But it is incredibly reliable, as there are no moving parts, no clusters or databases to maintain.
The goal of STAC is to expose as much asset metadata online as possible, so the static catalog offers a very low
barrier to entry for anyone with geospatial assets to make their data searchable.

Static catalogs tend to make extensive use of *sub-catalogs* to organize their Items into sensible browsing structures, 
as they can only have a single representation of their catalog, since the static nature means the structure is baked in.
While it is up to the implementor to organize the catalog, it is recommended to arrange it in a way that would make sense 
for a human to browse a set of STAC Items in an intuitive matter.

Users indicate their intent for a file to be parsed as a Collection or Catalog using the required `type` field on
each entity. For Collections, this field must have the value `Collection`, while for Catalogs, it must have the
value `Catalog`. Additionally, we recommend for static STACs indicate contents using the filenames `catalog.json`
or `collection.json` to distinguish the Catalog from other JSON type files. In order to support multiple catalogs, the recommended practice 
is to place the Catalog file in namespaces "directories". For example:

- current/catalog.json
- archive/catalog.json

#### Dynamic Catalogs

A dynamic catalog is implemented in software as an HTTP-based API, following the same specified JSON structure for Items, Catalogs
and Collections. Its structure and responses are usually generated dynamically, instead of relying on a set of
already defined files. But the result is the same, enabling the same discovery from people browsing and search engines crawling. 
It generally indexes data for efficient responses, and aims to be easy for existing APIs to implement as a more standard interface 
for clients to consume. A dynamic catalog will sometimes be populated by a static catalog, or at least may have a 'backup' of its 
fields stored as a cached static catalog.

Dynamic catalogs often also implement the [STAC API](https://github.com/radiantearth/stac-api-spec/) specification, that 
responds to search queries (like "give me all imagery in Oahu gathered on January 15, 2017"). But they are not required to.  One
can have a dynamic service that only implements the core STAC specification, and is crawled by STAC API implementations that
provide 'search'. For example a Content Management Service like Drupal or an open data catalog like CKAN could choose to expose 
its content as linked STAC Items by implementing a dynamic catalog. 

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same Items in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another by
providers, and users could browse down to both. The leaf Items should just be linked to in a single canonical location
(or at least use a `rel` link that indicates the location of the canonical one).

### Catalog Layout

Creating a catalog involves a number of decisions as to what folder structure to use to represent sub-catalogs, Items
and assets, and how to name them. The specification leaves this totally open, and you can link things as you want. But 
it is recommended to be thoughtful about the organization of sub-catalogs, putting them into a structure that a person
might reasonably browse (since they likely will with [STAC on the Web](#stac-on-the-web) recommendations). For example
start with location, like a normal grid (path+row in Landsat) or administrative boundaries (country -> state-level) and 
then year, month, day. Or do the opposite - date and then location. Making a huge unordered list is technically allowed,
but not helpful for discovery of data. Thus it is generally considered a best practice to make use of sub-catalogs to 
keep the size of each sub-catalog under a megabyte. If your sub-catalog lists tens of thousands of child items then you
should consider an additional way to break it up. 

We encourage people to explore new structures of linking data, but the following list is what a number of implementors 
ended up doing. Following these recommendations makes for more legible catalogs, and many tools operate more efficiently
if you follow these recommendations.

1. Root documents (Catalogs / Collections) should be at the root of a directory tree containing the static catalog.
2. Catalogs should be named `catalog.json` and Collections should be named `collection.json`.
3. Items should be named `<id>.json`.
4. Sub-Catalogs or sub-Collections should be stored in subdirectories of their parent
   (and only 1 subdirectory deeper than a document's parent, e.g. `.../sample/sub1/catalog.json`).
5. Items should be stored in subdirectories of their parent Catalog or Collection if there are usually [sidecar files](https://en.wikipedia.org/wiki/Sidecar_file) stored alongside the Item.
   This means that each Item and its assets are contained in a unique subdirectory unless this would regularly lead to a single Item in a directory.
6. Limit the number of Items in a Catalog or Collection, grouping / partitioning as relevant to the dataset.
7. Use structural elements (Catalog and Collection) consistently across each 'level' of your hierarchy.
   For example, if levels 2 and 4 of the hierarchy only contain Collections,
   don't add a Catalog at levels 2 and 4.

One further recommendation to help tools is to always include the 'title' field when including a link, especially in the 
`item`, `child`, `parent` and `root` links, even if it repeats several times. This should be the same as the 'title' in the 
link destination. Having this enables clients to display a nice human readable name of the link without having  to open the 
link destination. 

#### Dynamic Catalog Layout

While these recommendations were primarily written for [static catalogs](#static-catalogs), they apply
equally well to [dynamic catalogs](#dynamic-catalogs). Subdirectories of course would just be URL paths 
generated dynamically, but the structure would be the same as is recommended.

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same Items in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another 
by providers, and users could browse down to both. The leaf Items should just be linked to in a single canonical location 
(or at least use a rel link that indicates the location of the canonical one). It is recommended that dynamic catalogs 
provide multiple 'views' to allow users to navigate in a way that makes sense to them, providing multiple 'sub-catalogs'
from the root that enable different paths to browse (country/state, date/time, constellation/satellite, etc). But the 
canonical 'rel' link should be used to designate the primary location of the Item to search engine crawlers.

#### Mixing STAC Versions

Although it is allowed to mix STAC versions, it should be used carefully as clients may not support all versions so that 
the catalog could be of limited use to users. A Catalog or Collection linking to differently versioned Sub-Catalogs or Sub-Collections
is a common use case when multiple data source are combined. Client developers should be aware of this use case. Nevertheless, it 
is strongly recommended that Catalogs don't contain differently versioned Items so that users/clients can at least use and/or download
consistent (Sub-)Catalogs containing either all or no data. Collections that are referenced from Items should always use the same
STAC version. Otherwise some behaviour of functionality may be unpredictable (e.g. merging common fields into Items or reading summaries).

### Using Summaries in Collections

One of the strongest recommendations for STAC is to always provide [summaries](collection-spec/collection-spec.md#summaries) in
your Collections. The core team decided to not require them, in case there are future situations where providing a summary
is too difficult. The idea behind them is not to exhaustively summarize every single field in the Collection, but to provide
a bit of a 'curated' view. 

Some general thinking on what to summarize is as follows:

- Any field that is a range of data (like numbers or dates) is a great candidate to summarize, to give people a sense what values
the data might be. For example in overhead imagery, a 
[`view:off_nadir`](https://github.com/stac-extensions/view/blob/main/README.md#item-properties-and-item-asset-fields)
with a range of 0 to 3 would tell people this imagery is all pretty much straight down,
while a value of 15 to 40 would tell them that it's oblique imagery, or 0 to 60 that it's 
a Collection with lots of different look angles. 

- Fields that have only one or a handful of values are also great to summarize. Collections with a single satellite may
use a single [`gsd`](item-spec/common-metadata.md#instrument) field in the summary, and it's quite useful for users to know
that all data is going to be the same resolution. Similarly it's useful to know the names of all the 
[`platform` values](item-spec/common-metadata.md#instrument) that are used in the Collection. 

- It is less useful to summarize fields that have numerous different discrete values that can't easily be represented
in a range. These will mostly be string values, when there aren't just a handful of options. For example if you had a 
'location' field that gave 3 levels of administrative region (like 'San Francisco, California, United States') to help people
understand more intuitively where a shot was taken. If your Collection has millions of Items, or even hundreds, you don't want
to include all the different location string values in a summary. 

- Fields that consist of arrays are more of a judgement call. For example [`instruments`](item-spec/common-metadata.md#instrument)
is straightforward and recommended, as the elements of the array are a discrete set of options. On the other hand 
[`proj:transform`](https://github.com/stac-extensions/projection/blob/main/README.md#projtransform)
makes no sense to summarize, as the union of all the values
in the array are meaningless, as each Item is describing its transform, so combining them would just be a bunch of random numbers.
So if the values contained in the array are independently meaningful (not interconnected) and there aren't hundreds of potential
values then it is likely a good candidate to summarize.

We do highly recommend including an [`eo:bands`](https://github.com/stac-extensions/eo/blob/main/README.md#eobands)
summary if your Items implement `eo:bands`, 
especially if it represents just one satellite or constellation. This should be a union of all the potential bands that you 
have in assets. It is ok to only add the summary at the Collection level without putting an explicit `eo:bands` summary at the 
`properties` level of an Item, since that is optional. This gives users of the Collection a sense of the sensor capabilities without 
having to examine specific Items or aggregate across every Item.

Note that the ranges of summaries don't have to be exact. If you are publishing a catalog that is constantly updating with
data from a high agility satellite you can put the `view:off_nadir` range to be the expected values, based on the satellite
design, instead of having it only represent the off nadir angles that are Items for assets already captured in the catalog.
We don't want growing catalogs to have to constantly check and recalculate their summaries whenever new data comes in - its
just meant to give users a sense of what types of values they could expect. 

### Use of links

The STAC specifications allow both relative and absolute links, and it is important to choose the correct link types so that
your STAC catalogs are easy to explore and resilient to any future changes to their layouts. The best practice is to use one
of the below catalog types, applying the link recommendations consistently, instead of just haphazardly applying relative links
in some places and absolute ones in other places.

#### Self-contained Catalogs

A 'self-contained catalog' is one that is designed for portability. Users may want to download a catalog from online and be
able to use it on their local computer, so all links need to be relative. Or a tool that creates catalogs may need to work 
without knowing the final location that it will live at online, so it isn't possible to set absolute 'self' URL's. These use
cases should utilize a catalog that follows the listed principles:

- **Only relative href's in structural `links`**: The full catalog structure of links down to sub-catalogs and Items, and their 
links back to their parents and roots, should be done with relative URL's. The structural rel types include `root`, `parent`, 
`child`, `item`, and `collection`. Other links can be absolute, especially if they describe a resource that makes less sense in
the catalog, like [sci:doi](https://github.com/stac-extensions/scientific/blob/main/README.md#item-and-collection-fields), 
`derived_from` or even `license` (it can be nice to include the license in the catalog, but some licenses live at a canonical 
online location which makes more sense to refer to directly). This enables the full catalog to be downloaded or
copied to another location and to still be valid. This also implies no `self` link, as that link must be absolute.

- **Use Asset `href` links consistently**: The links to the actual assets are allowed to be either relative or absolute. There
are two types of 'self-contained catalogs'. 

#### Self-contained Metadata Only

These consist of just the STAC metadata (Collection, Catalog and Item files), and uses absolute href 
links to refer to the online locations of the assets. 

#### Self-contained with Assets

These use relative href links for the assets, and includes them in the folder structure.
This enables offline use of a catalog, by including all the actual data, referenced locally.

Self-contained catalogs tend to be used more as static catalogs, where they can be easily passed around. But often they will
be generated by a more dynamic STAC service, enabling a subset of a catalog or a portion of a search criteria to be downloaded
and used in other contexts. That catalog could be used offline, or even published in another location.

Self-contained catalogs are not just for offline use, however - they are designed to be able to be published online and to live
on the cloud in object storage. They just aim to ease the burden of publishing, by not requiring lots of updating of links. 
Adding a single `self` link at the root is recommended for online catalogs,
turning it into a 'relative published catalog', as detailed below.
This anchors it in an online location and enables provenance tracking.

#### Published Catalogs

While STAC is useful as a portable format to move between systems, the goal is really to enable search. While any combination
of absolute and relative links is technically allowed by the specification, it is strongly recommended to follow one of the 
patterns described below when publishing online. Many clients will not properly handle arbitrary mixes of absolute and relative
href's. 

We refer to a 'published catalog' as one that lives online in a stable location, and uses `self` links to establish its location and 
enable easy provenance tracking. There are two types of published catalogs:

#### Absolute Published Catalog

This is a catalog that uses absolute links for everything, both in the `links` objects and in the
`asset` hrefs. It includes `self` links for every Item. Generally these are implemented by dynamic catalogs, as it is quite
easy for them to generate the proper links dynamically. But a static catalog that knows its published location could easily
implement it.

#### Relative Published Catalog

This is a self-contained catalog as described above, except it includes an absolute `self` link at
the root to identify its online location. This is designed so that a self-contained catalog (of either type, with its 
assets or just metadata) can be 'published' online
by just adding one field (the self link) to its root (Catalog or Collection). All the other links should remain the same. The resulting catalog
is no longer compliant with the self-contained catalog recommendations, but instead transforms into a 'relative published catalog'. 
With this, a client may resolve Item and sub-catalog self links by traversing parent and root links, but requires reading 
multiple sources to achieve this. 

So if you are writing a STAC client it is recommended to start with just supporting these two types of published catalogs. In 
turn, if your data is published online publicly or for use on an intranet then following these recommendations will ensure
that a wider range of clients will work with it.

### Using Relation Types

Implementors of STAC are highly recommended to be quite liberal with their `links`, and to use the `rel` field (in conjunction
with the `type` field) to communicate the structure and content of related entities. While each STAC spec describes some of the 
'custom' relations STAC has set, the ideal is to reuse official [IANA Link Relation 
Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml) as much as possible. The following table describes
a number of the common official relations that are used in production STAC implementations.

| Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alternate | It is recommended that STAC Items are also available as HTML, and should use this rel with `"type" : "text/html"` to tell clients where they can get a version of the Item or Collection to view in a browser. See [STAC on the Web in Best Practices](#stac-on-the-web) for more information.                                                                                                                                                |
| canonical | The URL of the [canonical](https://en.wikipedia.org/wiki/Canonical_link_element) version of the Item or Collection. API responses and copies of catalogs should use this to inform users that they are direct copy of another STAC Item, using the canonical rel to refer back to the primary location.                                                                                                                                       |
| via       | The URL of the source metadata that this STAC Item or Collection is created from. Used similarly to canonical, but refers back to a non-STAC record (Landsat MTL, Sentinel metadata XML, etc)                                                                                                                                                                                                                                                 |
| prev      | Indicates that the link's context is a part of a series, and that the previous in the series is the link target. Typically used in STAC by API's, to return smaller groups of Items or Catalogs/Collections.                                                                                                                                                                                                                                  |
| next      | Indicates that the link's context is a part of a series, and that the next in the series is the link target. Typically used in STAC by API's, to return smaller groups of Items or Catalogs/Collections.                                                                                                                                                                                                                                      |
| preview   | Refers to a resource that serves as a preview (see [RFC 6903, sec. 3](https://tools.ietf.org/html/rfc6903#section-3)), usually a lower resolution thumbnail. In STAC this would usually be the same URL as the [thumbnail](#list-of-asset-roles) asset, but adding it as a link in addition enables OGC API clients that can't read assets to make use of it. It also adds support for thumbnails to STAC Catalogs as they can't list assets. |

Being liberal with the `links` also means that it's ok to have repeated links with the same `href`. For example the
`parent` and `root` relation types will point at the same file when the child is directly below the root, and it is
recommended to include both. 

### Versioning for Catalogs

In the Item and Collection STAC JSON, versions and deprecation can be indicated with the
[Versioning Indicators Extension](https://github.com/stac-extensions/version).

The [Items and Collections API Version Extension](https://github.com/stac-extensions/version/) provides endpoints and 
semantics for keeping and accessing previous versions of Collections and Items. The same semantics can be used in static 
catalogs to preserve previous versions of the documents and link them together.

In order to achieve this, the static catalog must make sure that for every record created, a copy of the record is also 
created in a separate location and it is named with the version id adopted by the catalog. See 
[here](https://github.com/stac-extensions/version/blob/main/README.md#version-id) for recommendations on versioning schema.

The main record should also provide a link to the versioned record following the linking patterns described 
[here](https://github.com/stac-extensions/version/blob/main/README.md#relation-types). For every update to the record, the same 
cycle is repeated:

1. Add link from the updated record to the previous version
2. Create a copy of the updated record and name it correctly

#### Example

When the record `my_item.json` is created, a copy of it is also created. `my_item.json` includes `permalink` to `my_item_01.json`.
The version suffix of the file name is taken from the version field of the record when it is available.

- `root / collections / example_collection / items / my_item / my_item.json`
- `root / collections / example_collection / items / my_item / my_item_01.json`

When `my_item.json` is updated, the new `my_item.json` includes a link to `my_item_01.json` and is also copied to `my_item_02.json`.
This ensures that `my_item_02.json` includes a link to `my_item_01.json`

- `root / collections / example_collection / items / my_item / my_item.json`
- `root / collections / example_collection / items / my_item / my_item_01.json`
- `root / collections / example_collection / items / my_item / my_item_02.json`

### Static to Dynamic best practices

Many implementors are using static catalogs to be the reliable core of their dynamic services, or layering their STAC API
on top of any static catalog that is published. These are some recommendations on how to handle this:

#### Ingestion and links

Implementors have found that it's best to 'ingest' a static STAC into an internal datastore (often elasticsearch, but a 
traditional database could work fine too) and then generate the full STAC API responses from that internal representation.
There are instances that have the API refer directly to the static STAC Items, but this only works well if the static STAC 
catalog is an 'absolute published catalog'. So the recommendation is to always use absolute links - either in the static 
published catalog, or to create new absolute links for the STAC search/ endpoint 
responses, with the API's location at the base url. The `/` endpoint with the catalog could either link directly
to the static catalog, or can follow the 'dynamic catalog layout' recommendations above with a new set of URL's.

Ideally each Item would use its `links` to provide a reference back to the static location. The location of the static
Item should be treated as the canonical location, as the generated API is more likely to move or be temporarily down. The
spec provides the `derived_from` rel field, which fits well enough, but `canonical` is likely the more appropriate one
as everything but the links should be the same.

#### Keep catalogs in sync with cloud notification and queue services

There is a set of emerging practices to use services like Amazon's Simple Queue Service (SQS)
and Simple Notification Service (SNS) to keep catalogs in sync.
There is a great [blog post](https://aws.amazon.com/blogs/publicsector/keeping-a-spatiotemporal-asset-catalog-stac-up-to-date-with-sns-sqs/)
on the CBERS STAC implementation on AWS.
The core idea is that a static catalog should emit a notification whenever it changes. The recommendation for SNS is to use the STAC 
Item JSON as the message body, with some fields such as a scene’s datetime and geographic bounding box that allows 
basic geographic filtering from listeners. 

The dynamic STAC API would then listen to the notifications and update its internal datastore whenever new data comes into
the static catalog. Implementors have had success using AWS Lambda to do a full 'serverless' updating of the elasticsearch
database, but it could just as easily be a server-based process.

## How to Differentiate STAC Files

Any tool that crawls a STAC implementation or encounters a STAC file in the wild needs a clear way to determine if it is an Item, 
Collection or Catalog. As of 1.0.0 this is done primarily
with the `type` field, and secondarily in Items with `stac_version`, or optionally with the `rel` of the link to it.

```shell
if type is 'Collection'
  => Collection
else if type is 'Catalog'
  => Catalog
else if type is 'Feature' and stac_version is defined
  => Item
else
  => Invalid (JSON)
```

When crawling a STAC implementation, one can also make use of the [relation type](catalog-spec/catalog-spec.md#relation-types
) (`rel` field) when following a link. If it is an `item` rel type then the file must be a STAC Item. If it is `child`, `parent` or
`root` then it must be a Catalog or a Collection, though the final determination between the two requires looking at the `type` field
in the Catalog or Collection JSON that it is linked to. Note that there is also a `type` field in STAC Link and Asset objects, but that
is for the Media Type, but there are not specific media types for Catalog and Collection. See the sections on [STAC media 
types](catalog-spec/catalog-spec.md#media-types), and [Asset media types](item-spec/item-spec.md#asset-media-type) for more information.

In versions of STAC prior to 1.0 the process was a bit more complicated, as there was no `type` field for catalogs and collections.
See [this issue comment](https://github.com/radiantearth/stac-spec/issues/889#issuecomment-684529444) for a heuristic that works
for older STAC versions.
