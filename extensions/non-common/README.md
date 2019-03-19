# Non-Common Properties Extension Specification (`-`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension lists all properties, which don't have common values across the items. It's the counterpart to the [Commons extension](../commons/), which lists properties with common values across all items.

This extension allows specifying the potential values or extents so that users don't need to walk through STAC Items to find potential values to query for. 

- [Example](example.json)
- [JSON Schema](schema.json)

## Collection fields

| Field Name       | Type                        | Description                                                  |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| other_properties | Map<string, Summary Object> | **REQUIRED.** A map of all properties used in STAC Items which don't have common values across all items. The keys must be the property names and the values are allowed to specify a summary of the values in the items as extents or sets of values. |

### Summary Object

You can optionally summarize the potential values that are available in STAC Items. 

| Field Name | Type                            | Description |
| ---------- | ------------------------------- | ----------- |
| extent     | [string\|number\|null]          | If the dimension consists of [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values, the extent (lower and upper bounds) of the values as two-dimensional array. Strings are only allowed for temporal extents, which are formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use `null` for open intervals. |
| values     | [number\|string\|null\|boolean] | If the property consists of [nominal](https://en.wikipedia.org/wiki/Level_of_measurement#Nominal_level), a set of all potential values can be specified. Only primitive data types allowed. |

## Implementations

None yet, still in proposal stage.
