# STAC Item Specification <!-- omit in toc --> 

- [Overview](#overview)
- [Item fields](#item-fields)
  - [Additional Field Information](#additional-field-information)
    - [stac_version](#stac_version)
    - [stac_extensions](#stac_extensions)
    - [id](#id)
    - [assets](#assets)
    - [bbox](#bbox)
  - [Properties Object](#properties-object)
    - [datetime](#datetime)
    - [Additional Fields](#additional-fields)
  - [Link Object](#link-object)
    - [Relation types](#relation-types)
      - [derived_from](#derived_from)
    - [Collections](#collections)
  - [Asset Object](#asset-object)
    - [Asset Media Type](#asset-media-type)
    - [Asset Roles](#asset-roles)
      - [Asset Role Types](#asset-role-types)
    - [Additional Fields for Assets](#additional-fields-for-assets)
- [Media Type for STAC Item](#media-type-for-stac-item)
- [Extensions](#extensions)

## Overview

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) Item. An **Item** is a
[GeoJSON](http://geojson.org/) [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) augmented with
[foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC object.
These include fields that identify the time range and assets of the Item. An Item is the core
object in a STAC Catalog, containing the core metadata that enables any client to search or crawl
online catalogs of spatial 'assets' (e.g., satellite imagery, derived data, DEMs).

The same Item definition is used in both [STAC Catalogs](../catalog-spec/README.md) and
the [Item-related API endpoints](https://github.com/radiantearth/stac-api-spec/blob/master/api-spec.md#ogc-api---features-endpoints).
Catalogs are simply sets of Items that are linked online, generally served by simple web servers
and used for crawling data. The search endpoint enables dynamic queries, for example selecting all
Items in Hawaii on June 3, 2015, but the results they return are FeatureCollections of Items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC Item.

- Examples:
  - See the [minimal example](../examples/simple-item.json),
    as well as a [more fleshed example](../examples/core-item.json) that contains a number of current best practices.
  - Real world [implementations](https://stacindex.org/catalogs) are also available.
- [JSON Schema](json-schema/item.json)

## Item fields

This object describes a STAC Item. The fields `id`, `type`, `bbox`, `geometry` and `properties` are
inherited from GeoJSON.

| Field Name | Type                                                                       | Description |
| ---------- | -------------------------------------------------------------------------- | ----------- |
| type       | string                                                                     | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `Feature`. |
| stac_version | string                                                                   | **REQUIRED.** The STAC version the Item implements. |
| stac_extensions | \[string]                                                             | A list of extensions the Item implements. |
| id         | string                                                                     | **REQUIRED.** Provider identifier. The ID should be unique within the  [Collection](../collection-spec/collection-spec.md) that contains the Item. |
| geometry   | [GeoJSON Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1) \| [null](https://tools.ietf.org/html/rfc7946#section-3.2) | **REQUIRED.** Defines the full footprint of the asset represented by this item, formatted according to [RFC 7946, section 3.1](https://tools.ietf.org/html/rfc7946#section-3.1). The footprint should be the default GeoJSON geometry, though additional geometries can be included. Coordinates are specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). |
| bbox       | \[number]                                                                  | **REQUIRED if `geometry` is not `null`.** Bounding Box of the asset represented by this Item, formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5). |
| properties | [Properties Object](#properties-object)                                    | **REQUIRED.** A dictionary of additional metadata for the Item. |
| links      | \[[Link Object](#link-object)]                                             | **REQUIRED.** List of link objects to resources and related URLs. A link with the `rel` set to `self` is strongly recommended. |
| assets     | Map<string, [Asset Object](#asset-object)>                                 | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key. |
| collection | string                                                                     | The `id` of the STAC Collection this Item references to (see [`collection` relation type](#relation-types)). This field is *required* if such a relation type is present and is *not allowed* otherwise. This field provides an easy way for a user to search for any Items that belong in a specified Collection. Must be a non-empty string. |

### Additional Field Information

#### stac_version

In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

#### stac_extensions

A list of extensions the Item implements.
The list consists of URLs to JSON Schema files that can be used for validation.
This list must only contain extensions that extend the Item specification itself,
see the the 'Scope' for each of the extensions.

#### id

It is important that an Item identifier is unique within a Collection, and that the 
[Collection identifier](../collection-spec/collection-spec.md#id) in turn is unique globally. Then the two can be combined to
give a globally unique identifier. Items are *[strongly recommended](#collections)* to have Collections, and not having one makes
it more difficult to be used in the wider STAC ecosystem.
If an Item does not have a Collection, then the Item identifier should be unique within its root Catalog or root Collection.

As most geospatial assets are already uniquely defined by some 
identification scheme from the data provider it is recommended to simply use that ID.
Data providers are advised to include sufficient information to make their IDs globally unique,
including things like unique satellite IDs.
See the [id section of best practices](../best-practices.md#item-ids) for additional recommendations.

#### assets

This is a dictionary of [Asset Objects](#asset-object) data associated with the Item that can be
downloaded or streamed, each with a unique key.
In general, the keys don't have any meaning and are considered to be non-descriptive unique identifiers.
Providers may assign any meaning to the keys for their respective use cases, but must not expect that clients understand them.
To communicate the purpose of an asset better use the `roles` field in the [Asset Object](#asset-object).

Assets should include the main asset, as well as any 'sidecar' files that are related and help a
client make sense of the data. Examples of this include extended metadata (in XML, JSON, etc.),
unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented
by multiple files - all should be linked to. It is generally recommended that different processing
levels or formats are not exhaustively listed in an Item, but instead are represented by related
Items that are linked to, but the best practices around this are still emerging.

#### bbox

Bounding Box of the asset represented by this Item using either 2D or 3D geometries,
formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5).
The length of the array must be 2\*n where n is the number of dimensions.
The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in
Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84).
When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters
and the elevation of the northeasterly most extent is the maximum.
This field enables more naive clients to easily index and search geospatially.
STAC compliant APIs are required to compute intersection operations with the Item's geometry field, not its bbox.

### Properties Object

Additional metadata fields can be added to the GeoJSON Object Properties. The only required field
is `datetime` but it is recommended to add more fields, see [Additional Fields](#additional-fields)
resources below.

| Field Name | Type         | Description                                                  |
| ---------- | ------------ | ------------------------------------------------------------ |
| datetime   | string\|null | **REQUIRED.** The searchable date and time of the assets, which must be in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). `null` is allowed, but requires `start_datetime` and `end_datetime` from [common metadata](common-metadata.md#date-and-time-range) to be set. |

#### datetime

This is likely the acquisition (in the case of single camera type captures) or the 'nominal'
or representative time in the case of assets that are combined together. Though time can be a
complex thing to capture, for this purpose keep in mind the STAC spec is primarily searching for
data, so use whatever single date and time is most useful for a user to search for. STAC content
extensions may further specify the meaning of the main `datetime` field, and many will also add more
datetime fields. **All times in STAC metadata should be in [Coordinated Universal 
Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC).**
If there's clearly no meaningful single 'nominal' time, it is allowed to use `null` instead.
In this case it is **required** to specify a temporal interval with the fields `start_datetime`
and `end_datetime` from [common metadata](common-metadata.md#date-and-time-range). For example, if
your data is a time-series that covers 100 years, it's not very meaningful to set the datetime to a
single timestamp as it would not be found in most searches that searches for a decade of data in that
period although the Item actually covers the decade. See [datetime selection](../best-practices.md#datetime-selection)
in the best practices document for more information.

#### Additional Fields

Providers should include metadata fields that are relevant for users of STAC, but it is recommended
to [select only those necessary for search](../best-practices.md#field-selection-and-metadata-linking).
Where possible metadata fields should be mapped to the STAC Common Metadata and widely used extensions,
to enable cross-catalog search on known fields.

- [STAC Common Metadata](common-metadata.md#stac-common-metadata) - A list of fields commonly used
throughout all domains. These optional fields are included for STAC Items by default.
- [Extensions](../extensions/README.md) - Additional fields that are more specific,
such as [EO](https://github.com/stac-extensions/eo), [View](https://github.com/stac-extensions/view).
- [Custom Extensions](../extensions/README.md#extending-stac) - It is generally allowed to add custom
fields but it is recommended to add multiple fields for related values instead of a nested object,
e.g., two fields `view:azimuth` and `view:off_nadir` instead of a field `view` with an object
value containing the two fields. The convention (as used within Extensions) is for related fields 
to use a common prefix on the field names to group them, e.g. `view`. A nested data structure should
only be used when the data itself is nested, as with `eo:bands`.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with the links section, to describe things like the Catalog an Item is in, related Items, parent or
child Items (modeled in different ways, like an 'acquisition' or derived data).
It is allowed to add additional fields such as a `title` and `type`.

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | [Media type](../catalog-spec/catalog-spec.md#media-types) of the referenced entity. |
| title      | string | A human readable title to be used in rendered displays of the link. |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

#### Relation types

STAC Items use a variety of `rel` types in the link object,
to describe the exact nature of the link between this Item and the entity it is linking to.
It is recommended to use the official
[IANA Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml) where possible.
The following table explains places where STAC use custom `rel` types are used with Items.
This happens where there is not a clear official option, or where STAC uses an official type but adds additional meaning for the STAC context.

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| self         | STRONGLY RECOMMENDED. *Absolute* URL to the Item if it is available at a public URL. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root         | URL to the root STAC entity (Catalog or Collection). |
| parent       | URL to the parent STAC entity (Catalog or Collection). |
| collection   | STRONGLY RECOMMENDED. URL to a Collection. *Absolute* URLs should be used whenever possible. The referenced Collection is STRONGLY RECOMMENDED to implement the same STAC version as the Item. A link with this `rel` type is *required* if the `collection` field in properties is present. |
| derived_from | URL to a STAC Item that was used as input data in the creation of this Item. |

A more complete list of potential `rel` types and their meaning in STAC can be found in the [Using Relation 
Types](../best-practices.md#using-relation-types) best practice. 

##### derived_from

*Note regarding the type `derived_from`: A full provenance model is far beyond the scope of STAC,
and the goal is to align with any good independent spec that comes along for that.
But the derived_from field is seen as a way to encourage fuller specs and at least start a linking
structure that can be used as a jumping off point for more experiments in provenance tracking*

#### Collections

Items are *strongly recommended* to provide a link to a STAC Collection definition.
It is important as Collections provide additional information about a set of items,
for example the license, provider and other information
giving context on the overall set of data that an individual Item is a part of.

If Items are part of a STAC Collection, the
[STAC Collection spec *requires* Items to link back to the Collection](../collection-spec/collection-spec.md#relation-types).
Linking back must happen in two places:

1. The field `collection` in an Item must be filled (see section 'Item fields'). It is the `id` of a STAC Collection.
2. An Item must also provide a link to the STAC Collection using the [`collection` relation type](#relation-types):
   ```js
   "links": [
     { "rel": "collection", "href": "link/to/collection/record.json" }
   ]
   ```

### Asset Object

An Asset is an object that contains a URI to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name  | Type      | Description |
| ----------- | --------- | ----------- |
| href        | string    | **REQUIRED.** URI to the asset object. Relative and absolute URI are both allowed. |
| title       | string    | The displayed title for clients and users. |
| description | string    | A description of the Asset providing additional details, such as how it was processed or created. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| type        | string    | [Media type](#asset-media-type) of the asset. See the [common media types](../best-practices.md#common-media-types-in-stac) in the best practice doc for commonly used asset types. |
| roles       | \[string] | The [semantic roles](#asset-roles) of the asset, similar to the use of `rel` in links. |

[Additional fields](#additional-fields) *may* be added to the assets, though this
is recommended only in special cases. See [Additional Fields for Assets](#additional-fields-for-assets)) for more information.

#### Asset Media Type

Any media type can be used in an Item's asset `type` field, and [registered](https://www.iana.org/assignments/media-types/media-types.xhtml) 
Media Types are preferred. STAC Items that have sidecar metadata files associated with a data asset (e.g, `.tfw`, Landsat 8 MTL files)
should use media types appropriate for the the metadata file.  For example, if it is a plain text file, then `text/plain`
would be appropriate; if it is an XML, then `text/xml` is appropriate. For more information on media types as well as a 
list of [common media types](../best-practices.md#common-media-types-in-stac) used in STAC see the [best practice on 
working with media types](../best-practices.md#working-with-media-types).

#### Asset Roles

The `roles` field is used to describe the purpose of each asset. It is recommended to include one for every asset, to give users
a sense of why they might want to make use of the asset. There are some emerging standards that enable clients to take particular
action when they encounter particular roles, listed below. But implementors are encouraged to come up with their own terms to 
describe the role.

##### Asset Role Types

Like the Link `rel` field, the `roles` field can be given any value, however here are a few standardized role names. 

| Role Name | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| thumbnail | An asset that represents a thumbnail of the Item, typically a true color image (for Items with assets in the visible wavelengths), lower-resolution (typically smaller 600x600 pixels), and typically a JPEG or PNG (suitable for display in a web browser). Multiple assets may have this purpose, but it recommended that the `type` and `roles` be unique tuples. For example, Sentinel-2 L2A provides thumbnail images in both JPEG and JPEG2000 formats, and would be distinguished by their media types. |
| overview  | An asset that represents a possibly larger view than the thumbnail of the Item, for example, a true color composite of multi-band data. |
| data      | The data itself. This is a suggestion for a common role for data files to be used in case data providers don't come up with their own names and semantics. |
| metadata  | A metadata sidecar file describing the data in this Item, for example the Landsat-8 MTL file. |

It is STRONGLY RECOMMENDED to add to each STAC Item
- a thumbnail with the role `thumbnail` for preview purposes
- one or more data file although it doesn't need to use the suggested role `data`

Note that multiple roles per asset are encouraged: pick all the ones that apply. So many should have the 'data' role, and then
another role to describe how the data is used. For more information on how to use roles see the [Asset 
Roles](../best-practices.md#asset-roles) section of the Best Practices document. It includes a [list of asset 
roles](../best-practices.md#list-of-asset-roles) that include many more ideas on roles to use. As they reach more widespread 
adoption we will include them here.

#### Additional Fields for Assets

As detailed above, Items contain properties, which are the main source of metadata for searching across Items. Many content
extensions can add further property fields as well. Any property that can be specified for an Item can also be specified for
a specific asset. This can be used to override a property defined in the Item, or to specify fields for which there is no
single value for all assets.

**It is important to note that the STAC API does not facilitate searching across Asset properties in this way, and this
should be used sparingly.** It is primarily used to define properties at the Asset level that may be used during use of
the data instead of for searching.

For example, `gsd` defined for an Item represents the best Ground Sample Distance (resolution) for the data within the Item.
However, some assets may be lower resolution and thus have a higher `gsd`. The `eo:bands` field from the EO extension defines
an array of spectral bands. However, it may be useful instead to specify the bands that are used in a particular asset.

For an example see the [sentinel2-sample](https://github.com/stac-utils/stac-examples/blob/main/sentinel2/sentinel2-sample.json).
The Sentinel-2 overall `gsd` is 10m, because this is
the best spatial resolution among all the bands and is defined in Item properties so it can be searched on. In the example
Band 5 and others have a `gsd` of 20m, so that asset specifies the `gsd` as well, which overrides the Item `gsd` for this
one asset. The example also includes reduced resolution versions of files included as assets, using `gsd` to represent
the proper resolution.

For `eo:bands`, it could be put in Item properties as an array of all the bands, but in this case it's not. Instead,
the assets each define an array containing the spectral band information for that asset (in the order the bands appear
in the file).

For examples of fields that this construct is recommended for,
see the [section of STAC Best Practices](../best-practices.md#common-use-cases-of-additional-fields-for-assets)
that talks about common use cases of additional fields for assets.

## Media Type for STAC Item

A STAC Item is a GeoJSON file ([RFC 7946](https://tools.ietf.org/html/rfc7946)), and thus should use the 
[`application/geo+json`](https://tools.ietf.org/html/rfc7946#section-12) as the [Media Type](https://en.wikipedia.org/wiki/Media_type) 
(previously known as the MIME Type). 

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

The [extensions page](../extensions/README.md) gives an overview about relevant extensions for STAC Items.
