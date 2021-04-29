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

Various *examples* are available in the folder [`examples`](../examples/).
*JSON Schemas* can be found in the folder [`json-schema`](json-schema/).

By default, these fields are only included and validated against in the core [Item schema](json-schema/item.json).

Implementation of any of the fields is not required, unless explicitly required by a specification using the field.
For example, `datetime` is required in STAC Items.

## Basics

Descriptive fields to give a basic overview of a STAC Item.

- [JSON Schema](json-schema/basics.json)

| Field Name  | Type   | Description                                                  |
| ----------- | ------ | ------------------------------------------------------------ |
| title       | string | A human readable title describing the Item. |
| description | string | Detailed multi-line description to fully explain the Item. [CommonMark 0.29](https://commonmark.org/) syntax MAY be used for rich text representation. |

## Date and Time

- [JSON Schema](json-schema/datetime.json)

Fields to provide additional temporal information such as ranges with a start and an end datetime stamp.

| Field Name | Type         | Description |
| ---------- | ------------ | ----------- |
| datetime   | string\|null | See the [Item Spec Fields](item-spec.md#properties-object) for more information. |
| created    | string       | Creation date and time of the corresponding data (see below), in UTC. |
| updated    | string       | Date and time the corresponding data (see below) was updated last, in UTC. |

All timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).

**created** and **updated** have different meaning depending on where they are used.
If those fields are available in the Item `properties`, they identify the creation and update times of the metadata.
Having those fields in the Item `assets` refers to the creation and update times of the actual data linked to in the Asset Object.

*NOTE: There are more date and time related fields available in the [Timestamps 
extension](https://github.com/stac-extensions/timestamps), which is not an official extension*.

### Date and Time Range

While a STAC Item can have a nominal datetime describing the capture, these properties allow an Item to have a range
of capture dates and times. An example of this is the [MODIS 16 day vegetation index product](https://lpdaac.usgs.gov/products/mod13q1v006/).

**Important:** Using one of the fields REQUIRES inclusion of the other field as well to enable a user to search STAC records by the provided times.
So if you use `start_datetime` you need to add `end_datetime` and vice-versa.
Both fields are also REQUIRED if the `datetime` field is set to `null`.
The datetime property in a STAC Item and these fields are not mutually exclusive.

| Field Name     | Type   | Description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| start_datetime | string | The first or start date and time for the Item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| end_datetime   | string | The last or end date and time for the Item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

## Licensing

Information about the license(s) of the data, which is not necessarily the same license that applies to the metadata.
**Licensing information should be defined at the [Collection](../collection-spec/collection-spec.md) level if possible.**

- [JSON Schema](json-schema/licensing.json)

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| license    | string | Item's license(s), either a SPDX [License identifier](https://spdx.org/licenses/), `various` if multiple licenses apply or `proprietary` for all other cases. Should be defined at the Collection level if possible. |

**license**: Data license(s) as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use
`proprietary` (see below) if the license is not on the SPDX license list or `various` if multiple licenses apply.
In all cases links to the license texts SHOULD be added, see the [`license` link relation type](#relation-types).
If no link to a license is included and the `license` field is set to `proprietary`, the Collection is private,
and consumers have not been granted any explicit right to use the data.

### Relation types

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| license      | The license URL(s) for the Item SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file. |

## Provider

Information about the organizations capturing, producing, processing, hosting or publishing this data.
**Provider information should be defined at the Collection level if possible.**

- [JSON Schema](json-schema/provider.json)

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| providers  | [[Provider Object](#provider-object)] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list.  |

### Provider Object

The object provides information about a provider.
A provider is any of the organizations that captures or processes the content of the assets and
therefore influences the data offered by the STAC implementation.
May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | \[string] | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information. |

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

| Field Name    | Type      | Description |
| ------------- | --------- | ----------- |
| platform      | string    | Unique name of the specific platform to which the instrument is attached. |
| instruments   | \[string] | Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1). |
| constellation | string    | Name of the constellation to which the platform belongs. |
| mission       | string    | Name of the mission for which data is collected. |
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
