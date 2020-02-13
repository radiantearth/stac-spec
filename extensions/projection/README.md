# Projection Extension Specification

- **Title: Projection**
- **Identifier: projection**
- **Field Name Prefix: proj**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Projection (`proj`) Extension to a STAC Item. Here `proj` is short
for "projection", and not a reference to the use of the PROJ/PROJ4 formats.

The field names defined herein should be added as fields in the Item Properties object. 

When specified on an Item, the values are assumed to apply to all Assets in that Item.  For example, an Item may have 
several related Assets each representing a band or layer for the Item, and which typically all use the same CRS, 
e.g. a UTM Zone.  However, there may also be assets intended for display, like a preview image or thumbnail, that have 
been reprojected to a different CRS, e.g., Web Mercator, to better accommodate that use case.  This case of differing 
projections per Asset is not currently handled by this extension.

## Examples
- [Example Landsat8](examples/example-landsat8.json)

## Schema
- [JSON Schema](json-schema/schema.json)

## Item Properties fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| proj:epsg        | integer\|null   | **Required** [EPSG code](http://www.epsg-registry.org/) of the datasource |
| proj:proj4       | string \|null   | PROJ4 string representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:wkt2        | string \|null   | WKT2 string representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:projjson    | [PROJJSON Object](https://proj.org/usage/projjson.html) \|null   | PROJJSON object representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:geometry    | [Polygon Object](https://geojson.org/schema/Polygon.json)  | Defines the footprint of this Item. |
| proj:bbox        | [number]        | Bounding box of the Item in the asset CRS in 2 or 3 dimensions. |
| proj:centroid    | Centroid Object | Coordinates representing the centroid of the Item in the asset CRS |

**proj:epsg** - A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data, and can usually be referenced using an [EPSG code](http://epsg.io).
If the asset data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, `proj:epsg` should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code.

**proj:proj4** - A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data. This value is a PROJ4 string.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, `proj:proj4` should be set to null. It should also be set to null if a CRS exists, but for which
a PROJ4 string does not exist.

**proj:wkt2** - A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data. This value is a WKT2 string.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:wkt2 should be set to null. It should also be set to null if a CRS exists, but for which
a WKT2 string does not exist.

**proj:projjson** - A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data. This value is a [PROJJSON](https://proj.org/usage/projjson.html) object.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:projjson should be set to null. It should also be set to null if a CRS exists, but for which
a PROJJSON string does not exist. The schema for this object can be found [here](https://proj.org/schemas/v0.1/projjson.schema.json).

**proj:geometry** - A Polygon object representing the footprint of this item, formatted according the Polygon 
object format specified in [RFC 7946, sections 3.1.6](https://tools.ietf.org/html/rfc7946), except not necessarily 
in EPSG:4326 as required by RFC7946.  Specified based on the `proj:proj4` field (not necessarily EPSG:4326). 
Ideally, this will be represented by a Polygon with five coordinates, as the item in the asset data CRS should be 
a square aligned to the original CRS grid. 

**proj:bbox** - Bounding box of the assets represented by this item in the asset data CRS. Specified as 4 or 6 
coordinates based on the CRS defined in the `proj:epsg` and `proj:proj4` fields.  First two numbers are coordinates 
of the lower left corner, followed by coordinates of upper right corner, , e.g., \[west, south, east, north], 
\[xmin, ymin, xmax, ymax], \[left, down, right, up], or \[west, south, lowest, east, north, highest]. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum in meters.

**proj:centroid** - Coordinates representing the centroid of the item in the asset data CRS.  Coordinates are 
defined in latitude and longitude, even if the data coordinate system does not use lat/long.

## Centroid Object

This object represents the centroid of an item's geometry.

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| lat                 | number | The latitude of the centroid.  |
| lon                 | number | The longitude of the centroid. |
