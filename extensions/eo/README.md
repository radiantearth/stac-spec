# Electro-Optical Extension Specification

- **Title: Electro-Optical**
- **Identifier: eo**
- **Field Name Prefix: eo**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @matthewhanson

This document explains the fields of the STAC Electro-Optical (EO) Extension to a STAC Item. 

These fields defined by this extension follow the convention for 
[additional fields for a STAC Item](../../item-spec/item-spec.md#additional-fields-for-assets) and are 
allowed in either Item Properties or Item Assets.  

EO data is considered to be data that represents a snapshot of the Earth for a single date and time. It
could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO
data include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on
Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8).

If the data has been collected by a satellite, it is strongly recommended to use the [`sat` extension](../sat/README.md), which in turn requires the [Instrument Fields](../../item-spec/common-metadata.md#instrument). If the data has been collected on an airborne platform it is strongly recommended to use the [Instrument Fields](../../item-spec/common-metadata.md#instrument).

For defining view geometry of data, it is strongly recommended to use the [`view` extension](../view/README.md).

- Examples:
  - [Landsat 8 with bands in assets](examples/example-landsat8.json)
  - [Example with bands in Item properties](../../item-spec/examples/sample-full.json)
  - [Landsat 8 with bands in Item Asset Definition and Collection Summaries](../item-assets/examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item Properties or Item Asset fields

| Field Name     | Type                           | Description |
| -------------- | ------------------------------ | ----------- |
| eo:bands       | \[[Band Object](#band-object)] | An array of available bands where each object is a [Band Object](#band-object). If given, requires at least one band. |
| eo:cloud_cover | number                         | Estimate of cloud cover |

### Additional Field Information

#### eo:bands

The `eo:bands` array is used to describe the available [spectral 
bands](https://www.sciencedirect.com/topics/earth-and-planetary-sciences/spectral-band) in an Asset. This enables clients to read  
the file and understand which band is 'red' and which is 'nir' (near infrared) so that it can perform an 
[NDVI](https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index) operation, for example. Each Asset should specify
its own band object. If the individual bands are repeated in different assets they should all use the same values and 
include the optional [`name`](#name) field to enable clients to easily combine and summarize the bands.

The `eo:bands` array may optionally be used in the Item Properties to summarize the available bands in the assets. This should
be a 'union' of all the possible bands represented in assets. It should be considered merely informative - clients should rely
on the `eo:bands` of each asset. An Item is only allowed to use `eo:bands` in its Properties if it has at least one asset with 
a defined bands array.

**NOTE**: In STAC versions 0.9.x and prior, `eo:bands` could only be used by an Asset putting the the Band Object definitions in an Item Properties and referencing these via array index. 1.0.0-beta.1 introduced the current behavior.

#### eo:cloud_cover

 Estimate of cloud cover as a percentage (0-100) of the entire scene. If not available, the field should not be provided. Generally, this value should be used in Item Properties rather than Item Assets, as an Item from an electro-optical source is a single snapshot of the Earth, so the cloud cover value would apply to all assets. 

### Band Object

| Field Name          | Type   | Description |
| ------------------- | ------ | ----------- |
| name                | string | The name of the band (e.g., "B01", "B8", "band2", "red"). |
| common_name         | string | The name commonly used to refer to the band to make it easier to search for bands across instruments. See the [list of accepted common names](#common-band-names). |
| description         | string | Description to fully explain the band. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| center_wavelength   | number | The center wavelength of the band, in micrometers (μm). |
| full_width_half_max | number | Full width at half maximum (FWHM). The width of the band, as measured at half the maximum transmission, in micrometers (μm). |

*At least one of the fields must be specified.*

#### name

This is typically the name the data provider uses for the band. It should be treated like an 'id', to identify that a particular
band used in several assets represents the same band (all the other fields should be the same as well). It is also recommended that
clients use this name for display, potentially in conjunction with the common name.

#### full_width_half_max (FWHM) 

This is a common way to describe the size of a spectral band. It is the
width, in micrometers (μm), of the bandpass measured at a half of the maximum transmission. Thus, if the
maximum transmission of the bandpass was 80%, the FWHM is measured as the width of the bandpass at
40% transmission.

#### Common Band Names

The band's common_name is the name that is commonly used to refer to that band's spectral
properties. The table below shows the common name based on the average band range for the band
numbers of several popular instruments.

| Common Name | Band Range (μm) | Landsat 5/7 | Landsat 8 | Sentinel 2 | MODIS | NAIP |
| ----------- | --------------- | ----------- | --------- | ---------- | ----- | ---- |
| coastal     | 0.40 - 0.45     |             | 1         | 1          |       |      |
| blue        | 0.45 - 0.50     | 1           | 2         | 2          | 3     | 3    |
| green       | 0.50 - 0.60     | 2           | 3         | 3          | 4     | 2    |
| red         | 0.60 - 0.70     | 3           | 4         | 4          | 1     | 1    |
| yellow      | 0.58 - 0.62     |             |           |            |       |      |
| pan         | 0.50 - 0.70     | 8 (*L7 only*) | 8       |            |       |      |
| rededge     | 0.70 - 0.79     |             |           | 5, 6, 7    |       |      |
| nir         | 0.75 - 1.00     | 4           |           | 8          | 2     | 4    |
| nir08       | 0.75 - 0.90     |             | 5         | 8a         |       |      |
| nir09       | 0.85 - 1.05     |             |           | 9          |       |      |
| cirrus      | 1.35 - 1.40     |             | 9         | 10         | 26    |      |
| swir16      | 1.55 - 1.75     | 5           | 6         | 11         | 6     |      |
| swir22      | 2.10 - 2.30     | 7           | 7         | 12         | 7     |      |
| lwir        | 10.5 - 12.5     | 6           |           |            |       |      |
| lwir11      | 10.5 - 11.5     |             | 10        |            | 31    |      |
| lwir12      | 11.5 - 12.5     |             | 11        |            | 32    |      |

The difference between the `nir`, `nir08`, and `nir09` bands are that the `nir` band is a wider band that covers most of the spectral range of 0.75μm to 1.0μm. `nir08` and `nir09` are narrow bands centered 0.85μm and 0.95μm respectively. The same goes for the difference between `lwir`, `lwir11` and `lwir12`.

## Implementations

A number of implementations listed on [STAC Examples on stacspec.org](https://stacspec.org/#examples) are making use of the core EO properties, including the SpaceNet, CBERS, sat-api and Planet implementations. This is not marked as more mature because
the eo:bands portion is still being fleshed out.

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to EO data:

* the [Sat Extension Specification](../sat/README.md) to describe SAR data collected from a satellite.
* the [View Geometry Extension Specification](../view/README.md) to describe angles of sensors collecting earth observation data from above the earth.
