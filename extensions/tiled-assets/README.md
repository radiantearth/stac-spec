# Tiled Assets specification

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

An extension to allow the specification of tiled assets within STAC Items. With this extension it is possible to allow the description of assets using template references and rules to construct those. This extension is tailored for cases where there are too many assets associated with an Item to be practically listed in the `assets` property. For this reason, the new `assetTemplates` property allows to specify template URLs where components can be replaced to get the final URLs to the actual files.


This extension is modelled closely after the definitions from the [OGC Two Dimensional Tile Matrix Set](http://docs.opengeospatial.org/is/17-083r2/17-083r2.html)

- Examples: [Tiled](examples/example-tiled.json), [Dimension](examples/example-dimension.json)
- [JSON Schema](json-schema/schema.json)

## Item properties

| Field Name        | Type                                                                                   | Description                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| tl:tileMatrixSet  | [[TileMatrixSet Object](#tile-matrix-set-object)]                                      | An array of available tile matrix sets                                                                          |
| tl:dimensions     | Map<string, [Discrete Dimension Object](#discrete-dimension-object)\|[number\|string]> | Additional dimensions. The keys of this object can be used to replace the template parameters of the same name. |

**tl:dimension:** The possible values of this dimension can be expressed as either a finite list of values (using an array of values) or as a discrete dimension using the [Discrete Dimension Object](#discrete-dimension-object).

### Tile Matrix Set Object

The description of the tile pyramid.

| Field Name        | Type                                               | Description                                                                                                                  |
| ----------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| type              | string                                             | **REQUIRED.** Type of the Tile Matrix Set. Fixed to `TileMatrixSetType`                                                      |
| title             | string                                             | Title of this tile matrix set, normally used for display to a human                                                          |
| abstract          | string                                             | Brief narrative description of this tile matrix set, normally available for display to a human                               |
| keywords          | [string]                                           | Unordered list of one or more commonly used or formalized word(s) or phrase(s) used to describe this dataset                 |
| identifier        | string                                             | **REQUIRED.** Tile matrix set identifier. This can be used as the `{TileMatrixSet}` template parameter.                      |
| boundingBox       | [BoundingBox Object](#bounding-box-object)         | Minimum bounding rectangle surrounding the tile matrix set, in the supported CRS                                             |
| supportedCRS      | string                                             | **REQUIRED.** Reference to one coordinate reference system (CRS)                                                             |
| wellKnownScaleSet | string                                             | Reference to a well-known scale set.                                                                                         |
| tileMatrix        | [[Tile Matrix Object](#tile-matrix-object)]        | **REQUIRED.** An array of tile matrix objects, describing the tile matrices of the resolution layers of the tile matrix set. |
| pixelBuffer       | [Pixel Buffer Object](#pixel-buffer-object)        | An optional default pixel buffer description object. By default, no pixel buffers are used.                                  |

### Bounding Box Object

| Field Name  | Type     | Description                                                        |
| ----------- | -------- | ------------------------------------------------------------------ |
| type        | string   | **REQUIRED.** Type of the Bounding Box. Fixed to `BoundingBoxType` |
| lowerCorner | [number] | **REQUIRED.** The lower corner of this bounding box.               |
| upperCorner | [number] | **REQUIRED.** The upper corner of this bounding box.               |

### Tile Matrix Object

The description of a single tile matrix (zoom level) of the tile pyramid.

| Field Name          | Type                                                          | Description                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                | string                                                        | **REQUIRED.** Type of the Tile Matrix. Fixed to `TileMatrixType`                                                                                                  |
| title               | string                                                        | Title of this tile matrix set, normally used for display to a human                                                                                               |
| abstract            | string                                                        | Brief narrative description of this tile matrix, normally available for display to a human                                                                        |
| keywords            | [string]                                                      | Unordered list of one or more commonly used or formalized word(s) or phrase(s) used to describe this dataset                                                      |
| identifier          | string                                                        | **REQUIRED.** Tile matrix identifier. This identifier can be used in templates to replace `{TileMatrix}` parameters.                                              |
| scaleDenominator    | number                                                        | **REQUIRED.** Scale denominator level of this tile matrix.                                                                                                        |
| topLeftCorner       | [number]                                                      | **REQUIRED.** Position in CRS coordinates of the top-left corner of this tile matrix.                                                                             |
| tileWidth           | number                                                        | **REQUIRED.** Width of each tile of this tile matrix in pixels. Pixel buffers are not reflected in this number.                                                   |
| tileHeight          | number                                                        | **REQUIRED.** Height of each tile of this tile matrix in pixels. Pixel buffers are not reflected in this number.                                                  |
| matrixWidth         | number                                                        | **REQUIRED.** The number of columns in this tile matrix. Any number between zero and `matrixWidth - 1` can be used to replace the `{TileCol}` template parameter. |
| matrixHeight        | number                                                        | **REQUIRED.** The number of rows in this tile matrix. Any number between zero and `matrixHeight - 1` can be used to replace the `{TileRow}` template parameter.   |
| variableMatrixWidth | [Variable Matrix Width Object](#variable-matrix-width-object) | Describes the rows that has variable matix width                                                                                                                  |
| pixelBuffer         | [Pixel Buffer Object](#pixel-buffer-object)                   | An optional default pixel buffer description object, overriding the default of the pyramid. By default, no pixel buffers are used.                                |

### Variable Matrix Width Object

List of data structures defining the tiles rows that was variable width

| Field Name  | Type     | Description                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| type        | string   | **REQUIRED.** Type of the Variable Matrix Width. Fixed to `VariableMatrixWidthType` |
| coalesce    | number   | **REQUIRED.** Coalescence factor                                                    |
| minTileRow  | number   | **REQUIRED.** Minimum tile row index valid for this layer                           |
| maxTileRow  | number   | **REQUIRED.** Maximum tile row index valid for this layer                           |

### Pixel Buffer Object

The pixel buffer definition.

| Field Name    | Type    | Description                                                                                                      |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| top           | number  | The size of the pixel-buffer in the top border of the image. Default is `0`.                                     |
| left          | number  | The size of the pixel-buffer in the left border of the image. Default is `0`.                                    |
| bottom        | number  | The size of the pixel-buffer in the bottom border of the image. Default is `0`.                                  |
| right         | number  | The size of the pixel-buffer in the right border of the image. Default is `0`.                                   |
| borderTop     | boolean | Whether or not the pixelbuffer is included images on the top border of the first tile row. Default is `true`.    |
| borderLeft    | boolean | Whether or not the pixelbuffer is included images on the left border of the first tile column. Default is `true`. |
| borderBottom  | boolean | Whether or not the pixelbuffer is included images on the bottom border of the last tile row. Default is `true`.  |
| borderRight   | boolean | Whether or not the pixelbuffer is included images on the right border of the last tile column. Default is `true`.   |

### Discrete Dimension Object

An additional discrete dimension of that tile pyramid. The possible values of that dimension are passed as a ruleset for discrete values.

| Field Name    | Type             | Description                                                                                                      |
| ------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| start         | number\|string   | The first possible value of that particular dimension. Either a numeric or an ISO 8601 date or datetime.         |
| stop          | number\|string   | The last possible value of that particular dimension. Either a numeric or an ISO 8601 date or datetime.          |
| steps         | integer          | The number of steps in that dimension, including the `start` and `stop` values as borders.                       |

**steps:** This is meant as a total number of steps. Where the first value is always the `start` and the last step is always the `stop` value.

## Item fields

| Field Name         | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| assetTemplates     | Map<string, [Asset Template Object](#asset-template-object)> | An array of Asset Template objects that denote templated arguments | 

### Asset Template Object

An asset template is an object that contains a link template to data associated with the Item that can be downloaded or streamed. It is allowed to add additional fields.

| Field Name   | Type   | Description                                                                           |
| ------------ | ------ | ------------------------------------------------------------------------------------- |
| hrefTemplate | string | **REQUIRED.** Link template to the asset object. Relative and absolute links are both allowed. All parts of the template within curly braces `{}` are meant to be template items to be replaced |
| title        | string | The displayed title for clients and users.                                            |
| type         | string | [Media type](../README.md#media-types) of the asset.                                  |

The available template parameters are `{TileMatrixSet}`, `{TileMatrix}`, `{TileRow}`, and `{TileCol}`. Also, each dimension enables an additional template parameter of the same name. E.g: if there is a `date` dimension object in the map of dimensions, the `{date}` template parameter should be used.

It is intended, that all extensions targeting the `Asset Object` are also applicable to the `Asset Template Object` when useful. For example the `eo` extension can also be used in conjunction with tiled assets by specifying the `eo:bands` property in the asset template 

## Implementations

None. Still in proposal stage