# STAC Item Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) Item. An **Item** is a 
[GeoJSON](http://geojson.org/) [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) augmented with 
[foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.
These attributes include fields that identify the time range and assets of the Item. An Item is the core
granular entity in a STAC, containing the core metadata that enables any client to search or crawl
online catalogs of spatial 'assets' - satellite imagery, derived data, DEM's, etc.

The same Item definition is used in both [STAC catalogs](../catalog-spec/README.md) and
the [`/search`](../api-spec/README.md) endpoint. Catalogs are simply sets of items that are linked online,
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

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated. 

## Item fields

This object describes a STAC Item. The fields `id`, `type`, `bbox`, `geometry` and `properties` are 
inherited from GeoJSON.

| Field Name | Type                                                                       | Description |
| ---------- | -------------------------------------------------------------------------- | ----------- |
| stac_version | string                                                                   | **REQUIRED.** The STAC version the Item implements. |
| stac_extensions | [string]                                                              | A list of extensions the Item implements. |
| id         | string                                                                     | **REQUIRED.** Provider identifier. As most geospatial assets are already defined by some identification scheme by the data provider it is recommended to simply use that ID. Data providers are advised to include sufficient information to make their IDs globally unique, including things like unique satellite IDs. |
| type       | string                                                                     | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `Feature`. |
| geometry   | [GeoJSON Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1) | **REQUIRED.** Defines the full footprint of the asset represented by this item, formatted according to [RFC 7946, section 3.1](https://tools.ietf.org/html/rfc7946). The footprint should be the default GeoJSON geometry, though additional geometries can be included. Coordinates are specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). |
| bbox       | [number]                                                                   | **REQUIRED.** Bounding Box of the asset represented by this item using either 2D or 3D geometries. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters and the elevation of the northeasterly most extent is the maximum.  This field enables more naive clients to easily index and search geospatially. STAC compliant APIs are required to compute intersection operations with the item's geometry field, not its bbox. |
| properties | [Properties Object](#properties-object)                                    | **REQUIRED.** A dictionary of additional metadata for the item. |
| links      | [[Link Object](#link-object)]                                              | **REQUIRED.** List of link objects to resources and related URLs. A link with the `rel` set to `self` is strongly recommended. |
| assets     | Map<string, [Asset Object](#asset-object)>                                 | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key. Some pre-defined keys are listed in the chapter '[Asset types](#asset-types)'. |
| collection | string                                                                     | The `id` of the STAC Collection this Item references to (see [`collection` relation type](#relation-types)). This field is *required* if such a relation type is present. This field provides an easy way for a user to search for any Items that belong in a specified Collection. |

**stac_version**: In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

**stac_extensions**: A list of extensions the Item implements. The list contains URLs to the JSON Schema files it can be validated against. For official extensions, a "shortcut" can be used. This means you can specify the folder name of the extension, for example `pointcloud` for the Point Cloud extension. If the versions of the extension and the item diverge, you can specify the URL of the JSON schema file.

**assets** should include the main asset, as well as any 'sidecar' files that are related and help a
client make sense of the data. Examples of this include extended metadata (in XML, JSON, etc.),
unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented
by multiple files - all should be linked to. It is generally recommended that different processing
levels or formats are not exhaustively listed in an Item, but instead are represented by related
Items that are linked to, but the best practices around this are still emerging.

### Properties Object

The Properties object adds additional metadata to the GeoJSON Object. Additional fields can be introduced through 
extensions. It is generally allowed to add custom fields.

It is recommended to add multiple attributes for related values instead of a nested object, e.g., two fields `eo:cloud_cover` and `eo:sun_azimuth` instead of a field `eo` with an object value containing the two fields. The convention (as used within Extensions) is for related attributes to use a common prefix on the attribute names to group them, e.g. `eo`. A nested data structure should only be used when the data itself is nested, as with `eo:bands`.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| datetime   | string | **REQUIRED.** The searchable date and time of the assets, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| license    | string | Item's license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60). Alternatively, use `proprietary` if the license is not on the SPDX license list or `various` if multiple licenses apply. In these two cases links to the license texts SHOULD be added, see the [`license` relation type](#relation-types). |
| providers  | [[Provider Object](#provider-object)] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| title      | string | A human readable title describing the item. |
| created    | string | Creation date and time of this metadata file. This is NOT the timestamp the asset was created. MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| updated    | string | Date and time this metadata file was updated last. This is NOT the timestamp the asset was updated last. MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

**datetime** is likely the acquisition (in the case of single camera type captures) or the 'nominal'
or representative time in the case of assets that are combined together. Though time can be a
complex thing to capture, for this purpose keep in mind the STAC spec is primarily searching for
data, so use whatever single date and time is most useful for a user to search for. STAC content
extensions may further specify the meaning of the main `datetime` field, and many will also add more
datetime fields.

**license** and **provider** should be defined at the Collection level if possible.

### Provider Object

The object provides information about a provider. A provider is any of the organizations that captured or processed the content of the collection and therefore influenced the data offered by this collection. May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | [string]  | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information. |

**roles**: The provider's role(s) can be one or more of the following elements:

* *licensor*: The organization that is licensing the dataset under the license specified in the collection's `license` field.
* *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
* *processor*: A processor is any provider who processed data to a derived product.
* *host*: The host is the actual provider offering the data on their storage. There should be no more than one host, specified as last element of the list. 

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with the links section, to describe things like the catalog an item is in, related items, parent or
child items (modeled in different ways, like an 'acquisition' or derived data).
It is allowed to add additional fields such as a `title` and `type`.

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | [Media type](#media-types) of the referenced entity. |
| title      | string | A human readable title to be used in rendered displays of the link. |

#### Relative vs Absolute links

Currently, the JSON schema for links does not require them to be formatted as URIs, to allow
implementors to provide relative links. In general, Catalog APIs should aim to provide absolute links
whenever possible. Static Catalogs are potentially more portable if they incorporate only
relative links, so that every link doesn't need to be rewritten when the data is copied. Additional
recommendations for particular ```rel``` types are given in the ```rel``` type description.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of an Item:

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| self         | STRONGLY RECOMMENDED. _Absolute_ URL to the Item if it is available at a public URL. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root         | URL to the root STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| parent       | URL to the parent STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| collection   | STRONGLY RECOMMENDED. URL to a [Collection](../collection-spec/README.md), which may use the use the [Commons extension](../extensions/commons/README.md) to hold common fields of this and other Items (see chapter '[Collections](#Collections)' for more explanations). _Absolute_ URLs should be used whenever possible. The referenced Collection is STRONGLY RECOMMENDED to implement the same STAC version as the Item. |
| license      | The license URL(s) for the item SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Item that was used as input data in the creation of this Item. |

A more complete list of possible 'rel' types can be seen at the [IANA page of Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

*Note regarding the type `derived_from`: A full provenance model is far beyond the scope of STAC, and the goal is to align with any good independent spec 
that comes along for that. But the derived_from field is seen as a way to encourage fuller specs and at least start a linking
structure that can be used as a jumping off point for more experiments in provenance tracking*

#### Collections

Items are *strongly recommended* to provide a link to a STAC Collection definition. It is important as Collections provide additional information about a set of items, for example the license, provider and other information
giving context on the overall set of data that an individual Item is a part of.

If Items are part of a STAC Collection, the [STAC Collection spec *requires* Items to link back to the Collection](../collection-spec/collection-spec.md#relation-types).
Linking back must happen in two places:

1. The field `collection` in an Item must be filled (see section 'Item fields'). It is the `id` of a STAC Collection.
2. An Item must also provide a link to the STAC Collection using the [`collection` relation type](#relation-types):
    ```
    "links": [
      { "rel": "collection", "href": "link/to/collection/record.json" }
    ]
    ```

Optionally, common information shared across items can be moved up into STAC Collections
using the [Commons extension](../extensions/commons/README.md) to avoid duplicating information.

### Asset Object

An asset is an object that contains a link to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name | Type   | Description                                                                           |
| ---------- | ------ | ------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** Link to the asset object. Relative and absolute links are both allowed. |
| title      | string | The displayed title for clients and users                                           |
| description      | string | A description of the Asset providing additional details, such as how it was processed                                           |
| type       | string | [Media type](#media-types) of the asset                                             |
| role        | string | The semantic purpose of the asset, similar to the use of `rel` in links                                                  |

#### Asset Role Types

Like the Link `rel` field, the `role` field can be given any value, however here are a few standardized role names.

| Role Name | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| thumbnail |  An asset that represents a thumbnail of the item, typically a true color image (for items with assets in the visible wavelengths), lower-resolution (typically smaller 600x600 pixels), and typically a JPEG or PNG (suitable for display in a web browser). Multiple assets may have this purpose, but it recommended that the `type` and `role` be unique tuple. For example, Sentinel-2 L2A provides thumbnail images in both JPEG and JPEG2000 formats, and would be distinguished by their media types. |
| overview  | An asset that represents a possibly larger view than the thumbnail of the Item , for example, a true color composite of multi-band data. |
| metadata  | A metadata sidecar file describing the data in this item, for example the Landsat-8 MTL file. |

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

| Media Type                                              | Description                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `image/tiff; application=geotiff`                       | GeoTIFF with standardized georeferencing metadata            |
| `image/tiff; application=geotiff; profile=cloud-optimized` | Cloud Optimized GeoTIFF (unofficial). Once there is an [official media type](http://osgeo-org.1560.x6.nabble.com/Media-type-tc5411498.html) it will be added and the proprietary media type here will be deprecated. |
| `image/jp2`                                             | JPEG 2000                                                    |
| `image/png`                                             | Visual PNGs (e.g. thumbnails)                                |
| `image/jpeg`                                            | Visual JPEGs (e.g. thumbnails, oblique)                      |
| `text/xml` or `application/xml`                         | XML metadata [RFC 7303](https://www.ietf.org/rfc/rfc7303.txt) |
| `application/json`                                      | JSON metadata                                                |
| `text/plain`                                            | Plain text metadata                                          |
| `application/geo+json`                                  | GeoJSON                                                      |
| `application/geopackage+sqlite3`                        | GeoPackage                                                   |
| `application/x-hdf5`                                    | Hierarchical Data Format version 5                           |
| `application/x-hdf`                                     | Hierarchical Data Format versions 4 and earlier.             |

Deprecation notice: GeoTiff previously used the media type `image/vnd.stac.geotiff` and
Cloud Optimized GeoTiffs used `image/vnd.stac.geotiff; profile=cloud-optimized`.
Both can still appear in old catalogues, but are deprecated and should be replaced.

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

Optionally, common information shared across items can be split up into STAC Collections using the
[Commons extension](../extensions/commons/README.md).

The [extensions page](../extensions/README.md) gives an overview about relevant extensions for STAC Items.

## Recommendations

### Metadata Linking

In general STAC aims to be oriented around **search**, centered on the core fields that users will want to search on to find imagery.
The core is space and time, but there are often other metadata attributes that are useful. While the specification is flexible enough that
providers can fill it with tens or even hundreds of fields of metadata that is not recommended. If providers have lots of metadata then 
that should be linked to in the [Asset Object](#asset-object) or in a [Link Object](#link-object), or even a new Asset Object could be added that is potentially easier to parse.
There is a lot of metadata that is only of relevance to advanced processing algorithms, and while that is important it should not be in the core STAC items.

### HTML versions of Items

It is recommended to have a complementary HTML version of each `Item` available for easy human consumption and search 
engine crawlability. The exact nature of the HTML is not part of the specification, but it is recommended to use common
ecosystem tools like [STAC Browser](https://github.com/radiantearth/stac-browser) to generate it. More information on creating 
HTML versions of STAC can be found in the [STAC on the Web section](../best-practices.md#stac-on-the-web) of the catalog 
best practices document.
