# STAC EO Extension Spec (`eo`)

This document explains the fields of the STAC Earth Observation (EO) Extension to a STAC `Item`. EO
data is considered to be data that represents a snapshot of the earth for a single date and time. It
could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO
data include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on
Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8), as well as SAR instruments (e.g.
Sentinel-1).

It is not necessary, but recommended to use the [Collections extension](stac-collection-spec.md)
(see chapter "Using collections").

- [Examples](examples/)
- JSON Schema (missing, [PRs welcome](https://github.com/radiantearth/stac-spec/issues/94))

## Item fields

| Field Name       | Type                     | Description                                                                                                                                                                                                                                                |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eo:gsd           | number                   | **REQUIRED.** Ground Sample distance. The nominal distance between pixel centers available, in meters.                                                                                                                                                     |
| eo:platform      | string                   | **REQUIRED.** Unique name of the specific platform the instrument is attached to. For satellites this would be the name of the satellite (e.g., landsat-8, sentinel-2A), whereas for drones this would be a unique name for the drone.                     |
| eo:constellation | string                   | **REQUIRED.** Name of the group or constellation that the platform belongs to. Example: The Sentinel-2 group has S2A and S2B, this field allows users to search for Sentinel-2 data without needing to specify which specific platform the data came from. |
| eo:instrument    | string                   | **REQUIRED.** Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1).                                                                                                                                                                      |
| eo:bands         | Map<string, Band Object> | **REQUIRED.** This is a dictionary of band information where each key in the dictionary is an identifier for the band (e.g., "B01", "B02", "B1", "B5", "QA").                                                                                              |
| eo:epsg          | integer                  | EPSG code of the datasource, null if no EPSG code.                                                                                                                                                                                                         |
| eo:cloud_cover   | integer                  | Estimate of cloud cover as a percentage (0-100) of the entire scene. If not available the field should not be provided.                                                                                                                                    |
| eo:off_nadir     | number                   | Viewing angle. The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90).                                                                                                                                   |
| eo:azimuth       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360).                                                 |
| eo:sun_azimuth   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360).                                                                                                    |
| eo:sun_elevation | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90).                                                                                                                         |

**eo:gsd** is the nominal Ground Sample Distance for the data, as measured in meters on the ground.
Since GSD can vary across a scene depending on projection, this should be the average or most
commonly used GSD in the center of the image. If the data includes multiple bands with different GSD
values, this should be the value for the greatest number or most common bands. For instance, Landsat
optical and short-wave IR bands are all 30 meters, but the panchromatic band is 15 meters. The
eo:gsd should be 30 meters in this case since those are the bands most commonly used.

**eo:instrument** is the name of the sensor used, although for Items which contain data from
multiple sensors this could also name multiple sensors. For example, data from the Landsat-8
platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed
together and commonly referred to as OLI_TIRS.

**eo:epsg** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data, and can usually be referenced using an [EPSG code](http://epsg.io).
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, eo:epsg should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code.

### Band Object

| Field Name          | Type     | Description                                                  |
| ------------------- | -------- | ------------------------------------------------------------ |
| common_name         | string   | The name commonly used to refer to the band to make it easier to search for bands across instruments. See below for a list of accepted common names. |
| description         | string   | Description to fully explain the band. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| gsd                 | number   | Ground Sample distance, the nominal distance between pixel centers available, in meters. See `eo:gsd` for more information. Defaults to `eo:gsd` if not provided. |
| accuracy            | number   | The expected error between the measured location and the true location of a pixel, in meters on the ground. |
| center_wavelength   | number   | The center wavelength of the band, in microns.               |
| full_width_half_max | number   | Full width at half maximum (FWHM). The width of the band, as measured at half the maximum transmission, in microns. |
| resolution          | number   | Spatial resolution of the band, in meters.                   |
| nodata              | [number] | The no data value(s).                                        |
| unit                | string   | Unit of measurements, preferably following the singular unit names in the [UDUNITS2 database](https://ncics.org/portfolio/other-resources/udunits2/). |
| offset              | number   | Offset to convert band values to the actual measurement scale. Defaults to `0`. |
| scale               | number   | Scale to convert band values to the actual measurement scale. Defaults to `1`. |

**full_width_half_max** (FWHM) is a common way to describe the size of a spectral band. It is the
width, in microns, of the bandpass measured at a half of the maximum transmission. Thus, if the
maximum transmission of the bandpass was 80%, the FWHM is measured as the width of the bandpass at
40% transmission.

#### Common Band Names

The band's common_name is the name that is commonly used to refer to that band's spectral
properties. The table below shows the common name based on the average band range for the band
numbers of several popular instruments.

| Common Name | Band Range (μm) | Landsat 5 | Landsat 7 | Landsat 8 | Sentinel 2 | MODIS |
| ----------- | --------------- | --------- | --------- | --------- | ---------- | ----- |
| coastal     | 0.40 - 0.45     |           |           | 1         | 1          |       |
| blue        | 0.45 - 0.5      | 1         | 1         | 2         | 2          | 3     |
| green       | 0.5 - 0.6       | 2         | 2         | 3         | 3          | 4     |
| red         | 0.6 - 0.7       | 3         | 3         | 4         | 4          | 1     |
| pan         | 0.5 - 0.7       |           | 8         | 8         |            |       |
| nir         | 0.77 - 1.00     | 4         | 4         | 5         | 8          | 2     |
| cirrus      | 1.35 - 1.40     |           |           | 9         | 10         | 26    |
| swir16      | 1.55 - 1.75     | 5         | 5         | 6         | 11         | 6     |
| swir22      | 2.1 - 2.3       | 7         | 7         | 7         | 12         | 7     |
| lwir11      | 10.5 - 11.5     |           |           | 10        |            | 31    |
| lwir12      | 11.5 - 12.5     |           |           | 11        |            | 32    |

## Item `Asset Object` fields

| Field Name | Type                           | Description                                  |
| ---------- | ------------------------------ | -------------------------------------------- |
| eo:bands   | Map<string, Asset Band Object> | Lists the band names available in the asset. |

### Asset Band Object

| Field Name | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| unit       | string | Unit of measurements, preferably following the singular unit names in the [UDUNITS2 database](https://ncics.org/portfolio/other-resources/udunits2/). |
| offset     | number | Offset to convert band values to the actual measurement scale. Defaults to `0`. |
| scale      | number | Scale to convert band values to the actual measurement scale. Defaults to `1`. |

### Example

```
...
  "assets": {
    "thumbnail": {
      "href": "https://eo-bucket.com/example/EXAMPLE_20180713_057_122.jpg",
      "type": "image/jpeg"
    },
    "B5": {
      "href": "s3://eo-bucket/example/EXAMPLE_20180713_057_122_L2_BAND5.tif",
      "type": "GeoTIFF",
      "format": "COG",
      "eo:bands": {
        "B5": {}
      }
    },
    "B6": {
      "href": "s3://eo-bucket/example/EXAMPLE_20180713_057_122_L2_BAND6.tif",
      "type": "image/geotiff",
      "eo:bands": {
        "B6": {
          "offset": 12345,
          "scale": 0.001
        }
      }
    }
  }
...
```

## Extensions

The [extensions page](../extensions/) gives an overview about related extensions.

### Using collections

A lot of EO data will have common metadata across many `Items`. It is not necessary, but recommended
to use the [Collections extension](stac-collection-spec.md). While the exact metadata that would
appear in a `Collection` record will vary depending on the dataset, the most common collection-level
metadata fields are indicated with an \* in the tables below.
