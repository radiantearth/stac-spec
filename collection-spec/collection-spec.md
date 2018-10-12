# STAC Collection Specification

The STAC Collection Specification defines a set of common fields to describe a group of Items that share properties and metadata. The 
STAC Collections Specification extends the [STAC Catalog Spec](../catalog-spec/README.md) with additional fields to describe the whole dataset and the included set of items.
It shares the same fields and therefore every Collection is also a valid Catalog. Collections can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

A STAC ollection can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Collection and also a valid STAC Catalog.

* [Example (Sentinel 2)](examples/sentinel2.json)
* [JSON Schema](json-schema/collection.json) - please see the [validation instructions](../validation/README.md)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated. 

## Collection fields

| Element      | Type              | Description                                                  |
| ------------ | ----------------- | ------------------------------------------------------------ |
| stac_version | string            | **REQUIRED.** The STAC version the collection implements.    |
| id           | string            | **REQUIRED.** Identifier for the collection that is unique across the provider. |
| title        | string            | A short descriptive one-line title for the collection.       |
| description  | string            | **REQUIRED.** Detailed multi-line description to fully explain the collection. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords     | [string]          | List of keywords describing the collection.                  |
| version      | string            | Version of the collection.                                   |
| license      | string            | **REQUIRED.** Collection's license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60) or `proprietary` if the license is not on the SPDX license list. Proprietary licensed data SHOULD add a link to the license text, see the `license` relation type. |
| provider     | [Provider Object] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| extent       | [Extent Object]   | **REQUIRED.** Spatial and temporal extents.                  |
| links        | [Link Object]     | **REQUIRED.** A list of references to other documents.       |

**stac_version**: It is not allowed to mix STAC versions. The root catalog or the root collection respectively MUST specify the implemented STAC version. Child Catalogs and child Collections MUST NOT specify a different STAC version.

### Extent Object

The object describes the spatio-temporal extents of the Collection. Both spatial and temporal extents are required to be specified.

**Note:** The STAC Collection Specification tries to align with [WFS 3.0](https://github.com/opengeospatial/WFS_FES), but there are still issues to be solved.
The WFS specification is in draft state and may change, especially regarding [extents](https://github.com/opengeospatial/WFS_FES/issues/168) or
[open date ranges](https://github.com/opengeospatial/WFS_FES/issues/155) for temporal extents. Therefore, it is also likely that the following fields change over time. 
Please also note that WFS Collections and STAC Collections originate from different specifications and despite the fact that we try to aling them as good as possible
be aware of their differences by reading both specifications.

| Element  | Type           | Description                                                         |
| -------- | -------------- | ------------------------------------------------------------------- |
| spatial  | [number]       | **REQUIRED.** Potential *spatial extent* covered by the collection. |
| temporal | [string\|null] | **REQUIRED.** Potential *temporal extent* covered by the collection. A list of two timestamps, which MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Open date ranges are supported by setting either the start or the end time to `null`. Example for data from the beginning of 2019 until now: `["2009-01-01T00:00:00Z", null]`. |

**temporal** - The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth):

- Lower left corner, coordinate axis 1 (west)
- Lower left corner, coordinate axis 2 (north)
- Lower left corner, coordinate axis 3 (base, optional)
- Upper right corner, coordinate axis 1 (east)
- Upper right corner, coordinate axis 2 (south)
- Upper right corner, coordinate axis 3 (height, optional)

The coordinate reference system of the values is WGS84 longitude/latitude.

### Provider Object

The object provides information about a provider. A provider is any of the organizations that captured or processed the content of the collection and therefore influenced the data offered by this collection. May also include information about the final storage provider hosting the data.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| name       | string | **REQUIRED.** The name of the organization or the individual. |
| type       | string | The type of provider. Any of `producer`, `processor` or `host`. |
| url        | string | Homepage of the provider.                                    |

**type**: The type of the provider can be one of the following elements:

* *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
* *processor*: A processor is any provider who processed data to a derived product.
* *host*: The host is the actual provider offering the data on their storage. There should be no more than one host, specified as last element of the list. 

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal with links.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | Media type of the referenced entity.                          |

Please see the chapter 'relative vs absolute links' in the [Item spec](../item-spec/item-spec.md#relative-vs-absolute-links) for a discussion on that topic. 

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Collection:

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| self    | **REQUIRED.** *Absolute* URL to the collection. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | URL to the root STAC [Catalog](../catalog-spec/README.md) or Collection. |
| parent  | URL to the parent STAC [Catalog](../catalog-spec/README.md) or Collection. |
| child   | URL to a child STAC [Catalog](../catalog-spec/README.md) or Collection. |
| item    | URL to a STAC [Item](../item-spec/README.md). All items linked from a collection MUST refer back to its collection with the `collection` relation type. |
| license | The license URL for the collection SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Collection that was used as input data in the creation of this collection. See the note in [STAC Item](../item-spec/item-spec.md#relation-types) for more info. |

**Note:** The [STAC Catalog specification](../catalog-spec/catalog-spec.md) requires a link to at least one `item` or `child` catalog. This is _not_ a requirement for collections, but _recommended_. In contrast to catalogs, it is **required** that items linked from a Collection MUST refer back to its Collection with the `collection` relation type.

## Extensions

Important related extensions for the STAC Collection Specification:

* [Commons extension](../extensions/commons)
* [EO extension](../extensions/eo)
* [Scientific extension](../extensions/scientific)

The [extensions page](../extensions/) gives a full overview about relevant extensions for STAC Collections.
