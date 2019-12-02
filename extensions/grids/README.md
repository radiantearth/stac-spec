# Grids Extension Specification (`grids`)

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Grids Extension to a STAC Item. Specifically, this extension is designed to provide information per asset on the real-world mapping of the image from pixel space to a CRS-referenced world space. This differs from the `eo:gsd` item field in the `eo` extension, as `eo:gsd` is defined specifically as being related to the spatial resolution at the sensor, rather than the pixel size of images after orthorectification, pansharpening, or scaling. The `grids` extension is designed to be related specifically to the image at the ground, rather than the sensor. 

We suggest encoding this information as two sets of data, the `shape` which is the size of the image in number of pixels, and the `transform` which is the affine transformation matrix as defined in the GDAL [`GetGeoTransform`](https://gdal.org/api/gdaldataset_cpp.html#_CPPv4N11GDALDataset15GetGeoTransformEPd) or the Rasterio [`Transform`](https://rasterio.readthedocs.io/en/stable/api/rasterio.io.html#rasterio.io.BufferedDatasetWriter.transform). 

We find this is valuable in instances where a single dataset may have assets with different transformations. An example that we find in our implementation is a single dataset that includes a panchromatic band/measurement. 

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
| shape                 | [number] | Number of pixels in x and y directions. A 2*1 array. |
| transform            | [number] | The affine transformation coefficients as defined in the GDAL [`GetGeoTransform`](https://gdal.org/api/gdaldataset_cpp.html#_CPPv4N11GDALDataset15GetGeoTransformEPd) or the Rasterio [`Transform`](https://rasterio.readthedocs.io/en/stable/api/rasterio.io.html#rasterio.io.BufferedDatasetWriter.transform).   |


#### Common Grid Types


## Associating assets with grids

Asset definitions that contain grids data should reference the grids index. Each asset should provide a `grids:grids` property that is an array of 0 based indexes to the correct [Grids Objects](#grids-object).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| grids:grids   | number | Lists the grid name available in the asset. |

See <example-to-be-done> for a full example.
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
      "default" {
        "name": "default",
        "shape": [7711, 7621],
        "transform": [30.0, 0.0, 188985.0, 0.0, -30.0, -2760885.0, 0.0, 0.0, 1.0],
      },
      "panchromatic" {
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
      "grids:grids": "default",
      "title": "NBAR (blue)"
    },
    "nbar_panchromatic": {
      "href": "ga_ls8c_nbar_3-0-0_114078_2018-09-16_final_band08.tif",
      "type": "image/tiff; application=geotiff",
      "grids:grids": "panchromatic",
      "title": "NBAR (panchromatic)"
    },
    ...
  }
}
```


## Implementations


## Extensions