# STAC Common Metadata
This document outlines all commonly used fields for STAC Item properties. These fields are 
included by default in the core [Item schema](json-schema/item.json) but implementation is not required. 

* [Basics](#basics)
* [Date and Time](#date-and-time)
* [Licensing](#licensing)
* [Provider](#provider)
* [Instrument](#instrument)
* [Metadata](#metadata)

Various *examples* are available in the folder [`examples`](examples/).
*JSON Schemas* can be found in the folder [`json-schema`](json-schema/).

## Basics

Descriptive fields to give a basic overview of a STAC Item.

- [JSON Schema](json-schema/basics.json)

| Field Name  | Type   | Description                                                  |
| ----------- | ------ | ------------------------------------------------------------ |
| title       | string | A human readable title describing the Item. |
| description | string | Detailed multi-line description to fully explain the Item. [CommonMark 0.29](https://commonmark.org/) syntax MAY be used for rich text representation. |

## Date and Time

Fields to provide additional temporal information such as ranges with a start and an end datetime stamp.

### Date and Time Range

- [JSON Schema](json-schema/datetimerange.json)

While a STAC item can have a nominal datetime describing the capture, these properties allow an item to have a range
of capture datetimes. An example of this is the [MODIS 16 day vegetation index product.](https://lpdaac.usgs.gov/products/mod13q1v006/).
The datetime property in a STAC item and these fields are not mutually exclusive.

**Important:** Using one of the fields REQUIRES to include the other field as well to enable a user to search STAC records by the provided times. So if you use `start_datetime` you need to add `end_datetime` and vice-versa.

| Field Name     | Type   | Description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| start_datetime | string | The first or start date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| end_datetime   | string | The last or end date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

## Licensing

Information about the license(s) of the data, which is not necessarily the same license that applies to the metadata.
**Licensing information should be defined at the Collection level if possible.**

- [JSON Schema](json-schema/licensing.json)

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| license    | string | Item's license(s), either a SPDX [License identifier](https://spdx.org/licenses/), `various` if multiple licenses apply or `proprietary` for all other cases. Should be defined at the Collection level if possible. |

**license**: Data license(s) as a SPDX [License identifier](https://spdx.org/licenses/). Alternatively, use
`proprietary` (see below) if the license is not on the SPDX license list or `various` if multiple licenses apply.
In all cases links to the license texts SHOULD be added, see the [`license` link relation type](#relation-types).
If no link to a license is included and the `license` field is set to `proprietary`, the collection is private,
and consumers have not been granted any explicit right to use the data.

### Relation types

| Type         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| license      | The license URL(s) for the item SHOULD be specified if the `license` field is set to `proprietary` or `various`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file. |

## Provider

Information about the organizations capturing, producing, processing, hosting or publishing this data.
**Provider information should be defined at the Collection level if possible.**

- [JSON Schema](json-schema/provider.json)

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| providers  | [[Provider Object](#provider-object)] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list.  |

### Provider Object

The object provides information about a provider. A provider is any of the organizations that captures or processes the content of the assets and therefore influences the data offered by the STAC catalog. May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | \[string] | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information. |

**roles**: The provider's role(s) can be one or more of the following elements:

* *licensor*: The organization that is licensing the dataset under the license specified in the collection's `license` field.
* *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
* *processor*: A processor is any provider who processed data to a derived product.
* *host*: The host is the actual provider offering the data on their storage. There should be no more than one host, specified as last element of the list.

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

**platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include 
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS, 
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02` 
(Maxar/DigitalGlobe WorldView-2).

**instruments** is an array of all the sensors used in the creation of the data. For example, data from the Landsat-8
platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed together so would be
specified as `['oli', 'tirs']`. Other instrument examples include `msi` (Sentinel-2), `aster` (Terra), and `modis`
(Terra and Aqua), `c-sar` (Sentinel-1) and `asar` (Envisat).

**constellation** is the name of a logical collection of one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without the need to specify which 
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8` 
(Landsat-8, a constellation consisting of a single platform), `sentinel-2`
([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)), 
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of 
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not 
part of a constellation, but these are combined to form the logical collection referred to as MODIS.

**mission** is the name of the mission or campaign for collecting data. This could be a discrete set of data collections
over a period of time (such as collecting drone imagery), or could be a set of tasks of related tasks from a satellite
data collection.

## Metadata

Fields to describe the metadata file itself. These fields do NOT describe the assets.

- [JSON Schema](json-schema/metadata.json)

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| published    | string | Date and time the metadata file was first published. This is NOT the timestamp the asset was created. MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| updated    | string | Date and time the metadata file was updated last. This is NOT the timestamp the asset was updated last. MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
