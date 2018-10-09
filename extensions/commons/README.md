# Commons Extension Spec (`c`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

A group of STAC `Item` objects from a single source can share a lot of common metadata. This is especially true with satellite imagery that uses the STAC EO Extension. Rather than including these common metadata fields on every `Item`, they can be provided into the `Collection` that the `Item`s belong to

- [Examples](examples/)
- JSON Schema (missing, [PRs welcome](https://github.com/radiantearth/stac-spec/issues/94))

## WARNING

**This is still an early version of the STAC Commons Spec, expect that there may be some changes before everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too drastically. Using the specification now will ensure that needed changes can be made before everything is locked in. So now is an ideal time to implement, as your feedback will be directly incorporated.

## Item fields

Unlike other extensions the `Commons` extension does not add any fields to `Item`, instead it allows one to move fields out of `Item` and into the parent `Collection`, from which any member `Item` will inherit. Any field under an `Item`s properties can be removed and added to the `Collection` properties. Since a `Collection` contains no properties itself, anything under properties are metadata fields that are common across all member `Item`s.

This provides maximum flexibility to data providers, as the set of common metadata fields can vary between different types of data. For instance, Landsat and Sentinel data always has a eo:off_nadir value of 0, because those satellites are always pointed downward (i.e., nadir), while satellite that can be pointed will have varying eo:off_nadir values. The `Commons` extension allow the data provider to define the set of metadata that defines the colleciton. While some metadata fields are more likely to be part of the common set, such as or 'eo:instrument' rather than `eo:cloud_cover`, it depends on how the data provider chooses to organize their data.

If a metadata field is specified in the `Collection` properties, it will be ignored in any `Item` that links to that `Collection`. This is important because a `Collection` is the metadta that is common across all `Item` objects. If a field is variable at all, it should not be part of the `Commons`.

### Linking to a `Collection`

All `Item`s link to a Collection (this is part of the core STAC spec) and is specified in two places. One is a field under properties called `collection` which is the `id` of a `Collection` record. The `collection` field provides an easy way for a user to search for any `Item`s that belong in a specified `Collection`.

An `Item` must also provide a link to the `Collection` using the "collection" rel type:

```
links: [
  ...
  { "rel": "collection", href": "link/to/collection/record.json" }
]
```

### Using a `Collection`

To get the complete record of an `Item` (both individual and commons properties), the properties from the `Collection` can be merged with the `Item`

```
# a collection
{
    "id": "landsat-8-l1",
    "title": "Landsat 8 L1",
    "description": "Landat 8 imagery radiometrically calibrated and orthorectified using gound points and Digital Elevation Model (DEM) data to correct relief displacement.",
    "keywords": "landsat",
    "version": "0.1.0",
    "extent": {...},
    "providers": [...],
    "license": "PDDL-1.0",
    "properties": {
        "eo:gsd": 15,
        "eo:platform": "landsat-8",
        "eo:instrument": "OLI_TIRS",
        "eo:off_nadir": 0,
        "eo:bands": [
            {
                "id": "B1",
                "common_name": "coastal",
                "gsd": 30,
                "center_wavelength": 0.44,
                "full_width_half_max": 0.02
            },
            ...
        ]
    },
    "assets": {...},
    "links": [...]
```


# an item (incomplete)
{
    "type": "Feature"
    "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
    "bbox": [...],
    "geometry": {...},
    "properties": {
        "collection": "landsat-8-l1",
        "datetime": "2018-10-01T01:08:32.033Z",
        "eo:cloud_cover": 78,
        "eo:sun_azimuth": 168.8989761,
        "eo:sun_elevation": 26.32596431,
        "landsat:path": 107,
        "landsat:row": 18
    },
    "assets": {...},
    "links": [...]
}
```

The merged `Item` then looks like this:

```
{
    "type": "Feature"
    "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
    "bbox": [...],
    "geometry": {...},
    "properties": {
        "collection": "landsat-8-l1",
        "datetime": "2018-10-01T01:08:32.033Z",
        "eo:cloud_cover": 78,
        "eo:sun_azimuth": 168.8989761,
        "eo:sun_elevation": 26.32596431,
        "landsat:path": 107,
        "landsat:row": 18,
        "eo:gsd": 15,
        "eo:platform": "landsat-8",
        "eo:instrument": "OLI_TIRS",
        "eo:off_nadir": 0,
        "eo:bands": [
            {
                "id": "B1",
                "common_name": "coastal",
                "gsd": 30,
                "center_wavelength": 0.44,
                "full_width_half_max": 0.02
            },
            ...
        ]
    },
    "assets": {...},
    "links": [...]
}

## Implementations

[sat-api](https://github.com/sat-utils/sat-api/) has pioneered this functionality. You can see it in action at https://sat-api.developmentseed.org/stac 
