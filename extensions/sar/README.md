# SAR Extension Specification

- **Title: SAR**
- **Identifier: sar**
- **Field Name Prefix: sar**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Synthetic-Aperture Radar (SAR) Extension to a STAC Item.
SAR data is considered to be data that represents a snapshot of the earth for a single date and time taken by a synthetic-aperture radar system such as Sentinel-1, RADARSAT or EnviSAT.

If the data has been collected by a satellite, it is strongly recommended to use the [`sat` extension](../sat/README.md), which in turn requires the [Instrument Fields](../../item-spec/common-metadata.md#instrument). If the data has been collected on an airborne platform it is strongly recommended to use the [Instrument Fields](../../item-spec/common-metadata.md#instrument).

To describe frame start and end times, use the [Date and Time Range fields](../../item-spec/common-metadata.md#date-and-time-range).

It is not necessary, but recommended to use the [Commons extension](../commons/README.md) (see chapter "Placing common fields in Collections").

- [Examples](examples/) (for example [Sentinel-1](examples/sentinel1.json) and [Envisat](examples/envisat.json))
- [JSON Schema](json-schema/schema.json)

## Item fields

**Note:** In the following specification *range* values are meant to be measured perpendicular to the flight path and *azimuth* values are meant to be measured parallel to the flight path.

| Field Name                | Type          | Description                                                  |
| ------------------------- | ------------- | ------------------------------------------------------------ |
| sar:instrument_mode       | string        | **REQUIRED.** The name of the sensor acquisition mode that is commonly used. This should be the short name, if available. For example, `WV` for "Wave mode" of Sentinel-1 and Envisat ASAR satellites. |
| sar:frequency_band        | string        | **REQUIRED.** The common name for the frequency band to make it easier to search for bands across instruments. See section "Common Frequency Band Names" for a list of accepted names. |
| sar:center_frequency      | number        | The center frequency of the instrument, in gigahertz (GHz). |
| sar:polarizations         | [string]      | **REQUIRED.** Any combination of polarizations. |
| sar:product_type          | string        | **REQUIRED.** The product type, for example `SSC`, `MGD`, or `SGC` |
| sar:resolution_range      | number        | The range resolution, which is the maximum ability to distinguish two adjacent targets perpendicular to the flight path, in meters (m).  |
| sar:resolution_azimuth    | number        | The azimuth resolution, which is the maximum ability to distinguish two adjacent targets parallel to the flight path, in meters (m).  |
| sar:pixel_spacing_range   | number        | The range pixel spacing, which is the distance between adjacent pixels perpendicular to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:pixel_spacing_azimuth | number        | The azimuth pixel spacing, which is the distance between adjacent pixels parallel to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:looks_range           | number        | Number of range looks, which is the number of groups of signal samples (looks) perpendicular to the flight path. |
| sar:looks_azimuth         | number        | Number of azimuth looks, which is the number of groups of signal samples (looks) parallel to the flight path. |
| sar:looks_equivalent_number | number      | The equivalent number of looks (ENL). |
| sar:observation_direction | string        | Antenna pointing direction relative to the flight trajectory of the satellite, either `left` or `right`.

**sar:polarizations** specifies a single polarization or a polarization combination. For single polarized radars one of `HH`, `VV`, `HV` or `VH` must be set. Fully polarimetric radars add all four polarizations to the array. Dual polarized radars and alternating polarization add the corresponding polarizations to the array, for instance for `HH+HV` add both `HH` and `HV`.

**sar:product_type**: The product type defines the type of procesed data contained in the assets. A list of suggestions include:

| sar:product_type | Data Type | Description |
|-------------------|----------------|----------------|
| SSC | complex | Single-look Slant-range Complex image (standard SLC) |
| MGD | amplitude | Multilooked Ground-range Detected image |
| GRD | amplitude | Multilooked Ground-range Detected image (used by Sentinel-1)
| GEC | amplitude | Geocoded Ellipsoid Corrected image |
| GTC | amplitude | Geocoded Terrain Corrected image |
| RTC | amplitude | Geocoded Radiometrically Terrain Corrected image |
| SGC | complex | Single-look Ground projected Complex image |
| SLC | complex | Single-look Ground projected Complex image (used by Sentinel-1) |

This can vary by data provider, who all may use slightly different names. Sentinel-1 for instance uses `GRD`, wihch is the same as the more general `MGD` and `SLC` instead of `SGC`. 


### Common Frequency Band Names

The `sar:frequency_band` is the name that is commonly used to refer to that band's spectral
properties. The table below shows the common name based on the wavelength and frequency ranges for several SAR satellites.

| Common Name | Wavelength Range (cm) | Frequency Range (GHz) | Satellites |
| ----------- | --------------------- | --------------------- | ---------- |
| P           | 30 - 120              | 0.25 - 1              | |
| L           | 15 - 30               | 1 - 2                 | ALOS, JERS, NISAR, SOACOM |
| S           | 7.5 - 15              | 2 - 4                 | HJ-1C |
| C           | 3.8 - 7.5             | 4 - 8                 | EnviSat, ERS, Radarsat, Risat-1, Sentinel-1 |
| X           | 2.4 - 3.8             | 8 - 12.5              | Cosmo-SkyMed, TerraSAR-X, RanDEM-X, PAZ, KOMPSat-5 |
| Ku          | 1.7 - 2.4             | 12.5 - 18             | |
| K           | 1.1 - 1.7             | 18 - 26.5             | |
| Ka          | 0.75 - 1.1            | 26.5 - 40             | |

### Date and Time

In SAR, you usually have frame start and end time. To describe this information it is recommended to use the [Date and Time Range fields](../../item-spec/common-metadata.md#date-and-time-range).
The center time of the frame should be specified with the `datetime` property for [STAC Items](../../item-spec/item-spec.md).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name        | Type     | Description                                  |
| ----------------- | -------- | -------------------------------------------- |
| sar:polarizations | [string] | Lists the polarizations available in the asset, in order. Any of `HH`, `VV`, `HV`, `VH`. |

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to SAR data:

* the [Sat Extension Specification](../sat/README.md) to describe SAR data collected from a satellite.

### Placing common fields in Collections
A lot of SAR data will have common metadata across many Items. It is not necessary, but recommended	
to use the [Commons extension](../commons/README.md) in combination with [STAC Collections](../../collection-spec/README.md).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.
