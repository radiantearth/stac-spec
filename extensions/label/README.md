# Label Extension Specification (`label`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension is meant to support using labeled AOIs with Machine Learning models, particularly training data sets, but can be used in any application where labeled AOIs are needed.

This document explains the fields of the STAC Label Extension to a STAC Item. It is used to describe labeled Areas of Interest (AOIs) that are used with earth observation imagery. These labels can take several forms, though all are expected to be contained with a GeoJSON `FeatureCollection`:
- **Tile classification labels:** A GeoJSON `FeatureCollection` with a single `Feature`. This feature's geometry should match the bounds of the labeled image tile, and a `Feature` property should define the class (see below).
- **Object detection labels:** A GeoJSON `FeatureCollection` containing rectangular bounding boxes (as `Polygon` geometry `Feature`s) defining the bounds of an object of interest (e.g. a car). A `Feature` property **must** define the class of the object labeled. Additional `Feature` properties may be defined for additional metadata.
- **Segmentation labels:** A GeoJSON `FeatureCollection` containing `Polygon` geometry `Feature`s that trace the boundaries of objects of interest (e.g. buildings, vegetation, bodies of water). If using raster-formatted segmentation labels (i.e. pixel masks), these should be stored using the core STAC specification, not `label`.


- [Example Item](example-roads.json)
- [Example Asset (labels)](example-labels.json)
- [Example Source Imagery](example-source.json)
- [JSON Schema](schema.json)

## Item fields

A Label Item represents a polygon or set of polygons defining labels and label classes and should be part of a Collection. See the [raster labels](#raster-labels) section below for notes on raster-formatted labels. It is up to the data provider how to group their catalog, but a typical use might have a Collection of a series of label sets (Items) that are related. For example a "Building" collection might have 50 Items, each one was a set of building AOIs for a single country. The Collection holds details on the data providers and the license.

Like other content extensions, the Label extension adds additional fields to a STAC Item, which are detailed after some additional clarification on what the core fields mean with respect to a Label Item.

### Core Item fields
Some additional notes are given here for some of the core STAC Item fields and what they represent for label.

- **bbox** and **geometry**: The bounding box and the geometry of a Label Item represents the region for which the label(s) is/are valid. This could be the extent of all the AOIs in the dataset, or could be the region the provider believes the label is representative.
- **properties.datetime**: The datetime of a Label Item is the nominal datetime for which the label applies, typically this is the datetime of the source imagery used to generate the labels. If the label applies over a range of datetimes (e.g., generated from multiple source images) then use the datetime-range (dtr) extension to indicate start and end datetimes.
- **assets**: The label assets are GeoJSON FeatureCollection assets containing the actual label features. As with the core STAC Item a thumbnail asset is also strongly encouraged.

### New Item fields

| element           | type info       | name                       | description       |
|-------------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| label:property    | [string]        | Name                       | **REQUIRED** These are the names of the property field(s) in each `Feature` of the label asset's `FeatureCollection` that contains the  classes (keywords from `label:classes` if the property defines classes). |
| label:classes     | [Class Object]    | Classes                    | **REQUIRED** A Class Object defining the list of possible class names for each `label:property`. (e.g., tree, building, car, hippo)|
| label:type        | [string]        | Type                       | Recommended to be a subset of 'regression', 'classification', 'detection', or 'segmentation', but may be an arbitrary value |
| label:method      | [string]        | Method                     | Recommended to be a subset of 'automated' or 'manual', but may be an arbitrary value. |
| label:version     | number          | Version                    |  Monotonically-increasing version number. |

### Class Object
| Field Name      | Type            | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| name            | string          | Name                       | The property key within the asset's each `Feature` corresponding to class labels. |
| classes         | [string or numeric]        | Classes                    | The different possible class values within the property `name`. |

### New Item properties
| element         | type info           | name                       | description       |
|-----------------|---------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| label:datetime  | datetime            | Datetime                   | **Required** The date and time *that the source imagery was collected.* |
| label:summaries   | [Label Summary Object] | Summaries                    | Objects storing counts (for classification-type data) or summary statistics (for continuous numerical/regression data) for each `feature` property storing label classes or metadata within the label asset `FeatureCollection`. |

### Label Summary Object

| Field Name      | Type            | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| property_key    | string          | Name                       | The property key within the asset corresponding to class labels. |
| counts          | [Count Object]  | Counts                     | An object containing counts for categorical data. |
| statistics      | [Stats Object]  | Statistics                 | An object containing statistics for regression/continuous numeric value data. |

`label:summary ` generally won't have both counts and statistics, but one of the two.

### Count Object

| Field Name      | Type            | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| class_name      | string          | Classes                    | The different possible classes within the property `name`. |
| count           | number          | Count                      | The number of occurrences of the class.


```json
  {
    "property_key": "road_type",
    "counts": [
      {
        "class_name": "dirt",
        "count": 10
      },
      {
        "class_name": "paved",
        "count": 99
      }
    ]
  }

```

### Stats Object

| Field Name      | Type       | name                       | description       |
|-----------------|------------|----------------------------|--------------------------------------------------------------------------------------------------|
| stat_name       | string     | Stat Name                  | The name of the statistic being reported. |
| value           | number     | Value                      | The value of the statistic `stat_name`. |

```json
  {
    "property_key": "elevation",
    "statistics": [
      {
        "stat_name": "mean",
        "value": 100.1
      },
      {
        "stat_name": "median",
        "value": 102.3
      },
      {
        "stat_name": "max",
        "value": 100000
      }
    ]
  }

```

#### Assets

##### labels (required)
The Label Extension requires at least one asset that uses the key "labels". The asset will contain a link to the actual label data. The asset has these requirements:

- is a GeoJSON FeatureCollection
- each feature should have one or more properties containing the label(s) for the class (one of `label:classes`)
- the name of the property can be anything (use "label" if making from scratch), but needs to be specified in the `Item` with the `label:label_property` field.

##### Rendered images (optional)
The source imagery used for creating the label is linked to under `links` (see below). However the source imagery is likely to have been rendered in some way when creating the traiining data. For instance, a byte-scaled true color image may have been created from the source imagery. It may be useful to save this image and include it as an asset in the `Item`.


#### Links: source imagery
A Label Item links to any source imagery that the AOIs apply to by linking to the STAC Item representing the imagery. Source imagery is indicated by using a `rel` type of "source" and providing the link to the STAC Item.

In addition the link has a new Label specific field:

| element         | type info       | name                       | description       |
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------|
| label:assets    | [string]        | Assets                     | The keys for the assets to which the label applies |


## Implementations
This is an initial proposal, there are no current implementations.

## Extensions
Label Items may often use the datetime-range extension if the labelset applies over a range of dates. While the EO extension doesn't make sense within a Label Item itself, most Label Items will link to source data which will frequently use the EO Extension. The [extensions page](../README.md) gives an overview about these and other extensions.
