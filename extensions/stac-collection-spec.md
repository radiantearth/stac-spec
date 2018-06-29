# STAC Collection Extension Spec

A group of STAC `Item` objects from a single source can share a lot of common metadata. This is especially true with satellite imagery that uses the STAC EO Extension. Rather than including these common metadata fields on every `Item`, they can be grouped into a `Collection`.

## Collection Extension Description

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| c:id | string | Collection ID | Machine readable ID for the collection
| c:name | string | Collection Name (optional) | A name given to the Collection, used for display
| c:description | string (optional) | Collection Description | A human readable description of the collection

A `Collection` does not have many specific fields, as it may contain any fields that are in the core spec as well as any other extension. This provides maximum flexibility to data providers, as some the set of common metadata fields can vary between different types of data. For instance, Landsat and Sentinel data always has a eo:off_nadir value of 0, because those satellites are always pointed downward (i.e., nadir), while satellite that can be pointed will have varying eo:off_nadir values.

Collections allow the data provider to define the common set of metadata themselves. Some metadata fields are more likely to be part of the common set, such as 'license', or 'eo:instrument', however depending on the data provider this could vary among `Item`s.

All `Items` that use the collection extension to designate additional fields must include the `c:id` field,
which enables a user to search STAC records by the collection. The optional `c:name` and `c:description`
fields are used to display to human users. If no name is specified then the id will be used for display. 
The other requirement to implement the collection extension is the `c:collection` object in the links
dictionary, as specified below. 

If a metadata field is specified in `Collection`, it will be ignored in any `Item` that links to that `Collection`. This is important because a `Collection` is the metadta that is common across all `Item` objects. If a field is variable at all, it should be part of the `Item` record.

### Warning
This extension is still in an early iteration, and is likely to change as it gets use. Collections should work generically and be combined with the static catalog 'catalog.json' file.  It is powerful and useful to be able to reference fields that don't need to repeat in every item, but the naming and fields may shift. Please try it out and give feedback on what works.


#### Linking to a `Collection`
An `Item` specifies the collection it belongs to in two places. One is a field called 'collection' which is a key to a `Collection` record, which also also has a 'collection' field. This acts as a way to provide a 2-way link between `Collection` and `Item` records through the 'collection' field. In database terms, the 'collection' field is like a Foreign Key in the `Item` that links to a `Collection`. 

An `Item` also provides a link to a collection under the links dictionary:
```
{ "c:collection": { "href": "link/to/collection/record.json" }
```

### The Collection JSON

The `Collection` JSON that a set of `Item`s link to is a fragment of a full STAC `Item`, containing any 
fields that are fixed for the set of `Item`s that link to it. Most fields will live under the `properties`
object, and represent the fields that would be in each `Item` JSON. The `Collection` JSON may contain
other JSON objects, which should be thought of as objects that would live in each `Item` and repeat. The
`eo:bands` in the example below work this way. The `eo:bands` object lives parallel to the `properties` 
object in the JSON.


#### Using a `Collection`
The fields from the `Collection` record can be merged with an `Item` record to get the complete metadata for the `Item`.
```
# a collection
{
    "properties": {
        "c:name": "My Collection",
        "c:id": "my_collection",
        "c:description": "A description of my collection",
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
        "c:collection": {"rel": "c:collection", "href": "link/to/my_collection" }
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
        "c:id": "my_collection",
        "c:name": "My Collection",
        "c.description": "A description of my collection",
        "provider": "me",
        "license": "MIT",
        "datetime": "2017-01-01T00:00:00Z",
        "geometry": {...}
    },
    "links": {
        "c:collection": {
          "rel": "c:collection",
          "href": "link/to/my_collection"
        },
        ...
    },
    "assets": {...}
}
```

#### `Collection` Example
This is an example `Collection` for Landsat-8 imagery and uses the [EO extension](stac-eo-spec.md).
```
{
    "properties": {
        "c:name": "Landsat 8",
        "c:id": "landsat-8",
        "c:description": "Landat 8 imagery radiometrically calibrated and orthorectified using gound points and Digital Elevation Model (DEM) data to correct relief displacement.",
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