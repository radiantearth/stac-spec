# Data cube Extension Specification (`cube`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Data cube related metadata, especially to describe their dimensions.

- [Example](example.json)
- [JSON Schema](schema.json)

## Item Fields

| Field Name      | Type                                                         | Description |
| --------------- | ------------------------------------------------------------ | ----------- |
| cube:dimensions | Map<string, Dimension Object\|Temporal Dimension Object\|Spatial Dimension Object> | Uniquely named dimensions of the data cube. |

### Dimension Object

| Field Name       | Type                   | Description |
| ---------------- | ---------------------- | ----------- |
| type             | string                 | **REQUIRED.** Custom type of the dimension. |
| values           | [number\|string]       | If the dimension consists of [nominal](https://en.wikipedia.org/wiki/Level_of_measurement#Nominal_level) values, a set of all potential values. |
| extent           | [number\|null]         | If the dimension consists of [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values, the extent (lower and upper bounds) of the values as two-dimensional array. Use `null` for open intervals. |
| step             | number\|null           | If the dimension consists of [interval](https://en.wikipedia.org/wiki/Level_of_measurement#Interval_scale) values, the space between the values. Use `null` for irregularly spaced steps. |
| unit             | string                 | The unit of measurement for the data, specified as [OGC URN](http://www.opengis.net/def/uom/). |
| reference_system | string                 | The reference system for the data, specified as [OGC URN](http://www.opengis.net/def/uom/). |

A Dimension Object MUST specify an `extent` or a set of `values`. It MAY specify both.

### Spatial Dimension Object

This object inherits the fields from the Dimension Object, but restricts or changes the definition of the following fields:

| Field Name       | Type             | Description                                                  |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| type             | string           | **REQUIRED.** Type of the dimension, always `spatial`.       |
| axis             | string           | **REQUIRED.** Axis of the spatial dimension (`x`, `y` or `z`). |
| extent           | [number]         | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. Open intervals with `null` are not allowed. |
| reference_system | string\|number   | The spatial reference system for the data, specified as [EPSG code](http://www.epsg-registry.org/) or [OGC URN](http://www.opengis.net/def/uom/). Defaults to EPSG code 4326. |

### Temporal Dimension Object

This object inherits the fields from the Dimension Object, but restricts or changes the definition of the following fields:

| Field Name       | Type           | Description                                                  |
| ---------------- | -------------- | ------------------------------------------------------------ |
| type             | string         | **REQUIRED.** Type of the dimension, always `temporal`.      |
| extent           | [string\|null] | **REQUIRED.** Extent (lower and upper bounds) of the dimension as two-dimensional array. `null` is allowed for open date ranges. |
| step             | string\|null   | The space between the temporal instances as [ISO8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations), e.g. `P1D`. Use `null` for irregularly spaced steps. |
| reference_system | string         | The temporal reference system for the data, specified as [OGC URN](http://www.opengis.net/def/uom/). Defaults to `urn:ogc:def:uom:iso-8601:0:Gregorian`. |

## Implementations

None yet, still in proposal stage.