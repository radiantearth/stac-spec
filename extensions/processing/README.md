# Processing Extension Specification

- **Title: Processing**
- **Identifier: proc**
- **Field Name Prefix: proc**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Processing metadata is considered to be data that indicate from which processing chain a data originates and how the data itself has been produced. Overall, it helps to increase traceability and search among processing levels and multiple algorithm versions.

Often, data items are the result of one or more waterfall processing pipeline. Tracing information such as the processing facility , the algorithm version or the processing date helps in the data version management.

This extension applies to STAC Items and STAC Collections. As these processing information are often closely bound to the collection level and therefore are shared across all items, it is recommended adding the fields to the corresponding STAC Collection.

- [Examples](examples/): [Sentinel-1 Item](examples/sentinel1-item.json),  [Sentinel-2 Level 2 Collection](examples/sentinel-2-level-2-collection.json)
- [JSON Schema](json-schema/schema.json)

## Item and Collection fields

For Items, the fields are placed in the properties. For Collections, the fields are placed in the summaries of the Collection.


| Field Name                  | Type      | Description                                                  |
| --------------------------- | --------- | ------------------------------------------------------------ |
| proc:name         | string    | The name of the processing of the data that is commonly used. For example, `GRD Post Processing` for "GRD" product of Sentinel-1 satellites. |
| proc:level        | string | **REQUIRED.** The name commonly used to refer to the processing level to make it easier to search for product level across collections or items. The short name must be used (only `L`, not `Level`). See the [list of suggested processing levels](#suggested-processing-levels).
| proc:facility          | string    | The name of the facility that produced the data. For example, `Copernicus S1 Core Ground Segment - DPA` for product of Sentinel-1 satellites. |
| proc:software        | string    | The name of the software that produced the data. For example, `Sentinel-1 IPF` for the software that produces Sentinel-1 satellites data. |
| proc:version           | string | The version of the software that produced the data. For example, `002.71` for the software that produces Sentinel-1 satellites data. |
| proc:organisation | string | The name of the organisation that produced the data. Preferably, the short name. For example, `ESA` for the European SPace Agency that produces Sentinel-1 satellites data. |
| proc:datetime            | datetime    | The product processing date |

### Suggested Processing Levels

The `proc:level` is the name that is commonly used to refer to that processing level properties. The table below shows some processing level used by the industry for some data product.

Each level represents a step in the abstraction process by which data relevant to physical information (raw, level 0, level 1) are turned into data relevant to geo physical informa­tion (level 2, level 3), and finally turned into data relevant to thematic information (level4)

This list is not exhaustive and can be extended with the processing level specific to a data product.

| Level Name | Description | Typical data product |
| ---------- | ----------- | -------------------- |
| RAW        |  Data in their original packets, as received from a satellite. | [Sentinel-1 RAW](https://sentinel.esa.int/web/sentinel/technical-guides/sentinel-1-sar/products-algorithms/level-0-products/raw) |
| L0         | Reconstructed unprocessed instrument data at full space timeresolution with all available supplemental information to be used in subsequentprocessing (e.g., ephemeris, health and safety) appended. | [Landat Level 0](https://www.usgs.gov/media/files/landsat-8-level-0-reformatted-data-format-control-book)  |
| L1         | Unpacked, reformatted level 0 data, with all supplemental informationto be used in subsequent processing appended. Optional radiometric andgeometric correction applied to produce parameters in physical units. Data generally presented as full time/space resolution. A wide variety of sub levelproducts are possible (see below). | [Sentinel-1 Level 1](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar/product-types-processing-levels/level-1) |
| L1A        | Reconstructed, unprocessed instrument data at full resolution, time-referenced, and annotated with ancillary information, including radiometric and geometric calibration coefficients and georeferencing parameters (e.g., platform ephemeris) computed and appended but not applied to Level 0 data. | [Sentinel-2 L1A](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/product-types/level-1a)
| L1B         | Level 1A data that have been processed to sensor units (not all instruments have Level 1B source data). | [Sentinel-2 L1B](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/product-types/level-1b)
| L1C         | Level 1B data that have been processed on a on the reference ellipsoid and represented in a uniform preselected cartographic presentation. | [Sentinel-2 L1C](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/product-types/level-1c) |
| L1D         | Level 1C data that have been processed to generate a geocoded terrain corrected product which is fully calibrated through the use of a terrain model, then detected, geolocated on a DEM (Digital Elevation Model), and represented in a uniform pre-selected cartographic projection. | [KOMPSAT-5 L1D](https://directory.eoportal.org/web/eoportal/satellite-missions/k/kompsat-5) |
| L1TP        | Radiometrically calibrated and orthorectified product using ground control points (GCPs) and digital elevation model (DEM) data to correct for relief displacement. | Landsat7/8 L1TP |
| L1GT        | Radiometrically calibrated product with systematic geometric corrections applied using the spacecraft ephemeris data and DEM data to correct for relief displacement. | Landsat7/8 L1GT |
| L1GS        | Radiometrically calibrated product with only systematic geometric corrections applied using the spacecraft ephemeris data. | Landsat7/8 L1GS |
| L2          | Retrieved environmental variables (e.g., ocean wave height, soilmoisture, ice concentration) at the same resolution and location as the level 1 source data. A wide variety of sub levelproducts are possible (see below). | |
| L2A         | Derived geophysical variables at the same resolution and location as Level 1 source data applying specific algorithm such as scene classification and atmospheric correction | [Sentinel-2 L2A](https://earth.esa.int/web/sentinel/technical-guides/sentinel-2-msi/level-2a-processing) |
| L2SP        | Surface reflectance and surface temperature science products | [Landsat Level 2 science products](https://www.usgs.gov/core-science-systems/nli/landsat/landsat-collection-2-level-2-science-products)
| L3          | Data or retrieved environmental variables which have been spatiallyand/or temporally re-sampled (i.e., derived from level 1 or 2 products). Such re-sampling may include averaging and compositing.  A wide variety of sub levelproducts are possible (see below). | [ENVISAT Level-3](http://envisat.esa.int/level3/), [Sentinel-2 L3](https://s2gm.sentinel-hub.com/)
| L4          | Model output or results from analyses of lower level data (i.e.,variables that are not directly measured by the instruments, but are derived fromthese measurements) |

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to processing levels:

* the [Sat Extension Specification](../sat/README.md) to describe data collected from a satellite.