# STAC Collection Specification

The STAC Collection Specification defines a set of common fields to describe a group of Items that share properties and metadata. The 
STAC Collections Specification extends the [STAC Catalog Spec](../catalog-spec/README.md) with additional fields to describe the whole dataset and the included set of items.
It shares the same fields and therefore every Collection is also a valid Catalog. Collections can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

A group of STAC Item objects from a single source can share a lot of common metadata. This is especially true with satellite imagery that uses the STAC EO or SAR extension. Rather than including these common metadata fields on every Item, they can be provided in the `properties` of the STAC Collection that the STAC Items belong to.

A STAC Collection can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Collection and also a valid STAC Catalog.

STAC Collections are meant to be compatible with WFS3 Collections, but please be aware that WFS Collections and STAC Collections originate from different specifications and despite the fact that we try to align them as much as possible be there may be subtle differences in the specifications.

* [Examples](examples/):
  * Sentinel 2: A basic standalone example of a [Item](examples/sentinel2.json) without items.
  * Landsat 8: A [Collection](examples/landsat-collection.json) that holds shared data from an [Item](examples/landsat-item.json).
* [JSON Schema](json-schema/collection.json) - please see the [validation instructions](../validation/README.md)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated. 

## Collection fields

| Element      | Type              | Description                                                  |
| ------------ | ----------------- | ------------------------------------------------------------ |
| stac_version | string            | **REQUIRED.** The STAC version the collection implements.    |
| stac_extensions | [string]       | A list of extensions the collection and its items have implemented. |
| id           | string            | **REQUIRED.** Identifier for the collection that is unique across the provider. |
| title        | string            | A short descriptive one-line title for the collection.       |
| description  | string            | **REQUIRED.** Detailed multi-line description to fully explain the collection. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords     | [string]          | List of keywords describing the collection.                  |
| version      | string            | Version of the collection.                                   |
| license      | string            | **REQUIRED.** Collection's license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60) or `proprietary` if the license is not on the SPDX license list. Proprietary licensed data SHOULD add a link to the license text, see the `license` relation type. |
| providers    | [Provider Object] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| extent       | Extent Object     | **REQUIRED.** Spatial and temporal extents.                  |
| properties   | object            | Common fields across referenced items. May also be used to describe standalone collections better that don't reference any items. See the section 'Common Fields' for more information. |
| links        | [Link Object]     | **REQUIRED.** A list of references to other documents.       |

**stac_version**: It is not allowed to mix STAC versions. The root catalog or the root collection respectively MUST specify the implemented STAC version. Child Catalogs and child Collections MUST NOT specify a different STAC version.

**stac_extensions**: A list of extensions the collection and its items have implemented. The list contains URLs to the JSON Schema files it can be validated against. For official extensions, a "shortcut" can be used. This means you can specify the folder name of the extension, for example `pointcloud` for the Point Cloud extension. If the versions of the extension and the catalog diverge, you can specify the URL of the JSON schema file.

### Extent Object

The object describes the spatio-temporal extents of the Collection. Both spatial and temporal extents are required to be specified.

| Element  | Type                   | Description                                                         |
| -------- | -----------------------| ------------------------------------------------------------------- |
| spatial  | Spatial Extent Object  | **REQUIRED.** Potential *spatial extent* covered by the collection. |
| temporal | Temporal Extent Object | **REQUIRED.** Potential *temporal extent* covered by the collection. |

#### Spatial Extent Object

The object describes the spatial extents of the Collection.

| Element | Type       | Description                                                         |
| ------- | ---------- | ------------------------------------------------------------------- |
| bbox    | [[number]] | **REQUIRED.** Potential *spatial extent* covered by the collection. |

**bbox**: The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth):

- Lower left corner, coordinate axis 1 (west)
- Lower left corner, coordinate axis 2 (south)
- Lower left corner, coordinate axis 3 (base, optional)
- Upper right corner, coordinate axis 1 (east)
- Upper right corner, coordinate axis 2 (north)
- Upper right corner, coordinate axis 3 (height, optional)

The coordinate reference system of the values is WGS 84 longitude/latitude. Example that covers the whole Earth: `[-180, -90, 180, 90]`.

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
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
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
| type       | string | Media type of the referenced entity. |
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
| item    | URL to a STAC [Item](../item-spec/item-spec.md). All items linked from a collection MUST refer back to its collection with the `collection` relation type. |
| license | The license URL for the collection SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Collection that was used as input data in the creation of this collection. See the note in [STAC Item](../item-spec/item-spec.md#relation-types) for more info. |

**Note:** The [STAC Catalog specification](../catalog-spec/catalog-spec.md) requires a link to at least one `item` or `child` catalog. This is _not_ a requirement for collections, but _recommended_. In contrast to catalogs, it is **REQUIRED** that items linked from a Collection MUST refer back to its Collection with the `collection` relation type.

### Common Fields and Standalone Collections

The `properties` field in STAC collections can be used in two ways, either to **move common fields in Items to the parent Collection** or to describe **standalone Collections** better that don't reference any items. Any field that can be used under an Items `properties` can be removed and added to the Collection `properties`. Since a Collection contains no properties itself, anything under properties are metadata fields that are common across all member Items.

To **move common fields in Items to the parent Collection**, the collection specification allows one to more fields that are common across all linked Items to be moved out of the respective Items and into the parent STAC Collection, from which the Items then inherit. This provides maximum flexibility to data providers, as the set of common metadata fields can vary between different types of data. For instance, Landsat and Sentinel data always have an `eo:off_nadir` value of `0`, because those satellites are always pointed downward (i.e., nadir), while satellites that can be pointed will have varying `eo:off_nadir` values. This allows the data provider to define the set of metadata that defines the collection. While some metadata fields are more likely to be part of the common set, such as or `eo:instrument` rather than `eo:cloud_cover`, it depends on how the data provider chooses to organize their data. If a metadata field is specified in the Collection properties, it will be ignored in any Item that links to that Collection. This is important because a Collection is the metadata that is common across all Item objects. If a field is variable at all, it should not be part of the common fields.

STAC Collections which don't link to any Item are called **standalone Collections**. To describe them with more fields than the Collection fields has to offer, it is allowed to re-use the metadata fields defined by content extensions for Items. Whenever suitable, the `properties` are used in the same way as if they were common fields across theoretical Items. This makes much sense for fields such as `eo:platform` or `eo:epsg`, which are often the same for a whole collection, but doesn't make much sense for `eo:cloud_cover`, which usually varies heavily across a Collection. The data provider is free to decide, which fields are reasoable to be used.

#### Merging common fields into a STAC Item

To get the complete record of an Item (both individual and commons properties), the properties from the Collection can be merged with the Item.

An incomplete Collection:
```
{
  "stac_version": "0.7.0",
  "stac_extensions": ["eo", "https://example.com/stac/landsat-extension/1.0/schema.json"],
  "id": "landsat-8-l1",
  "title": "Landsat 8 L1",
  "description": "Landat 8 imagery radiometrically calibrated and orthorectified using gound points and Digital Elevation Model (DEM) data to correct relief displacement.",
  "version": "0.1.0",
  "extent": {...},
  "license": "PDDL-1.0",
  "properties": {
    "eo:gsd": 30,
    "eo:platform": "landsat-8",
    "eo:instrument": "OLI_TIRS",
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
  "stac_version": "0.7.0",
  "stac_extensions": ["eo", "https://example.com/stac/landsat-extension/1.0/schema.json"],
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
    "eo:platform": "landsat-8",
    "eo:constellation": "landsat-8",
    "eo:instrument": "OLI_TIRS",
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
