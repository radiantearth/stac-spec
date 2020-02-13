# Extensions

This folder contains extensions to the SpatioTemporal Asset Catalog specification. The specification
is designed for extension, defining just a minimal core. It is expected that most real world
implementations will use several extensions to fully describe their data and API. 

Extensions can be changes in functionality or new fields. This can include new JSON files that are
linked to from the core `links`, as well as new OpenAPI fragments. Extensions should include
narrative explaining the fields, a comprehensive example and a JSON-Schema to validate compliance.
Any data provider can create an extension, and when providers work together to share fields between
them they can create a shared extension and include it in the STAC repository.

Anyone is welcome to create an extension (see section 'Extending STAC'), and is encouraged to at least link to the extension from 
here. The third-party / vendor extension section is for the sharing of extensions. As third 
parties create useful extensions for their implementation it is expected that others will make use 
of it, and then evolve to make it a 'community extension', that several providers maintain 
together. For now anyone from the community is welcome to use this extensions/ folder of the 
stac-spec repository to collaborate.

## Extension Maturity

Extensions in this directory are meant to evolve to maturity, and thus may be in different states
in terms of stability and number of implementations. All extensions included must include a 
maturity classification, so that STAC spec users can easily get a sense of how much they can count
on the extension. 

| Maturity Classification |  Min Impl # | Description | Stability |
| ----------------------- | ----------- | ----------- | --------- |
| Proposal                | 0           | An idea put forward by a community member to gather feedback | Not stable - breaking changes almost guaranteed as implementers try out the idea. |
| Pilot                   | 1           | Idea is fleshed out, with examples and a JSON schema, and implemented in one or more catalogs. Additional implementations encouraged to help give feedback | Approaching stability - breaking changes are not anticipated but can easily come from additional feedback |
| Candidate               | 3           | A number of implementers are using it and are standing behind it as a solid extension. Can generally count on an extension at this maturity level | Mostly stable, breaking changes require a new version and minor changes are unlikely. |
| Stable                  | 6           | Highest current level of maturity. The community of extension maintainers commits to a STAC review process for any changes, which are not made lightly. | Completely stable, all changes require a new version number and review process. |
| Deprecated              | N/A         | A previous extension that has likely been superceded by a newer one or did not work out for some reason. | DO NOT USE, is not supported |

Maturity mostly comes through diverse implementations, so the minimum number of implementations
column is the main gating function for an extension to mature. But extension authors can also
choose to hold back the maturity advancement if they don't feel they are yet ready to commit to
the less breaking changes of the next level.

A 'mature' classification level will likely be added once there are extensions that have been 
stable for over a year and are used in twenty or more implementations.


## List of content extensions

An extension can add new fields to STAC entities (content extension), or can add new endpoints or behavior to the API (API extension). Below is a list of content extensions, while API extensions given under [api-spec](../api-spec/) in a folder for [API extensions](../api-spec/extensions/).

| Extension Title                                | Identifier       | Field Name Prefix   | Scope                     | Maturity   | Description                        |
| ---------------------------------------------- | ---------------- | ------------------- | ------------------------- | ---------- | ---------------------------------- | 
| [Asset Definition](asset/README.md)            | asset            | -                   | Collection                | *Proposal* | Provides a way to specify details about what assets may be found in Items belonging to a collection. |
| [Checksum](checksum/README.md)                 | checksum         | checksum            | Item, Catalog, Collection | *Proposal* | Provides a way to specify file checksums for assets and links in Items, Catalogs and Collections. |
| [Commons](commons/README.md)                   | commons          | -                   | Item, Collection          | *Proposal* | Provides a way to specify data fields in a collection that are common across the STAC Items in that collection, so that each does not need to repeat all the same information. |
| [Data Cube](datacube/README.md)                | datacube         | cube                | Item, Collection          | *Proposal* | Data Cube related metadata, especially to describe their dimensions. |
| [Electro-Optical](eo/README.md)                | eo               | eo                  | Item                      | *Pilot*    | Covers electro-optical data that represents a snapshot of the earth for a single date and time. It could consist of multiple spectral bands, for example visible bands, infrared bands, red edge bands and panchromatic bands. The extension provides common fields like bands, cloud cover, gsd and more. |
| [Label](label/README.md)                       | label            | label               | Item                      | *Proposal* | Items that relate labeled AOIs with source imagery |
| [Point Cloud](pointcloud/README.md)            | pointcloud       | pc                  | Item                      | *Proposal* | Provides a way to describe point cloud datasets. The point clouds can come from either active or passive sensors, and data is frequently acquired using tools such as LiDAR or coincidence-matched imagery. |
| [Projection](projection/README.md)             | projection       | proj                | Item                      | *Proposal* | Provides a way to describe items whose assets are in a geospatial projection. |
| [SAR](sar/README.md)                           | sar              | sar                 | Item                      | *Proposal* | Covers synthetic-aperture radar data that represents a snapshot of the earth for a single date and time. |
| [Satellite](sat/README.md)                     | sat              | sat                 | Item                      | *Proposal* | Satellite related metadata for data collected from satellites. |
| [Scientific](scientific/README.md)             | scientific       | sci                 | Item, Collection          | *Proposal* | Scientific metadata is considered to be data that indicate from which publication data originates and how the data itself should be cited or referenced. |
| [Single File STAC](single-file-stac/README.md) | single-file-stac | -                   | ItemCollection            | *Proposal* | An extension to provide a set of Collections and Items as a single file catalog. |
| [Versioning Indicators](version/README.md)     | version          | -                   | Item, Collection          | *Proposal* | Provides fields and link relation types to provide a version and indicate deprecation. |
| [View Geometry](view/README.md)                | view             | view                | Item                      | *Proposal* | View Geometry adds metadata related to angles of sensors and other radiance angles that affect the view of resulting data |

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name     | Scope | Description | Vendor |
| -------- | ----- | ----------- | ------ |
| None yet |       |             |        |

## Proposed extensions

The following extensions are proposed through the
[STAC issue tracker](https://github.com/radiantearth/stac-spec/issues) and are considered to be
implemented. If you would find any of these helpful or are considering to implement a similar
extension, please get in touch through the referenced issues:

- [Drone content Extension](https://github.com/radiantearth/stac-spec/issues/149)
- [Full Motion Video Content Extension](https://github.com/radiantearth/stac-spec/issues/156)
- [Storage Extensions](https://github.com/radiantearth/stac-spec/issues/148)
- [gRPC STAC Extensions](https://github.com/radiantearth/stac-spec/issues/575)

## Extending STAC

Anyone is welcome to create an extension. There are several types of extensions, some just add additional fields,
some change the behaviour of STAC and some introduce completely new functionality. New extensions should try to align 
with existing extensions as good as possible and may even re-use fields and their definitions until they may get split
into a new extension that combines commonly used fields across multiple extensions.
Best practices for extension proposals are still emerging in this section.

### Prefixes

A STAC Item can combine schema information from several different sources - the core STAC item information, 
an earth observation community extension, and a vendor specific provider. It can be difficult to distinguish exactly where each definition
came from, and to pull out the most relevant information, especially when vendors often will dump in all the metadata they have in to the
STAC definition.

So one idea is to have prefixes to differentiate specific vendors (like `dg:` for DigitalGlobe), and for communities of practice
(like `eo:` for Electro-Optical). These wouldn't be full namespacing, though an extension for like JSON-LD could potentially
evolve to make fully resolved namespacing an option.

An example of this can be seen in a Landsat example:

```
  "properties": {
    "datetime":"2018-01-01T13:21:30Z",

    "start_datetime":"2018-01-01T13:21:30Z",
    "end_datetime":"2018-01-01T13:31:30Z",

    "view:off_nadir": -0.001,
    "eo:cloud_cover": 10.31,
    "view:sun_azimuth": 149.01607154,
    "view:sun_elevation": 59.21424700,
    "eo:gsd": 30,

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

For content extensions, it is recommended to use use arrays only as true (potentially sorted) enumerations/lists without having additional meaning and to avoid objects whenever possible.

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