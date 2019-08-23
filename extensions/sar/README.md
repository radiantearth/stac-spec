# SAR Extension Specification (`sar`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Synthetic-Aperture Radar (SAR) Extension to a STAC Item.
SAR data is considered to be data that represents a snapshot of the earth for a single date and time taken by a synthetic-aperture radar system such as Sentinel-1, RADARSAT or EnviSAT.

A lot of SAR data will have common metadata across many Items. It is not necessary, but recommended	
to place common fields in [STAC Collections](../../collection-spec/collection-spec.md).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.

- [Examples](examples/) (for example [Sentinel-1](examples/sentinel1.json) and [Envisat](examples/envisat.json))
- [JSON Schema](json-schema/schema.json)

## Item fields

**Note:** In the following specification *range* values are meant to be measured perpendicular to the flight path and *azimuth* values are meant to be measured parallel to the flight path.

| Field Name                | Type          | Description                                                  |
| ------------------------- | ------------- | ------------------------------------------------------------ |
| sar:platform              | string        | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| sar:constellation         | string        | Name of the constellation to which the platform belongs. |
| sar:instrument            | string        | **REQUIRED.** Name of the sensor used, although for Items which contain data from multiple sensors this could also name multiple sensors. |
| sar:instrument_mode       | string        | **REQUIRED.** The name of the sensor acquisition mode that is commonly used. This should be the short name, if available. For example, `WV` for "Wave mode" of Sentinel-1 and Envisat ASAR satellites. |
| sar:frequency_band        | string        | **REQUIRED.** The common name for the frequency band to make it easier to search for bands across instruments. See section "Common Frequency Band Names" for a list of accepted names. |
| sar:center_wavelength     | number        | The center wavelength of the instrument, in centimeters (cm). |
| sar:center_frequency      | number        | The center frequency of the instrument, in gigahertz (GHz). |
| sar:polarization          | [string]      | **REQUIRED.** A single polarization or a polarization combination specified as array. |
| sar:bands                 | [[Band Object](#band-object)] | This is a list of the available bands where each item is a [Band Object](#band-object). |
| sar:pass_direction        | string\|null  | **REQUIRED.** Direction of the orbit, either `ascending`, `descending` or `null` if not relevant. |
| sar:type                  | string        | **REQUIRED.** The product type, for example `RAW`, `GRD`, `OCN` or `SLC` for Sentinel-1. |
| sar:resolution_range      | number        | The range resolution, which is the maximum ability to distinguish two adjacent targets perpendicular to the flight path, in meters (m).  |
| sar:resolution_azimuth    | number        | The azimuth resolution, which is the maximum ability to distinguish two adjacent targets parallel to the flight path, in meters (m).  |
| sar:pixel_spacing_range   | number        | The range azimuth, which is the distance between adjacent pixels perpendicular to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:pixel_spacing_azimuth | number        | The azimuth pixel spacing, which is the distance between adjacent pixels parallel to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:looks_range           | number        | Number of range looks, which is the number of groups of signal samples (looks) perpendicular to the flight path. |
| sar:looks_azimuth         | number        | Number of azimuth looks, which is the number of groups of signal samples (looks) parallel to the flight path. |
| sar:looks_equivalent_number | number      | The equivalent number of looks (ENL). |
| sar:observation_direction | string        | Antenna pointing direction relative to the flight trajectory of the satellite, either `left` or `right`.
| sar:absolute_orbit        | integer       | An absolute orbit number associated with the acquisition. |
| sar:relative_orbit        | integer       | A relative orbit number associated with the acquisition. |
| sar:incidence_angle       | number        | The center incidence angle is the angle defined by the incident radar beam at the scene center and the vertical (normal) to the intercepting surface. Measured in degrees (0-90). |

**sar:platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include `sentinel-1a` (Sentinel-1) and `envisat` (Envisat).
 
**sar:constellation** is the name of a logical collection one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without needing to specify from 
which specific platform the data came. One example is 
the constellation `sentinel-1` (Sentinel-1) consisting of two satellites Sentinel-1A and Sentinel-1B. If a system 
consists of only a single satellite, the constellation name is the same as the satellite name, e.g., `envisat` 
(Envisat). 

**sar:instrument** is the name of the sensor used, although for Items which contain data from multiple sensors this 
could also name multiple sensors. Examples include `c-sar` (Sentinel-1) and `asar` (Envisat).

**sar:polarization** specifies a single polarization or a polarization combination. For single polarized radars one of `HH`, `VV`, `HV` or `VH` must be set. Fully polarimetric radars add all four polarizations to the array. Dual polarized radars and alternating polarization add the corresponding polarizations to the array, for instance for `HH+HV` add both `HH` and `HV`.

**sar:absolute_orbit** usually corresponds to the number of orbits elapsed since satellite launch (e.g. ALOS, ERS-1/2, JERS-1, RADARSAT-1 and Sentinel-1). For airborne SAR such as UAVSAR it can be the [Flight ID](http://uavsar.jpl.nasa.gov/cgi-bin/data.pl) or a similar concept. The center orbit number should be specified if readily available, otherwise the orbit number at the start of the flight can be used instead.

**sar:relative_orbit** is a count of orbits from 1 to the number of orbits contained in a repeat cycle, where relative orbit 1 starts from a defined reference for a given satellite. This property is usually not set for airborne SAR such as UAVSAR. The center orbit number should be specified if readily available, otherwise the orbit number at the start of the flight can be used instead.

### Common Frequency Band Names

The `sar:freuency_band` is the name that is commonly used to refer to that band's spectral
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

In SAR, you usually have frame start and end time. To describe this information it is recommended to use the [Datetime Range Extension Specification](../datetime-range/README.md). The center time of the frame should be specified with the `datetime` property for [STAC ITems](../../item-spec/item-spec.md).

### Band Object

The bands contained in SAR image are dependent on the `sar:type`. For example, single look complex (SLC) data contain both phase and amplitude information of the signal. This may be provided for instance in form of complex number components (i and q bands) for each available polarization. Multilooked data (for example GRD in case of Sentinel-1) contain only amplitude and intensity bands for each polarization. Geocoded data contain radiometrically calibrated and terrain corrected data such as sigma0 or flattening gamma and may also contain angular information such as projected local incidence angle. Details about each band and the respective processing applied is given in its description.

| Field Name          | Type         | Description |
| ------------------- | ------------ | ----------- |
| name                | string       | The name of the band. |
| description         | string       | Description to fully explain the band, should include processing information. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| data_type           | string       | Specifies the type of the data contained in the band, for example `amplitude`, `intensity`, `phase`, `angle`, `sigma0`, `gamma0`. |
| unit                | string       | The unit of measurement for the data, preferably the symbols from [SI](https://physics.nist.gov/cuu/Units/units.html) or [UDUNITS](https://ncics.org/portfolio/other-resources/udunits2/). |
| polarization        | string\|null | The polarization of the band, either `HH`, `VV`, `HV`, `VH` or `null` if not applicable. |

## Associating assets with bands

Asset definitions that contain band data should reference the band index. Each asset should provide a `sar:bands` property that is an array of 0 based indexes to the correct [Band Objects](#band-object).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| sar:bands  | [number] | Lists the band names available in the asset. |

## Extensions

The [extensions page](../README.md) gives an overview about related extensions, for example:

* the [Datetime Range Extension Specification](../datetime-range/README.md) to describe frame start and end time.