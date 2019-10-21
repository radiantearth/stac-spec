# Tiled Assets specification

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

An extension to allow the specification of tiled assets within STAC Items. With this extension it is possible to allow the description of assets using template references and rules to construct those. This extension is tailored for cases where there are too many assets associated with an Item to be practically listed in the `assets` property. For this reason, the new `assetTemplates` property allows to specify template URLs where components can be replaced to get the final URLs to the actual files.

- [Example](examples/example.json)
- [JSON Schema](json-schema/schema.json)

## Item properties

| Field Name         | Type                                  | Description                                                  |
| ------------------ | ------------------------------------- | ------------------------------------------------------------ |
| tl:tilePyramid     | [[TilePyramid](#tile-pyramid-object)] | **REQUIRED.** The tile pyramid structure                     | 

### Tile Pyramid Object

The description of the tile pyramid.

| Field Name    | Type                                        | Description                                                                           |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| name          | string                                      | **REQUIRED.** TODO: necessary?     |
| crs           | string                                      | **REQUIRED.** TODO: crs of item?   |
| bbox          | [number]                                    | **REQUIRED.** TODO: bbox of item?  |
| tileMatrixSet | [[TileMatrix](#tile-matrix-object)]         | **REQUIRED.** An array of tile matrix objects, describing the zoom layers of the pyramid. |
| pixelBuffer   | [PixelBuffer](#pixel-buffer-object)         | An optional default pixel buffer description object. By default, no pixel buffers are used. |
| dimensions    | Map<string, [Dimension](#dimension-object)> | Additional dimensions. The keys of this object can be used to replace the template parameters of the same name. |

### Tile Matrix Object

The description of a single tile matrix (zoom level) of the tile pyramid.

| Field Name    | Type                                | Description                                                                                                    |
| ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| identifier    | string                              | **REQUIRED.** The identifier of this tile matrix. This identifier can be used in templates as `{tileMatrix}`.  |
| width         | number                              | **REQUIRED.** The number of columns in this tile matrix. Any number between zero and `width - 1` can be used to replace the `{tileCol}` template parameter. |
| height        | number                              | **REQUIRED.** The number of rows in this tile matrix. Any number between zero and `height - 1` can be used to replace the `{tileRow}` template parameter. |
| tileWidth     | number                              | **REQUIRED.** The pixel width of tiles in this tile matrix. Pixel buffers are not reflected in this number.    |
| tileHeight    | number                              | **REQUIRED.** The pixel height of tiles in this tile matrix. Pixel buffers are not reflected in this number.   |
| pixelBuffer   | [PixelBuffer](#pixel-buffer-object) | An optional default pixel buffer description object, overriding the default of the pyramid. By default, no pixel buffers are used. |

### Pixel Buffer Object

The pixel buffer definition.

| Field Name    | Type    | Description                                                                                                      |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| top           | number  | The size of the pixel-buffer in the top border of the image. Default is `0`.                                     |
| left          | number  | The size of the pixel-buffer in the left border of the image. Default is `0`.                                    |
| bottom        | number  | The size of the pixel-buffer in the bottom border of the image. Default is `0`.                                  |
| right         | number  | The size of the pixel-buffer in the right border of the image. Default is `0`.                                   |
| borderTop     | boolean | Whether or not the pixelbuffer is included images on the top border of the first tile row. Default is `true`.    |
| borderLeft    | boolean | Whether or not the pixelbuffer is included images on the left border of the first tile comun. Default is `true`. |
| borderRight   | boolean | Whether or not the pixelbuffer is included images on the right border of the last tile row. Default is `true`.   |
| borderBottom  | boolean | Whether or not the pixelbuffer is included images on the bottom border of the last tile row. Default is `true`.  |


### Dimension Object

An additional dimension of that tile pyramid. The possible values of that dimension can either be passed as a concrete list of positions, or as a ruleset.

| Field Name    | Type    | Description                                                                                                      |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| positions     | [*]     | The discrete possible values of that dimension.                  |

## Item fields

| Field Name         | Type                               | Description                                                  |
| ------------------ | ---------------------------------- | ------------------------------------------------------------ |
| assetTemplates     | [[AssetTemplate](#asset-template)] | An array of Asset Template objects that denote templated arguments | 

### Asset Template Object

An asset template is an object that contains a link template to data associated with the Item that can be downloaded or streamed. It is allowed to add additional fields.

| Field Name   | Type   | Description                                                                           |
| ------------ | ------ | ------------------------------------------------------------------------------------- |
| hrefTemplate | string | **REQUIRED.** Link template to the asset object. Relative and absolute links are both allowed. All parts of the template within curly braces `{}` are meant to be template items to be replaced |
| title        | string | The displayed title for clients and users.                                            |
| type         | string | [Media type](../README.md#media-types) of the asset.                                  |

## Implementations

None. Still in proposal stage