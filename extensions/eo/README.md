# Electro-Optical Extension Specification

- **Title: Electro-Optical**
- **Identifier: eo**
- **Field Name Prefix: eo**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

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

A lot of EO data will have common metadata across many Items. 
It is not necessary, but recommended to use the [Commons extension](../commons/README.md)
(see chapter "Placing common fields in Collections").

If the data has been collected by a satellite, it is strongly recommended to use the [`sat` extension](../sat/README.md), which in turn requires the [Instrument Fields](../../item-spec/common-metadata.md#instrument). If the data has been collected on an airborne platform it is strongly recommended to use the [Instrument Fields](../../item-spec/common-metadata.md#instrument).

For defining view geometry of data, it is strongly recommended to use the [`view` extension](../view/README.md).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| eo:gsd           | number                   | **REQUIRED.** Ground Sample Distance at the sensor. |
| eo:bands         | [[Band Object](#band-object)] | **REQUIRED.** This is a list of the available bands where each item is a [Band Object](#band-object). |
| eo:cloud_cover   | number                   | Estimate of cloud cover as a percentage (0-100) of the entire scene. If not available the field should not be provided. |


### Ground Sampling Distance

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

### Band Object

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| name                | string | The name of the band (e.g., "B01", "B02", "B1", "B5", "QA"). |
| common_name         | string | The name commonly used to refer to the band to make it easier to search for bands across instruments. See the [list of accepted common names](#common-band-names). |
| description         | string | Description to fully explain the band. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| center_wavelength   | number | The center wavelength of the band, in micrometers (μm).      |
| full_width_half_max | number | Full width at half maximum (FWHM). The width of the band, as measured at half the maximum transmission, in micrometers (μm). |

**full_width_half_max** (FWHM) is a common way to describe the size of a spectral band. It is the
width, in micrometers (μm), of the bandpass measured at a half of the maximum transmission. Thus, if the
maximum transmission of the bandpass was 80%, the FWHM is measured as the width of the bandpass at
40% transmission.

#### Common Band Names

The band's common_name is the name that is commonly used to refer to that band's spectral
properties. The table below shows the common name based on the average band range for the band
numbers of several popular instruments.

| Common Name | Band Range (μm) | Landsat 5/7 | Landsat 8 | Sentinel 2 | MODIS |
| ----------- | --------------- | ----------- | --------- | ---------- | ----- |
| coastal     | 0.40 - 0.45     |             | 1         | 1          |       |
| blue        | 0.45 - 0.50     | 1           | 2         | 2          | 3     |
| green       | 0.50 - 0.60     | 2           | 3         | 3          | 4     |
| red         | 0.60 - 0.70     | 3           | 4         | 4          | 1     |
| yellow      | 0.58 - 0.62     |             |           |            |       |
| pan         | 0.50 - 0.70     | 8 (*L7 only*) | 8         |            |       |
| rededge     | 0.70 - 0.75     |             |           |            |       |
| nir         | 0.75 - 1.00     | 4           |           | 8          | 2     |
| nir08       | 0.75 - 0.90     |             | 5         | 8a         |       |
| nir09       | 0.85 - 1.05     |             |           | 9          |       |
| cirrus      | 1.35 - 1.40     |             | 9         | 10         | 26    |
| swir16      | 1.55 - 1.75     | 5           | 6         | 11         | 6     |
| swir22      | 2.10 - 2.30     | 7           | 7         | 12         | 7     |
| lwir        | 10.5 - 12.5     | 6           |           |            |       |
| lwir11      | 10.5 - 11.5     |             | 10        |            | 31    |
| lwir12      | 11.5 - 12.5     |             | 11        |            | 32    |

The difference between the `nir`, `nir08`, and `nir09` bands are that the `nir` band is a wider band that covers most of the spectral range of 0.75μm to 1.0μm. `nir08` and `nir09` are narrow bands centered 0.85μm and 0.95μm respectively. The same goes for the difference between `lwir`, `lwir11` and `lwir12`. 

## Associating assets with bands

Asset definitions that contain band data should reference the band index. Each asset should provide a `eo:bands` property that is an array of 0 based indexes to the correct [Band Objects](#band-object).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| eo:bands   | [number] | Lists the band names available in the asset. |

See [example-landsat8.json](examples/example-landsat8.json) for a full example.
```
{
  "stac_version": "0.9.0",
  "stac_extensions": ["eo"],
  "id": "LC08_L1TP_107018_20181001_20181001_01_RT",
  "type": "Feature",
  ...
  "properties": {
    ...
    "eo:bands": [
      {
        "name": "B1",
        "common_name": "coastal",
        "center_wavelength": 0.44,
        "full_width_half_max": 0.02
      },
      {
        "name": "B2",
        "common_name": "blue",
        "center_wavelength": 0.48,
        "full_width_half_max": 0.06
      },
      {
        "name": "B3",
        "common_name": "green",
        "center_wavelength": 0.56,
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
  "stac_version": "0.9.0",
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
* the [View Geometry Extension Specification](../view/README.md) to describe angles of sensors collecting earth observation data from above the earth.

### Placing common fields in Collections
A lot of EO data will have common metadata across many Items. It is not necessary, but recommended	
to use the [Commons extension](../commons/README.md) in combination with [STAC Collections](../../collection-spec/README.md).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.
