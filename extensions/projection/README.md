# Projection Extension Specification (`proj`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Projection (`proj`) Extension to a STAC Item. Here `proj` is short
for "projection", and not a reference to the use of the PROJ format for the CRS attribute.

The field names defined herein should be added as fields in the Item's Properties object. 

When specified on an Item, the values are assumed to apply to all Assets in that Item.  For example, an Item may have several related Assets each representing a band for the Item, all of which are in the same native CRS, e.g., a UTM Zone.  However, there may also be assets intended for display, like a preview image or thumbnail, that have been reprojected to a different CRS, e.g., Web Mercator, to better accommodate that use case.  This case of differing projections per Asset is not currently handled by this extension.

## Item Properties fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| epsg        | integer\|null   | **Required** [EPSG code](http://www.epsg-registry.org/) of the datasource |
| native_crs_proj4         | string \|null   | Recommended. PROJ string representing the Coordinate Reference System (CRS) that the `native_crs_geometry` and `native_crs_bbox` fields represent |
| native_crs_geometry    | Polygon Object  | Recommended. Defines the footprint of this item. |
| native_crs_bbox        | [number]        | Recommended. Bounding box of the item in the native CRS |
| native_crs_centroid    | Centroid Object | Recommended. Coordinates representing the centroid of the item in the native CRS |

**epsg** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data, and can usually be referenced using an [EPSG code](http://epsg.io).
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, `epsg` should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code.

**native_crs_proj4** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data. This value is a PROJ string.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, native_crs_proj4 should be set to null. It should also be set to null if a CRS exists, but for which
a PROJ string does not exist.

**native_crs_geometry** - A Polygon object representing the footprint of this item, formatted according the Polygon object format specified in [RFC 7946, sections 3.1.6](https://tools.ietf.org/html/rfc7946), except not necessarily in EPSG:4326 as required by RFC7946.  Specified based on the `native_crs_proj4` field (not necessarily EPSG:4326). Ideally, this will be represented by a Polygon with five coordinates, as the item in the native CRS should be a square aligned to the CRS grid.  It is recommended that either or both of `native_crs_geometry` and `native_crs_bbox` be defined.

**native_crs_bbox** - Bounding box of the assets represented by this item in the native CRS. Specified as four coordinates based on the CRS defined in the `epsg` and `native_crs_proj4` fields.  First two numbers are coordinates of the lower left corner, followed by coordinates of upper right corner, e.g., \[west, south, east, north], \[xmin, ymin, xmax, ymax], \[left, down, right, up]. It is recommended that either or both of `native_crs_geometry` and `native_crs_bbox` be defined.

**native_crs_centroid** - Coordinates representing the centroid of the item in the native coordinate system.  Coordinates are defined in latitude and longitude, even if the native coordinate system does not use lat/long.

## Centroid Object

This object represents the centroid of an item's geometry.

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| lat                 | number | The latitude of the centroid.  |
| lon                 | number | The longitude of the centroid. |

## Examples

```
{
  "id": "LC81530252014153LGN00",
  "type": "Feature",
  ...
  "properties": {
    "epsg": 32614,
    "native_crs_proj4": "+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs",
    "native_crs_geometry": {
      "coordinates": [
        [
          [
            169200.0,
            3712800.0
          ],
          [
            403200.0,
            3712800.0
          ],
          [
            403200.0,
            3951000.0
          ],
          [
            169200.0,
            3951000.0
          ],
          [
            169200.0,
            3712800.0
          ]
        ]
      ],
      "type": "Polygon"
    },
    "native_crs_bbox": [ 169200.0, 3712800.0, 403200.0, 3951000.0 ],
    "native_crs_centroid": {
        "lat": 34.595302781575604, 
        "lon": -101.34448382627504 
    }
  }
 }
```
