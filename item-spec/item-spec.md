# STAC Item Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) Item. Each
is a [GeoJSON](http://geojson.org/) [feature](https://tools.ietf.org/html/rfc7946#section-3.2), plus
a few required fields that identify the time range and assets of the item. An Item is the core
granular entity in a STAC, containing the core metadata that enables any client to search or crawl
online catalogs of spatial 'assets' - satellite imagery, derived data, DEM's, etc.

The same Item definition is used in both '[catalogs](../catalog-spec/README.md)' and
the '[/stac/search](../api-spec/README.md)' endpoint. Catalogs are simply sets of items that are linked online,
generally served by simple web servers and used for crawling data. The search endpoint enables dynamic
queries, for example selecting all Items in Hawaii on June 3, 2015, but the results they return are
FeatureCollections of items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC Item.

- Examples:
  - See the [minimal example](examples/sample.json), as well as a [more fleshed example](examples/sample-full.json) that contains a number of
    current best practices. There are more real world inspired samples in the [examples/](examples/) folder.
  - Real world [implementations](../implementations.md) are also available.
- [JSON Schema](json-schema/item.json)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before
everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too
drastically. Using the specification now will ensure that needed changes can be made before
everything is locked in. So now is an ideal time to implement, as your feedback will be directly
incorporated.

## Item fields

This object describes a STAC Item. The fields `id`, `type`, `bbox`, `geometry` and `properties` are
inherited from GeoJSON.

| Field Name | Type                                                                       | Description                                                                                                                                                                                                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id         | string                                                                     | **REQUIRED.** Provider identifier. As most geospatial assets are already defined by some identification scheme by the data provider it is recommended to simply use that ID. Data providers are advised to include sufficient information to make their IDs globally unique, including things like unique satellite IDs.     |
| type       | string                                                                     | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `Feature`.                                                                                                                                                                                                                                                          |
| geometry   | [GeoJSON Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1) | **REQUIRED.** Defines the full footprint of the asset represented by this item, formatted according to [RFC 7946, section 3.1](https://tools.ietf.org/html/rfc7946). The footprint should be the default GeoJSON geometry, though additional geometries can be included. Specified in Longitude/Latitude based on EPSG:4326. |
| bbox       | [number]                                                                   | **REQUIRED.** Bounding Box of the asset represented by this item. Specified in Longitude/Latitude based on EPSG:4326 - first two numbers are longitude and latitude of lower left corner, followed by longitude and latitude of upper right corner. This field enables more naive clients to easily index and search geospatially. Most software can easily generate them for footprints. STAC compliant APIs are required to compute intersection operations with the item's geometry field, not its bbox.                 |
| properties | Properties Object                                                          | **REQUIRED.** A dictionary of additional metadata for the item.                                                                                                                                                                                                                                                                    |
| links      | [Link Object]                                                              | **REQUIRED.** List of link objects to resources and related URLs. A link with the `rel` set to `self` is required.                                                                                                                                                                                                           |
| assets     | Map<string, Asset Object>                                                  | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key. Some pre-defined keys are listed in the chapter 'Asset types'.                                                                                                                                                                    |

**assets** should include the main asset, as well as any 'sidecar' files that are related and help a
client make sense of the data. Examples of this include extended metadata (in XML, JSON, etc.),
unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented
by multiple files - all should be linked to. It is generally recommended that different processing
levels or formats are not exhaustively listed in an Item, but instead are represented by related
Items that are linked to, but the best practices around this are still emerging.

### Properties Object

The Properties object adds additional metadata to the GeoJSON Object. Basically, each entry is a
key-value pair. The values SHOULD not be an array or object to avoid GIS systems mis-rendering them.
Metadata that require an object or array SHOULD be placed a level up, directly in the GeoJSON/STAC
Item object. Additional fields can be introduced through extensions. It is generally allowed to add
custom fields.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| datetime   | string | **REQUIRED.** The searchable date and time of the assets, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| title      | string | A human readable title describing the item. |

**datetime** is likely the acquisition (in the case of single camera type captures) or the 'nominal'
or representative time in the case of assets that are combined together. Though time can be a
complex thing to capture, for this purpose keep in mind the STAC spec is primarily searching for
data, so use whatever single date and time is most useful for a user to search for. STAC content
extensions may further specify the meaning of the main `datetime` field, and many will also add more
datetime fields.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with the links section, to describe things like the catalog an item is in, related items, parent or
child items (modeled in different ways, like an 'acquisition' or derived data). The `self` link is
required as an absolute URL, to represent the location that the Item can be found online. It is
allowed to add additional fields such as a `title` and `type`.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | Media type of the referenced entity. 																								|
| title      | string | A human readable title to be used in rendered displays of the link. |

#### Relation types

The following types are commonly used as `rel` types in the Link Object of an Item:

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| self         | **REQUIRED.** _Absolute_ URL to the item file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root         | URL to the root STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| parent       | URL to the parent STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| collection   | STRONGLY RECOMMENDED. URL to a [Collection](../collection-spec/README.md), which may use the [Commons extension](../extensions/commons/README.md) and holds common fields of this and other Items (see chapter '[Collections](#Collections)' for more explanations). |
| derived_from | URL to a STAC Item that was used as input data in the creation of this Item. |

A more complete list of possible 'rel' types can be seen at the [IANA page of Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

*Note regarding the type `derived_from`: A full provenance model is far beyond the scope of STAC, and the goal is to align with any good independent spec 
that comes along for that. But the derived_from field is seen as a way to encourage fuller specs and at least start a linking
structure that can be used as a jumping off point for more experiments in provenance tracking*

#### Relative vs Absolute links

Currently the JSON schema for links does not require a URI formatting, to give the option for
implementors to provide relative links. In general, Catalog API's should aim for absolute links
whenever possible. But Static Catalogs are potentially more portable if they can be implemented with
relative links, so that every link doesn't need to be rewritten when the data is copied. The `self`
link is required to be absolute.

#### Collections

Items are *strongly recommended* to provide a link to a STAC Collection definition. It is important as Collections 
provide additional information about a set of items, for example the license, provider and other information (see section 'Extensions')
giving context on the overall set of data that an individual Item is a part of. If Items are part of a STAC Collection, 
the [STAC Collection spec *requires* Items to link back to the Collection](collection-spec/collection-spec.md#relation-types).

### Asset Object

An asset is an object that contains a link to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name | Type   | Description                                                                           |
| ---------- | ------ | ------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** Link to the asset object. Relative and absolute links are both allowed. |
| title      | string | The displayed title for clients and users.                                            |
| type       | string | Media type of the asset (see chapter on Media Types below).                           |

#### Asset types

The following types are common for assets and are used as the key for the Asset Object:

| Type      | Description |
| --------- | ----------- |
| thumbnail | STRONGLY RECOMMENDED. A downsampled image of the core asset, for direct display online in a web page or interactive search application. Even assets that are less easily translated in to a visual image should provide some visual representation, that users can browse. For example a SAR asset can render an elevation mask or hillshade for display. If at all possible it should be included for a better user experience in searching data. |

#### Media Types

The media type of an Asset can be used by STAC browsers to better determine what to render and display 
to users searching and browsing the catalog.  Media types are often referred to by the now-deprecated term "MIME types".

[Registered](https://www.iana.org/assignments/media-types/media-types.xhtml) Media Types are
preferred. In cases where custom vendor-specific media types are necessary, they should
use the `vnd.` prefix. 

STAC Items that have sidecar metadata files associated with a data asset (e.g, `.tfw`, Landsat 8 MTL files) 
should use media types appropriate for the the metadata file.  For example, if it is a plain text file, then `text/plain`
would be appropriate; if it is an XML, then `text/xml` is appropriate.

Common STAC Item Media Types:

| Media Type                      | Description                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `image/tiff` or `image/vnd.stac.geotiff` | GeoTIFF with standardized georeferencing metadata                               |
| `image/vnd.stac.geotiff; cloud-optimized=true` | Cloud Optimized GeoTIFF                                                   |
| `image/jp2`                      | JPEG 2000                                                                               |
| `image/png`                      | Visual PNGs (e.g. thumbnails)                                                           |
| `image/jpeg`                     | Visual JPEGs (e.g. thumbnails, oblique)                                                 |
| `text/xml` or `application/xml`  | XML metadata [RFC 7303](https://www.ietf.org/rfc/rfc7303.txt)                           |
| `application/json`               | JSON metadata                                                                           |
| `text/plain`                     | Plain text metadata                                                                     |
| `application/geo+json`           | GeoJSON                                                                                 |
| `application/geopackage+sqlite3` | GeoPackage                                                                              |
| `application/x-hdf5`             | Hierarchical Data Format version 5                                                      |
| `application/x-hdf`              | Hierarchical Data Format versions 4 and earlier.                                        |

Note: should GeoTIFF become an IANA-registered type in the future (e.g., image/geotiff), this will be added as a recommended
media type.

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

Optionally, common information shared across items can be split up into STAC Collections using the
[Commons extension](../extensions/commons/README.md). Please note that this extension is only in
'[proposal](../extensions/README.md#extension-maturity)' stage.

The [extensions page](../extensions/README.md) gives an overview about relevant extensions for STAC Items.

## Recommendations

### Metadata Linking

In general STAC aims to be oriented around **search**, centered on the core fields that users will want to search on to find imagery.
The core is space and time, but there are often other metadata attributes that are useful. While the specification is flexible enough that
providers can fill it with tens or even hundreds of fields of metadata that is not recommended. If providers have lots of metadata then 
that should be linked to in the Asset Object or in a Link Object, or even a new Asset Object could be added that is potentially easier to parse.
There is a lot of metadata that is only of relevance to advanced processing algorithms, and while that is important it should not be in the core STAC items.
