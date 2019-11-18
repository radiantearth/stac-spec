# STAC Collection Specification

The STAC Collection Specification defines a set of common fields to describe a group of Items that share properties and metadata. The 
STAC Collections Specification extends the [STAC Catalog Spec](../catalog-spec/README.md) with additional fields to describe the whole dataset and the included set of items.
It shares the same fields and therefore every Collection is also a valid Catalog. Collections can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

A group of STAC Item objects from a single source can share a lot of common metadata. This is especially true with satellite imagery that uses the STAC EO or SAR extension. Rather than including these common metadata fields on every Item, they can be provided in the `properties` of the STAC Collection that the STAC Items belong to.

A STAC Collection can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Collection and also a valid STAC Catalog.

STAC Collections are meant to be compatible with *OGC API - Features* Collections, but please be aware that OAFeat Collections and STAC Collections originate from different specifications and despite the fact that we try to align them as much as possible be there may be subtle differences in the specifications.

* [Examples](examples/):
  * Sentinel 2: A basic standalone example of a [Collection](examples/sentinel2.json) without items.
  * Landsat 8: A [Collection](examples/landsat-collection.json) that holds shared data from an [Item](examples/landsat-item.json).
* [JSON Schema](json-schema/collection.json) - please see the [validation instructions](../validation/README.md)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated. 

## Collection fields

| Element      | Type              | Description                                                  |
| ------------ | ----------------- | ------------------------------------------------------------ |
| stac_version | string            | **REQUIRED.** The STAC version the Collection implements.    |
| stac_extensions | [string]       | A list of extensions the Collection implements. |
| id           | string            | **REQUIRED.** Identifier for the collection that is unique across the provider. |
| title        | string            | A short descriptive one-line title for the collection.       |
| description  | string            | **REQUIRED.** Detailed multi-line description to fully explain the collection. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords     | [string]          | List of keywords describing the collection.                  |
| license      | string            | **REQUIRED.** Collection's license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60). Alternatively, use `proprietary` if the license is not on the SPDX license list or `various` if multiple licenses apply. In these two cases links to the license texts SHOULD be added, see the `license` link relation type. |
| providers    | [[Provider Object](#provider-object) | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| extent       | [Extent Object](#extent-object) | **REQUIRED.** Spatial and temporal extents.    |
| properties   | Map<string, *>    | Common fields across referenced items. |
| summaries    | Map<string, [*]\|[Stats Object](#stats-object)> | A map of property summaries, either a set of values or statistics such as a range. |
| links        | [[Link Object](#link-object)]     | **REQUIRED.** A list of references to other documents.       |

**stac_version**: In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

**stac_extensions**: A list of extensions the Collection implements. This does NOT declare the extensions of child Catalogs or Items. The list contains URLs to the JSON Schema files it can be validated against. For official extensions, a "shortcut" can be used. This means you can specify the folder name of the extension, for example `pointcloud` for the Point Cloud extension. If the versions of the extension and the collection diverge, you can specify the URL of the JSON schema file.

**summaries**: You can optionally summarize the potential values that are available as part of the `properties` in STAC Items.
Summaries are used to inform users about values they can expect from items without having to crawl through them. It also helps do fully define collections, especially if they don't link to any Items.
Summaries are either a unique set of all values or statistics. Statistics by default only specify the range (minimum and maximum values), but can optionally be accompanied by additional statistical values.
The range can specify the potential range of values, but it is recommended to be as precise as possible. The set of values must contain at least one element and it is strongly recommended to list all values.
It is recommended to list as many properties as reasonable so that consumers get a full overview about the properties included in the Items. Nevertheless, it is not very useful to list all potential `title` values of the Items. Also, a range for the `datetime` property may be better suited to be included in the STAC Collection. In general, properties that are covered by the Collection specification (e.g. `providers` and `license`) may not be repeated in the summaries.

### Extent Object

The object describes the spatio-temporal extents of the Collection. Both spatial and temporal extents are required to be specified.

| Element  | Type                                              | Description                                                         |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| spatial  | [Spatial Extent Object](#spatial-extent-object)   | **REQUIRED.** Potential *spatial extent* covered by the collection. |
| temporal | [Temporal Extent Object](#temporal-extent-object) | **REQUIRED.** Potential *temporal extent* covered by the collection. |

#### Spatial Extent Object

The object describes the spatial extents of the Collection.

| Element | Type       | Description                                                         |
| ------- | ---------- | ------------------------------------------------------------------- |
| bbox    | [[number]] | **REQUIRED.** Potential *spatial extent* covered by the collection. |

**bbox**: Bounding Box of the assets represented by this collection using either 2D or 3D geometries. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters and the elevation of the northeasterly most extent is the maximum.

The coordinate reference system of the values is WGS 84 longitude/latitude. Example that covers the whole Earth: `[-180.0, -90.0, 180.0, 90.0]`.  Example that covers the whole earth with a depth of 100 meters to a height of 150 meters: `[-180.0, -90.0, -100.0, 180.0, 90.0, 150.0]`.

The list of numbers is wrapped in a list to potentially support multiple bounding boxes later or with an extension.

#### Temporal Extent Object

The object describes the temporal extents of the Collection.

| Element  | Type             | Description                                                          |
| -------- | ---------------- | -------------------------------------------------------------------- |
| interval | [[number\|null]] | **REQUIRED.** Potential *temporal extent* covered by the collection. |

**interval**: A list of two timestamps wrapped in a list. The timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Open date ranges are supported by setting either the start or the end time to `null`.

The temporal reference system is the Gregorian calendar. Example for data from the beginning of 2019 until now: `[["2009-01-01T00:00:00Z", null]]`.

The list of timestamps is wrapped in a list to potentially support multiple extents later or with an extension.

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

This object describes a relationship with another entity. Data providers are advised to be liberal with links.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | [Media type](../item-spec/item-spec.md#media-types) of the referenced entity. |
| title      | string | A human readable title to be used in rendered displays of the link. |

A more complete list of possible 'rel' types can be seen at the [IANA page of Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

Please see the chapter 'relative vs absolute links' in the [Item spec](../item-spec/item-spec.md#relative-vs-absolute-links) for a discussion on that topic. 

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Collection:

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| self    | STRONGLY RECOMMENDED. _Absolute_ URL to the location that the collection file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | URL to the root STAC [Catalog](../catalog-spec/README.md) or Collection. Collections should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC [Catalog](../catalog-spec/README.md) or Collection. Non-root collections should include a link to their parent. |
| child   | URL to a child STAC [Catalog](../catalog-spec/) or Collection. |
| item    | URL to a STAC [Item](../item-spec/item-spec.md). All items linked from a collection MUST refer back to its collection with the [`collection` relation type](../item-spec/item-spec.md#relation-types). |
| license | The license URL(s) for the collection SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Collection that was used as input data in the creation of this collection. See the note in [STAC Item](../item-spec/item-spec.md#relation-types) for more info. |

**Note:** The [STAC Catalog specification](../catalog-spec/catalog-spec.md) requires a link to at least one `item` or `child` catalog. This is _not_ a requirement for collections, but _recommended_. In contrast to catalogs, it is **REQUIRED** that items linked from a Collection MUST refer back to its Collection with the [`collection` relation type](../item-spec/item-spec.md#relation-types).

### Stats Object

For a good understanding of the summarized field, statistics can be added. By default, only ranges with a minimum and a maximum value can be specified.
Ranges can be specified for [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values only, which means they need to have a rank order.
Therefore, ranges can only be specified for numbers and some special types of strings. Examples: grades (A to F), dates or times.
Implementors are free to add other derived statistical values to the object, for example `mean` or `stddev`.

| Field Name | Type           | Description |
| ---------- | -------------- | ----------- |
| min        | number\|string | **REQUIRED.** Minimum value. |
| max        | number\|string | **REQUIRED.** Maximum value. |

## Common Fields and Standalone Collections

The `properties` field in STAC collections can be used in two ways, either to **move common fields in Items to the parent Collection** or to describe **standalone Collections** better that don't reference any items. Any field that can be used under an Items `properties` can be removed and added to the Collection `properties`. Since a Collection contains no properties itself, anything under properties are metadata fields that are common across all member Items.

To **move common fields in Items to the parent Collection**, the collection specification allows one to more fields that are common across all linked Items to be moved out of the respective Items and into the parent STAC Collection, from which the Items then inherit. This provides maximum flexibility to data providers, as the set of common metadata fields can vary between different types of data. For instance, Landsat and Sentinel data always have an `eo:off_nadir` value of `0`, because those satellites are always pointed downward (i.e., nadir), while satellites that can be pointed will have varying `eo:off_nadir` values. This allows the data provider to define the set of metadata that defines the collection. While some metadata fields are more likely to be part of the common set, such as `instrument` rather than `eo:cloud_cover`, it depends on how the data provider chooses to organize their data. If a metadata field is specified in the Collection properties, it will be ignored in any Item that links to that Collection. This is important because a Collection is the metadata that is common across all Item objects. If a field is variable at all, it should not be part of the common fields.

STAC Collections which don't link to any Item are called **standalone Collections**. To describe them with more fields than the Collection fields has to offer, it is allowed to re-use the metadata fields defined by content extensions for Items. Whenever suitable, the `properties` are used in the same way as if they were common fields across theoretical Items. This makes much sense for fields such as `platform` or `eo:epsg`, which are often the same for a whole collection, but doesn't make much sense for `eo:cloud_cover`, which usually varies heavily across a Collection. The data provider is free to decide, which fields are reasoable to be used.

### Merging common fields into a STAC Item

To get the complete record of an Item (both individual and commons properties), the properties from the Collection can be merged with the Item.

An incomplete Collection:
```
{
  "stac_version": "0.8.1",
  "id": "landsat-8-l1",
  "title": "Landsat 8 L1",
  "description": "Landat 8 imagery radiometrically calibrated and orthorectified using gound points and Digital Elevation Model (DEM) data to correct relief displacement.",
  "extent": {...},
  "license": "PDDL-1.0",
  "properties": {
    "eo:gsd": 30,
    "platform": "landsat-8",
    "instruments": ["oli", "tirs"],
    "eo:off_nadir": 0,
    "eo:bands": [
      {
        "name": "B1",
        "common_name": "coastal",
        "gsd": 30,
        "center_wavelength": 0.44,
        "full_width_half_max": 0.02
      },
      ...
    ]
  },
  "links": [...]
}
```

An incomplete item:
```
{
  "stac_version": "0.8.1",
  "type": "Feature",
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "bbox": [...],
  "geometry": {...},
  "properties": {
    "collection": "landsat-8-l1",
    "datetime": "2018-10-01T01:08:32.033Z",
    "eo:cloud_cover": 78,
    "eo:sun_azimuth": 168.8989761,
    "eo:sun_elevation": 26.32596431,
    "landsat:path": 107,
    "landsat:row": 18
  },
  "assets": {...},
  "links": [...]
}
```

The merged Item then looks like this:

```
{
  "stac_version": "0.8.1",
  "type": "Feature",
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "bbox": [],
  "geometry": {},
  "properties": {
    "collection": "landsat-8-l1",
    "datetime": "2018-10-01T01:08:32.033Z",
    "eo:cloud_cover": 78,
    "eo:sun_azimuth": 168.8989761,
    "eo:sun_elevation": 26.32596431,
    "landsat:path": 107,
    "landsat:row": 18,
    "eo:gsd": 30,
    "platform": "landsat-8",
    "constellation": "landsat-8",
    "instruments": ["oli", "tirs"],
    "eo:off_nadir": 0,
    "eo:bands": [
      {
        "name": "B1",
        "common_name": "coastal",
        "gsd": 30,
        "center_wavelength": 0.44,
        "full_width_half_max": 0.02
      },
      ...
    ]
  },
  "assets": {...},
  "links": [...]
}
```

## Extensions

The [extensions page](../extensions/README.md) gives a full overview about relevant extensions for STAC Collections.
