# STAC Collection Specification <!-- omit in toc --> 

- [Overview](#overview)
- [Collection fields](#collection-fields)
  - [Additional Field Information](#additional-field-information)
    - [stac_version](#stac_version)
    - [stac_extensions](#stac_extensions)
    - [id](#id)
    - [license](#license)
    - [summaries](#summaries)
    - [assets](#assets)
  - [Extent Object](#extent-object)
    - [Spatial Extent Object](#spatial-extent-object)
    - [Temporal Extent Object](#temporal-extent-object)
  - [Provider Object](#provider-object)
  - [Link Object](#link-object)
    - [Relation types](#relation-types)
  - [Asset Object](#asset-object)
  - [Range Object](#range-object)
  - [JSON Schema Object](#json-schema-object)
- [Media Type for STAC Collections](#media-type-for-stac-collections)
- [Standalone Collections](#standalone-collections)

## Overview

The STAC Collection Specification defines a set of common fields to describe a group of Items that share properties and metadata. The 
Collection Specification shares all fields with the STAC [Catalog Specification](../catalog-spec/catalog-spec.md) (with different allowed 
values for `type` and `stac_extensions`) and adds fields to describe the whole dataset and the included set of Items. Collections 
can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

A STAC Collection is represented in JSON format.
Any JSON object that contains all the required fields is a valid STAC Collection and also a valid STAC Catalog.

STAC Collections are compatible with the [Collection](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#example_4) JSON 
specified in [*OGC API - Features*](https://ogcapi.ogc.org/features/), but they are extended with additional fields.  

- [Examples](../examples/):
  - Sentinel 2: A basic standalone example of a [Collection](../examples/collection-only/collection.json) without Items.
  - Simple Example: A [Collection](../examples/collection.json) that links to 3 example Items.
  - Extension Collection: An additional [Collection](../examples/extensions-collection/collection.json), which is used to highlight
  various [extension](../extensions) functionality, but serves as another example.
- [JSON Schema](json-schema/collection.json)

## Collection fields

| Element         | Type                                             | Description                                                  |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| type            | string                                           | **REQUIRED.** Must be set to `Collection` to be a valid Collection. |
| stac_version    | string                                           | **REQUIRED.** The STAC version the Collection implements. |
| stac_extensions | \[string]                                        | A list of extension identifiers the Collection implements.   |
| id              | string                                           | **REQUIRED.** Identifier for the Collection that is unique across the provider. |
| title           | string                                           | A short descriptive one-line title for the Collection.       |
| description     | string                                           | **REQUIRED.** Detailed multi-line description to fully explain the Collection. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords        | \[string]                                        | List of keywords describing the Collection.                  |
| license         | string                                           | **REQUIRED.** Collection's license(s), either a SPDX [License identifier](https://spdx.org/licenses/), `various` if multiple licenses apply or `proprietary` for all other cases. |
| providers       | \[[Provider Object](#provider-object)]           | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |
| extent          | [Extent Object](#extent-object)                  | **REQUIRED.** Spatial and temporal extents.                  |
| summaries       | Map<string, \[\*]\|[Range Object](#range-object)\|[JSON Schema Object](#json-schema-object)> | STRONGLY RECOMMENDED. A map of property summaries, either a set of values, a range of values or a [JSON Schema](https://json-schema.org). |
| links           | \[[Link Object](#link-object)]                   | **REQUIRED.** A list of references to other documents.       |
| assets          | Map<string, [Asset Object](#asset-object)>       | Dictionary of asset objects that can be downloaded, each with a unique key. |

### Additional Field Information

#### stac_version

In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

#### stac_extensions

A list of extensions the Collection implements.
The list consists of URLs to JSON Schema files that can be used for validation.
This list must only contain extensions that extend the Collection specification itself,
see the the 'Scope' for each of the extensions.
This must **not** declare the extensions that are only implemented in child Collection objects or child Item objects.

#### id

It is important that Collection identifiers are unique across the provider. And providers should strive as much as possible to make
their Collection ids 'globally' unique, prefixing any common information with a unique string. This could be the provider's name if
it is a fairly unique name, or their name combined with the domain they operate in.

#### license

Collection's license(s) as a SPDX [License identifier](https://spdx.org/licenses/).
Alternatively, use `proprietary` (see below) if the license is not on the SPDX license list or `various` if multiple licenses apply.
In all cases links to the license texts SHOULD be added, see the `license` link relation type.
If no link to a license is included and the `license` field is set to `proprietary`, the Collection is private,
and consumers have not been granted any explicit right to use the data.

#### summaries

Collections are *strongly recommended* to provide summaries of the values of fields that they can expect from the `properties` 
of STAC Items contained in this Collection. This enables users to get a good sense of what the ranges and potential values of 
different fields in the Collection are, without having to inspect a number of Items (or crawl them exhaustively to get a definitive answer). 
Summaries are often used to give users a sense of the data in [Standalone Collections](#standalone-collections),
describing the potential values even when it can't be accessed as Items. They also give clients enough information to 
build tailored user interfaces for querying the data, by presenting the potential values that are available.
 Fields selected to be included in summaries should capture all the potential values of the 
 field that appear in every Item underneath the collection, including in any nested sub-Catalogs.

A summary for a field can be specified in three ways:

1. A set of all distinct values in an array: The set of values must contain at least one element and it is strongly recommended to list all values.
   If the field summarizes an array (e.g. [`instruments`](../item-spec/common-metadata.md#instrument)),
   the field's array elements of each Item must be merged to a single array with unique elements.
2. A Range in a [Range Object](#range-object): Statistics by default only specify the range (minimum and maximum values),
   but can optionally be accompanied by additional statistical values.
   The range specified by the `minimum` and `maximum` properties can specify the potential range of values,
   but it is recommended to be as precise as possible.
3. Extensible JSON Schema definitions for fine-grained information, see the [JSON Schema Object](#json-schema-object)
   section for more.

All values must follow the schema of the property field they summarize, unless the field is an array as described in (1) above.
So the values in the array or the values given for `minimum` and `maximum` must comply to the original data type
and any further restrictions that apply for the property they summarize.
For example, the `minimum` for `gsd` can't be lower than zero and the summaries for `platform` and `instruments`
must each be an array of strings (or alternatively minimum and maximum values, but that's not very meaningful).

It is recommended to list as many properties as reasonable so that consumers get a full overview about the properties included in the Items.
Nevertheless, it is not very useful to list all potential `title` values of the Items.
Also, a range for the `datetime` property may be better suited to be included in the STAC Collection's `extent` field.
In general, properties that are covered by the Collection specification should not be repeated in the summaries.

See the [examples folder](../examples) for Collections with summaries to get a sense of how to use them.

#### assets

This provides an optional mechanism to expose assets that don't make sense at the Item level.
It is a dictionary of [Asset Objects](#asset-object) associated with the Collection that can be
downloaded or streamed, each with a unique key.
In general, the keys don't have any meaning and are considered to be non-descriptive unique identifiers.
Providers may assign any meaning to the keys for their respective use cases, but must not expect that clients understand them.
To communicate the purpose of an asset better use the `roles` field in the [Asset Object](#asset-object).
The definition provided here, at the Collection level, is the same as the
[Asset Object in Items](../item-spec/item-spec.md#asset-object).

There are a few guidelines for using the asset construct at the Collection level:

- Collection-level assets SHOULD NOT list any files also available in Items.
- If possible, item-level assets are always the preferable way to expose assets.

Collection-level assets can be useful in some scenarios, for example:
1. Exposing additional data that applies Collection-wide and you don't want to expose it in each Item.
   This can be Collection-level metadata or a thumbnail for visualization purposes.
2. Individual Items can't properly be distinguished for some data structures,
   e.g. [Zarr](https://zarr.readthedocs.io/) as it's a data structure not contained in single files.
3. Exposing assets for
   "[Standalone Collections](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#standalone-collections)".

Oftentimes it is possible to model data and assets with either a Collection or an Item. In those scenarios we *recommend* to use
Items as much as is feasible, as they designed for assets. Using Collection-level assets should only be used if there is not another
option.

### Extent Object

The object describes the spatio-temporal extents of the Collection. Both spatial and temporal extents are required to be specified.

| Element  | Type                                              | Description                                                           |
| -------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| spatial  | [Spatial Extent Object](#spatial-extent-object)   | **REQUIRED.** Potential *spatial extents* covered by the Collection.  |
| temporal | [Temporal Extent Object](#temporal-extent-object) | **REQUIRED.** Potential *temporal extents* covered by the Collection. |

#### Spatial Extent Object

The object describes the spatial extents of the Collection.

| Element | Type         | Description                                                          |
| ------- | ------------ | -------------------------------------------------------------------- |
| bbox    | \[\[number]] | **REQUIRED.** Potential *spatial extents* covered by the Collection. |

**bbox**: Each outer array element can be a separate spatial extent describing the bounding boxes
of the assets represented by this Collection using either 2D or 3D geometries.

The first bounding box always describes the overall spatial extent of the data. All subsequent bounding boxes can be
used to provide a more precise description of the extent and identify clusters of data.
Clients only interested in the overall spatial extent will only need to access the first item in each array.
It is recommended to only use multiple bounding boxes if a union of them would then include
a large uncovered area (e.g. the union of Germany and Chile).

The length of the inner array must be 2*n where n is the number of dimensions.
The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in
Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84).
When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters
and the elevation of the northeasterly most extent is the maximum.

The coordinate reference system of the values is WGS 84 longitude/latitude.
Example that covers the whole Earth: `[[-180.0, -90.0, 180.0, 90.0]]`.
Example that covers the whole earth with a depth of 100 meters to a height of 150 meters: `[[-180.0, -90.0, -100.0, 180.0, 90.0, 150.0]]`.

#### Temporal Extent Object

The object describes the temporal extents of the Collection.

| Element  | Type               | Description                                                           |
| -------- | ------------------ | --------------------------------------------------------------------- |
| interval | \[\[string\|null]] | **REQUIRED.** Potential *temporal extents* covered by the Collection. |

**interval**: Each outer array element can be a separate temporal extent.
The first time interval always describes the overall temporal extent of the data. All subsequent time intervals
can be used to provide a more precise description of the extent and identify clusters of data.
Clients only interested in the overall extent will only need to access the first item in each array.
It is recommended to only use multiple temporal extents if a union of them would then include a large
uncovered time span (e.g. only having data for the years 2000, 2010 and 2020).

Each inner array consists of exactly two elements, either a timestamp or `null`.

Timestamps consist of a date and time in UTC and MUST be formatted according to
[RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
The temporal reference system is the Gregorian calendar.

Open date ranges are supported by setting the start and/or the end time to `null`.
Example for data from the beginning of 2019 until now: `[["2019-01-01T00:00:00Z", null]]`.
It is recommended to provide at least a rough guideline on the temporal extent and thus
it's not recommended to set both start and end time to `null`. Nevertheless, this is possible
if there's a strong use case for an open date range to both sides.

### Provider Object

The object provides information about a provider.
A provider is any of the organizations that captures or processes the content of the Collection
and therefore influences the data offered by this Collection.
May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | \[string] | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information. |

**roles**: The provider's role(s) can be one or more of the following elements:

- *licensor*: The organization that is licensing the dataset under the license specified in the Collection's `license` field.
- *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
- *processor*: A processor is any provider who processed data to a derived product.
- *host*: The host is the actual provider offering the data on their storage.
  There should be no more than one host, specified as last element of the list.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal with links.

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "[Relation types](#relation-types)" for more information. |
| type       | string | [Media type](../catalog-spec/catalog-spec.md#media-types) of the referenced entity. |
| title      | string | A human readable title to be used in rendered displays of the link. |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

#### Relation types

STAC Collections use a variety of `rel` types in the link object,
to describe the exact nature of the link between this Collection and the entity it is linking to.
It is recommended to use the official
[IANA Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml) where possible.
The following table explains places where custom STAC `rel` types are used for ollections.
This is done where there is not a clear official option, or where STAC uses an official type but adds additional meaning for the STAC context.

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| self    | STRONGLY RECOMMENDED. *Absolute* URL to the location that the Collection file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | URL to the root STAC entity (Catalog or Collection). Collections should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC entity (Catalog or Collection). Non-root Collections should include a link to their parent. |
| child   | URL to a child STAC entity (Catalog or Collection). |
| item    | URL to a STAC Item. All Items linked from a Collection MUST refer back to its Collection with the [`collection` relation type](../item-spec/item-spec.md#relation-types). |
| license | The license URL(s) for the Collection SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to put the license text in a separate file and link to this file. |
| derived_from | URL to a STAC Collection that was used as input data in the creation of this Collection. See the note in [STAC Item](../item-spec/item-spec.md#derived_from) for more info. |

A more complete list of possible `rel` types and their meaning in STAC can be found in the
[Using Relation Types](../best-practices.md#using-relation-types) best practice. 

**Note:** The STAC Catalog specification requires a link to at least one `item` or `child` Catalog.
This is *not* a requirement for Collections, but *recommended*. In contrast to Catalogs,
it is **REQUIRED** that Items linked from a Collection MUST refer back to its Collection
with the [`collection` relation type](../item-spec/item-spec.md#relation-types).

### Asset Object

An Asset is an object that contains a URI to data associated with the Collection that can be downloaded
or streamed. The definition provided here, at the Collection level, is the same as the
[Asset Object in Items](../item-spec/item-spec.md#asset-object). It is allowed to add additional fields.

| Field Name  | Type      | Description |
| ----------- | --------- | ----------- |
| href        | string    | **REQUIRED.** URI to the asset object. Relative and absolute URI are both allowed. |
| title       | string    | The displayed title for clients and users. |
| description | string    | A description of the Asset providing additional details, such as how it was processed or created. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| type        | string    | [Media type](../item-spec/item-spec.md#asset-media-type) of the asset. See the [common media types](../best-practices.md#common-media-types-in-stac) in the best practice doc for commonly used asset types. |
| roles       | \[string] | The [semantic roles](../item-spec/item-spec.md#asset-role-types) of the asset, similar to the use of `rel` in links. |

### Range Object

For summaries that would normally consist of a lot of continuous values, statistics can be added instead.
By default, only ranges with a minimum and a maximum value can be specified.
Ranges can be specified for [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values only,
which means they need to have a rank order.
Therefore, ranges can only be specified for numbers and some special types of strings. Examples: grades (A to F), dates or times.
Implementors are free to add other derived statistical values to the object, for example `mean` or `stddev`.

| Field Name | Type           | Description |
| ---------- | -------------- | ----------- |
| minimum    | number\|string | **REQUIRED.** Minimum value. |
| maximum    | number\|string | **REQUIRED.** Maximum value. |

### JSON Schema Object

For a full understanding of the summarized field, a JSON Schema can be added for each summarized field.
This allows very fine-grained information for each field and each value as JSON Schema is also extensible.
Each schema must be valid against all corresponding values available for the property in the sub-Items.

It is recommended to use [JSON Schema draft-07](https://json-schema.org/specification-links.html#draft-7)
to align with the JSON Schemas provided by STAC. Empty schemas are not allowed.

For an introduction to JSON Schema, see "[Learn JSON Schema](https://json-schema.org/learn/)".

## Media Type for STAC Collections

A STAC Collection is a JSON file ([RFC 8259](https://tools.ietf.org/html/rfc8259)), and thus should use the 
[`application/json`](https://tools.ietf.org/html/rfc8259#section-11) as the [Media Type](https://en.wikipedia.org/wiki/Media_type) 
(previously known as the MIME Type). 

## Standalone Collections

STAC Collections which don't link to any Item are called **standalone Collections**.
To describe them with more fields than the Collection fields has to offer,
it is allowed to re-use the metadata fields defined by extensions for Items in the `summaries` field.
This makes much sense for fields such as `platform` or `proj:epsg`, which are often the same for a whole Collection,
but doesn't make much sense for `eo:cloud_cover`, which usually varies heavily across a Collection.
The data provider is free to decide, which fields are reasonable to be used.
