# STAC Common Metadata

This document outlines commonly used fields in STAC.
They are often used in [STAC Item properties](item-spec.md#properties-object),
but can also be used in other places, e.g. an [Item Asset](item-spec.md#asset-object)
or [Collection Asset](../collection-spec/collection-spec.md#asset-object).

- [STAC Common Metadata](#stac-common-metadata)
  - [Basics](#basics)
  - [Date and Time](#date-and-time)
  - [Licensing](#licensing)
  - [Provider](#provider)
  - [Instrument](#instrument)
    - [Additional Field Information](#additional-field-information)
      - [platform](#platform)
      - [instruments](#instruments)
      - [constellation](#constellation)
      - [mission](#mission)
      - [gsd](#gsd)
  - [Bands](#bands)
  - [Data Values](#data-values)
  - [Relation types](#relation-types)
    - [Hierarchical relations](#hierarchical-relations)
      - [Self relation](#self-relation)
      - [Root and parent relation](#root-and-parent-relation)
      - [Child relation](#child-relation)
      - [Collection and item relation](#collection-and-item-relation)
  - [Link](#link-object)

Various *examples* are available in the folder [`examples`](../examples/).
*JSON Schemas* can be found in the folder [`json-schema`](json-schema/).

Implementation of any of the fields is not required, unless explicitly required by a specification using the field.
For example, `datetime` is required in STAC Items.

## Basics

Descriptive fields to give a basic overview of a STAC entity (e.g. Catalog, Collection, Item, Asset).

- [JSON Schema](json-schema/basics.json)

| Field Name  | Type      | Description                                                                                                                                                   |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title       | string    | A human readable title describing the STAC entity.                                                                                                            |
| description | string    | Detailed multi-line description to fully explain the STAC entity. [CommonMark 0.29](https://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords    | \[string] | List of keywords describing the STAC entity.                                                                                                                  |
| roles       | \[string] | The semantic roles of the entity, e.g. for assets, links, providers, bands, etc.                                                                              |

## Date and Time

- [JSON Schema](json-schema/datetime.json)

Fields to provide additional temporal information such as ranges with a start and an end datetime stamp.

| Field Name | Type         | Description                                                                                |
| ---------- | ------------ | ------------------------------------------------------------------------------------------ |
| datetime   | string\|null | See the [Item Spec Fields](item-spec.md#properties-object) for more information.           |
| created    | string       | Creation date and time of the corresponding STAC entity or Asset (see below), in UTC.      |
| updated    | string       | Date and time the corresponding STAC entity or Asset (see below) was updated last, in UTC. |

All timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).

**created** and **updated** have different meaning depending on where they are used.
If those fields are available in a Collection, in a Catalog (both top-level), or in a Item (in the `properties`),
the fields refer the metadata (e.g., when the STAC metadata was created).
Having those fields in the Assets or Links, they refer to the actual data linked to (e.g., when the asset was created).

***NOTE:** There are more date and time related fields available in the
[Timestamps extension](https://github.com/stac-extensions/timestamps)*.

### Date and Time Range

While a STAC entity (e.g. an Item) can have a nominal datetime describing the capture, these properties allow a STAC entity to have a range
of capture dates and times. An example of this is the [MODIS 16 day vegetation index product](https://lpdaac.usgs.gov/products/mod13q1v006/).

**Important:** Using one of the fields REQUIRES inclusion of the other field as well to enable a user to search STAC records by the provided times.
So if you use `start_datetime` you need to add `end_datetime` and vice-versa.
Both fields are also REQUIRED if the `datetime` field is set to `null`.
The datetime property in a STAC Item and these fields are not mutually exclusive.

| Field Name     | Type   | Description                                                                                                                                                                      |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_datetime | string | The first or start date and time for the resource, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| end_datetime   | string | The last or end date and time for the resource, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).    |

`start_datetime` and `end_datetime` constitute inclusive bounds,
meaning that the range covers the entire time interval between the two timestamps and the timestamps itself.

## Licensing

Information about the license(s) of the data, which is not necessarily the same license that applies to the metadata.
**Licensing information should be defined at the [Collection](../collection-spec/collection-spec.md) level if possible.**

- [JSON Schema](json-schema/licensing.json)

| Field Name | Type   | Description                                                                                         |
| ---------- | ------ | --------------------------------------------------------------------------------------------------- |
| license    | string | License(s) of the data as SPDX License identifier, SPDX License expression, or `other` (see below). |

**license**: License(s) of the data that the STAC entity provides.

The license(s) can be provided as:

1. [SPDX License identifier](https://spdx.org/licenses/)
2. [SPDX License expression](https://spdx.github.io/spdx-spec/v2.3/SPDX-license-expressions/)
3. String with the value `other` if the license is not on the SPDX license list.
   The strings `various` and `proprietary` are **deprecated**.

If the license is **not** an SPDX license identifier, links to the license texts SHOULD be added.
The links MUST use the [`license` link relation type](#relation-types).
If there is no public license URL available,
it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file.
If no link to a license is included and the `license` field is set to `other` (or one of the deprecated values),
the data is private, and consumers have not been granted any explicit right to use it.

### License relation

| Type    | Description                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| license | The license URL(s) for the resource SHOULD be specified if the `license` field is **not** a SPDX license identifier. |

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

Please refer to the [Bands best practices](../best-practices.md#bands) for more details.

> \[!NOTE]
> This property is the successor of the `eo:bands` and `raster:bands` fields, which has been present in previous versions of these extensions.
> The behavior is very similar and they can be migrated easily.
> Usually, you can simply merge the each object on a by-index basis.
> Nevertheless, you should consider deduplicating properties with the same values across all bands to the asset level
> (see the [best practices](../best-practices.md#multiple-bands)).
> For some fields you need to add the extension prefix of the `eo` or `raster` extension to the property name though.
> See the [Band migration best practice](../best-practices.md#band-migration) for details.

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

| Field Name | Type                                    | Description                                            |
| ---------- | --------------------------------------- | ------------------------------------------------------ |
| nodata     | number\|string                          | Value used to identify no-data, see [below](#no-data). |
| data_type  | string                                  | The data type of the values, see [below](#data-types). |
| statistics | [Statistics Object](#statistics-object) | Statistics of all the values.                          |
| unit       | string                                  | Unit of measurement of the value, see [below](#units). |

### No-data

The no-data value must be provided either as:

- a number
- a string:
  - `nan` - [NaN](https://de.wikipedia.org/wiki/NaN) (not a number) as defined in IEEE-754
  - `inf` - Positive Infinity
  - `-inf` - Negative Infinity

### Units

It is STRONGLY RECOMMENDED to provide units in one of the following two formats:

- [UCUM](https://ucum.org/): The unit code that is compliant to the UCUM specification.
- [UDUNITS-2](https://ncics.org/portfolio/other-resources/udunits2/): The unit symbol if available, otherwise the singular unit name.

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

## Relation types

STAC Entities use a variety of `rel` types in the link object,
to describe the exact nature of the link between the STAC object and the entity it is linking to.
It is recommended to use the official
[IANA Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml) where possible.

### Hierarchical relations

The following table lists the STAC-specific `rel` types that are used in the `links` object of a STAC entity
to link with other STAC entities in the same catalog.

| Type       | Description                                                                                                         | Media Type                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| self       | *Absolute* URL to the location that the STAC file can be found online, if available.                                | application/json                                     |
| root       | URL to the root STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)).   | application/json                                     |
| parent     | URL to the parent STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)). | application/json                                     |
| child      | URL to a child STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)).    | application/json                                     |
| collection | URL to the parent Collection. *Absolute* URLs should be used whenever possible.                                     | application/json                                     |
| item       | URL to a STAC Item.                                                                                                 | application/geo+json (preferred) or application/json |

#### `self` relation

The `self` relation is used to link to the STAC entity itself.
This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from.

#### `root` and `parent` relation

The `root` and `parent` relations are used to link to the root and parent STAC entity,
which is either a [Catalog](../catalog-spec/README.md) or a [Collection](../collection-spec/README.md).
Conceptually, STAC entities SHALL have no more than one parent entity.
As such, STAC entities also can have no more than one root entity.
Therefore, there's usually just one link with `root` or `parent` relationship
unless different variations of the same conceptual entity exist (identified by the ID).
Different variations could be:

- a different encoding (see the `type` property), e.g. a HTML version in addition to JSON
- a different language (see the `hreflang` property). e.g. a German version in addition to English

#### `child` relation

The `child` relation is **ONLY** used to link a catalog or collection to a child catalog or collection.

#### `collection` and `item` relation

The `collection` and `item` relations are used to link to the parent collection and a child Item, respectively.
It is RECOMMENDED to link an `item` from a collection and not directly from a catalog.
All Items linked from a Collection MUST refer back to its Collection with the `collection` relation type
The referenced Collection is STRONGLY RECOMMENDED to implement the same STAC version as the Collection.

## Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with the links section, to describe things like the Catalog an Item is in, related Items, parent or
child Items (modeled in different ways, like an 'acquisition' or derived data).

| Field Name | Type                             | Description                                                                                                                                                                    |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| href       | string                           | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. [Trailing slashes are significant.](../best-practices.md#consistent-uris) |
| rel        | string                           | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information.                                            |
| type       | string                           | Media type of the referenced entity.                                                                                                                                           |
| title      | string                           | A human readable title to be used in rendered displays of the link.                                                                                                            |
| method     | string                           | The HTTP method that shall be used for the request to the target resource, in uppercase. `GET` by default                                                                      |
| headers    | Map<string, string \| \[string]> | The HTTP headers to be sent for the request to the target resource.                                                                                                            |
| body       | any                              | The HTTP body to be sent to the target resource.                                                                                                                               |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

### HTTP headers

The field `headers` allows to describe a dictionary of HTTP headers that are required to be sent by the client.
The keys of the dictionary are the header names, and the values are either a single string or an array of strings.
In case of an array, the header is expected to be sent multiple times with the different values.
