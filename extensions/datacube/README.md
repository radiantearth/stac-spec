# Data cube Extension Specification (`cube`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Data cube related metadata, especially to describe their dimensions.

- [Example](example.json)
- JSON Schema is missing, PRs are welcome.

## Item Fields

| Field Name      | Type                                                         | Description |
| --------------- | ------------------------------------------------------------ | ----------- |
| cube:dimensions | Map<string, Dimension Object\|Temporal Dimension Object\|Spatial Dimension Object> | Uniquely named dimensions of the data cube. |

### Dimension Object

| Field Name       | Type                   | Description |
| ---------------- | ---------------------- | ----------- |
| type             | string                 | **REQUIRED.** Custom type of the dimension. |
| number | integer | Number of the dimension, unique across each dimension type. |
| values           | [number\|string\]      | If the dimension consists of [nominal](https://en.wikipedia.org/wiki/Level_of_measurement#Nominal_level) values, a set of all potential values. |
| extent           | [number\|string\|null] | If the dimension consists of [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values, the extent (lower and upper bounds) of the values as two-dimensional array. Use `null` for open intervals. |
| step             | string\|number\|null   | If the dimension consists of [interval](https://en.wikipedia.org/wiki/Level_of_measurement#Interval_scale) values, the space between the values. Use `null` for irregularly spaced steps. |
| unit             | string                 | The unit of measurement for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |
| reference_system | string                 | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |

A Dimension Object SHOULD specify either an `extent` or a set of `values`.

### Spatial Dimension Object

This object inherits all fields from the Dimension Object, but adds or restricts the following fields:

| Field Name       | Type             | Description                                                  |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| type             | string           | **REQUIRED.** Type of the dimension, always `spatial`.       |
| number           | integer          | **REQUIRED.** Axis of the spatial dimension (1 = x, 2 = y or 3 = z). |
| extent           | [number\|string] | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. Open intervals with `null` are not allowed. |
| reference_system | string           | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/crs/EPSG/0/4326`. |

### Temporal Dimension Object

This object inherits all fields from the Dimension Object, but adds or restricts the following fields:

| Field Name       | Type           | Description                                                  |
| ---------------- | -------------- | ------------------------------------------------------------ |
| type             | string         | **REQUIRED.** Type of the dimension, always `temporal`.      |
| extent           | [string\|null] | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. `null` is allowed for open date ranges. |
| step             | string\|null   | The space between the temporal instances as [ISO8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations), e.g. `P1D`. Use `null` for irregularly spaced steps. |
| reference_system | string         | The temporal reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/uom/ISO-8601/0/Gregorian`. |

## Implementations

None yet, still in proposal stage.