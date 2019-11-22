# Grids Extension Specification (`grids`)

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Grids Extension to a STAC Item. Specifically, this extension is designed to provide information per asset on the size, location and grid of the image. This differs from the `eo:gsd` item field in the `eo` extension as that is defined specifically as being related to the spatial resolution at the sensor, rather than the pixel size of images after orthorectification, pansharpening, or scaling. The `grids` extension is designed to be related specifically to the image at the ground, rather than the sensor. 

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
| shape                 | number |  |
| transform            | number |  |


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
        "shape": [7711, 7621],
        "transform": [30.0, 0.0, 188985.0, 0.0, -30.0, -2760885.0, 0.0, 0.0, 1.0],
      },
      {
        "name": "panchromatic",
        "shape": [15421, 15241],
        "transform": [15.0, 0.0, 188992.5, 0.0, -15.0, -2760892.5, 0.0, 0.0, 1.0]
      },
      ...
    ]
  },
  "assets": {
    "nbar_blue": {
      "href": "ga_ls8c_nbar_3-0-0_114078_2018-09-16_final_band02.tif",
      "type": "image/tiff; application=geotiff",
      "grids:grids": [0],
      "title": "NBAR (blue)"
    },
    "nbar_panchromatic": {
      "href": "ga_ls8c_nbar_3-0-0_114078_2018-09-16_final_band08.tif",
      "type": "image/tiff; application=geotiff",
      "grids:grids": [1],
      "title": "NBAR (panchromatic)"
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


## Implementations


## Extensions


### Placing common fields in Collections
