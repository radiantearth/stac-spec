# STAC ItemCollection Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) ItemCollection. 
An **ItemCollection** is a [GeoJSON](http://geojson.org/) [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) 
that is augmented with [foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.

Similary to the relationship between a GeoJSON Feature and a STAC Item, a STAC ItemCollection should be a valid GeoJSON FeatureCollection to allow interoperability with existing tools that support GeoJSON. 

The same ItemCollection definition is currently only used by the [`/stac/search`](../api-spec/README.md) endpoint. 
The search endpoint enables dynamic
queries, for example selecting all Items in Hawaii on June 3, 2015, but the results they return are an
ItemCollection of Items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC ItemCollection.

- Examples:
  - See the [minimal example](examples/itemcollection-sample-minimal.json), as well as a [more complete example](examples/itemcollection-sample-full.json). There are more real world inspired samples in the [examples/](examples/) folder.
  - Real world [implementations](../implementations.md) are also available.
- [JSON Schema](json-schema/itemcollection.json)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated. 

## ItemCollection fields

This object describes a STAC ItemCollection. The fields `type` and `features` are inherited from GeoJSON FeatureCollection.

| Field Name | Type                                                                       | Description |
| ---------- | -------------------------------------------------------------------------- | ----------- |
| type       | string | **REQUIRED.** always "FeatureCollection" to provide compatibility with GeoJSON  |
| features   | [Item] | **REQUIRED** a possibly-empty array of Items          |
| links      | [Link] | an array of Links related to this ItemCollection   |

## Extensions

The [Search Extension](../extensions/search/README.md) adds additional fields to STAC ItemCollection relevant to their use as 
search results.