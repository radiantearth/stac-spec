## Intro

This document explains the fields of a SpatioTemporal Asset Catalog (STAC) `Item`. Each is a [GeoJSON](http://geojson.org/) 
[feature](https://tools.ietf.org/html/rfc7946#section-3.2), plus a few required fields that identify the time range and 
assets of the item. An `Item` is the core granular entity in a STAC, containing the core metadata that enables any 
client to search or crawl online catalogs of spatial 'assets' - satellite imagery, derived data, DEM's, etc. 

The same `Item` definition is used in both '[static catalogs](../static-catalog/)' and '[catalog apis](../api-spec/)'. 
Static catalogs are simply sets of items that are linked online, generally served by simple web servers and used 
for crawling data. Catalog API's enable dynamic queries, for example selecting all `Item`s in Hawaii on June 3, 2015, but the
results they return are FeatureCollections of items.

`Item`s are very flexible - any JSON object that contains all the required fields is a valid STAC `Item`. There
are emerging best practices, which in time will evolve in to specification extensions for particular domains or
uses. 

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification 
now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as
your feedback will be directly incorporated. 

## Specification Description 

| element         | type info       | name                       | description                           										                    | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| id              | string          | Provider ID                | Provider ID for the item                       													| 
| geometry        | geojson         | Geometry                   | Bounding Box + Footprint of the item in lat/long (EPSG 4326)										|
| datetime 		  | date and time   | Date and Time 	         | The searchable date/time of the assets, in UTC (Formatted in RFC 3339)    						| 
| links           | dictionary           | Resource Links             | Dictionary of link objects to resources and related URLs (self required), each with a unique key								|
| assets          | dictionary           | Assets            	   	 | Dict of asset objects that can be be download (at least one required, thumbnail strongly recommended), each with a unique key |
| provider        | string          | Provider     (optional)    | Provider name  																					|
| license         | string          | Data License (optional)    | Item's license name based on SPDX License List or following guidelines for non-SPDX licenses 	|

## Specification Definition

The `Item` is a JSON object, specifically a GeoJSON `Feature`, that validates against the [stac-item](json-schema/stac-item.json) 
JSON Schema document. Listed below are a set of instructions for one way to validate implementations, but any JSON Schema validation using the
[STAC Item schema](json-schema/stac-item.json) works great.

## Fields Explained

**id** uses the GeoJSON id field. As most geospatial assets are already defined by some identification scheme by the data provider 
it is recommended to simply use that ID. In time there may be a best practice recommendation for creating new ID's, or a method for 
globally unique identifiers, but for now data providers are advised to include sufficient information to make their ID's globally 
unique, including things like unique satellite id's.

**geometry** defines the full footprint of the asset represented by this item, formatted according to [RFC7946](https://tools.ietf.org/html/rfc7946) - [GeoJSON](http://geojson.org). The footprint should be the default GeoJSON geometry, though additional geometries can be included. All geometries should 
be either Polygons or MultiPolygons, as assets represent an area, not a line or point. Bounding Boxes are required, on the 'Feature' 
level in GeoJSON, and most software can easily generate BBOX's for footprints. This is to enable more naive clients to easily index 
and search geospatially. GeoJSON is specified in Long/Latitude - EPSG code 4326, and the `geometry` element of all STAC `Items` 
should be the same. 

**datetime** is the representative time and date for the asset, likely the acquisition (in the case of single camera type captures)
or the 'nominal' or representative time in the case of assets that are combined together. It is formatted
according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Though time can be a complex thing to capture,
for this purpose keep in mind the STAC spec is primarily searching for data, so use whatever single date and time is most useful for
a user to search for. STAC content profiles may further specify the meaning of the main `datetime` field, and many will also add 
more datetime fields.

**links** are used primarily to represent relationships with other entities. The key of each object in `links` represents the 
link 'type', a shorthand for the relationship described. In time different link types, along with the expected 'rel' values will
be enumerated - for now the `self` type is the only one specified. A `link` dictionary item requires an 'href' to provide 
the actual link - relative and absolute links are both allowed. The actual 
['rel' relation'](https://www.w3schools.com/tags/att_link_rel.asp) is specified with a 'rel' attribute in the object, and is 
also required. Data providers are advised to be liberal with the links section, to describe things like the catalog an item 
is in, related items, parent or child items (modeled in different ways, like an 'acquisition' or derived data). The `self` link is 
required, to represent the location that the `Item` can be found online. This is particularly useful when in a download package 
that includes `Item` metadata, so that the downstream user can know where the data has come from. The `self` href field 
*must* be an absolute url, not relative, to communicate the canonical location of the `Item`. 

**assets** is an set of keyed objects that contain of links to data associated with the `Item` that can be downloaded. This should include the main asset, as well
as any 'sidecar' files that are related and help a client make sense of the data. Examples of this include extended metadata (in XML, 
JSON, etc), unusable data masks, satellite ephemeris data, etc. Some assets (like Landsat data) are represented by multiple files - 
all should be linked to. It is generally recommended that different processing levels or formats are not exhaustively listed in an
`Item`, but instead are represented by related `Items` that are linked to, but the best practices around this are still emerging.
An asset object currently just requires a href field, which can be a relative or absolute link, to provide a link to the
asset for download or streaming access. The 'name' field is optional, and is generally the display name for clients & users.
The asset definition will likely evolve soon to be able to explain itself more.

**thumbnail** is a special *strongly recommended* `asset` that is a downsampled image of the core asset, for direct display online in a web page or
interactive search application. Even assets that are less easily translated in to a visual image should provide some visual representation, 
that users can browse. For example a SAR asset can render an elevation mask or hillshade for display. The field used to be required, and
if at all possible it should be included for a better user experience in searching data.

**provider** is an optional field that lists the name of the provider. This field will likely evolve a bit to be useful for 
querying and filtering, but for now is just the name.

**license** specifies the license that the data is available under. For public data licenses this should be an identifier from
the [SPDX License](https://spdx.org/licenses/) list. The practice for non-public data is still evolving, but it is recommended
to link to the actual license text the data is available under.

## Relative vs Absolute links

Currently the JSON schema for links does not require a URI formatting, to give the option for implementors to provide relative
links. In general Catalog API's should aim for absolute links whenever possible. But Static Catalogs are potentially more
portable if they can be implemented with relative links, so that every link doesn't need to be rewritten when the data
is copied. The `self` link is required to be absolute.

## Examples

See the [sample.json](sample.json) for a minimal example, as well as [sample-full.json](sample-full.json) for a more fleshed
example that contains a number of current best practices. There are also a few more real world inspired samples in the 
[examples/](examples/) folder. 

## Schema Validation

Any JSON Schema validation tool can be used, just run the json data to test against the stac-item.json schema, and be sure to
include geojson.json schema in the testing. 

See the [README](README.md) for instructions on how to install and run a javascript validator.

**Warning** - Not all validation is fully complete. For example the href checking is probably
too loose right now, it just checks for a string, see the 'relative vs absolute links' section above for reasons why. 
