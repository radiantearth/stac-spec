# Satellite Extension Specification

- **Title: Satellite**
- **Identifier: sat**
- **Field Name Prefix: sat**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Satellite Extension to a STAC Item. Sat adds metadata related to a satellite that carries an instrument for collecting data. It will often be combined with other extensions that describe the actual data, such as the `eo`, `os` or `sar` extensions.

The Satellite extension requires the [Instrument Fields](../../item-spec/common-metadata.md#instrument).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| sat:orbit_state        | string        | The state of the orbit. Either `ascending` or `descending` for polar orbiting satellites, or `geostationary` for geosynchronous satellites |
| sat:relative_orbit     | integer       | The relative orbit number at the time of acquisition. |

*At least one of the fields must be specified.*

**sat:orbit_state** indicates the type and current state of orbit. Satellites are either geosynchronous in which case they have one state: `geostationary`, or they are sun synchronous (i.e., polar orbiting satellites) in which case they are either `ascending` or `descending`. For sun synchronous satellites it is daytime during one of these states, and nighttime during the other.

**sat:relative_orbit** is a count of orbits from 1 to the number of orbits contained in a repeat cycle, where relative orbit 1 starts from a specific reference location of the sub-satellite point (the point on the earth directly below the satellite). It resets to 1 when the sub-satellite point revisits the refernece location.

## Implementations

- No implementations yet

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to sat data.
