# Grids Extension Specification (`grids`)

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Grids Extension to a STAC Item. Specifically, this extension is designed to provide information per asset on the size, location and grid of the image. This differs from the `eo:gsd` item field in the `eo` extension as this is defined specifically as being related to the spatial resolution at the sensor, rather than the pizel size of images after orthorectification, pansharpening, or scaling. The `grids` extension is designed to be related specifically to the image at the ground, rather than the sensor. 

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| grids:grids      | [[Grids Object](#grids-object)]| **REQUIRED.** This is a list of the available types of grids  |


### Grids Object

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| name                | string | The name of the grid (e.g., "default", "panchromatic"). |
| description         | string | Description to fully explain the grid. |
| shape                 | number | Ground Sample Distance, the nominal distance between pixel centers available, in meters. Defaults to `eo:gsd` if not provided. |
| transform            | number | The expected error between the measured location and the true location of a pixel, in meters on the ground. |


#### Common Grid Types


## Associating assets with grids

Asset definitions that contain band data should reference the band index. Each asset should provide a `eo:bands` property that is an array of 0 based indexes to the correct [Band Objects](#band-object).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| grids:grids   | [number] | Lists the grid names available in the asset. |

See [example-landsat8.json](examples/example-landsat8.json) for a full example.
```
{
  "stac_version": "0.8.1",
  "stac_extensions": ["grids"],
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "type": "Feature",
  ...
  "properties": {
    ...
    "grids:grids": [
      {
        "name": "default",
        "common_name": "coastal",
        "gsd": 30,
        "center_wavelength": 0.44,
        "full_width_half_max": 0.02
      },
      {
        "name": "B2",
        "common_name": "blue",
        "gsd": 30,
        "center_wavelength": 0.48,
        "full_width_half_max": 0.06
      },
      ...
    ]
  },
  "assets": {
    "B1": {
      "href": "https://landsat-pds.s3.amazonaws.com/c1/L8/107/018/LC08_L1TP_107018_20181001_20181001_01_RT/LC08_L1TP_107018_20181001_20181001_01_RT_B1.TIF",
      "type": "image/tiff; application=geotiff",
      "eo:bands": [0],
      "title": "Band 1 (coastal)"
    },
    "B2": {
      "href": "https://landsat-pds.s3.amazonaws.com/c1/L8/107/018/LC08_L1TP_107018_20181001_20181001_01_RT/LC08_L1TP_107018_20181001_20181001_01_RT_B2.TIF",
      "type": "image/tiff; application=geotiff",
      "eo:bands": [1],
      "title": "Band 2 (blue)"
    },
    "B3": {
      "href": "https://landsat-pds.s3.amazonaws.com/c1/L8/107/018/LC08_L1TP_107018_20181001_20181001_01_RT/LC08_L1TP_107018_20181001_20181001_01_RT_B3.TIF",
      "type": "image/tiff; application=geotiff",
      "eo:bands": [2],
      "title": "Band 3 (green)"
    },
    ...
  }
}
```
Planet example:

```
{
  "stac_version": "0.8.1",
  "stac_extensions": ["eo"],
  "id": "20171110_121030_1013",
  "type": "Feature",
  ...
  "properties": {
    ...
    "eo:bands": [
      {
        "full_width_half_max": 0.08,
        "center_wavelength": 0.63,
        "common_name": "red"
      },
      {
        "full_width_half_max": 0.09,
        "center_wavelength": 0.545,
        "common_name": "green"
      },
      {
        "full_width_half_max": 0.06,
        "center_wavelength": 0.485,
        "common_name": "blue"
      },
      {
        "full_width_half_max": 0.08,
        "center_wavelength": 0.82,
        "common_name": "nir"
      }
    ]
  },
  "assets": {
    "analytic": {
      "href": "https://api.planet.com/data/v1/assets/eyJpIjogIjIwMTcxMTEwXzEyMTAxMF8xMDEzIiwgImMiOiAiUFNTY2VuZTRCYW5kIiwgInQiOiAiYW5hbHl0aWMiLCAiY3QiOiAiaXRlbS10eXBlIn0",
      "title": "PSScene4Band GeoTIFF (COG)",
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "eo:bands": [0,1,2,3]
    }
  }
}
```

## Implementations

A number of implementations listed on [STAC Implementations page](../../implementations.md) are making use of the core EO 
properties, including the SpaceNet, CBERS, sat-api and Planet implementations. This is not marked as more mature because
the eo:bands portion is still being fleshed out.

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to EO data:

* the [Sat Extension Specification](../sat/README.md) to describe SAR data collected from a satellite.
* the [Instrument Extension Specification](../instrument/README.md) is required when using the EO extension, which contains fields about the sensor and platform used to collect the data. It is required when using the Sat extension.

### Placing common fields in Collections
A lot of EO data will have common metadata across many Items. It is not necessary, but recommended	
to use the [Commons extension](../commons/README.md) in combination with [STAC Collections](../../collection-spec/README.md).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.
