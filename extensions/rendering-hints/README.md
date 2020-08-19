# Rendering Hints Extension Specification

- **Title: Rendering Hints**
- **Identifier: rendering_hints**
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
| render:max_zoom  | integer | The maximum [zoom level](https://wiki.openstreetmap.org/wiki/Zoom_levels), expressed as an integer, that corresponds with the highest resolution of the data. Specified as [Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator_projection) zoom levels. |
| render:min_zoom  | integer  | The minimum [zoom level](https://wiki.openstreetmap.org/wiki/Zoom_levels), expressed as an integer, that tells renderers where the overviews of the data stop. |
| render:data_type    | string | The data `type` (float, int, complex, etc) to let the renderer apply any needed rescaling up front. The full set of options is listed below. |

**render:max_zoom**: This field informs renderers of the resolution of the data, using 
[Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator_projection) zoom levels (since it is used in the majority
of web tile maps). Some renderers will not use web mercator, but most should be able to use the hint in web mercator 
and translate to the appropriate zoom level. The easiest way to get the zoom levels for data is to use [rio-cogeo](https://pypi.org/project/rio-cogeo/): `[get_zooms()](https://github.com/cogeotiff/rio-cogeo/blob/master/rio_cogeo/utils.py#L69)` in python or using `[rio info](https://github.com/cogeotiff/rio-cogeo/#examples)` on the command line. Should be between
0 and 30. 

**render:min_zoom** - This field informs renderers of the minimum level supported by the data, generally corresponding
to the resolution for which overviews were generated. It works just like max zoom: specified in web mercator and 
rio-cogeo can be used to easily get the value. If not specified then renderers will assume the minimum zoom is 0.

**render:data_type** - Specifies the data storage `type` of the assets. Can be used at the asset level if the assets are of
different types. This is used to let the renderer know if any type of rescaling is needed up front. The possible values
for the type in STAC are specified in the table below.

| Type Name | Description |
|-----------|-------------|
| `unknown` | Not known   |
| `byte`    | An unsigned 8-bit integer (common for 8-bit rgb png's) |
| `int16`   | 16-bit integer |
| `int32`   | 32-bit integer |
| `unit16`  | unsigned 16-bit integer |
| `uint32`  | unsigned 32-bit integer |
| `float32` | 32-bit float |
| `float64` | 64-big float |
| `cint16`  | 16-bit complex integer |
| `cint32`  | 32-bit complex integer |
| `cfloat32` | 32-bit complex float |
| `cfloat64` | 64-bit complex float |
