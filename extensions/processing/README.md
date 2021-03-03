# Processing Extension Specification

- **Title: Processing**
- **Identifier: processing**
- **Field Name Prefix: processing**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @emmanuelmathot

Processing metadata is considered to be data that indicate from which processing chain a data originates and how the data itself has been produced. Overall, it helps to increase traceability and search among processing levels and multiple algorithm versions.

Often, data items are the result of one or more waterfall processing pipeline. Tracing information such as the processing facility, the algorithm version or the processing date helps in the data version management.

This extension applies to STAC Items and STAC Collections. As these processing information are often closely bound to the Collection level and therefore are shared across all items, it is recommended adding the fields to the corresponding STAC Collection.

- [Examples](examples/): [Sentinel-1 Item](examples/sentinel1-item.json),  [Sentinel-2 Level 1C Collection](examples/sentinel2-collection.json)
- [JSON Schema](json-schema/schema.json)

## Item Properties and Collection Fields

* For Items, the fields are placed in the properties. Additionally, STAC allows all Item properties to be used in the Asset Object.
* For Collections, the fields are placed in the [Provider Objects](../../collection-spec/collection-spec.md#Provider-Object) for the `providers` that have the role `producer` or `processor` assigned.

| Field Name              | Type                | Description |
| ----------------------- | ------------------- | ----------- |
| processing:lineage      | string              | Lineage Information provided as free text information about the how observations were processed or models that were used to create the resource being described [NASA ISO](https://wiki.earthdata.nasa.gov/display/NASAISO/Lineage+Information). For example, `GRD Post Processing` for "GRD" product of Sentinel-1 satellites. [CommonMark 0.29](https://commonmark.org/) syntax MAY be used for rich text representation. |
| processing:level        | string              | The name commonly used to refer to the processing level to make it easier to search for product level across collections or items. The short name must be used (only `L`, not `Level`). See the [list of suggested processing levels](#suggested-processing-levels). |
| processing:facility     | string              | The name of the facility that produced the data. For example, `Copernicus S1 Core Ground Segment - DPA` for product of Sentinel-1 satellites. |
| processing:software     | Map<string, string> | A dictionary with name/version for key/value describing one or more softwares that produced the data. For example, `"Sentinel-1 IPF":"002.71"` for the software that produces Sentinel-1 satellites data. |

*At least one of the fields must be specified.*

### Processing Date Time

The time of the processing is directly specified via the `created` properties of the target asset as specified in the [STAC Common metadata](https://github.com/radiantearth/stac-spec/blob/master/item-spec/common-metadata.md#date-and-time)

### Linking the Items

In Items that declare this `processing` extension, it is recommended to add one or more [Links](../../item-spec/item-spec.md#relation-types) with `derived_from` or `via` relationships to the eventual source metadata & data used in the processing. They could be used to trace back the processing history of the dataset.

### Suggested Processing Levels

The `processing:level` is the name that is commonly used to refer to that processing level properties. The table below shows some processing level used by the industry for some data product.

Each level represents a step in the abstraction process by which data relevant to physical information (raw, level 0, level 1) are turned into data relevant to geo physical information (level 2, level 3), and finally turned into data relevant to thematic information (level4)

This list is not exhaustive and can be extended with the processing level specific to a data product.

| Level Name | Description | Typical data product |
| ---------- | ----------- | -------------------- |
| RAW        | Data in their original packets, as received from the instrument. | [Sentinel-1 RAW](https://sentinel.esa.int/web/sentinel/technical-guides/sentinel-1-sar/products-algorithms/level-0-products/raw) |
| L0         | Reconstructed unprocessed instrument data at full space time resolution with all available supplemental information to be used in subsequent processing (e.g., ephemeris, health and safety) appended. | [Landsat Level 0](https://www.usgs.gov/media/files/landsat-8-level-0-reformatted-data-format-control-book)  |
| L1         | Unpacked, reformatted level 0 data, with all supplemental information to be used in subsequent processing appended. Optional radiometric and geometric correction applied to produce parameters in physical units. Data generally presented as full time/space resolution. A wide variety of sub level products are possible (see below). | [Sentinel-1 Level 1](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar/product-types-processing-levels/level-1) [Sentinel-2 L1A](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/product-types/level-1a) |
| L2          | Retrieved environmental variables (e.g., ocean wave height, soil-moisture, ice concentration) at the same resolution and location as the level 1 source data. A wide variety of sub-level products are possible (see below). | [Sentinel-2 L2A](https://earth.esa.int/web/sentinel/technical-guides/sentinel-2-msi/level-2a-processing) |
| L3          | Data or retrieved environmental variables which have been spatiallyand/or temporally re-sampled (i.e., derived from level 1 or 2 products). Such re-sampling may include averaging and compositing.  A wide variety of sub-level products are possible (see below). | [ENVISAT Level-3](http://envisat.esa.int/level3/), [Sentinel-2 L3](https://s2gm.sentinel-hub.com/) |
| L4          | Model output or results from analyses of lower level data (i.e.,variables that are not directly measured by the instruments, but are derived from these measurements) |  |

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to processing levels:

* the [Sat Extension Specification](../sat/README.md) to describe data collected from a satellite.
