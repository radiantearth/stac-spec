# Point Cloud Extension Specification

- **Title: Point Cloud**
- **Identifier: pointcloud**
- **Field Name Prefix: pc**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Point Cloud Extension to a STAC Item,
which allows STAC to more fully describe point cloud datasets. The point clouds can
come from either active or passive sensors, and data is frequently acquired using
tools such as LiDAR or coincidence-matched imagery.

- [Example](examples/example-autzen.json)
- JSON Schema is missing. PRs are welcome.

## Item Fields

| Field Name    | Type                              | Description |
| ------------- | --------------------------------- | ----------- |
| pc:count      | integer                           | **REQUIRED.** The number of points in the item. |
| pc:type       | string                            | **REQUIRED.** Phenomenology type for the point cloud. Possible valid values might include `lidar`, `eopc`, `radar`, `sonar`, or `other` |
| pc:encoding   | string                            | **REQUIRED.** Content encoding or format of the data. |
| pc:schemas    | [[Schema Object](#schema-object)] | **REQUIRED.** A sequential array of items that define the dimensions and their types. |
| pc:density    | number                            | Number of points per square unit area. |
| pc:statistics | [[Stats Object](#stats-object)]   | A sequential array of items mapping to `pc:schemas` defines per-channel statistics. |

### Schema Object

A sequential array of items that define the dimensions or channels of
the point cloud, their types, and their sizes (in full bytes).

| Field Name | Type    | Description |
| ---------- | ------- | -------------------------- |
| name       | string  | **REQUIRED.** The name of the dimension. |
| size       | integer | **REQUIRED.** The size of the dimension in bytes. Whole bytes only are supported.|
| type       | string  | **REQUIRED.** Dimension type. Valid values include `floating`, `unsigned`, and `signed`|

### Stats Object

A sequential array of items mapping to `pc:schemas` defines per-channel statistics. All fields
are optional.

| Field Name | Type    | Description |
| ---------- | ------- | ----------- |
| average    | number  | The average of the channel. |
| count      | integer | The number of elements in the channel. |
| maximum    | number  | The maximum value of the channel. |
| minimum    | number  | The minimum value of the channel. |
| name       | string  | The name of the channel. |
| position   | integer | Position of the channel in the schema.|
| stddev     | number  | The standard deviation of the channel. |
| variance   | number  | The variance of the channel. |

## Implementations

None yet, still in proposal stage.
