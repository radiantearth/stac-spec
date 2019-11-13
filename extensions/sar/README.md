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
| sar:instrument_mode       | string        | **REQUIRED.** The name of the sensor acquisition mode that is commonly used. This should be the short name, if available. For example, `WV` for "Wave mode" of Sentinel-1 and Envisat ASAR satellites. |
| sar:frequency_band        | string        | **REQUIRED.** The common name for the frequency band to make it easier to search for bands across instruments. See section "Common Frequency Band Names" for a list of accepted names. |
| sar:center_frequency      | number        | The center frequency of the instrument, in gigahertz (GHz). |
| sar:polarization          | [string]      | **REQUIRED.** A single polarization or a polarization combination specified as array. |
| sar:bands                 | [[Band Object](#band-object)] | This is a list of the available bands where each item is a [Band Object](#band-object). |
| sar:product                  | string        | **REQUIRED.** The product type, for example `RAW`, `GRD`, `OCN` or `SLC` for Sentinel-1. |
| sar:resolution_range      | number        | The range resolution, which is the maximum ability to distinguish two adjacent targets perpendicular to the flight path, in meters (m).  |
| sar:resolution_azimuth    | number        | The azimuth resolution, which is the maximum ability to distinguish two adjacent targets parallel to the flight path, in meters (m).  |
| sar:pixel_spacing_range   | number        | The range azimuth, which is the distance between adjacent pixels perpendicular to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:pixel_spacing_azimuth | number        | The azimuth pixel spacing, which is the distance between adjacent pixels parallel to the flight path, in meters (m). Strongly RECOMMENDED to be specified for products of type `GRD`. |
| sar:looks_range           | number        | Number of range looks, which is the number of groups of signal samples (looks) perpendicular to the flight path. |
| sar:looks_azimuth         | number        | Number of azimuth looks, which is the number of groups of signal samples (looks) parallel to the flight path. |
| sar:looks_equivalent_number | number      | The equivalent number of looks (ENL). |
| sar:observation_direction | string        | Antenna pointing direction relative to the flight trajectory of the satellite, either `left` or `right`.

**sar:polarization** specifies a single polarization or a polarization combination. For single polarized radars one of `HH`, `VV`, `HV` or `VH` must be set. Fully polarimetric radars add all four polarizations to the array. Dual polarized radars and alternating polarization add the corresponding polarizations to the array, for instance for `HH+HV` add both `HH` and `HV`.

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

In SAR, you usually have frame start and end time. To describe this information it is recommended to use the [Datetime Range Extension Specification](../datetime-range/README.md). The center time of the frame should be specified with the `datetime` property for [STAC Items](../../item-spec/item-spec.md).

### Item [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields
| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| sar:bands  | [[Band Object](#band-object)] | This is a list of the available bands in the asset where each item is a [Band Object](#band-object). |

### Band Object

The polarizations (i.e., 'bands') within in the assets are dependent on `sar:product`. For example, single look complex (SLC) data contain both phase and amplitude information of the signal. This may be provided for instance in form of complex number components (i and q bands) for each available polarization. Multilooked data (for example GRD in case of Sentinel-1) contain only amplitude and intensity bands for each polarization. Geocoded data contain radiometrically calibrated and terrain corrected data such as sigma0 or flattening gamma and may also contain angular information such as projected local incidence angle. Details about each band and the respective processing applied is given in its description.

| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| data_type  | string | Specifies the type of the data contained in the band, for example `amplitude`, `intensity`, `phase`, `angle`, `sigma0`, `gamma0`. |
| unit                | string       | The unit of measurement for the data, preferably the symbols from [SI](https://physics.nist.gov/cuu/Units/units.html) or [UDUNITS](https://ncics.org/portfolio/other-resources/udunits2/). |
| polarization        | string\|null | The polarization of the band, either `HH`, `VV`, `HV`, `VH` or `null` if not applicable. |


## Extensions

The [extensions page](../README.md) gives an overview about related extensions, for example:

* the [Datetime Range Extension Specification](../datetime-range/README.md) to describe frame start and end time.