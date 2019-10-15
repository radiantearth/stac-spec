# Data cube Extension Specification (`cube`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Data cube related metadata, especially to describe their dimensions.

- Examples:
  - [Item](examples/example-item.json)
  - [Collection](example-collection.json)
- [JSON Schema](json-schema/schema.json)

## Item Fields

| Field Name      | Type                                               | Description                                 |
| --------------- | -------------------------------------------------- | ------------------------------------------- |
| cube:dimensions | Map<string, [Dimension Object](#dimension-object)> | Uniquely named dimensions of the data cube. |

### Dimension Object

A *Dimension Object* comes in different flavors, each of them is defined below. The fields define mostly very similar fields, but they differ slightly depending on their use case. All objects share the fields `type` and `description` with the same definition, but `type` may be restricted to certain values. The definition of`axis` is shared between the spatial dimensions, but restricted to certain values, too. `extent`, `values` and `step` share the same definition, but differ in the supported data types (number or string) depending on the type of dimension. Whenever it's useful to specify these fields, the objects add the additional fields `reference_system`, `data_type` and `unit` with very similar definitions across the objects.

### Horizontal Spatial Dimension Object

A spatial dimension in one of the horizontal (x or y) directions.

| Field Name       | Type           | Description                                                  |
| ---------------- | -------------- | ------------------------------------------------------------ |
| type             | string         | **REQUIRED.** Type of the dimension, always `spatial`.       |
| axis             | string         | **REQUIRED.** Axis of the spatial dimension (`x`, `y`).      |
| description      | string         | Detailed multi-line description to explain the dimension. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| extent           | [number]       | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. Open intervals with `null` are not allowed. |
| values           | [number]       | Optionally, a set of all potential values.                   |
| step             | number\|null   | The space between the values. Use `null` for irregularly spaced steps. |
| reference_system | string\|number | The spatial reference system for the data, specified as [EPSG code](http://www.epsg-registry.org/) or [PROJ definition](https://proj4.org/operations/projections/index.html). Defaults to EPSG code 4326. |

### Vertical Spatial Dimension Object

A spatial dimension in vertical (z) direction.

| Field Name       | Type             | Description                                                  |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| type             | string           | **REQUIRED.** Type of the dimension, always `spatial`.       |
| axis             | string           | **REQUIRED.** Axis of the spatial dimension, always `z`.     |
| description      | string           | Detailed multi-line description to explain the dimension. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| data_type        | string           | The data type for the dimension values, e.g. `string`, `boolean`, `number` or `integer`. |
| extent           | [number\|null]   | If the dimension consists of [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values, the extent (lower and upper bounds) of the values as two-dimensional array. Use `null` for open intervals. |
| values           | [number\|string] | A set of all potential values, especially useful for [nominal](https://en.wikipedia.org/wiki/Level_of_measurement#Nominal_level) values. |
| step             | number\|null     | If the dimension consists of [interval](https://en.wikipedia.org/wiki/Level_of_measurement#Interval_scale) values, the space between the values. Use `null` for irregularly spaced steps. |
| unit             | string           | The unit of measurement for the data, preferably the symbols from [SI](https://physics.nist.gov/cuu/Units/units.html) or [UDUNITS](https://ncics.org/portfolio/other-resources/udunits2/). |
| reference_system | string\|number   | The spatial reference system for the data, specified as [EPSG code](http://www.epsg-registry.org/) or [PROJ definition](https://proj4.org/operations/projections/index.html). Defaults to EPSG code 4326. |

An Vertical Spatial Dimension Object MUST specify **at least** a `data_type`, an `extent` or a set of `values`. It is **recommended** to specify `data_type` and either `extent` or `values`.

### Temporal Dimension Object

A temporal dimension based on the ISO 8601 standard. The temporal reference system for the data is expected to be ISO 8601 compliant (Gregorian calendar / UTC). Data not compliant with ISO 8601 can be represented as an *Additional Dimension Object* with `type` set to `temporal`.

| Field Name | Type           | Description                                                  |
| ---------- | -------------- | ------------------------------------------------------------ |
| type       | string         | **REQUIRED.** Type of the dimension, always `temporal`.      |
| description | string        | Detailed multi-line description to explain the dimension. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| extent     | [string\|null] | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. The dates and/or times must be strings compliant to [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). `null` is allowed for open date ranges. |
| values     | [string]       | If the dimension consists of set of specific values they can be listed here. The dates and/or times must be strings compliant to [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). |
| step       | string\|null   | The space between the temporal instances as [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations), e.g. `P1D`. Use `null` for irregularly spaced steps. |

### Additional Dimension Object

An additional dimension that is not `spatial`, but may be `temporal` if the data is not compliant with ISO 8601.

| Field Name       | Type             | Description                                                  |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| type             | string           | **REQUIRED.** Custom type of the dimension, never `spatial`. |
| description      | string           | Detailed multi-line description to explain the dimension. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| data_type        | string           | The data type for the dimension values, e.g. `string`, `boolean`, `number` or `integer`. |
| extent           | [number\|null]   | If the dimension consists of [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values, the extent (lower and upper bounds) of the values as two-dimensional array. Use `null` for open intervals. |
| values           | [number\|string] | A set of all potential values, especially useful for [nominal](https://en.wikipedia.org/wiki/Level_of_measurement#Nominal_level) values. |
| step             | number\|null     | If the dimension consists of [interval](https://en.wikipedia.org/wiki/Level_of_measurement#Interval_scale) values, the space between the values. Use `null` for irregularly spaced steps. |
| unit             | string           | The unit of measurement for the data, preferably the symbols from [SI](https://physics.nist.gov/cuu/Units/units.html) or [UDUNITS](https://ncics.org/portfolio/other-resources/udunits2/). |
| reference_system | string           | The reference system for the data.                           |

An Additional Dimension Object MUST specify **at least** a `data_type`, an `extent` or a set of `values`. It is **recommended** to specify `data_type` and either `extent` or `values`.

## Implementations

openEO has multiple implementations. Some example collections: 
- [Sentinel-2 collection on openEO Google Earth Engine driver](https://earthengine.openeo.org/v0.4/collections/COPERNICUS/S2) (STAC 0.7.0)
- [MODIS ST Drought collection on EURAC WCPS driver](https://openeo.eurac.edu/collections/MODIS_ST_DROUGHT) (STAC 0.7.0)

