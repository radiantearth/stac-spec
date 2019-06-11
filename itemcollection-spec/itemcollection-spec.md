# STAC ItemCollection Specification

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) ItemCollection. An **ItemCollection** is a [GeoJSON](http://geojson.org/) [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) 
that is augmented with [foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.

Similary to the relationship between a GeoJSON Feature and a STAC Item, a STAC ItemCollection should be a valid GeoJSON FeatureCollection to allow interoperability with existing tools that support GeoJSON. 

The same ItemCollection definition is currently only used by the [`/stac/search`](../api-spec/README.md) endpoint. 
The search endpoint enables dynamic
queries, for example selecting all Items in Hawaii on June 3, 2015, but the results they return are an
ItemCollection of Items.

Items are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC ItemCollection.

- Examples:
  - See the [minimal example](examples/minimal-sample.json), as well as a [more complete example](examples/sample-full.json). There are more real world inspired samples in the [examples/](examples/) folder.
  - Real world [implementations](../implementations.md) are also available.
- [JSON Schema](json-schema/itemcollection.json)

## ItemCollection fields

This object describes a STAC ItemCollection. The fields `type` and `features` are inherited from GeoJSON FeatureCollection.

| Field Name | Type                                                                       | Description |
| ---------- | -------------------------------------------------------------------------- | ----------- |
| type       | string | **REQUIRED.** always "FeatureCollection" to provide compatability with GeoJSON  |
| features   | [Item] | **REQUIRED** a possibly-empty array of Items          |
| links      | [Link] | an array of Links related to this ItemCollection   |
| properties      | Properties | an array of Links related to this ItemCollection   |

### Properties Object

The Properties object adds additional metadata to the ItemCollection. Basically, each entry is a
key-value pair. The values SHOULD not be an array or object to avoid GIS systems mis-rendering them.
Metadata that require an object or array SHOULD be placed a level up, directly in the
ItemCollection object. Additional fields can be introduced through extensions. It is generally allowed to add
custom fields.

There are no required fields for the core definition of ItemCollection.

## ItemCollection Example

An ItemCollection is identical to a GeoJSON FeatureCollection.

```json
{
  "type": "FeatureCollection",
  "features": [ ],
  "links":[
      {
        "rel":"self",
        "href":"http://stac.example.com/stac/search?collection=modis_mcd43a4"
      }
    ],
  "properties" : {}  
}
```

## ItemCollection Extensions

The [Search Extension](extensions/search/README.md) adds additional fields to STAC ItemCollection relevant to their use as 
search results.
