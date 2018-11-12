# SAR Extension Specification (`sar`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Synthetic-Aperture Radar (SAR) Extension to a STAC Item.
SAR data is considered to be data that represents a snapshot of the earth for a single date and time taken by a synthetic-aperture radar system such as Sentinel-1, RADARSAT or EnviSAT.

It is not necessary, but recommended to use the [Commons extension](../commons/README.md) (see chapter "Placing common fields in Collections").

- [Example (Sentinel-1)](example-sentinel1.json)
- JSON Schema is missing. PRs are welcome.

## Item fields

| Field Name         | Type          | Description |
| ------------------ | ------------- | ----------- |
| sar:platform       | string        | **REQUIRED.** Unique name of the specific platform the instrument is attached to. For satellites this would be the name of the satellite (e.g., landsat-8, sentinel-2A), whereas for drones this would be a unique name for the drone. |
| sar:constellation  | string        | Name of the constellation that the platform belongs to. See below for details. |
| sar:instrument     | string        | **REQUIRED.** Name of the sensor used, although for Items which contain data from multiple sensors this could also name multiple sensors. |
| sar:bands          | [Band Object] | **REQUIRED.** This is a list of the available bands where each item is a Band Object. |
| sar:pass_direction | string        | **REQUIRED.** Direction of the orbit, either `ascending`, `descending` or `irrelevant`. |
| sar:type           | string        | The product type, either `RAW`, `GRD`, `OCN` or `SLC`. |

**sar:constellation** is the name of the group of satellites that have similar payloads and have their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and radiometric characteristics. Examples are the Sentinel-1 [constellation](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-1/Satellite_constellation), which has S1A, S1B, S1C and S1D and RADARSAT, which has RADARSAT-1 and RADARSAT-2. This field allows users to search for Sentinel-1 data, for example, without needing to specify which specific platform the data came from.

### Band Object

| Field Name          | Type      | Description |
| ------------------- | --------- | ----------- |
| name                | string    | The name of the band. |
| common_name         | string    | The name commonly used to refer to the band to make it easier to search for bands across instruments. See below for a list of accepted common names. |
| description         | string    | Description to fully explain the band. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| instrument_mode     | string    | **REQUIRED.** The sensor mode, either `SM`, `IW`, `EW` or `WV`. |
| polarization        | [string]  | **REQUIRED.** The polarization, one of `HH`, `VV`, `HV` or `VH` for single channels. For multi-channels all channels must be added to the array, for instance for `HH+HV` both `HH` and `HV` must be added. |
| resolution          | [number]  | **REQUIRED.** The resolution is the maximum ability to distinguish two adjacent targets, in meters (m). The first element of the array is the range resolution, the second element is the azimuth resolution. |
| pixel_spacing       | [number]  | **REQUIRED.** The resolution is the distance between adjacent pixels, in meters (m). The first element of the array is the range pixel spacing, the second element is the azimuth pixel spacing. |
| looks               | [integer] | **REQUIRED.** The number of groups of signal samples (looks) sent. The first element of the array is the number of range looks, the second element is the number of azimuth looks. |
| center_wavelength   | number    | The center wavelength of the band, in centimeters (cm). |
| center_frequency    | number    | The center frequency of the band, in gigahertz (GHz). |
| full_width_half_max | number    | Full width at half maximum (FWHM). The width of the band, as measured at half the maximum transmission, in centimeters (cm). |

**resolution, pixel_spacing, looks**: These three fields are all two-element arrays. The first element of the array is the range (measured perpendicular to the flight path), the second element is the azimuth (measured parallel to the flight path).

**full_width_half_max** (FWHM) is a common way to describe the size of a spectral band. It is the
width, in micrometers (cm), of the bandpass measured at a half of the maximum transmission. Thus, if the
maximum transmission of the bandpass was 80%, the FWHM is measured as the width of the bandpass at
40% transmission.

#### Common Band Names

The band's `common_name` is the name that is commonly used to refer to that band's spectral
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

## Associating assets with bands

Asset definitions that contain band data should reference the band index. Each asset should provide a `sar:bands` property that is an array of 0 based indexes to the correct Band Objects.

### Item `Asset Object` fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| sar:bands  | [number] | Lists the band names available in the asset. |

## Extensions

The [extensions page](../README.md) gives an overview about related extensions.

### Placing common fields in Collections
A lot of SAR data will have common metadata across many Items. It is not necessary, but recommended	
to use the [Commons extension](../commons/README.md) in combination with [STAC Collections](../../collection-spec/README.md).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.