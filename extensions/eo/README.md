# EO Extension Specification (`eo`)

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Electro-Optical (EO) Extension to a STAC Item. EO
data is considered to be data that represents a snapshot of the earth for a single date and time. It
could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO
data include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on
Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8).

**Note:** This extension used to be called Earth Observation with a much broader scope (including
Synthetic Aperture Radar (SAR), etc). The decision was made to limit this to what was already its 
natural focus, and encourage other sensors to make their own extensions. Once that happens some of
these fields will evolve to higher level extensions. In the meantime other implementations are welcome
to reuse the names and definitions here.

A lot of EO data will have common metadata across many Items. It is not necessary, but recommended	
to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| eo:gsd           | number                   | **REQUIRED.** Ground Sample Distance at the sensor. |
| eo:platform      | string                   | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| eo:instrument    | string                   | **REQUIRED.** Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1). |
| eo:bands         | [[Band Object](#band-object)] | **REQUIRED.** This is a list of the available bands where each item is a [Band Object](#band-object). |
| eo:constellation | string                   | Name of the constellation to which the platform belongs. |
| eo:epsg          | integer\|null            | [EPSG code](http://www.epsg-registry.org/) of the datasource, `null` if no EPSG code. |
| eo:cloud_cover   | number                   | Estimate of cloud cover as a percentage (0-100) of the entire scene. If not available the field should not be provided. |
| eo:off_nadir     | number                   | Viewing angle. The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| eo:azimuth       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| eo:sun_azimuth   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| eo:sun_elevation | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |

**eo:gsd** is the nominal Ground Sample Distance for the data, as measured in meters on the ground. There are many
definitions of GSD. The value of this attribute should be related to the spatial resolution at the sensor, rather
than the pixel size of images after orthorectification, pansharpening, or scaling.
The GSD of a sensor can vary depending on off-nadir and wavelength, so it is at the discretion of the implementer
to decide which value most accurately represents the GSD. For example, Landsat8 optical and short-wave IR bands 
are all 30 meters, but the panchromatic band is 15 meters. The
`eo:gsd` should be 30 meters in this case because that is nominal spatial resolution at the sensor. The Planet 
PlanetScope Ortho Tile Product has an `eo:gsd` of 3.7 (or 4 if rounding), even though the pixel size of the images is 
3.125.   For example, one might choose for WorldView-2 the 
Multispectral 20° off-nadir value of 2.07 and for WorldView-3 the Multispectral 20° off-nadir value of 1.38.

**eo:platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include 
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS, 
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02` 
(Maxar/DigitalGlobe WorldView-2).
 
**eo:instrument** is the name of the sensor used, although for Items which contain data from
multiple sensors this could also name multiple sensors. For example, data from the Landsat-8
platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed
together and commonly referred to as OLI_TIRS. Examples include `oli_tirs` (Landsat-8), `msi` (Sentinel-2), 
`aster` (Terra), and `modis` (Terra and Aqua).

**eo:constellation** is the name of a logical collection one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without needing to specify which 
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8` 
(Landsat-8, a constellation consisting of a single platform), `sentinel-2` ([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)), 
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of 
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not 
part of a constellation, but these combine to form the logical collection referred to as MODIS. 

**eo:epsg** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data, and can usually be referenced using an [EPSG code](http://epsg.io).
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, eo:epsg should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code.

### Band Object

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| name                | string | The name of the band (e.g., "B01", "B02", "B1", "B5", "QA"). |
| common_name         | string | The name commonly used to refer to the band to make it easier to search for bands across instruments. See the [list of accepted common names](#common-band-names). |
| description         | string | Description to fully explain the band. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| gsd                 | number | Ground Sample Distance, the nominal distance between pixel centers available, in meters. Defaults to `eo:gsd` if not provided. |
| accuracy            | number | The expected error between the measured location and the true location of a pixel, in meters on the ground. |
| center_wavelength   | number | The center wavelength of the band, in micrometers (μm).      |
| full_width_half_max | number | Full width at half maximum (FWHM). The width of the band, as measured at half the maximum transmission, in micrometers (μm). |

**eo:gsd** is the Ground Sample Distance, measured in meters on the ground. This value is the nominal distance between 
pixel centers for the data.
Since GSD can vary across a scene depending on projection, this should be the average or most
commonly used GSD in the center of the image. For instance, Landsat8 optical and short-wave IR bands are 30 meters
and the panchromatic band is 15 meters. The Planet PlanetScope Ortho Tile Product has a band `gsd` of 3.125 (3 if 
rounding), which is different from the `eo:gsd` of 3.7 (4 if rounding).

**full_width_half_max** (FWHM) is a common way to describe the size of a spectral band. It is the
width, in micrometers (μm), of the bandpass measured at a half of the maximum transmission. Thus, if the
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

## Associating assets with bands

Asset definitions that contain band data should reference the band index. Each asset should provide a `eo:bands` property that is an array of 0 based indexes to the correct [Band Objects](#band-object).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| eo:bands   | [number] | Lists the band names available in the asset. |

See [landsat8-merged.json](examples/landsat8-merged.json) for a full example.
```
{
  "stac_version": "0.8.0",
  "stac_extensions": ["eo"],
  "id": "LC81530252014153LGN00",
  "type": "Feature",
  ...
  "properties": {
    ...
  },

  "assets" :{
    "B1": {
      "href": "http://landsat-pds.s3.amazonaws.com/L8/153/025/LC81530252014153LGN00/LC81530252014153LGN00_B1.TIF",
      "type": "image/vnd.stac.geotiff",
      "eo:bands": [0]
    },
    "B2": {
      "href": "http://landsat-pds.s3.amazonaws.com/L8/153/025/LC81530252014153LGN00/LC81530252014153LGN00_B2.TIF",
      "type": "image/vnd.stac.geotiff",
      "eo:bands": [1]
    },
    ...
  },
  "eo:bands": [
    {
      "name": "B01",
      "common_name": "coastal",
      "gsd": 30.0,
      "wavelength": 0.44,
      "full_width_half_max": 0.02
    },
    {
      "name": "B02",
      "common_name": "blue",
      "gsd": 30.0,
      "wavelength": 0.48,
      "full_width_half_max": 0.06
    },
    ...
  ]
 }
```
Planet example:

```
{
  "stac_version": "0.8.0",
  "stac_extensions": ["eo"],
  "id": "20171110_121030_1013",
  "type": "Feature",
  "properties": {
    ...
  },
  ...
  "assets": {
    "analytic": {
      "href": "https://api.planet.com/data/v1/assets/eyJpIjogIjIwMTcxMTEwXzEyMTAxMF8xMDEzIiwgImMiOiAiUFNTY2VuZTRCYW5kIiwgInQiOiAiYW5hbHl0aWMiLCAiY3QiOiAiaXRlbS10eXBlIn0",
      "name": "PSScene4Band GeoTIFF (COG)",
      "eo:bands":[0,1,2,3]
      ...
    }
    ...

  },
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
}
```

## Implementations

A number of implementations listed on [STAC Implementations page](../../implementations.md) are making use of the core EO 
properties, including the SpaceNet, CBERS, sat-api and Planet implementations. This is not marked as more mature because
the eo:bands portion is still being fleshed out.

## Extensions

The [extensions page](../README.md) gives an overview about related extensions.