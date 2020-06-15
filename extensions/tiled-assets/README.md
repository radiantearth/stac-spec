# Tiled Assets specification

- **Title: Tiled Assets**
- **Identifier: tiled-assets**
- **Field Name Prefix: tiles**
- **Scope: Item, Catalog, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Some data products are too big to be handled in a single file or a small set of enumerated files and are thus split into tiles. For example, Sentinel-2 datastrips are tiled into overlapping granules, in some cases in even more than one coordinate reference system. Other very big datasets, such as continental or global mosaics can also only be handled in a tiled fashion. Usually, they go one step further and provide multiple layers of resolution to allow a quick inspection of larger areas but also retain the possibility to get to the full resolution data.

When a very large dataset is split into many tiles it is very impractical to list all possible files with the `assets` property.

This extension allows the specification of tiled assets within STAC Items. With this extension it is possible to allow the description of assets using template references and rules to construct those in order to get the tiles the user is interested in. The new `asset_templates` property allows to specify template URLs where components can be replaced to get the final URLs to the actual files.

This extension is modelled in close alignment to the [OGC Two Dimensional Tile Matrix Set](http://docs.opengeospatial.org/is/17-083r2/17-083r2.html). The main access approach and the templating mechanism used is defined in the [OGC WMTS Simple Profile](http://docs.opengeospatial.org/is/13-082r2/13-082r2.html).

- Examples: [Tiled](examples/example-tiled.json), [Dimension](examples/example-dimension.json)
- [JSON Schema](json-schema/schema.json)

## Item, Collection and Catalog properties

| Field Name               | Type                                                                  | Description                                                                                                          |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| tiles:tile_matrix_sets   | Map<string, [TileMatrixSet Object](#tile-matrix-set-object)>          | **REQUIRED for Collections and Catalogs.** A mapping of tile matrix set identifier to a tile matrix set link object. |

### Tile Matrix Set Object

Tile matrix sets can be directly embedded in a collection, catalog or item. Such directly embedded tile matrix set objects must conform to the [OGC Two Dimensional Tile Matrix Set JSON schema](http://schemas.opengis.net/tms/1.0/json/tms-schema.json).

## Item properties

| Field Name                  | Type                                                                  | Description                                                                                                     |
| --------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| tiles:tile_matrix_set_links | Map<string, [TileMatrixSetLink Object](#tile-matrix-set-link-object)> | A mapping of tile matrix set identifier to a tile matrix set link object.                                       |

The keys of the `tiles:tile_matrix_set_links` mapping can be used as a substitution of the `{TileMatrixSet}` template parameters for the `href` field of the [Asset Object](../../item-spec/item-spec.md#asset-object) used as `asset_template`.

### Tile Matrix Set Link Object

This object allows to reference a tile matrix set. This concept is modelled after the [TileMatrixSetLink2D requirement class](http://docs.opengeospatial.org/is/17-083r2/17-083r2.html#18).

| Field Name           | Type                                                          | Description                                                                                                                  |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| url                  | string                                                        | The URL reference to the actual tile matrix definition.                                                                      |
| well_known_scale_set | string                                                        | If the tile matrix set completely aligns with a well known scale set can be referenced.                                      |
| limits               | Map<string, [Tile Matrix Limits](#tile-matrix-limits-object)> | Optional limits for each tile matrix.                                                                                        |
| pixel_buffer         | Map<string, [Pixel Buffer Object](#pixel-buffer-object)>      | An optional pixel buffer description object per tile matrix. By default, no pixel buffers are used.                          |

**url**/**well_known_scale_set**: Either one of these parameters must be present.

**url**: The URL must refer to a valid tile matrix set definition as defined in the Two-dimensional tile matrix set specification in any encoding (JSON, JSON-LD, or XML).
It is also possible, to have the tile matrix set embedded in the items collection, catalog or even in the items file itself using the `tiles:tile_matrix_sets` property. When refering to an embedded tile matrix set definition, the name of the map key of that tile matrix set definition must be used as a URL fragment.

Example reference to an external tile matrix definition:

```js
"url": "http://schemas.opengis.net/tms/1.0/json/examples/WebMercatorQuad.json"
```

Example reference to an embedded definition in a collection:

```js
"url": "https://example.com/collections/stac.json#WebMercatorQuad"
```

Example reference to an embedded definition in the same item:

```js
"url": "#WebMercatorQuad"
```

**limits**: The keys of the map are the identifiers of the tile matrices in their respective tile matrix set. When present, only the referenced tile matrices are used
for the assets. When the `limits` are not present, the tile matrix set in full is referenced.

**pixel_buffer**: For each tile matrix in a tile matrix set, a pixel buffer can be specified. Similarly to the `limits` property, the key of the mapping must be the identifier of one tile matrix.

### Tile Matrix Limits Object

This object allows to specify subset region of the source tileset. This concept is modelled after the [TileMatrixSetLimits2D requirement class](http://docs.opengeospatial.org/is/17-083r2/17-083r2.html#17).

| Field Name    | Type    | Description                                                                                                           |
| ------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| min_tile_row  | number  | Minimum tile row index valid for this layer. If not specified it uses the the one from the referenced tile matrix.    |
| max_tile_row  | number  | Maximum tile row index valid for this layer. If not specified it uses the the one from the referenced tile matrix.    |
| min_tile_col  | number  | Minimum tile column index valid for this layer. If not specified it uses the the one from the referenced tile matrix. |
| max_tile_col  | number  | Maximum tile column index valid for this layer. If not specified it uses the the one from the referenced tile matrix. |

### Pixel Buffer Object

Pixel buffer objects allow the definition of image boundarys, so that the internal tiles may overlap. When using this information, the clients may be able to reduce the number of requests.

| Field Name    | Type    | Description                                                                                                        |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| top           | number  | The size of the pixel-buffer in the top border of the image. Default is `0`.                                       |
| left          | number  | The size of the pixel-buffer in the left border of the image. Default is `0`.                                      |
| bottom        | number  | The size of the pixel-buffer in the bottom border of the image. Default is `0`.                                    |
| right         | number  | The size of the pixel-buffer in the right border of the image. Default is `0`.                                     |
| border_top    | boolean | Whether or not the pixel-buffer is included images on the top border of the first tile row. Default is `true`.     |
| border_left   | boolean | Whether or not the pixel-buffer is included images on the left border of the first tile column. Default is `true`. |
| border_bottom | boolean | Whether or not the pixel-buffer is included images on the bottom border of the last tile row. Default is `true`.   |
| border_right  | boolean | Whether or not the pixel-buffer is included images on the right border of the last tile column. Default is `true`. |

## Item fields

| Field Name          | Type                                                                   | Description                                                                                   |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| asset_templates     | Map<string, [Asset Object](../../item-spec/item-spec.md#asset-object)> | **REQUIRED.** An map key to Asset objects that use template parameters for later substitution |

**asset_templates**: The `href` field can make use of template parameters that can be replaced with values to generate references to actual files. The available template parameters are `{TileMatrixSet}`, `{TileMatrix}`, `{TileRow}`, and `{TileCol}`. The templating mechanism is detailed in the [OGC WMTS Simple Profile](http://docs.opengeospatial.org/is/13-082r2/13-082r2.html#17). Additional template substitution parameters may be present, see the next section for more details.
Also: it is not mandatory, that all template parameters are present. If, for example, the data is only available in one specific tile matrix, then that parameter can be omitted. It is possible, for whatever reason, to have the same template parameter more than once in the same template string.

### Template Parameters from other extensions

| Extension     | Property   | Template parameter         | Mapping description                                                                                               |
| ------------- | ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| eo            | bands      | `{eo:band}`                | Each bands name can be used as a substitution value for this bands parameter.                                     |
| datacube      | dimensions | `{cube:dimensions:<name>}` | The template parameter must specify which dimension it refers to by replacing the `<name>`. Any value that is representable via a `dimension` can be used as a substitution. |

This list is not exhaustive, other useful template substitutions may exist.

### Template examples

* Plain:
  
  `http://example.com/data/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg`

* Using `eo:bands`:
  
  `http://example.com/data/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}/{eo:bands}.jpeg`

* Using `cube:dimensions`:
  
  `http://example.com/data/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}/{cube:dimensions:elevation}.jpeg`

## Implementations

None. Still in proposal stage
