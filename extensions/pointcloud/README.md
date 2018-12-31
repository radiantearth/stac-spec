# STAC Point Cloud Extension Spec (`pc`)

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

This document explains the fields of the STAC Point Cloud Extension to a STAC Catalog,
which allows STAC to more fully describe point cloud datasets. The point clouds can
come from either active or passive sensors, and data is frequently acquired using
tools such as LiDAR or coincidence-matched imagery.

- [Example](example-alaska.json)
- [JSON Schema](schema.json)

## Item Fields

| Field Name       | Type                 | Description                                                                                                                                                                                                                                  |
| ---------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pc:count | integer | The number of points in the item
| pc:density| float | Number of points per square unit area
| pc:encoding| string | Content encoding or format of the data
| pc:schema| array | A sequential array of items that define the dimensions and their types
| pc:statistics| array | A sequential array of items mapping to `pc:schema` defines per-channel statistics
| pc:type| enumeration | Phenomenology type for the point cloud. Valid values include `lidar`, `eopc`, `radar`, `sonar`




