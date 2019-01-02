# Point Cloud Extension Specification (`pc`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Point Cloud Extension to a STAC Item,
which allows STAC to more fully describe point cloud datasets. The point clouds can
come from either active or passive sensors, and data is frequently acquired using
tools such as LiDAR or coincidence-matched imagery.

- [Example](example-alaska.json)
- JSON Schema is missing. PRs are welcome.

## Item Fields

| Field Name    | Type                | Description |
| ------------- | ------------------- | ----------- |
| pc:count      | integer             | The number of points in the item. |
| pc:density    | number              | Number of points per square unit area. |
| pc:encoding   | string              | Content encoding or format of the data. |
| pc:schema     | [Schema Object]     | A sequential array of items that define the dimensions and their types. |
| pc:statistics | [Statistics Object] | A sequential array of items mapping to `pc:schema` defines per-channel statistics. |
| pc:type       | string              | Phenomenology type for the point cloud. Valid values include `lidar`, `eopc`, `radar`, `sonar`. |

### Schema Object

A sequential array of items that define the dimensions and their types.

| Field Name | Type    | Description |
| ---------- | ------- | -------------------------- |
| name       | string  | The name of the dimension. |
| size       | integer | |
| type       | string  | |

### Statistics Object

A sequential array of items mapping to `pc:schema` defines per-channel statistics.

| Field Name | Type    | Description |
| ---------- | ------- | ----------- |
| average    | number  | The average of the channel. |
| count      | integer | The number of elements in the channel. |
| maximum    | number  | The maximum value of the channel. |
| minimum    | number  | The minimum value of the channel. |
| name       | string  | The name of the channel. |
| position   | integer | |
| stddev     | number  | The standard deviation of the channel. |
| variance   | number  | The variance of the channel. |

## Implementations

None yet, still in proposal stage.
