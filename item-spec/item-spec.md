# STAC Item Specification <!-- omit in toc -->

- [Overview](#overview)
- [Item fields](#item-fields)
  - [stac\_version](#stac_version)
  - [stac\_extensions](#stac_extensions)
  - [id](#id)
  - [geometry](#geometry)
  - [bbox](#bbox)
  - [collection](#collection)
  - [properties](#properties)
    - [Properties Object](#properties-object)
    - [datetime](#datetime)
    - [Additional Fields](#additional-fields)
  - [Links](#links)
    - [Relation types](#relation-types)
    - [Collections](#collections)
  - [Assets](#assets)
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

| Field Name      | Type                                    | Description                                                                                                                                                                                                                                                                                               |
| --------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | string                                  | **REQUIRED.** Type of the GeoJSON Object. MUST be set to `Feature`.                                                                                                                                                                                                                                       |
| stac_version    | string                                  | **REQUIRED.** The STAC version the Item implements.                                                                                                                                                                                                                                                       |
| stac_extensions | \[string]                               | A list of extensions the Item implements.                                                                                                                                                                                                                                                                 |
| id              | string                                  | **REQUIRED.** Provider identifier. The ID should be unique within the [Collection](../collection-spec/collection-spec.md) that contains the Item.                                                                                                                                                         |
| geometry        | GeoJSON Geometry Object \| null         | **REQUIRED.** Defines the full footprint of the asset represented by this item, formatted according to RFC 7946, [section 3.1](https://tools.ietf.org/html/rfc7946#section-3.1) if a geometry is provided or [section 3.2](https://tools.ietf.org/html/rfc7946#section-3.2) if *no* geometry is provided. |
| bbox            | \[number]                               | **REQUIRED if `geometry` is not `null`, prohibited if `geometry` is `null`.** Bounding Box of the asset represented by this Item, formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5).                                                                            |
| properties      | [Properties Object](#properties-object) | **REQUIRED.** A dictionary of additional metadata for the Item.                                                                                                                                                                                                                                           |
| links           | \[[Link Object](#links)]                | **REQUIRED.** List of link objects to resources and related URLs. See the [best practices](../best-practices.md#use-of-links) for details on when the use `self` links is strongly recommended.                                                                                                           |
| assets          | Map<string, [Asset Object](#assets)>    | **REQUIRED.** Dictionary of asset objects that can be downloaded, each with a unique key.                                                                                                                                                                                                                 |
| collection      | string                                  | The `id` of the STAC Collection this Item references to. This field is **required** if a link with a `collection` relation type is present and is **not allowed** otherwise.                                                                                                                              |

### stac_version

In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

### stac_extensions

A list of extensions the Item implements.
The list consists of URLs to JSON Schema files that can be used for validation.
This list must only contain extensions that extend the Item specification itself,
see the 'Scope' for each of the extensions.

### id

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

### geometry

Defines the full footprint of the asset represented by this item, formatted according to RFC 7946.

If **a geometry** is provided, the value must be a Geometry Object according to
[RFC 7946, section 3.1](https://tools.ietf.org/html/rfc7946#section-3.1)
with the exception that the type `GeometryCollection` is not allowed in STAC.
If **no geometry** is provided, the value must be `null` according to
[RFC 7946, section 3.2](https://tools.ietf.org/html/rfc7946#section-3.2).

Coordinates are specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84).

### bbox

Bounding Box of the asset represented by this Item using either 2D or 3D geometries,
formatted according to [RFC 7946, section 5](https://tools.ietf.org/html/rfc7946#section-5).
The length of the array must be 2\*n where n is the number of dimensions.
The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in
Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84).
When using 3D geometries, the elevation of the southwesterly most extent is the minimum depth/height in meters
and the elevation of the northeasterly most extent is the maximum.
This field enables more naive clients to easily index and search geospatially.
STAC compliant APIs are required to compute intersection operations with the Item's geometry field, not its bbox.

### collection

The `id` of the STAC Collection this Item references to with the [`collection` relation type](#relation-types) in the `links`  array.

This field provides an easy way for a user to search for any Items that belong in a specified Collection.
If present, must be a non-empty string.

### properties

#### Properties Object

Additional metadata fields can be added to the GeoJSON Object Properties. The only required field
is `datetime` but it is recommended to add more fields, see [Additional Fields](#additional-fields)
resources below.

| Field Name | Type         | Description                                                                                                                                                                                                                                                                                                                                     |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| datetime   | string\|null | **REQUIRED.** The searchable date and time of the assets, which must be in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). `null` is allowed, but requires `start_datetime` and `end_datetime` from [common metadata](../commons/common-metadata.md#date-and-time-range) to be set. |

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
and `end_datetime` from [common metadata](../commons/common-metadata.md#date-and-time-range). For example, if
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
only be used when the data itself is nested, as with `bands`.

### Links

Each link in the `links` array must be a [Link Object](../commons/links.md#link-object).

#### Relation types

All [common relation types](../commons/links.md#relation-types) except for `item` can be used in Items.
A `self` and `collection` links are STRONGLY RECOMMENDED.
A link with this `rel` type is *required* for STAC item if the `collection` field in properties is present.

> \[!NOTE]
> Dynamic catalogs can implement multiple parents through a dynamic browsing interface as they could dynamically create the parent
> link based on the desired browsing structure (though only 1 parent at a time).
> Multiple parents are allowed for other types than `application/json`.

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

Multiple collections can point to an Item, but an Item can only point back to a single collection.

### Assets

The property `assets` is a dictionary of [Asset Objects](../commons/assets.md#asset-object), each with a unique key.
Each asset refers to data associated with the Item that can be downloaded or streamed.
This construct is further detailed in the [Assets](../commons/assets.md) document.

Assets in a STAC Item should include the main asset, as well as any 'sidecar' files that are related and help a
client make sense of the data. Examples of this include extended metadata (in XML, JSON, etc.),
unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented
by multiple files - all should be linked to. It is generally recommended that different processing
levels or formats are not exhaustively listed in an Item, but instead are represented by related
Items that are linked to, but the best practices around this are still emerging.

It is STRONGLY RECOMMENDED to add to each STAC Item

- a thumbnail with the role `thumbnail` for preview purposes
- one or more data files with the role `data`

## Media Type for STAC Item

A STAC Item is a GeoJSON file ([RFC 7946](https://tools.ietf.org/html/rfc7946)), and thus should use the
[`application/geo+json`](https://tools.ietf.org/html/rfc7946#section-12) as the [Media Type](https://en.wikipedia.org/wiki/Media_type)
(previously known as the MIME Type).

## Extensions

STAC Items are [extensible](../extensions/README.md).
Please refer to the [extensions overview](https://stac-extensions.github.io) to find relevant extensions for STAC Items.
