# Label Extension Specification

- **Title: Label**
- **Identifier: label**
- **Field Name Prefix: label**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension is meant to support using labeled AOIs with Machine Learning models, particularly training data sets, but can be used in any application where labeled AOIs are needed.

This document explains the fields of the STAC Label Extension to a STAC Item. It is used to describe labeled Areas of Interest (AOIs) that are used with earth observation imagery. These labels can take several forms, though all are expected to be contained with a GeoJSON `FeatureCollection`:
- **Tile classification labels:** A GeoJSON `FeatureCollection` with a single `Feature`. This feature's geometry should match the bounds of the labeled image tile, and a `Feature` property should define the class (see below).
- **Tile regression labels:** A GeoJSON `FeatureCollection` with a single `Feature`. This feature's geometry should match the bounds of the labeled image tile, and a `Feature` property should define the regression value (see below).
- **Object detection labels:** A GeoJSON `FeatureCollection` containing rectangular bounding boxes (as `Polygon` geometry `Feature`s) defining the bounds of an object of interest (e.g. a car). A `Feature` property **must** define the class of the object labeled. Additional `Feature` properties may be defined for additional metadata.
- **Segmentation labels:** A GeoJSON `FeatureCollection` containing `Polygon` geometry `Feature`s that trace the boundaries of objects of interest (e.g. buildings, vegetation, bodies of water), or raster-formatted pixel masks defining pixel classes. (See [raster label notes](#raster-label-notes))

## Examples

**Roads:**
- [Example Roads Item](examples/spacenet-roads/roads_item.json)
- [Example Roads Asset (labels)](examples/spacenet-roads/spacenetroads_AOI_3_Paris_img101.geojson)
- [Example Roads Source Imagery Item](examples/spacenet-roads/roads_source.json)
- [Example Roads Collection](examples/spacenet-roads/roads_collection.json)

**Buildings:**
- [Example Collection of Two Building Footprint Label Catalogs](examples/multidataset/catalog.json)
- [Example SpaceNet Buildings Collection](examples/multidataset/spacenet-buildings/collection.json)
- [Example SpaceNet Buildings (Vegas) Item](examples/multidataset/spacenet-buildings/AOI_2_Vegas_img2636.json)
- [Example SpaceNet Buildings (Paris) Item](examples/multidataset/spacenet-buildings/AOI_3_Paris_img1648.json)
- [Example SpaceNet Buildings (Shanghai) Item](examples/multidataset/spacenet-buildings/AOI_4_Shanghai_img3344.json)
- [Example World Bank Zanzibar Buildings Collection](examples/multidataset/zanzibar/collection.json)
- [Example World Bank Zanzibar Building Item 1](examples/multidataset/zanzibar/znz001.json)
- [Example World Bank Zanzibar Building Item 2](examples/multidataset/zanzibar/znz029.json)
## Schema
- [JSON Schema](json-schema/schema.json)

## Item fields

A Label Item represents a polygon, set of polygons, or raster data defining labels and label metadata and should be part of a Collection. See the [raster label notes](#raster-label-notes) section below for details on raster-formatted labels. It is up to the data provider how to group their catalog, but a typical use might have a Collection of a series of label sets (Items) that are related. For example a "Building" collection might have 50 Items, each one was a set of building AOIs for a single country. The Collection holds details on the data providers and the license.

Like other content extensions, the Label extension adds additional fields to a STAC Item, which are detailed after some additional clarification on what the core fields mean with respect to a Label Item.

### Core Item fields
Some additional notes are given here for some of the core STAC Item fields and what they represent for label.

- **bbox** and **geometry**: The bounding box and the geometry of a Label Item represents the region for which the label(s) is/are valid. This could be the extent of all the AOIs in the dataset, or could be the region the provider believes the label is representative.
- **properties.datetime**: The datetime of a Label Item is the nominal datetime for which the label applies, typically this is the datetime of the source imagery used to generate the labels. If the label applies over a range of datetimes (e.g., generated from multiple source images) then use the [Date and Time Range fields](../../item-spec/common-metadata.md#date-and-time-range) to indicate start and end datetimes.
- **assets**: The label assets are GeoJSON FeatureCollection assets containing the actual label features. As with the core STAC Item a thumbnail asset is also strongly encouraged.

### New Item properties
| element           | type info            | name                       | description       |
|-------------------|----------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| label:properties  | [string\|null]       | Name                       | **REQUIRED** These are the names of the property field(s) in each `Feature` of the label asset's `FeatureCollection` that contains the  classes (keywords from `label:classes` if the property defines classes). If labels are rasters, use `null`. |
| label:classes     | [[Class Object](#class-object)] | Classes           | **REQUIRED** if using categorical data. A Class Object defining the list of possible class names for each `label:properties`. (e.g., tree, building, car, hippo)|
| label:description | string               | Description                | **REQUIRED** A description of the label, how it was created, and what it is recommended for |
| label:type        | string               | Type                       | **REQUIRED** An ENUM of either `vector` label type or `raster` label type |
| label:tasks       | [string]             | Task                       | Recommended to be a subset of 'regression', 'classification', 'detection', or 'segmentation', but may be an arbitrary value |
| label:methods     | [string]             | Method                     | Recommended to be a subset of 'automated' or 'manual', but may be an arbitrary value. |
| label:overviews   | [[Label Overview Object](#label-overview-object)] | Overview | An Object storing counts (for classification-type data) or summary statistics (for continuous numerical/regression data). |

#### Class Object
| Field Name      | Type                 | name                       | description       |
|-----------------|----------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| name            | string\|null         | Name                       | The property key within the asset's each `Feature` corresponding to class labels. If labels are raster-formatted, use null.|
| classes         | [string\|number]     | Classes                    | The different possible class values within the property `name`. |

#### Label Overview Object

| Field Name      | Type                            | name                       | description       |
|-----------------| ------------------------------- |----------------------------|--------------------------------------------------------------------------------------------------|
| property_key    | string                          | Property Key                       | The property key within the asset corresponding to class labels. |
| counts          | [[Count Object](#count-object)] | Counts                     | An object containing counts for categorical data. |
| statistics      | [[Stats Object](#stats-object)] | Statistics                 | An object containing statistics for regression/continuous numeric value data. |

`label:overviews ` generally won't have both counts and statistics, but one of the two.

#### Count Object

| Field Name      | Type            | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| name            | string          | Class Name                    | The different possible classes within the property `name`. |
| count           | integer         | Count                      | The number of occurrences of the class.


```json
  {
    "property_key": "road_type",
    "counts": [
      {
        "name": "dirt",
        "count": 10
      },
      {
        "name": "paved",
        "count": 99
      }
    ]
  }

```

#### Stats Object

| Field Name      | Type       | name                       | description       |
|-----------------|------------|----------------------------|--------------------------------------------------------------------------------------------------|
| name       | string     | Stat Name                  | The name of the statistic being reported. |
| value           | number     | Value                      | The value of the statistic `name`. |

```json
  {
    "property_key": "elevation",
    "statistics": [
      {
        "name": "mean",
        "value": 100.1
      },
      {
        "name": "median",
        "value": 102.3
      },
      {
        "name": "max",
        "value": 100000
      }
    ]
  }

```

#### Assets

##### labels (required)
The Label Extension requires at least one asset that uses the key "labels". The asset will contain a link to the actual label data. The asset has these requirements:

- is a GeoJSON FeatureCollection
- if `label:tasks` is tile_classification, object_detection, or segmentation, each feature should have one or more properties containing the label(s) for the class (one of `label:classes`). the name of the property can be anything (use "label" if making from scratch), but needs to be specified in the `Item` with the `label:properties` field.
- if `label:tasks` is tile_regression, each feature should have one or more properties defining the value for regression. the name of the property can be anything (use "label" if making from scratch), but needs to be specified in the `Item` with the `label:properties` field.

##### Raster Label Notes

If the labels are formatted as rasters - for example, a pixel mask with 1s where there is water and 0s where there is land - the following approach is recommended for including those data.

The raster label file (e.g. a GeoTIFF) should be included as an asset under the item. Along with the image file, a GeoJSON `FeatureCollection` asset should be included. That `FeatureCollection` should contain a single `Feature`, ideally a polygon geometry defining the extent of the raster.

##### Rendered images (optional)
The source imagery used for creating the label is linked to under `links` (see below). However the source imagery is likely to have been rendered in some way when creating the training data. For instance, a byte-scaled true color image may have been created from the source imagery. It may be useful to save this image and include it as an asset in the `Item`.


#### Links: source imagery
A Label Item links to any source imagery that the AOI applys to by linking to the STAC Item representing the imagery. Source imagery is indicated by using a `rel` type of "source" and providing the link to the STAC Item.

In addition the source imagery link has a new label extension specific field:

| element         | type info       | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| label:assets    | [string]        | Assets                     | The keys for the assets within the `source` item to which this label item applies. |

The `label:assets` field applies to situations where the labels may apply to certain assets inside the source imagery Item, but not others (e.g. if the labels were traced on top of RGB imagery, but the source item also contains assets for a Digital Elevation Model).


## Implementations

The SpaceNet Challenge Round 2 dataset has a [STAC catalog](https://spacenet-dataset.s3.amazonaws.com/spacenet-stac/SN2_buildings/catalog.json) generated using [PySTAC](https://pystac.readthedocs.io/en/latest) containing Label Items. Further example implementations can be found in [Examples](#Examples). The Roads implementation provides an example item for labels from the [SpaceNet Road Network Extraction Challenge Dataset](https://spacenet.ai/spacenet-roads-dataset/), providing segmentation labels for road networks. The Misc Samples implementation provides an example catalog of collections with sample label items from several training datasets, [SpaceNet Buildings](https://spacenet.ai/spacenet-buildings-dataset-v2/) and [Open AI Tanzania Building Footprint Segmentation Challenge](https://competitions.codalab.org/competitions/20100) for now, providing segmentation labels for buildings.

[Raster Foundry](https://rasterfoundry.azavea.com/) supports exporting STAC-compliant training data label items, assets, and sources in a self-contained `zip` file and as an s3 directory when initiated from an internal annotation and labeling tool.

[PySTAC](https://pystac.readthedocs.io/en/latest/) supports [reading/writing](https://pystac.readthedocs.io/en/latest/tutorials/how-to-create-stac-catalogs.html#Adding-label-items-to-the-Spacenet-5-catalog) STAC collections according to this extension.

## Extensions
While the EO extension doesn't make sense within a Label Item itself, most Label Items will link to source data which will frequently use the EO Extension.
The [extensions page](../README.md) gives an overview about these and other extensions.
