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
| extent           | [number\|string\|null] | **REQUIRED.** Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. Use `null` for open intervals. |
| unit             | string                 | The unit of measurement for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |
| reference_system | string                 | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |

### Spatial Dimension Object

| Field Name | Type             | Description |
| ---------- | ---------------- | ----------- |
| type       | string           | **REQUIRED.** Type of the dimension, always `spatial`. |
| extent     | [number\|string] | **REQUIRED.** Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. |
| crs        | string           | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/crs/EPSG/0/4326`. |
| axis       | string           | **REQUIRED.** Axis of the spatial dimension (one of: `x`, `y` or `z`). |

### Temporal Dimension Object

| Field Name | Type           | Description |
| ---------- | -------------- | ----------- |
| type       | string         | **REQUIRED.** Type of the dimension, always `temporal`. |
| extent     | [string\|null] | **REQUIRED.** Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. `null` is allowed for open date ranges. |
| trs        | string         | The temporal reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/uom/ISO-8601/0/Gregorian`. |

## Implementations

None yet, still in proposal stage.