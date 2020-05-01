# STAC ItemCollection Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) ItemCollection. 
An **ItemCollection** is a [GeoJSON](http://geojson.org/) [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) 
that is augmented with [foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.

Similarly to the relationship between a GeoJSON Feature and a STAC Item, a STAC ItemCollection should be a valid GeoJSON FeatureCollection to allow interoperability with existing tools that support GeoJSON. 

The same ItemCollection definition is currently only used by the
[`/search` API endpoint](https://github.com/radiantearth/stac-api-spec/tree/master/api-spec.md#stac-endpoints) endpoint. 
The search endpoint enables dynamic queries, for example selecting all Items in
Hawaii on June 3, 2015, but the results they return are an ItemCollection of Items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC ItemCollection.

- Examples:
  - See the [minimal example](examples/itemcollection-sample-minimal.json), as well as a [more complete example](examples/itemcollection-sample-full.json). There are more real world inspired samples in the [examples/](examples/) folder.
  - Real world [implementations](../implementations.md) are also available.
- [JSON Schema](json-schema/itemcollection.json)

## ItemCollection fields

This object describes a STAC ItemCollection. The fields `type` and `features` are inherited from GeoJSON FeatureCollection.

| Field Name      | Type                                    | Description |
| --------------- | --------------------------------------- | ----------- |
| stac_version    | string                                  | **REQUIRED.** The STAC version the ItemCollection implements. |
| stac_extensions | \[string]                               | A list of extensions the ItemCollection implements. |
| type            | string                                  | **REQUIRED.** Always "FeatureCollection" to provide compatibility with GeoJSON. |
| features        | [STAC Item](item-spec.md)               | **REQUIRED** A possibly-empty array of Items. |
| links           | [Link Object](item-spec.md#link-object) | An array of Links related to this ItemCollection. |

**stac_version**: In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

**stac_extensions**: A list of extensions the ItemCollection implements. The list contains URLs to the JSON Schema files it can be validated against. For official [content extensions](../extensions/README.md#list-of-content-extensions), a "shortcut" can be used. This means you can specify the folder name of the extension, for example `single-file-stac` for the Single File STAC extension. This does *not* apply for API extensions. If the versions of the extension and the item diverge, you can specify the URL of the JSON schema file.
This list must only contain extensions that extend the ItemCollection itself, see the the 'Scope' column in the list of extensions. It must not contain extensions that extend the Items, these must be specified in the Items directly.

## Extensions

* The [Context Extension](https://github.com/radiantearth/stac-api-spec/tree/master/extensions/context/README.md) adds additional fields to STAC ItemCollection relevant to their use as search results.
* The [Single File STAC Extension](../extensions/single-file-stac/README.md) provides a set of Collections and Items as a single file catalog.
