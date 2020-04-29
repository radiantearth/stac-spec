# STAC Item Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) Item. An **Item** is a 
[GeoJSON](http://geojson.org/) [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) augmented with 
[foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.
These attributes include fields that identify the time range and assets of the Item. An Item is the core
granular entity in a STAC, containing the core metadata that enables any client to search or crawl
online catalogs of spatial 'assets' - satellite imagery, derived data, DEM's, etc.

The same Item definition is used in both [STAC catalogs](../catalog-spec/README.md) and
the [Item-related API endpoints](https://github.com/radiantearth/stac-api-spec/blob/master/api-spec.md#ogc-api---features-endpoints).
Catalogs are simply sets of items that are linked online, generally served by simple web servers
and used for crawling data. The search endpoint enables dynamic queries, for example selecting all
Items in Hawaii on June 3, 2015, but the results they return are FeatureCollections of items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC Item.

- Examples:
  - See the [minimal example](examples/sample.json), as well as a [more fleshed example](examples/sample-full.json) that contains a number of
    current best practices. There are more real world inspired samples in the [examples/](examples/) folder.
  - Real world [implementations](../implementations.md) are also available.
- [JSON Schema](json-schema/item.json)

## Item fields

This object describes a STAC Item. The fields `id`, `type`, `bbox`, `geometry` and `properties` are 
inherited from GeoJSON.

| Field Name | Type                                                                       | Description |
| ---------- | -------------------------------------------------------------------------- | ----------- |
| stac_version | string                                                                   | **REQUIRED.** The STAC version the Item implements. |
| stac_extensions | \[string]                                                             | A list of extensions the Item implements. |
| id         | string                                                                     | **REQUIRED.** Provider identifier. As most geospatial assets are already defined by some identification scheme by the data provider it is recommended to simply use that ID. Data providers are advised to include sufficient information to make their IDs globally unique, including things like unique satellite IDs. |
| type       | string                                                                     | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `Feature`. |
| geometry   | [GeoJSON Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1) | **REQUIRED.** Defines the full footprint of the asset represented by this item, formatted according to [RFC 7946, section 3.1](https://tools.ietf.org/html/rfc7946#section-3.1). The footprint should be the default GeoJSON geometry, though additional geometries can be included. Coordinates are specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). |
| bbox       | \[number]                                                                  | **REQUIRED.** Bounding Box of the asset represented by this item, formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5). |
| properties | [Properties Object](#properties-object)                                    | **REQUIRED.** A dictionary of additional metadata for the item. |
| links      | \[[Link Object](#link-object)]                                             | **REQUIRED.** List of link objects to resources and related URLs. A link with the `rel` set to `self` is strongly recommended. |
| assets     | Map<string, [Asset Object](#asset-object)>                                 | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key. |
| collection | string                                                                     | The `id` of the STAC Collection this Item references to (see [`collection` relation type](#relation-types)). This field is *required* if such a relation type is present. This field provides an easy way for a user to search for any Items that belong in a specified Collection. |

**stac_version**: In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

**stac_extensions**: A list of extensions the Item implements. The list contains URLs to the JSON Schema files it can be validated against. For official [content extensions](../extensions/README.md#list-of-content-extensions), a "shortcut" can be used. This means you can specify the folder name of the extension, for example `pointcloud` for the Point Cloud extension. This does *not* apply for API extensions. If the versions of the extension and the item diverge, you can specify the URL of the JSON schema file.
This list must only contain extensions that extend the Item itself, see the the 'Scope' column in the list of extensions. If an extension such as the Commons extension has influence on multiple parts of the whole catalog structure, it must be listed in all affected parts (e.g. Collection and Item for the Commons extension).

**assets**: Dictionary of asset objects that can be downloaded, each with a unique key. 
In general, the keys don't have any meaning and are considered to be non-descriptive unique identifiers.
Providers may assign any meaning to the keys for their respective use cases, but must not expect that clients understand them.
To communicate the purpose of an asset better use the `roles` field in the [Asset Object](#asset-object).
Assets should include the main asset, as well as any 'sidecar' files that are related and help a
client make sense of the data. Examples of this include extended metadata (in XML, JSON, etc.),
unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented
by multiple files - all should be linked to. It is generally recommended that different processing
levels or formats are not exhaustively listed in an Item, but instead are represented by related
Items that are linked to, but the best practices around this are still emerging.

**bbox**: Bounding Box of the asset represented by this item using either 2D or 3D geometries, formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5). The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters and the elevation of the northeasterly most extent is the maximum.  This field enables more naive clients to easily index and search geospatially. STAC compliant APIs are required to compute intersection operations with the item's geometry field, not its bbox.

### Properties Object

Additional metadata fields can be added to the GeoJSON Object Properties. The only required field 
is `datetime` but it is recommended to add more fields, see [Additional Fields](#additional-fields) 
resources below.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| datetime   | string | **REQUIRED.** The searchable date and time of the assets, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

**datetime** is likely the acquisition (in the case of single camera type captures) or the 'nominal'
or representative time in the case of assets that are combined together. Though time can be a
complex thing to capture, for this purpose keep in mind the STAC spec is primarily searching for
data, so use whatever single date and time is most useful for a user to search for. STAC content
extensions may further specify the meaning of the main `datetime` field, and many will also add more
datetime fields.

#### Additional Fields

Providers should include metadata fields that are relevant for users in the catalog, but it is recommended
to [select only those necessary for search](../best-practices.md#field-selection-and-metadata-linking). 
Where possible metadata fields should be mapped to the STAC Common Metadata and widely used extensions,
to enable cross-catalog search on known fields.

* [STAC Common Metadata](common-metadata.md#stac-common-metadata) - A list of fields commonly used 
throughout all domains. These optional fields are included for STAC Items by default.
* [Content Extensions](../extensions/README.md#list-of-content-extensions) - Domain-specific fields 
such as EO, SAR and point clouds.
* [Custom Extensions](../extensions/README.md#extending-stac) - It is generally allowed to add custom 
fields but it is recommended to add multiple attributes for related values instead of a nested object, 
e.g., two fields `view:azimuth` and `view:off_nadir` instead of a field `view` with an object 
value containing the two fields. The convention (as used within Extensions) is for related attributes 
to use a common prefix on the attribute names to group them, e.g. `view`. A nested data structure should 
only be used when the data itself is nested, as with `eo:bands`.

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
recommendations for particular `rel` types are given in the `rel` type description.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of an Item:

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| self         | STRONGLY RECOMMENDED. *Absolute* URL to the Item if it is available at a public URL. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root         | URL to the root STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| parent       | URL to the parent STAC [Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md). |
| collection   | STRONGLY RECOMMENDED. URL to a [Collection](../collection-spec/README.md), which may use the use the [Commons extension](../extensions/commons/README.md) to hold common fields of this and other Items (see chapter '[Collections](#Collections)' for more explanations). *Absolute* URLs should be used whenever possible. The referenced Collection is STRONGLY RECOMMENDED to implement the same STAC version as the Item. |
| derived_from | URL to a STAC Item that was used as input data in the creation of this Item. |
| alternate    | It is recommended that STAC Items are also available as HTML, and should use this rel with `"type" : "text/html"` to tell clients where they can get a version of the Item to view in a browser. See [STAC on the Web in Best Practices](../best-practices.md#stac-on-the-web) for more information. |

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
   ```js
   "links": [
     { "rel": "collection", "href": "link/to/collection/record.json" }
   ]
   ```

Optionally, common information shared across items can be moved up into STAC Collections
using the [Commons extension](../extensions/commons/README.md) to avoid duplicating information.

### Asset Object

An asset is an object that contains a link to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name  | Type      | Description |
| ----------- | --------- | ----------- |
| href        | string    | **REQUIRED.** Link to the asset object. Relative and absolute links are both allowed. |
| title       | string    | The displayed title for clients and users. |
| description | string    | A description of the Asset providing additional details, such as how it was processed or created. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| type        | string    | [Media type](#media-types) of the asset. |
| roles       | \[string] | The [semantic roles](#asset-role-types) of the asset, similar to the use of `rel` in links. |

Additionally, it is allowed to add any [additional fields](#additional-fields) to an asset that normally appears in an Item's properties:

* [STAC Common Metadata](common-metadata.md#stac-common-metadata) - A list of fields commonly used throughout all domains.
* [Content Extensions](../extensions/README.md#list-of-content-extensions) - Domain-specific fields 
such as EO, SAR and point clouds.
* [Custom Extensions](../extensions/README.md#extending-stac) - It is generally allowed to add custom 
fields.

See [Additional Fields for Assets](#additional-fields-for-assets) below.

#### Asset Role Types

Like the Link `rel` field, the `roles` field can be given any value, however here are a few standardized role names.

| Role Name | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| thumbnail | An asset that represents a thumbnail of the item, typically a true color image (for items with assets in the visible wavelengths), lower-resolution (typically smaller 600x600 pixels), and typically a JPEG or PNG (suitable for display in a web browser). Multiple assets may have this purpose, but it recommended that the `type` and `roles` be unique tuples. For example, Sentinel-2 L2A provides thumbnail images in both JPEG and JPEG2000 formats, and would be distinguished by their media types. |
| overview  | An asset that represents a possibly larger view than the thumbnail of the Item, for example, a true color composite of multi-band data. |
| data      | The data itself. This is a suggestion for a common role for data files to be used in case data providers don't come up with their own names and semantics. |
| metadata  | A metadata sidecar file describing the data in this item, for example the Landsat-8 MTL file. |

It is STRONGLY RECOMMENDED to add to each STAC Item
* a thumbnail with the role `thumbnail` for preview purposes
* one or more data file although it doesn't need to use the suggested role `data`

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

#### Additional Fields for Assets

As detailed above, Items contain properties, which are the main source of metadata for searching across Items. Many content extensions can add further property fields as well. Any property that can be specified for an Item can also be specified for a specific asset. This can be used to override a property defined in the Item, or to specify fields for which there is no single value for all assets.

**It is important to note that the STAC API does not faciliate searching across Asset properties in this way, and this should be used sparingly.** It is primarily used to define properties at the Asset level that may be used during use of the data instead of for searching. 

For example, `gsd` defined for an Item represents the best Ground Sample Distance (resolution) for the data within the Item. However, some assets may be lower resolution and thus have a higher `gsd`. The `eo:bands` field from the EO extension defines an array of spectral bands. However, it may be useful instead to specify the bands that are used in a particular asset.

Here is a partial Sentinel-2 Item:

```json
{
    "id": "S2A_30PZQ_20190713_0_L2A",
    "collection": "sentinel-s2-l2a",
    "properties": {
        "datetime": "2019-07-13T10:28:48.870000+00:00",
        "gsd": 10
    },
    "assets": {
        "visual": {
            "title": "True color image",
            "type": "image/jp2",
            "roles": [
                "visual"
            ],
            "eo:bands": [
                {
                    "full_width_half_max": 0.038,
                    "center_wavelength": 0.6645,
                    "name": "B04",
                    "common_name": "red"
                },
                {
                    "full_width_half_max": 0.045,
                    "center_wavelength": 0.56,
                    "name": "B03",
                    "common_name": "green"
                },
                {
                    "full_width_half_max": 0.098,
                    "center_wavelength": 0.4966,
                    "name": "B02",
                    "common_name": "blue"
                }
            ],
            "href": "s3://sentinel-s2-l2a/tiles/30/P/ZQ/2019/7/13/0/R10m/TCI.jp2"
        },
        "B05": {
            "title": "Band 5",
            "type": "image/jp2",
            "roles": [
                "data"
            ],
            "gsd": 20,
            "eo:bands": [
                {
                    "full_width_half_max": 0.019,
                    "center_wavelength": 0.7039,
                    "name": "B05"
                }
            ],
            "href": "s3://sentinel-s2-l2a/tiles/30/P/ZQ/2019/7/13/0/R20m/B05.jp2"
        },
        "B08": {
            "title": "Band 8 (nir)",
            "type": "image/jp2",
            "roles": [
                "data"
            ],
            "eo:bands": [
                {
                    "full_width_half_max": 0.145,
                    "center_wavelength": 0.8351,
                    "name": "B08",
                    "common_name": "nir"
                },
            ],
            "href": "s3://sentinel-s2-l2a/tiles/30/P/ZQ/2019/7/13/0/R10m/B08.jp2"
        }
    }
}
```

The Sentinel-2 overall `gsd` is 10m, because this is the best spatial resolution among all the bands and is defined in Item properties so it can be searched on. However, Band 5 has a `gsd` of 20m, so that asset specifies the `gsd` as well, which overrides the Item `gsd` for this one asset. Reduced resolution versions of files could also be included as assets and the `gsd` correectly represented.

For `eo:bands`, it could be put in Item properties as an array of all the bands, but in this case it's not. Instead, the assets each define an array containing the spectral band information for that asset (in the order the bands appear in the file).

##### Common Use Cases of Additional Fields for Assets

Overriding or providing Item Properties only in the Assets makes discovery more difficult and should generally be avoided. However, there are some core and extension fields for which providing them at at the Asset level can prove to be very useful for using the data.

- `datetime`: Provide individual timestamp on an Item, in case the Item has a `start_datetime` and `end_datetime`, but an Asset is for one specific time.
- `gsd`: Specify some assets with different spatial resolution than the overall best resolution.
- `eo:bands`: Provide spectral band information, and order of bands, within an individual asset.
- `proj:epsg`/`proj:wkt2`/`proj:projjson`: Specify different projection for some assets. If the projection is different for all assets it should probably not be provided as an Item property. If most assets are one projection, and there is a single reprojected version (such as a Web Mercator preview image), it is sensible to specify the main projection in the Item and the alternate projection for the affected asset(s).
- `proj:shape`/`proj:transform`: If assets have different spatial resolutions and slightly different exact bounding boxes, specify these per asset to indicate the size of the asset in pixels and it's exact GeoTranform in the native projection.
- `sar:polarizations`: Provide the polarization content and ordering of a specific asset, similar to `eo:bands`.
- `sar:product_type`: If mixing multiple product types within a single Item, this can be used to specify the product_type for each asset.

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

Optionally, common information shared across items can be split up into STAC Collections using the
[Commons extension](../extensions/commons/README.md).

The [extensions page](../extensions/README.md) gives an overview about relevant extensions for STAC Items.
