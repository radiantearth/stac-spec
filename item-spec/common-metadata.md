# STAC Common Metadata

This document outlines commonly used fields in STAC.
They are often used in [STAC Item properties](item-spec.md#properties-object),
but can also be used in other places, e.g. an [Item Asset](item-spec.md#asset-object)
or [Collection Asset](../collection-spec/collection-spec.md#asset-object).

- [STAC Common Metadata](#stac-common-metadata)
  - [Basics](#basics)
  - [Date and Time](#date-and-time)
    - [Date and Time Range](#date-and-time-range)
  - [Licensing](#licensing)
    - [Relation types](#relation-types)
  - [Provider](#provider)
    - [Provider Object](#provider-object)
  - [Instrument](#instrument)
  - [Bands](#bands)
  - [Data Values](#data-values)

Various *examples* are available in the folder [`examples`](../examples/).
*JSON Schemas* can be found in the folder [`json-schema`](json-schema/).

Implementation of any of the fields is not required, unless explicitly required by a specification using the field.
For example, `datetime` is required in STAC Items.

## Basics

Descriptive fields to give a basic overview of a STAC Item.

- [JSON Schema](json-schema/basics.json)

| Field Name  | Type      | Description                                                                                                                                                   |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title       | string    | A human readable title describing the STAC entity.                                                                                                            |
| description | string    | Detailed multi-line description to fully explain the STAC entity. [CommonMark 0.29](https://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords    | \[string] | List of keywords describing the STAC entity.                                                                                                                  |

## Date and Time

- [JSON Schema](json-schema/datetime.json)

Fields to provide additional temporal information such as ranges with a start and an end datetime stamp.

| Field Name | Type         | Description                                                                      |
| ---------- | ------------ | -------------------------------------------------------------------------------- |
| datetime   | string\|null | See the [Item Spec Fields](item-spec.md#properties-object) for more information. |
| created    | string       | Creation date and time of the corresponding data (see below), in UTC.            |
| updated    | string       | Date and time the corresponding data (see below) was updated last, in UTC.       |

All timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).

**created** and **updated** have different meaning depending on where they are used.
If those fields are available in a Collection, in a Catalog (both top-level), or in a Item (in the `properties`),
the fields refer the metadata (e.g., when the STAC metadata was created).
Having those fields in the Assets or Links, they refer to the actual data linked to (e.g., when the asset was created).

***NOTE:** There are more date and time related fields available in the
[Timestamps extension](https://github.com/stac-extensions/timestamps)*.

### Date and Time Range

While a STAC Item can have a nominal datetime describing the capture, these properties allow an Item to have a range
of capture dates and times. An example of this is the [MODIS 16 day vegetation index product](https://lpdaac.usgs.gov/products/mod13q1v006/).

**Important:** Using one of the fields REQUIRES inclusion of the other field as well to enable a user to search STAC records by the provided times.
So if you use `start_datetime` you need to add `end_datetime` and vice-versa.
Both fields are also REQUIRED if the `datetime` field is set to `null`.
The datetime property in a STAC Item and these fields are not mutually exclusive.

| Field Name     | Type   | Description                                                                                                                                                                  |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_datetime | string | The first or start date and time for the Item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| end_datetime   | string | The last or end date and time for the Item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).    |

## Licensing

Information about the license(s) of the data, which is not necessarily the same license that applies to the metadata.
**Licensing information should be defined at the [Collection](../collection-spec/collection-spec.md) level if possible.**

- [JSON Schema](json-schema/licensing.json)

| Field Name | Type   | Description                                                                                                                                                                                                          |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| license    | string | Item's license(s), either a SPDX [License identifier](https://spdx.org/licenses/), `various` if multiple licenses apply or `proprietary` for all other cases. Should be defined at the Collection level if possible. |

**license**: Data license(s) as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use
`proprietary` (see below) if the license is not on the SPDX license list or `various` if multiple licenses apply.
In all cases links to the license texts SHOULD be added, see the [`license` link relation type](#relation-types).
If no link to a license is included and the `license` field is set to `proprietary`, the Collection is private,
and consumers have not been granted any explicit right to use the data.

### Relation types

| Type    | Description                                                                                                                                                                                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| license | The license URL(s) for the Item SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file. |

## Provider

Information about the organizations capturing, producing, processing, hosting or publishing this data.
**Provider information should be defined at the Collection level if possible.**

- [JSON Schema](json-schema/provider.json)

| Field Name | Type                                  | Description                                                                                                                                                                                                                            |
| ---------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| providers  | [[Provider Object](#provider-object)] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |

### Provider Object

The object provides information about a provider.
A provider is any of the organizations that captures or processes the content of the assets and
therefore influences the data offered by the STAC implementation.
May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                                                                                                                                                                                                                            |
| ----------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | string    | **REQUIRED.** The name of the organization or the individual.                                                                                                                                                                                                          |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | \[string] | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`.                                                                                                                                                                                           |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information.                                                                                                                                                                                |

#### roles

The provider's role(s) can be one or more of the following elements:

- *licensor*: The organization that is licensing the dataset under the license specified in the Collection's `license` field.
- *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
- *processor*: A processor is any provider who processed data to a derived product.
- *host*: The host is the actual provider offering the data on their storage.
  There should be no more than one host, specified as the last element of the provider list.

## Instrument

Adds metadata specifying a platform and instrument used in a data collection mission. These fields will often be combined
with domain-specific extensions that describe the actual data, such as the `eo` or `sar` extensions.

- [JSON Schema](json-schema/instrument.json)

| Field Name    | Type      | Description                                                                  |
| ------------- | --------- | ---------------------------------------------------------------------------- |
| platform      | string    | Unique name of the specific platform to which the instrument is attached.    |
| instruments   | \[string] | Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1).      |
| constellation | string    | Name of the constellation to which the platform belongs.                     |
| mission       | string    | Name of the mission for which data is collected.                             |
| gsd           | number    | Ground Sample Distance at the sensor, in meters (m), must be greater than 0. |

### Additional Field Information

#### platform

The unique name of the specific platform the instrument is attached to. For satellites this would
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS,
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02`
(Maxar/DigitalGlobe WorldView-2).

#### instruments

An array of all the sensors used in the creation of the data. For example, data from the Landsat-8
platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed together so would be
specified as `['oli', 'tirs']`. Other instrument examples include `msi` (Sentinel-2), `aster` (Terra), and `modis`
(Terra and Aqua), `c-sar` (Sentinel-1) and `asar` (Envisat).

#### constellation

The name of a logical collection of one or more platforms that have similar payloads and have
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and
radiometric characteristics. This field allows users to search for related data sets without the need to specify which
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8`
(Landsat-8, a constellation consisting of a single platform), `sentinel-2`
([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)),
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not
part of a constellation, but these are combined to form the logical collection referred to as MODIS.

#### mission

The name of the mission or campaign for collecting data. This could be a discrete set of data collections
over a period of time (such as collecting drone imagery), or could be a set of tasks of related tasks from a satellite
data collection.

#### gsd

The nominal Ground Sample Distance for the data, as measured in meters on the ground. There are many
definitions of GSD. The value of this field should be related to the spatial resolution at the sensor, rather
than the pixel size of images after orthorectification, pansharpening, or scaling.
The GSD of a sensor can vary depending on geometry (off-nadir / grazing angle) and wavelength, so it is at the
discretion of the implementer to decide which value most accurately represents the GSD. For example, Landsat8
optical and short-wave IR bands are all 30 meters, but the panchromatic band is 15 meters. The
`gsd` should be 30 meters in this case because that is the nominal spatial resolution at the sensor. The Planet
PlanetScope Ortho Tile Product has an `gsd` of 3.7 (or 4 if rounding), even though the pixel size of the images is 3.125.
For example, one might choose for WorldView-2 the Multispectral 20° off-nadir value of 2.07
and for WorldView-3 the Multispectral 20° off-nadir value of 1.38.

## Bands

| Field Name | Type                           | Description                                                                     |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------- |
| bands      | \[[Band Object](#band-object)] | An array of available bands where each object is a [Band Object](#band-object). |

The `bands` array is used to describe the available bands in a STAC entity or Asset.
This fields describes the general construct of a band or layer, which doesn't necessarily need to be a spectral band.
By adding fields from extensions you can indicate that a band, for example, is
- a spectral band ([EO extension](https://github.com/stac-extensions/eo)),
- a band with classification results ([classification extension](https://github.com/stac-extensions/classification)),
- a band with quality information such as cloud cover probabilities, 
- etc.

Each Asset should specify its own Band Object.
If the individual bands are repeated in different assets they should all use the same values and 
include the optional `name` field to enable clients to easily combine and summarize the bands.

**Note:** This property is the successor of the `eo:bands` and `raster:bands` fields, which has been present in previous versions of these extensions.
The behavior is very similar and they can be migrated easily. Usually, you can simply merge the each object on a by-index basis.
For some fields you need to add the extension prefix of the `eo` or `raster` extension to the property name though. Example:

Before:
```json
{
	"eo:bands": [{
		"name": "B4",
		"description": "Red band",
		"common_name": "red",
		"center_wavelength": 0.665,
		"full_width_half_max": 0.038
	}],
	"raster:bands": [{
		"data_type": "float32",
		"nodata": "nan",
		"statistics": {"minimum": 0, "maximum": 1},
		"spatial_resolution": 10
	}]
}
```

After:
```json
{
	"bands": [{
		"name": "B4",
		"description": "Red band",
		"data_type": "float32",
		"nodata": "nan",
		"statistics": {"minimum": 0, "maximum": 1},
		"eo:common_name": "red",
		"eo:center_wavelength": 0.665,
		"eo:full_width_half_max": 0.038,
		"raster:spatial_resolution": 10
	}]
}
```

### Band Object

Specifically defined for the Band Object is just a single property `name`, which serves as a unique identifier.
You can add additional fields from the common metadata such as a [`description`](#basics) or the [value-related](#data-values) properties.

| Field Name  | Type   | Description                                                                                                                                                                                     |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | string | The name of the band (e.g., "B01", "B8", "band2", "red"), which should be unique across all bands defined in the list of bands. This is typically the name the data provider uses for the band. |
| description | string | Description to fully explain the band. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation.                                                               |

A Band Object must contain at least one property, which is not necessarily one of the properties
defined here and can be a property from an extension or common metadata.

## Data Values

Adds metadata about the data values or measurement values contained in the entity that is described by
the object these fields get added to (e.g., an asset or a band).
These fields will often be combined with extensions that group data values into a "unit" or "chunk", e.g.,
a band or layer in a file (`raster` and `eo` extensions),
a column in a table (`table` extension),
or dimensions in a datacube (`datacube` extension).

| Field Name | Type                                    | Description                                                                                                                                    |
| ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| nodata     | number\|string                          | Values used to identify values that are nodata, either by the value as a number or as one of the following strings: `nan`, `inf` or `-inf`.    |
| data_type  | string                                  | The data type of the values. One of the [data types as described below](#data-types).                                                          |
| statistics | [Statistics Object](#statistics-object) | Statistics of all the values.                                                                                                                  |
| unit       | string                                  | Unit of measurement of the value, preferably compliant to [UDUNITS-2](https://ncics.org/portfolio/other-resources/udunits2/) units (singular). |

### Statistics Object

| Field Name    | Type    | Description                                                                                                                            |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| minimum       | number  | minimum value of the values in the band. If not present, the minimum value of the given data type or negative infinity can be assumed. |
| maximum       | number  | maximum value of the values in the band. If not present, the maximum value of the given data type or positive infinity can be assumed. |
| mean          | number  | mean value of all the values in the band                                                                                               |
| stddev        | number  | standard deviation value of the values in the band                                                                                     |
| count         | integer | Total number of all data values (>= 0)                                                                                                 |
| valid_percent | number  | Percentage of valid (not `nodata`) values (0-100)                                                                                      |

### Data Types

The data type gives information about the values.
This can be used to indicate the (maximum) range of numerical values expected.
For example `uint8` indicates that the numbers are in a range between 0 and 255,
they can never be smaller or larger. This can help to pick the optimal numerical
data type when reading the files to keep memory consumption low.
Nevertheless, it doesn't necessarily mean that the expected values fill the whole range.
For example, there can be use cases for `uint8` that just use the numbers 0 to 10 for example.
Through the [Statistics Object](#statistics-object) it is possible to specify an exact value range so
that visualizations can be optimized.
The allowed values for `data_type` are:

- `int8`: 8-bit integer
- `int16`: 16-bit integer
- `int32`: 32-bit integer
- `int64`: 64-bit integer
- `uint8`: unsigned 8-bit integer (common for 8-bit RGB PNG's)
- `uint16`: unsigned 16-bit integer
- `uint32`: unsigned 32-bit integer
- `uint64`: unsigned 64-bit integer
- `float16`: 16-bit float
- `float32`: 32-bit float
- `float64`: 64-big float
- `cint16`: 16-bit complex integer
- `cint32`: 32-bit complex integer
- `cfloat32`: 32-bit complex float
- `cfloat64`: 64-bit complex float
- `other`: Other data type than the ones listed above (e.g. boolean, string, higher precision numbers)
