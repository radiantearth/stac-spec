# Projection Extension Specification

- **Title: Projection**
- **Identifier: projection**
- **Field Name Prefix: proj**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @matthewhanson

This document explains the fields of the STAC Projection (`projection`) Extension to a STAC [Item](../../item-spec/item-spec.md).

The fields defined here may be added to the Item Properties object or an Item Asset object.

When specified in Item Properties, the values are assumed to apply to all Assets in that Item. For example, an Item may have
several related Assets each representing a band or layer for the Item, and which typically all use the same CRS,
e.g., a UTM Zone. However, there may also be Assets intended for display, like a preview image or thumbnail, that have
been reprojected to a different CRS, e.g., Web Mercator, or resized to better accommodate that use case. In this case, the 
fields should be specified at the Item Asset level, while those Item Asset objects that use the defaults can remain unspecified.

## Examples

- [Example Landsat8](../../examples/extensions-collection/proj-example/proj-example.json)

## Schema

- [JSON Schema](json-schema/schema.json)

## Item Asset or Item Properties fields

The `proj` prefix is short for "projection", and is not a reference to the PROJ/PROJ4 formats.

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| proj:epsg        | integer\|null   | **REQUIRED.** [EPSG code](http://www.epsg-registry.org/) of the datasource |
| proj:wkt2        | string\|null    | [WKT2](http://docs.opengeospatial.org/is/12-063r5/12-063r5.html) string representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:projjson    | [PROJJSON Object](https://proj.org/specifications/projjson.html)\|null | PROJJSON object representing the Coordinate Reference System (CRS) that the `proj:geometry` and `proj:bbox` fields represent |
| proj:geometry    | [GeoJSON Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1) | Defines the footprint of this Item. |
| proj:bbox        | \[number]       | Bounding box of the Item in the asset CRS in 2 or 3 dimensions. |
| proj:centroid    | [Centroid Object](#centroid-object) | Coordinates representing the centroid of the Item (in lat/long) |
| proj:shape       | \[integer]      | Number of pixels in Y and X directions for the default grid |
| proj:transform   | \[number]       | The affine transformation coefficients for the default grid  |

### Additional Field Information

#### proj:epsg

A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data, and can usually be referenced using an [EPSG code](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset).
If the asset data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, `proj:epsg` should be set to null. It should also be set to null if a CRS exists, but for which
there is no valid EPSG code. A great tool to help find EPSG codes is [epsg.io](http://epsg.io/).

#### proj:wkt2

A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data. This value is a [WKT2](http://docs.opengeospatial.org/is/12-063r5/12-063r5.html) string.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:wkt2 should be set to null. It should also be set to null if a CRS exists, but for which
a WKT2 string does not exist.

#### proj:projjson

A Coordinate Reference System (CRS) is the data reference system (sometimes called a
'projection') used by the asset data. This value is a [PROJJSON](https://proj.org/specifications/projjson.html) object.
If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control
Points, proj:projjson should be set to null. It should also be set to null if a CRS exists, but for which
a PROJJSON string does not exist. The schema for this object can be found [here](https://proj.org/schemas/v0.2/projjson.schema.json).

#### proj:geometry

A GeoJSON Geometry object as defined in [RFC 7946, sections 3.1](https://tools.ietf.org/html/rfc7946)
representing the footprint of this Item, except not necessarily in EPSG:4326 as required by RFC7946.
Specified based on the `proj:epsg`, `proj:projjson` or `proj:wkt2` fields (not necessarily EPSG:4326).
Usually, this will be represented by a Polygon with five coordinates, as the item in the asset data CRS should be
a square aligned to the original CRS grid.

#### proj:bbox

Bounding box of the assets represented by this Item in the asset data CRS. Specified as 4 or 6
coordinates based on the CRS defined in the `proj:epsg`, `proj:projjson` or `proj:wkt2` fields.  First two numbers are coordinates
of the lower left corner, followed by coordinates of upper right corner, , e.g., \[west, south, east, north],
\[xmin, ymin, xmax, ymax], \[left, down, right, up], or \[west, south, lowest, east, north, highest]. The length of the array must be 2\*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum in meters.

#### proj:centroid

Coordinates representing the centroid of the Item. Coordinates are defined in latitude and longitude, even if 
the data coordinate system does not use lat/long. This is to enable less sophisticated mapping tools to be able to render the 
location of the Item, as some only handle points. Note that the centroid is best calculated in the native CRS and then projected
into lat/long, as some projections can wrap the centroid location.

#### proj:shape

An array of integers that represents the number of pixels in the most common pixel grid used by the Item Asset objects.
The number of pixels should be specified in Y, X order. If the shape is defined in Item Properties, it is used as
the default shape for all assets that don't have an overriding shape. This can be be easily determined with 
[`gdalinfo`](https://gdal.org/programs/gdalinfo.html) (the 'size' result) or [`rio info`](https://rasterio.readthedocs.io/en/latest/cli.html#info)
(the 'shape' field) on the command line.

#### proj:transform

Linear mapping from pixel coordinate space (Pixel, Line) to projection coordinate space (Xp, Yp). It is 
a `3x3` matrix stored as a flat array of 9 elements in row major order. Since the last row is always `0,0,1` it can be omitted, 
in which case only 6 elements are recorded. This mapping can be obtained from 
GDAL([`GetGeoTransform`](https://gdal.org/api/gdaldataset_cpp.html#_CPPv4N11GDALDataset15GetGeoTransformEPd)) or the Rasterio 
([`Transform`](https://rasterio.readthedocs.io/en/stable/api/rasterio.io.html#rasterio.io.BufferedDatasetWriter.transform)). 
To get it on the command line you can use the [Rasterio CLI](https://rasterio.readthedocs.io/en/latest/cli.html) with the 
[info](https://rasterio.readthedocs.io/en/latest/cli.html#info) command: `$ rio info`. 

``` bash
  [Xp]   [a0, a1, a2]   [Pixel]
  [Yp] = [a3, a4, a5] * [Line ]
  [1 ]   [0 ,  0,  1]   [1    ]
```

If the transform is defined in Item Properties, it is used as the default transform for all assets that don't have an overriding transform.

## Centroid Object

This object represents the centroid of the Item Geometry.

| Field Name          | Type   | Description                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| lat                 | number | The latitude of the centroid.  |
| lon                 | number | The longitude of the centroid. |

## Best Practices

There are several projection extension fields with potentially overlapping functionality. This section attempts to 
give an overview of which ones you should consider using. They fit into three general categories:

- **Description of the coordinate reference system:** [EPSG code](#projepsg) is the default, but it is just a reference to known
projection information. [WKT2](#projwkt2) and [PROJJSON](#projprojjson) are two options to fully describe the projection information. 
This is typically done for projections that aren't available or fully described in the [EPSG Registry](https://epsg.org/). 
For example, the MODIS Sinusoidal projection does not have an EPSG code, but can be described using WKT2 or PROJJSON.
- **Description of the native geometry information:** STAC requires the geometry and bounding box, but they are only available
in lat/long (EPSG:4326). But most remote sensing data does not come in that projection, so it is often useful for clients to have 
the geometry information ([geometry](#projgeometry), [bbox](#projbbox), [centroid](#projcentroid)) in the coordinate reference system
of the asset's data, so it doesn't have to reproject (which can be lossy and takes time). 
- **Information to enable cataloging of data without opening assets:** Often it is useful to be able to construct a 'virtual layer',
like GDAL's [VRT](https://gdal.org/drivers/raster/vrt.html) without having to open the actual imagery file. [shape](#projshape) and
[transform](#projtransform) together with the core description of the CRS provide enough information about the size and shape of
the data in the file so that tools don't have to open it.

None of these are necessary for 'search' of data, the main use case of STAC. But all enable more 'cloud native' use of data,
as they describe the metadata needed to stream data for processing and/or display on the web. We do recommend including at least the
EPSG code if it's available, as it's a fairly standard piece of metadata, and [see below](#crs-description-recommendations) for more
information about when to use WKT and PROJJSON. We do recommend including the shape and transform fields if you have cloud
optimized geotiff's or some other cloud native format, to enable online tools to work with the assets more efficiently. This is
especially useful if the data is likely to be mosaiced or otherwise processed together, so that tools don't have to open every 
single file to show or process aggregates of hundreds or thousands. Finally, the descriptions of the native geometry information 
are useful when STAC is the complete metadata for an Item. If other metadata is also included it likely has this information, but
we provide it because some modern systems are just using STAC for their entire metadata description.

### CRS Description Recommendations

WKT2 and PROJJSON are mostly recommended when you have data that is not part of the standard EPSG registry. Providing one of them
supplies the exact information for projection software to do the exact projection transform.
WKT2 and PROJJSON are equivalent to one another - more clients understand WKT2, but PROJJSON fits more nicely in the STAC JSON 
structure, since they are both JSON. For now it's probably best to use both for maximum interoperability, but just using PROJJSON 
is likely ok if you aren't worried about legacy client support. 
