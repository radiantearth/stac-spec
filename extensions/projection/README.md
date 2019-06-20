# Projection Extension Specification (`proj`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Projection (`proj`) Extension to a STAC Item. Here `proj` is short
for "projection", and not a reference to the use of the PROJ format for the CRS attribute.

The field names defined herein should be added as fields in the Item's Properties object. 

When specified on an Item, the values are assumed to apply to all Assets in that Item.  For example, an Item may have several related Assets each representing a band for the Item, all of which are in the same native CRS, e.g., a UTM Zone.  However, there may also be assets intended for display, like a preview image or thumbnail, that have been reprojected to a different CRS, e.g., Web Mercator, to better accommodate that use case.  This case of differing projections per Asset is not currently handled by this extension.

## Item Properties fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| proj:epsg        | integer\|null  | **Required** [EPSG code](http://www.epsg-registry.org/) of the datasource |
| proj:crs         | string \|null  | Recommended. PROJ string representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:geometry    | Polygon Object | Recommended. Defines the footprint of this item. |
| proj:bbox        | [number]       | Recommended. Bounding box of the item in the native CRS |
| proj:centroid    | [number]       | Recommended. Coordinates representing the centroid of the item in the native CRS |

**proj:epsg** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data, and can usually be referenced using an [EPSG code](http://epsg.io).
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:epsg should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code.

**proj:crs** - A Coordinate Reference System (CRS) is the native reference system (sometimes called a
'projection') used by the data. This value is a PROJ string.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:crs should be set to null. It should also be set to null if a CRS exists, but for which
a PROJ string does not exist.

**proj:geometry** - A Polygon object representing the footprint of this item, formatted according the Polygon object format specified in [RFC 7946, sections 3.1.6](https://tools.ietf.org/html/rfc7946), except not necessarily in EPSG:4326 as required by RFC7946.  Specified based on the `proj:crs` field (not necessarily EPSG:4326). Ideally, this will be represented by a Polygon with five coordinates, as the item in the native CRS should be a square aligned to the CRS grid.  It is recommended that either or both of `proj:geometry` and `proj:bbox` be defined.

**proj:bbox** - Bounding box of the asset represented by this item in the native CRS. Specified as four coordinates based on the CRS defined in the `proj:epsg` and `proj:crs` fields.  First two numbers are coordinates of the lower left corner, followed by coordinates of upper right corner, e.g., \[west, south, east, north], \[xmin, ymin, xmax, ymax], \[left, down, right, up]. It is recommended that either or both of `proj:geometry` and `proj:bbox` be defined.

**proj:centroid** - Coordinates representing the centroid of the item in the native coordinate system.  Coordinates defined as \[lat,lon], even if the native coordinate system does not use lat/long.

## Examples

```
{
  "id": "LC81530252014153LGN00",
  "type": "Feature",
  ...
  "properties": {
    "proj:epsg": 32614,
    "proj:crs": "+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs ",
    "proj:geometry": {
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
    "proj:bbox": [ 169200.0, 3712800.0, 403200.0, 3951000.0 ],
    "proj:centroid": [ 34.595302781575604, -101.34448382627504 ]
  },
  "assets" :{
    "B1": {
      "href": "http://example.com/L8/153/025/LC81530252014153LGN00/LC81530252014153LGN00_B1.TIF",
      "type": "image/vnd.stac.geotiff",
      "eo:bands": [0]
    },
    "thumbnail": {
      "href": "http://example.com/L8/153/025/LC81530252014153LGN00/LC81530252014153LGN00_thumbnail.jpg",
      "type": "image/jpeg",
        "proj:crs": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs ",
        "proj:epsg": 3857,
        "proj:geometry": {
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
        "proj:bbox": [ 169200.0, 3712800.0 403200.0, 3951000.0 ],
        "proj:centroid": [ 34.595302781575604, -101.34448382627504 ],
    },
    ...
  }
 }
```
