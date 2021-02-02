# STAC Collection Specification

The STAC Collection Specification defines a set of common fields to describe a group of Items that share properties and metadata. The 
STAC Collections Specification extends the [STAC Catalog Spec](../catalog-spec/README.md) with additional fields to describe the whole dataset and the included set of items.
It shares the same fields and therefore every Collection is also a valid Catalog. Collections can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

A STAC Collection can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Collection and also a valid STAC Catalog.

STAC Collections are meant to be compatible with *OGC API - Features* Collections, but please be aware that OAFeat Collections and STAC Collections originate from different specifications and despite the fact that we try to align them as much as possible be there may be subtle differences in the specifications.

* [Examples](examples/):
  * Sentinel 2: A basic standalone example of a [Collection](examples/sentinel2.json) without items.
  * Landsat 8: A [Collection](examples/landsat-collection.json) with corresponding Item [Item](../item-spec/examples/landsat8-sample.json).
* [JSON Schema](json-schema/collection.json)

## Collection fields

| Element         | Type                                             | Description                                      |
| --------------- | ------------------------------------------------ | ------------------------------------------------ |
| stac_version    | string                                           | **REQUIRED.** The STAC version the Collection implements. STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind. |
| stac_extensions | \[string]                                        | A list of extension identifiers the Collection implements. |
| id              | string                                           | **REQUIRED.** Identifier for the collection that is unique across the provider. |
| title           | string                                           | A short descriptive one-line title for the collection.       |
| description     | string                                           | **REQUIRED.** Detailed multi-line description to fully explain the collection. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords        | \[string]                                        | List of keywords describing the collection.                  |
| license         | string                                           | **REQUIRED.** Collection's license(s), either a SPDX [License identifier](https://spdx.org/licenses/), `various` if multiple licenses apply or `proprietary` for all other cases. |
| providers       | \[[Provider Object](#provider-object)]           | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| extent          | [Extent Object](#extent-object)                  | **REQUIRED.** Spatial and temporal extents.    |
| summaries       | Map<string, \[*]\|[Stats Object](#stats-object)> | A map of property summaries, either a set of values or statistics such as a range. |
| links           | \[[Link Object](#link-object)]                   | **REQUIRED.** A list of references to other documents.       |

**stac_extensions**: A list of extensions the Collection implements. This does NOT declare the extensions of child Catalogs or Items. The list contains URLs to the JSON Schema files it can be validated against. For official [content extensions](../extensions/README.md#list-of-content-extensions), a "shortcut" can be used. This means you can specify the folder name of the extension, for example `version` for the Versioning Indicators extension. If the versions of the extension and the collection diverge, you can specify the URL of the JSON schema file.
This list must only contain extensions that extend the Collection itself, see the the 'Scope' column in the list of extensions. If an extension as the  extension has influence on multiple parts of the whole catalog structure, it must be listed in all affected parts (e.g. Collection and Item for the `datacube` extension). If a structure such as the summaries extension provide fields in their JSON structure, these extensions must not be listed here as they don't extend the Collection itself. For example, if a Collection includes the field `sat:platform` in the summaries, the Collection still does not list the `sat` extension in the `stac_extensions` field.

**license**: Collection's license(s) as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use `proprietary` (see below) if the license is not on the SPDX license list or `various` if multiple licenses apply. In all cases links to the license texts SHOULD be added, see the `license` link relation type. If no link to a license is included and the `license` field is set to `proprietary`, the collection is private, and consumers have not been granted any explicit right to use the data.

**summaries**: You can optionally summarize the potential values that are available as part of the `properties` in STAC Items.
Summaries are used to inform users about values they can expect from items without having to crawl through them. It also helps do fully define collections, especially if they don't link to any Items.
A summary for a field  can be specified in two ways:

1. A set of all distinct values in an array: The set of values must contain at least one element and it is strongly recommended to list all values. If the field summarizes an array (e.g. `instruments`), the field's array elements of each Item must be merged to a single array with unique elements.
2. Statistics in a [Stats Object](#stats-object): Statistics by default only specify the range (minimum and maximum values), but can optionally be accompanied by additional statistical values. The range specified by the minimum and maximum can specify the potential range of values, but it is recommended to be as precise as possible.

It is recommended to list as many properties as reasonable so that consumers get a full overview about the properties included in the Items. Nevertheless, it is not very useful to list all potential `title` values of the Items. Also, a range for the `datetime` property may be better suited to be included in the STAC Collection's `extent` field. In general, properties that are covered by the Collection specification should not be repeated in the summaries.

### Extent Object

The object describes the spatio-temporal extents of the Collection. Both spatial and temporal extents are required to be specified.

| Element  | Type                                              | Description                                                           |
| -------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| spatial  | [Spatial Extent Object](#spatial-extent-object)   | **REQUIRED.** Potential *spatial extents* covered by the collection.  |
| temporal | [Temporal Extent Object](#temporal-extent-object) | **REQUIRED.** Potential *temporal extents* covered by the collection. |

#### Spatial Extent Object

The object describes the spatial extents of the Collection.

| Element | Type         | Description                                                          |
| ------- | ------------ | -------------------------------------------------------------------- |
| bbox    | \[\[number]] | **REQUIRED.** Potential *spatial extents* covered by the collection. |

**bbox**: Bounding Boxes of the assets represented by this collection using either 2D or 3D geometries. Each outer array element can be a separate bounding box, but it is recommended to only use multiple bounding boxes if a union of them would then include a large uncovered area (e.g. the union of Germany and Chile).

The length of the inner array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters and the elevation of the northeasterly most extent is the maximum.

The coordinate reference system of the values is WGS 84 longitude/latitude. Example that covers the whole Earth: `[[-180.0, -90.0, 180.0, 90.0]]`.  Example that covers the whole earth with a depth of 100 meters to a height of 150 meters: `[[-180.0, -90.0, -100.0, 180.0, 90.0, 150.0]]`.

#### Temporal Extent Object

The object describes the temporal extents of the Collection.

| Element  | Type               | Description                                                           |
| -------- | ------------------ | --------------------------------------------------------------------- |
| interval | \[\[string\|null]] | **REQUIRED.** Potential *temporal extents* covered by the collection. |

**interval**: Each outer array element can be a separate temporal extent, but it is recommended to only use multiple temporal extents if a union of them would then include a large uncovered time span (e.g. only having data for the years 2000, 2010 and 2020).

Each inner array consists of exactly two dates and times. Each date and time MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). The temporal reference system is the Gregorian calendar.

Open date ranges are supported by setting either the start or the end time to `null`. Example for data from the beginning of 2019 until now: `[["2009-01-01T00:00:00Z", null]]`. 

### Provider Object

The object provides information about a provider. A provider is any of the organizations that captures or processes the content of the collection and therefore influences the data offered by this collection. May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | \[string] | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
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

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Collection:

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| self    | STRONGLY RECOMMENDED. *Absolute* URL to the location that the collection file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | URL to the root STAC [Catalog](../catalog-spec/README.md) or Collection. Collections should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC [Catalog](../catalog-spec/README.md) or Collection. Non-root collections should include a link to their parent. |
| child   | URL to a child STAC [Catalog](../catalog-spec/) or Collection. |
| item    | URL to a STAC [Item](../item-spec/item-spec.md). All items linked from a collection MUST refer back to its collection with the [`collection` relation type](../item-spec/item-spec.md#relation-types). |
| license | The license URL(s) for the collection SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Collection that was used as input data in the creation of this collection. See the note in [STAC Item](../item-spec/item-spec.md#relation-types) for more info. |

**Note:** The [STAC Catalog specification](../catalog-spec/catalog-spec.md) requires a link to at least one `item` or `child` catalog. This is *not* a requirement for collections, but *recommended*. In contrast to catalogs, it is **REQUIRED** that items linked from a Collection MUST refer back to its Collection with the [`collection` relation type](../item-spec/item-spec.md#relation-types).

### Stats Object

For a good understanding of the summarized field, statistics can be added. By default, only ranges with a minimum and a maximum value can be specified.
Ranges can be specified for [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values only, which means they need to have a rank order.
Therefore, ranges can only be specified for numbers and some special types of strings. Examples: grades (A to F), dates or times.
Implementors are free to add other derived statistical values to the object, for example `mean` or `stddev`.

| Field Name | Type           | Description |
| ---------- | -------------- | ----------- |
| min        | number\|string | **REQUIRED.** Minimum value. |
| max        | number\|string | **REQUIRED.** Maximum value. |

## Standalone Collections

STAC Collections which don't link to any Item are called **standalone Collections**.
To describe them with more fields than the Collection fields has to offer, it is allowed to re-use the metadata fields defined by content extensions for Items in the `summaries` field.
This makes much sense for fields such as `platform` or `proj:epsg`, which are often the same for a whole collection, but doesn't make much sense for `eo:cloud_cover`, which usually varies heavily across a Collection.
The data provider is free to decide, which fields are reasonable to be used.

## Extensions

Commonly used extensions for the STAC Collection specification:

* [Asset Definition](../extensions/item-assets/README.md): Allows to indicate the structure of the Item assets.
* [Scientific extension](../extensions/scientific/README.md): Add fields to indicate citations and DOIs.
* [Versioning Indicators extension](../extensions/version/README.md): Allows versioning by adding the fields `version` and `deprecated`.

The [extensions page](../extensions/README.md) gives a full overview about relevant extensions for STAC Collections.
