# Extensions

- [Extensions](#extensions)
  - [Overview](#overview)
  - [General Conventions](#general-conventions)
  - [Core STAC Extensions](#core-stac-extensions)
  - [Community Extensions](#community-extensions)
    - [Extension Maturity](#extension-maturity)
  - [List of STAC Extensions](#list-of-stac-extensions)
  - [Proposed extensions](#proposed-extensions)
  - [Extending STAC](#extending-stac)
    - [Proposing new extensions](#proposing-new-extensions)
    - [Prefixes](#prefixes)
    - [Use of arrays and objects](#use-of-arrays-and-objects)
    - [Directory Structure](#directory-structure)

## Overview

One of the most important aspects of the SpatioTemporal Asset Catalog specification is its extensibility. The core
STAC specification defines only a minimal core, but is designed for extension. It is expected that most real-world
implementations will use several 'extensions' to fully describe their data. This document describes how extensions
work, and links to the 'core' extensions included in this repo, as well as to a variety of 'community' extensions.

Extensions to the core STAC specification provide additional JSON fields that can be used to better describe
the data. Most tend to be about describing a particular domain or type of data, but some imply
functionality.

Extensions include a JSON Schema precisely describing the structure, a natural language description of the fields, and thorough examples.


Anybody can create an extension for their data, and data providers often work together to share
fields between them to create a shared community extensions. See the section below on '[Extending STAC](#extending-stac)')
for information on how to get started. And everyone is encouraged to link to the extension in the table below, so others
can be aware of it.

## General Conventions

1. Additional attributes relating to an [Item](../item-spec/item-spec.md) should be added into the Item Properties object, rather than directly in the Item object.
2. In general, additional attributes that apply to an Item Asset should also be allowed in Item Properties and vice-versa.
For example, the `eo:bands` attribute may be used in Item Properties to describe the aggregation of all bands available in
the Item Asset objects contained in the Item, but may also be used in an individual Item Asset to describe only the bands available in that asset.
3. Additional attributes relating to a [Catalog](../catalog-spec/catalog-spec.md) or [Collection](../collection-spec/collection-spec.md) should be added to the root of the object.

## Core STAC Extensions

These extensions are considered stable, and are included directly in this repository.

| Extension Title                             | Identifier | Field Name Prefix | Scope            | Description |
|---------------------------------------------|------------|-------------------|------------------|-------------|
| [Electro-Optical](eo/README.md)             | eo         | eo                | Item             | Covers electro-optical data that represents a snapshot of the Earth for a single date and time. It could consist of multiple spectral bands, for example visible bands, infrared bands, red edge bands and panchromatic bands. The extension provides common fields like bands, cloud cover, gsd and more. |
| [Projection](projection/README.md)          | projection | proj              | Item             | Provides a way to describe Items whose assets are in a geospatial projection. |
| [Scientific Citation](scientific/README.md) | scientific | sci               | Item, Collection | Metadata that indicate from which publication data originates and how the data itself should be cited or referenced. |
| [View Geometry](view/README.md)             | view       | view              | Item             | View Geometry adds metadata related to angles of sensors and other radiance angles that affect the view of resulting data |

## Community Extensions

There are many more extensions that the broader STAC community is working on. These aren't included directly in the
main repository as many are still evolving through active usage. But they are listed here.

### Extension Maturity

There are many extensions being built with STAC, but they have varying degrees of maturity. All community extensions
listed here included must include a maturity classification, so that STAC spec users can easily get a sense of how
much they can count on the extension. Extension creators are encouraged to list their extensions here, even if it is just
an rough proposal, so others can potentially collaborate.

| Maturity Classification |  Min Impl # | Description | Stability |
| ----------------------- | ----------- | ----------- | --------- |
| Proposal                | 0           | An idea put forward by a community member to gather feedback | Not stable - breaking changes almost guaranteed as implementers try out the idea. |
| Pilot                   | 1           | Idea is fleshed out, with examples and a JSON schema, and implemented in one or more catalogs. Additional implementations encouraged to help give feedback | Approaching stability - breaking changes are not anticipated but can easily come from additional feedback |
| Candidate               | 3           | A number of implementers are using it and are standing behind it as a solid extension. Can generally count on an extension at this maturity level | Mostly stable, breaking changes require a new version and minor changes are unlikely. The extension has a [code owner](../.github/CODEOWNERS). |
| Stable                  | 6           | Highest current level of maturity. The community of extension maintainers commits to a STAC review process for any changes, which are not made lightly. | Completely stable, all changes require a new version number and review process. |
| Deprecated              | N/A         | A previous extension that has likely been superseded by a newer one or did not work out for some reason. | DO NOT USE, is not supported |

Maturity mostly comes through diverse implementations, so the minimum number of implementations
column is the main gating function for an extension to mature. But extension authors can also
choose to hold back the maturity advancement if they don't feel they are yet ready to commit to
the less breaking changes of the next level.

A 'mature' classification level will likely be added once there are extensions that have been
stable for over a year and are used in twenty or more implementations.

## List of STAC Extensions

These extensions add new fields or semantics to STAC objects.

| Extension Title                                  | Identifier        | Field Name Prefix   | Scope                     | Maturity   | Description |
| ------------------------------------------------ | ----------------- | ------------------- | ------------------------- | ---------- | ----------- |
| [Data Cube](https://github.com/stac-extensions/datacube)                  | datacube          | cube                | Item, Collection          | *Proposal* | Data Cube related metadata, especially to describe their dimensions. |
| [File Info](https://github.com/stac-extensions/file)                      | file              | file                | Item, Collection          | *Proposal* | Provides a way to specify file details such as size, data type and checksum for assets in Items and Collections. |
| [Item Asset Definition](https://github.com/stac-extensions/item-assets)   | item-assets       | -                   | Collection                | *Proposal* | Provides a way to specify details about what assets may be found in Items belonging to a Collection. |
| [Point Cloud](https://github.com/stac-extensions/pointcloud)              | pointcloud        | pc                  | Item                      | *Proposal* | Provides a way to describe point cloud datasets. The point clouds can come from either active or passive sensors, and data is frequently acquired using tools such as LiDAR or coincidence-matched imagery. |
| [Processing](https://github.com/stac-extensions/processing)               | processing        | processing          | Item, Collection          | *Proposal* | Indicates from which processing chain data originates and how the data itself has been produced. |
| [SAR](https://github.com/stac-extensions/sar)                             | sar               | sar                 | Item                      | *Proposal* | Covers synthetic-aperture radar data that represents a snapshot of the earth for a single date and time. |
| [Single File STAC](https://github.com/stac-extensions/single-file-stac)   | single-file-stac  | -                   | Catalog                   | *Proposal* | An extension to provide a set of Collections and Items within a single file STAC. |
| [Tiled Assets](https://github.com/stac-extensions/tiled-assets)           | tiled-assets      | tiles               | Item, Catalog, Collection | *Proposal* | Allows to specify numerous assets using asset templates via tile matrices and dimensions. |
| [Timestamps](https://github.com/stac-extensions/timestamps)               | timestamps        | -                   | Item                      | *Proposal* | Allows to specify numerous timestamps for assets and metadata. |
| [Versioning Indicators](https://github.com/stac-extensions/version)       | version           | -                   | Item, Collection          | *Proposal* | Provides fields and link relation types to provide a version and indicate deprecation. |
| [CARD4L](https://github.com/stac-extensions/card4l) | card4l            | card4l | Item  | How to comply to the CEOS CARD4L product family specifications (Optical and SAR), from [openEO Platform](https://platform.openeo.org) |

## Proposed extensions

The following extensions are proposed through the
[STAC issue tracker](https://github.com/radiantearth/stac-spec/issues) and are considered to be
implemented. If you would find any of these helpful or are considering to implement a similar
extension, please get in touch through the referenced issues:

- [Drone Extension](https://github.com/radiantearth/stac-spec/issues/149)
- [Full Motion Video Extension](https://github.com/radiantearth/stac-spec/issues/156)
- [Storage Extensions](https://github.com/radiantearth/stac-spec/issues/148)
- [gRPC STAC Extensions](https://github.com/radiantearth/stac-spec/issues/575)

## Extending STAC

Anyone is welcome to create an extension. There are several types of extensions, some just add additional fields,
some change the behavior of STAC and some introduce completely new functionality. New extensions should try to align
with existing extensions as well as possible and may even re-use fields and their definitions until they may get split
into a new extension that combines commonly used fields across multiple extensions.
Best practices for extension proposals are still emerging in this section.

### Proposing new extensions

Extensions can be hosted anywhere, but should use the [extension template](https://github.com/stac-extensions/stac-extensions.github.io#using-the-stac-extensions-template) as a starting point. If you'd like to add a repository to the [stac-extensions](https://github.com/stac-extensions) GitHub organization, just ask on [Gitter](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby)! This is fine for work-in-progress extensions. You can also host the extension repository in your own GitHub account, and optionally transfer it to the stac-extensions org later.

For new extensions that require community discussion, we recommend the following workflow:

- Use the stac-extensions template to sketch out your proposed extension
- Open an issue on this repository with the prefix "New Extension: " and describe the extension. Include a link to the extension repository.
- Discussion can occur on that issue, or discussion can move to issues/pull requests on the extension repository directly.
- Once the extension has an initial release, the issue on stac-spec will be closed.

### Prefixes

A STAC Item can combine schema information from several different sources - the core STAC Item information,
an earth observation community extension, and a vendor specific provider. It can be difficult to distinguish exactly where each definition
came from, and to pull out the most relevant information, especially when vendors often will dump in all the metadata they have in to the
STAC definition.

So one idea is to have prefixes to differentiate specific vendors (like `dg:` for DigitalGlobe), and for communities of practice
(like `eo:` for Electro-Optical). These wouldn't be full namespacing, though an extension for like JSON-LD could potentially
evolve to make fully resolved namespacing an option.

An example of this can be seen in a Landsat example:

```js
  "properties": {
    "datetime":"2018-01-01T13:21:30Z",

    "start_datetime":"2018-01-01T13:21:30Z",
    "end_datetime":"2018-01-01T13:31:30Z",

    "view:off_nadir": -0.001,
    "eo:cloud_cover": 10.31,
    "view:sun_azimuth": 149.01607154,
    "view:sun_elevation": 59.21424700,
    "gsd": 30,

    "l8:data_type": "L1T",
    "l8:wrs_path": 153,
    "l8:wrs_row": 25,
    "l8:earth_sun_distance": 1.0141560,
    "l8:ground_control_points_verify": 114,
    "l8:geometric_rmse_model": 7.562,
    "l8:image_quality_tirs": 9,
    "l8:ground_control_points_model": 313,
    "l8:geometric_rmse_model_x": 5.96,
    "l8:geometric_rmse_model_y": 4.654,
    "l8:geometric_rmse_verify": 5.364,
    "l8:image_quality_oli": 9
  }
```

### Use of arrays and objects

For extensions, it is recommended to

1. Use arrays only as enumerations/lists (possibly sorted), without implying additional meaning (such as order)
2. To avoid using nested objects, in favor of multiple attributes with a similar naming scheme.

For example, if one would like to define an extension to contain a start and a end date, there are multiple options (tl;dr: option **3** is recommended):

1. Define an object, for example: `"date_range": {"start": "2018-01-01", "end": "2018-01-31"}`. This is **discouraged** as it is more complex to search in objects.
2. Define an two-element array where the first element is the start date and the second element is the end date, for example `"date_range": ["2018-01-01", "2018-01-31"]`. This is **discouraged** as it would conflict with Collection `summaries`, which always considers arrays as true (potentially sorted) enumeration without any additional meaning.
3. Define two separate fields, e.g. `"date_range_start": "2018-01-01", "date_range_end": "2018-01-31"`. This is **recommended** as it avoids the conflicts above and is usually better displayed in software that only understands GeoJSON but has no clue about STAC. This is due to the fact that most legacy software can not display arrays or objects GeoJSON `properties` properly.

This rules only applies to the fields defined directly for the Item's `properties`. For fields and structures defined on other levels (e.g. in the root of an Item or in an array), extension authors can freely define the structure. So an array of objects such as the `eo:bands` are fine to use, but keep in mind that the drawbacks mentioned above usually still apply.

### Directory Structure

A STAC extension can have references to additional schemas within the extension schema.
These files should be kept together in order to preserve relative `$ref` links.

See the [EO](eo/) extension file structure as an example.
* Specification examples should be stored in an `examples` directory.
* The specification schema file(s) should be stored in a `json-schema` directory.

Make sure to choose a meaningful identifier for the extension and use this value as the extension's directory name.
The extension's identifier should be used in the `stac_extensions` field. Also, make sure to add the identifier to the
enum defined for the `stac_extensions` field in the
[JSON schema of the STAC catalog specification](../catalog-spec/json-schema/catalog.json).
