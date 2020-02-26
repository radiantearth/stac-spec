# Commons Extension Specification

- **Title: Commons**
- **Identifier: commons**
- **Field Name Prefix: -**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

A group of STAC Item objects from a single source can share a lot of common metadata. This is especially true with satellite imagery that uses the STAC EO Extension. Rather than including these common metadata fields on every Item, they can be provided into the [STAC Collection](../../collection-spec/README.md) that the STAC Items belong to.

This extension makes most sense in **static catalogs** to move common information to a central place. This reduces duplication of metadata and makes updates to static catalogs easier. It also makes navigating a static catalog easier as user know in advance which common fields to expect although Items can better be summarized with the `summaries` field in Collections. Therefore it is recommended to use the summaries for this use case and only use the Commons extension to avoid data duplication.

In **API implementations** the Commons extension should not be used as it leads to less intuitive search results. For example, a search result for Items may not include the fields a user has searched for as it has been moved to the Collection, which may lead to confusion. Also, data duplication in dynamically created responses is usually not an issue and APIs derived from static catalogs can simply merge the common fields back into the Items for the response. In this case the `stac_extensions` field should not contain the `commons` extension any longer. To reduce the size of the response body, the [Fields API Extension](../../api-spec/extensions/fields/README.md) can be used.

- [Examples](examples/):
  - Landsat 8: An [Item](examples/landsat-item.json) that uses the Commons extension to place shared data in a [Collection](examples/landsat-collection.json).
- [JSON Schema](json-schema/schema.json)

## Item fields

Unlike other extensions the Commons extension does not add any fields to a STAC Item, instead it allows one to move fields out of Item and into the parent STAC Collection, from which any member Item will inherit. Any field under an Items `properties` field can be removed and added to the Collection `properties` field. Since a Collection contains no properties itself, anything under properties are metadata fields that are common across all member Items.

This provides maximum flexibility to data providers, as the set of common metadata fields can vary between different types of data. For instance, Landsat and Sentinel data always has a `view:off_nadir` value of `0`, because those satellites are always pointed downward (i.e., nadir), while satellite that can be pointed will have varying `view:off_nadir` values. The Commons extension allow the data provider to define the set of metadata that defines the collection. While some metadata fields are more likely to be part of the common set, such as or `instrument` rather than `eo:cloud_cover`, it depends on how the data provider chooses to organize their data.

If a metadata field is specified in the Collection properties, it will be ignored in any Item that links to that Collection. This is important because a Collection is the metadata that is common across all Item objects. If a field is variable at all, it should not be part of the Commons.

A Collection may not link to any Items, it may just be a definition of a Collection, in which case the Commons extension could still be used by defining any properties that would be shared by any member Item.

### Linking to a STAC Collection

All Items are strongly recommended to link to a Collection (this is part of the STAC Item spec) and related references are specified in two places.

One is a field called `collection` in a STAC Item which is the `id` of a STAC Collection record. The `collection` field provides an easy way for a user to search for any Items that belong in a specified Collection.

A STAC Item must also provide a link to the STAC Collection using the `collection` rel type:

```
"links": [
  ...
  { "rel": "collection", "href": "http://example.com/link/to/collection/record.json" }
]
```

### Using a STAC Collection

To get the complete record of an Item (both individual and commons properties), the properties from the Collection can be merged with the Item.

An incomplete Collection:
```
{
  "stac_version": "0.9.0",
  "stac_extensions": ["commons"],
  "id": "landsat-8-l1",
  "title": "Landsat 8 L1",
  "description": "Landat 8 imagery radiometrically calibrated and orthorectified using gound points and Digital Elevation Model (DEM) data to correct relief displacement.",
  "extent": {...},
  "license": "PDDL-1.0",
  "properties": {
    "platform": "landsat-8",
    "constellation": "landsat-8",
    "instruments": ["oli", "tirs"],
    "eo:gsd": 30,
    "view:off_nadir": 0,
    "eo:bands": [
      {
        "name": "B1",
        "common_name": "coastal",
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
  "stac_version": "0.9.0",
  "stac_extensions": ["commons", "eo", "view"],
  "type": "Feature",
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "bbox": [...],
  "geometry": {...},
  "collection": "landsat-8-l1",
  "properties": {
    "datetime": "2018-10-01T01:08:32.033Z",
    "eo:cloud_cover": 78,
    "view:sun_azimuth": 168.8989761,
    "view:sun_elevation": 26.32596431
  },
  "assets": {...},
  "links": [...]
}
```

The merged Item then looks like this:

```
{
  "stac_version": "0.9.0",
  "stac_extensions": ["eo", "view"],
  "type": "Feature",
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "bbox": [...],
  "geometry": {...},
  "collection": "landsat-8-l1",
  "properties": {
    "datetime": "2018-10-01T01:08:32.033Z",
    "platform": "landsat-8",
    "constellation": "landsat-8",
    "instruments": ["oli", "tirs"],
    "eo:cloud_cover": 78,
    "view:sun_azimuth": 168.8989761,
    "view:sun_elevation": 26.32596431,
    "eo:gsd": 30,
    "view:off_nadir": 0,
    "eo:bands": [
      {
        "name": "B1",
        "common_name": "coastal",
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

## Implementations

[sat-api](https://github.com/sat-utils/sat-api/) has pioneered this functionality. You can see it in action at [https://sat-api.developmentseed.org/stac](https://sat-api.developmentseed.org/stac).
