# STAC Collection Extension Spec

A group of STAC `Item` objects from a single source usually shared common metadata. This is especially true with satellite imagery that uses the STAC EO Extension. Rather than including these common metadata fields on every `Item`, they can be grouped into a `Collection`.

## Collection Extension Description

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| collection_name | string | Collection Name | A name given to the Collection
| collection_description | string (optional) | Collection Description | A human readable description of the collection

A `Collection` does not have many specific fields, as it may contain any fields that are in the core spec as well as any other extension. If a field is specified in `Collection`, it will be ignored in any `Item` that links to that `Collection`. This is important because a `Collection` is the metadta that is common across all `Item` objects. If a field is variable at all, it should be part of the `Item` record.

#### Linking to a `Collection`
An `Item` links to a collection by providing a "link" with "rel" set to "collection". For example
```
{ "rel": "collection", "href": "link/to/collection/record" }
```

#### Using a `Collection`
The fields from the `Collection` record can be merged with an `Item` record to get the complete metadata for the `Item`.
```
# a collection
{
    "properties": {
        "collection_name": "my_collection",
        "provider": "me",
        "license": "MIT"
    }
}
# an item (incomplete)
{
    "id": "SCENE_001",
    "properties": {
        "datetime": "2017-01-01T00:00:00Z",
        "geometry": {...}
    },
    "links": {
        { "rel": "collection", "href": "link/to/my_collection" }
        ...
    },
    "assets": {...}
}
```

The merged `Item` then looks like this:
```
{
    "id": "SCENE_001",
    "properties": {
        "collection_name": "my_collection",
        "provider": "me",
        "license": "MIT"    
        "datetime": "2017-01-01T00:00:00Z",
        "geometry": {...}
    },
    "links": {
        { "rel": "collection", "href": "link/to/my_collection" }
        ...
    },
    "assets": {...}
}
```

#### `Collection` Example
This is an example `Collection` for Landsat-8 imagery and uses the EO extension.
```
{
    "properties": {
        "provider": "LANDSAT_8",
        "license": "PDDL-1.0",
        "eo:gsd" : 30,
    },

    "eo:bands": {
      "1": {
        "common_name": "coastal",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 0.44,
        "fwhm": 0.02
      },
      "2": {
        "common_name": "blue",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 0.48,
        "fwhm": 0.06
      },
      "3": {
        "common_name": "green",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 0.56,
        "fwhm": 0.06
      },
      "4": {
        "common_name": "red",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 0.65,
        "fwhm": 0.04
      },
      "5": {
        "common_name": "nir",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 0.86,
        "fwhm": 0.03
      },
      "6": {
        "common_name": "swir16",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 1.6,
        "fwhm": 0.08
      },
      "7": {
        "common_name": "swir22",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 2.2,
        "fwhm": 0.2
      },
      "8": {
        "common_name": "pan",
        "gsd": 15.0,
        "accuracy": null,
        "wavelength": 0.59,
        "fwhm": 0.18
      },
      "9": {
        "common_name": "cirrus",
        "gsd": 30.0,
        "accuracy": null,
        "wavelength": 1.37,
        "fwhm": 0.02
      },
      "10": {
        "common_name": "lwir11",
        "gsd": 100.0,
        "accuracy": null,
        "wavelength": 10.9,
        "fwhm": 0.8
      },
      "11": {
        "common_name": "lwir12",
        "gsd": 100.0,
        "accuracy": null,
        "wavelength": 12.0,
        "fwhm": 1.0
      }
    }
```
