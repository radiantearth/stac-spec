# STAC Item Spec

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) Item. Each
is a [GeoJSON](http://geojson.org/) [feature](https://tools.ietf.org/html/rfc7946#section-3.2), plus
a few required fields that identify the time range and assets of the item. An Item is the core
granular entity in a STAC, containing the core metadata that enables any client to search or crawl
online catalogs of spatial 'assets' - satellite imagery, derived data, DEM's, etc.

The same Item definition is used in both '[catalogs](../catalog-spec/)' and
the '[/stac/search](../api-spec/)' endpoint. Catalogs are simply sets of items that are linked online,
generally served by simple web servers and used for crawling data. The search endpoint enables dynamic
queries, for example selecting all Items in Hawaii on June 3, 2015, but the results they return are
FeatureCollections of items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC Item.

- Examples:
  - See the [examples/sample.json](sample.json) for a minimal example, as well as
    [examples/sample-full.json](sample-full.json) for a more fleshed example that contains a number of
    current best practices.
  - There are also a few more real world inspired samples in the [examples/](examples/) folder.
- [JSON Schema](json-schema/stac-item.json)

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
| bbox       | [number]                                                                   | **REQUIRED.** Bounding Box of the asset represented by this item. This is to enable more naive clients to easily index and search geospatially. Most software can easily generate them for footprints. Specified in Longitude/Latitude based on EPSG:4326.                                                                   |
| properties | Properties Object                                                          | **REQUIRED.** A list of additional metadata for the item.                                                                                                                                                                                                                                                                    |
| links      | [Link Object]                                                              | **REQUIRED.** List of link objects to resources and related URLs. A link with the `rel` set to `self` is required.                                                                                                                                                                                                           |
| assets     | Map<string, Asset Object>                                                  | **REQUIRED.** Dictionary of asset objects that can be be download, each with a unique key. Some pre-defined keys are listed in the chapter 'Asset types'.                                                                                                                                                                    |

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

| Field Name | Type   | Name          | Description                                                                                                                                                                                                                                                      |
| ---------- | ------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| datetime   | string | Date and Time | **REQUIRED.** The searchable date and time of the assets, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).                                                                                         |
| provider   | string | Provider      | Provider name                                                                                                                                                                                                                                                    |
| license    | string | Data License  | Items' license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60) or `proprietary` if the license is not on the SPDX license list. Proprietary licensed data SHOULD add a link to the license text, see the `license` relation type. |

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
required as an absolute URL, to represent the location that the `Item` can be found online. It is
allowed to add additional fields such as a `title` and `type`.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | MIME-type of the referenced entity. 																								|
| title      | string | A human readable title to be used in rendered displays of the link 																	|

#### Relation types

The following types are commonly used as `rel` types in the Link Object of an Item:

| Type    | Description                                                                                                                                                                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self    | **REQUIRED.** _Absolute_ URL to the item file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | URL to the root [STAC Catalog](../catalog-spec/) or [Dataset](../dataset-spec/).                                                                                                                                                                                                     |
| parent  | URL to the parent [STAC Catalog](../catalog-spec/) or [Dataset](../dataset-spec/).                                                                                                                                                                                                   |
| license | The license URL for the item SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in separate file and link to this file.                           |

#### Relative vs Absolute links

Currently the JSON schema for links does not require a URI formatting, to give the option for
implementors to provide relative links. In general, Catalog API's should aim for absolute links
whenever possible. But Static Catalogs are potentially more portable if they can be implemented with
relative links, so that every link doesn't need to be rewritten when the data is copied. The `self`
link is required to be absolute.

### Asset Object

An asset is an object that contains a link to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name | Type   | Description                                                                           |
| ---------- | ------ | ------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** Link to the asset object. Relative and absolute links are both allowed. |
| name       | string | The display name for clients and users.                                               |
| type       | string | MIME-type of the asset (see chapter on MIME types below).                             |

#### Asset types

The following types are commonly for assets and are used as key for the Asset Object:

| Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| thunbnail | STRONGLY RECOMMENDED. A downsampled image of the core asset, for direct display online in a web page or interactive search application. Even assets that are less easily translated in to a visual image should provide some visual representation, that users can browse. For example a SAR asset can render an elevation mask or hillshade for display. If at all possible it should be included for a better user experience in searching data. |

#### MIME types

[Registered](https://www.iana.org/assignments/media-types/media-types.xhtml) MIME types are
preferred when possible. In cases where custom, vendor specific MIME types are necessary they can be
used with the `vnd.` prefix for the type. The MIME type can be used by STAC browsers to better
determine what is relevant to render and display to users searching and browsing the catalog. In
some cases, selection of a mime type can be ambiguous. For instance, many STAC items have sidecar
metadata files associated with the core asset (`.tfw`, Landsat 8 MTL files, etc.) that should use
mime types appropriate for the file - for instance, if it is a plain text file then `text/plain`
would be appropriate, `text/xml` would be appropriate for cases the metadata is in XML format.

A set of commonly used MIME types for STAC items include the following:

| MIME type                      | Description                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| image/geotiff                  | Georeferenced TIFF. _We would like to register image/geotiff as a mime type with IANA._ |
| image/geotiff+cog              | Cloud Optimized GeoTIFF                                                                 |
| image/jp2                      | JPEG 2000                                                                               |
| image/png                      | Visual PNGs (e.g. thumbnails)                                                           |
| image/jpeg                     | Visual JPEGs (e.g. thumbnails, oblique)                                                 |
| text/xml                       | XML metadata                                                                            |
| application/json               | JSON metadata                                                                           |
| text/plain                     | Plain text metadata                                                                     |
| application/geo+json           | GeoJSON                                                                                 |
| application/geopackage+sqlite3 | GeoPackage                                                                              |

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

The [extensions page](../extensions/) gives an overview about relevant extensions for STAC Items.
