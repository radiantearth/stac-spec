# Label Extension Specification (`label`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Label Extension to a STAC Collection and Item. It is used to describe labeled Areas of Interest (AOIs) that are used with earth observation imagery. The AOI is usually a polygon, but in some cases could be a line or point such as is the case with a road. This extension is meant to support using labeled AOIs with Machine Learning models, particularly training data sets, but can be used in any application where labeled AOIs are needed.

- [Example Item](example-roads.json)
- [Example Asset (labels)](example-labels.json)
- [Example Source Imagery](example-source.json)
- [JSON Schema](schema.json)

## Collection fields



### New Collection properties
| element         | type info       | name                       | description       | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| label:description | string   | Description | **REQUIRED.** A description of the label, how it was created, and what it is recommended for |
| label:classes     | [string] | Classes     | **REQUIRED.** a list of keywords representing the nature of the labels. (e.g., tree, building, car, hippo)
| label:property    | string   | Name        | **REQUIRED.** This is the name of the property field in the "labels" asset that contains the class (one of keywords from `label:classes`). 
| label:title       | string   | Title       | A human readable title of the dataset for display |
| label:type  | [string] | Type | Recommended to be a subset of 'regression', 'classification', 'detection', or 'segmentation', but may be an arbitrary value |
| label:method  | [string] | Method | Recommended to be a subset of 'automated' or 'manual', but may be an arbitrary value. |
| label:version  | number | Version |  Monotonically-increasing version number. |

## Item fields

A Label Item represents a set of polygons with labels and should be part of a Collection. It is up to the data provider how to group their catalog, but a typical use might have a Collection of a series of label sets (Items) that are related. For example a "Building" collection might have 50 Items, each one was a set of building AOIs for a single country. The Collection holds details on the data providers and the license.

Like other content extensions, the Label extension adds additional fields to a STAC Item, which are detailed after some additional clarification on what the core fields mean with respect to a Label Item.

### Core Item fields
Some additional notes are given here for some of the core STAC Item fields and what they represent for label.

- **bbox** and **geometry**: The bounding box and the geometry of a Label Item represents the region for which the label is valid. This could be the extent of all the AOIs in the dataset, or could be the region the provider believes the label is representative.
- **properties.datetime**: The datetime of a Label Item is the nominal datetime for which the label applies, typically this is the datetime of the source imagery used to generate the labels. If the label applies over a range of datetimes (e.g., generated from multiple source images) then use the datetime-range (dtr) extension to indicate start and end datetimes.
- **assets**: Unlike other extensions, the Label extension requires a single asset with the key "labels". This is a GeoJSON FeatureCollection asset containing the actual label features. As with the core STAC Item a thumbnail asset is also strongly encouraged.

### New Item properties
| element         | type info       | name                       | description       | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| label:tixxx       | string | Title | A human readable title of the dataset for display |

#### Assets

##### labels (required)
The Label Extension requires at least one asset that uses the key "labels". The asset will contain a link to the actual label data. The asset has these requirements:

- is a GeoJSON FeatureCollection
- each feature should have a property containing the label for the class (one of `label:classes`)
- the name of the property can be anything (use "label" if making from scratch), but needs to be specified in the `Item` with the `label:label_property` field.

##### Rendered images (optional)
The source imagery used for creating the label is linked to under `links` (see below). However the source imagery is likely to have been rendered in some way when creating the traiining data. For instance, a byte-scaled true color image may have been created from the source imagery. It may be useful to save this image and include it as an asset in the `Item`.


#### Links: source imagery
A Label Item links to any source imagery that the AOIs apply to by linking to the STAC Item representing the imagery. Source imagery is indicated by using a `rel` type of "source" and providing the link to the STAC Item.

In addition the link has a new Label specific field:

| element         | type info       | name                       | description       | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| label:assets | [string] | Assets | The keys for the assets to which the label applies |


## Implementations
This is an initial proposal, there are no current implementations.

## Extensions
Label Items may often use the datetime-range extension if the labelset applies over a range of dates. While the EO extension doesn't make sense within a Label Item itself, most Label Items will link to source data which will frequently use the EO Extension. The [extensions page](../README.md) gives an overview about these and other extensions.