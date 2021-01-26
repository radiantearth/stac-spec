# Rendering Hints Extension Specification

- **Title: Rendering Hints**
- **Identifier: rendering-hints**
- **Field Name Prefix: render**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

One of the things many people want to do with data cataloged in STAC is to render it, often doing so directly
from the assets (usually [Cloud Optimized GeoTIFF's](http://cogeo.org)) with dynamic web tile services. To 
perform well these services benefit from a few 'hints' that can help the renderer perform more effectively. 

This document explains the fields of the STAC Rendering Hints (`render`) Extension to a STAC Item. They are meant
to be 'hints' - things that could be discovered by inspecting the data, but provided in STAC to help out tools
that can take advantage of them. It is written with geospatial raster data in mind, but could apply to other data types.

The field names defined herein should be added as fields in the Item Properties object. When specified on an Item, 
the values are assumed to apply to all non-thumbnail Assets in that Item. 

## Examples

- TODO

## Schema

- TODO

## Item Properties fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| render:overview_max_gsd  | number | The maximum Ground Sample Distance represented in an overview. This should be the GSD of the highest level overview, generally of a [Cloud Optimized GeoTIFF](http://cogeo.org), but should work with any format. |
| render:data_type    | string | The data `type` (float, int, complex, etc) to let the renderer apply any needed rescaling up front. The full set of options is listed below. |

**render:overview_max_gsd**: This field helps renderers of understand what zoom levels they can efficiently show. It is 
generally used in conjunction with `gsd` (from [common metadata](https://github.com/radiantearth/stac-spec/blob/master/item-spec/common-metadata.md#instrument)). `overview_max_gsd` enables the calculuation of the 'minimum' zoom level that a renderer
would want to show, and then the maximum zoom level is calculated from the `gsd` - the resolution of the image. The former
is based on the highest level of overview (also known as a [pyramid](https://en.wikipedia.org/wiki/Pyramid_(image_processing)))
contained in the asset. 

<img src="https://user-images.githubusercontent.com/407017/90821250-75ce5280-e2e7-11ea-9008-6c073e083be0.png" alt="image pyramid" width="300">

So in the above image it would be the ground sample distance of 'level 4', which will be a much higher gsd than the image,
as each pixel is greatly down-sampled. Dynamic tile servers (like [titiler](https://github.com/developmentseed/titiler)) will
generally convert the gsd to [zoom 
levels](https://wiki.openstreetmap.org/wiki/Zoom_levels), [Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator_projection) 
or others, which is easily done (example python [to webmercator](https://github.com/cogeotiff/rio-cogeo/blob/b9b57301c2b7a4be560c887176c282e68ca63c27/rio_cogeo/utils.py#L62-L66) or arbitrary [TileMatrixSet](https://github.com/cogeotiff/rio-tiler-crs/blob/834bcf3d39cdc555b3ce930439ab186d00fd5fc5/rio_tiler_crs/cogeo.py#L98-L105))

**render:data_type** - Specifies the data storage `type` of the assets. Can be used at the asset level if the assets are of
different types. This is used to let the renderer know if any type of rescaling is needed up front. The possible values
for the type in STAC are specified in the table below.

| Type Name | Description |
|-----------|-------------|
| `unknown` | Not known   |
| `int8`    | 8-bit integer  |
| `int16`   | 16-bit integer |
| `int32`   | 32-bit integer |
| `uint8`   | unsigned 8-bit integer (common for 8-bit rgb png's) |
| `unit16`  | unsigned 16-bit integer |
| `uint32`  | unsigned 32-bit integer |
| `float32` | 32-bit float |
| `float64` | 64-big float |
| `cint16`  | 16-bit complex integer |
| `cint32`  | 32-bit complex integer |
| `cfloat32` | 32-bit complex float |
| `cfloat64` | 64-bit complex float |
