# Datacube Extension Specification (`cube`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Datacube related metadata, especially to describe their dimensions.

- [Example](example.json)
- JSON Schema is missing, PRs are welcome.

## Item Fields

| Field Name      | Type                                                         | Description                                |
| --------------- | ------------------------------------------------------------ | ------------------------------------------ |
| cube:dimensions | Map<string, Dimension Object\|Temporal Dimension Object\|Spatial Dimension Object> | Uniquely named dimensions of the datacube. |

### Dimension Object

| Field Name       | Type                   | Description                                                  |
| ---------------- | ---------------------- | ------------------------------------------------------------ |
| extent           | [number\|string\|null] | Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. |
| unit             | string                 | The unit of measurement for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |
| reference_system | string                 | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). |

### Spatial Dimension Object

| Field Name | Type             | Description                                                  |
| ---------- | ---------------- | ------------------------------------------------------------ |
| extent     | [number\|string] | Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. |
| crs        | string           | The reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/crs/EPSG/0/4326`. |
| number     | integer          | Number of the spatial dimension (1 - 3; 1 = x, 2 = y, 3 = z). |

### Temporal Dimension Object

| Field Name | Type           | Description                                                  |
| ---------- | -------------- | ------------------------------------------------------------ |
| extent     | [string\|null] | Extent of the dimension, i.e. the lower and upper bounds as two-dimensional array. `null` is allowed for open date ranges. |
| trs        | string         | The temporal reference system for the data, specified as [OGC URL](http://www.opengis.net/def/uom/). Defaults to `http://www.opengis.net/def/uom/ISO-8601/0/Gregorian`. |

## Implementations

None yet, still in proposal stage.