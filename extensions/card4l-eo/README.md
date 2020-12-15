# STAC CARD4L Optical Extension

- **Title: CARD4L Optical**
- **Identifier: card4l-eo**
- **Field Name Prefix: card4l** (shared with the CARD4L SAR Extension)
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension specifies how to create STAC Items that comply to the [CEOS CARD4L](http://ceos.org/ard/) product family specification for either
- *Optical Surface Reflectance* (SR) products in version 5.0
  ([PDF](http://ceos.org/ard/files/PFS/SR/v5.0/CARD4L_Product_Family_Specification_Surface_Reflectance-v5.0.pdf),
  [Word](http://ceos.org/ard/files/PFS/SR/v5.0/CARD4L_Product_Family_Specification_Surface_Reflectance-v5.0.docx))
  *or*
- *Optical Surface Temperature* (ST) products in version 5.0
  ([PDF](http://ceos.org/ard/files/PFS/ST/v5.0/CARD4L_Product_Family_Specification_Surface_Temperature-v5.0.pdf),
  [Word](http://ceos.org/ard/files/PFS/ST/v5.0/CARD4L_Product_Family_Specification_Surface_Temperature-v5.0.docx)).

**Document structure:** In general, the fields required in this extension are required to either meet the *threshold (minimum) requirements* by the CEOS CARD4L specification *or* are required fields in STAC. Any additional optional field provided may lead to a higher percentage of the CARD4L *target (desired) requirements* met.

The column *Field Name* refers to the STAC field names. The column *Req.* refers to the requirement number in the CARD4L specification.

**STAC Extensions:** This extension requires a number of existing STAC extensions and, for *STAC mode*, adds additional fields:

- [EO](../eo/README.md)
- [Processing](../processing/README.md)
- [Projection](../projection/README.md)
- [View](../view/README.md)

**Additional resources:**

- [Examples](examples/) (ToDo)
- [JSON Schema](json-schema/) (ToDo)

## STAC Items

STAC Items must always be valid, but not all STAC Item requirements are covered here, only additional requirements and mappings to fulfill the CARD4L requirements are listed here:

| Field Name      | Description                                                  | Req.  |
| --------------- | ------------------------------------------------------------ | ----- |
| stac_extensions | **REQUIRED.** Must contain all extensions used, for the product at least the following values: `card4l-eo`, `eo`, `processing`, `projection`, `view`. | *n/a* |
| geometry        | **REQUIRED.** The geometry of the acquisition.               | 1.4   |
| bbox            | **REQUIRED.** The bounding box of the acquisition.           | 1.4   |

### STAC Item Properties

#### CARD4L

All these fields are **required** in **STAC mode** only! In XML Mode they are expected to be in the XML file.

| Field Name                         | Data Type | Description                                               | Req. |
| ---------------------------------- | --------- | --------------------------------------------------------- | ---- |
| card4l:northern_geometric_accuracy | number    | An estimate of the northern geometric accuracy in meters. | 1.8  |
| card4l:eastern_geometric_accuracy  | number    | An estimate of the eastern geometric accuracy in meters.  | 1.8  |

Note that the following fields aligned with the CARD4L SAR extension: card4l:northern/eastern_geometric_accuracy

#### Common Metadata

| Field Name     | Description                                                  | Req.  |
| -------------- | ------------------------------------------------------------ | ----- |
| license        | Recommended to be specified in a STAC Collection.            |       |
| datetime       | **REQUIRED.** The time of the acquisition, usually the central timestamp between `start_datetime` and `end_datetime`. | 1.3   |
| start_datetime | Start time of the acquisition.                               | 1.3   |
| end_datetime   | End time of the acquisition.                                 | 1.3   |
| instruments    | **REQUIRED.**                                                | 1.9   |
| constellation  | Constellation name in lower-case. Only if part of a constellation, e.g. `sentinel-2` for Sentinel 2A and 2B. Can often be derived from `platform`. | (1.9) |
| platform       | Platform name in lower-case. Use a specific name such as `sentinel-2a` if part of constellation. MUST NOT duplicate `constellation`. | (1.9) |

#### EO (Electro-Optical)

| Field Name     | Description | Req. |
| -------------- | ----------- | ---- |
| eo:cloud_cover |             | 1.17 |

#### Processing

| Field Name          | Description                                                  | Req.        |
| ------------------- | ------------------------------------------------------------ | ----------- |
| processing:facility | **REQUIRED.**                                                |             |
| processing:software | String likely needs to be split into software name and version number. | 1.13 / 1.15 |
| processing:lineage  | Additional processing information and parameters, e.g. a description of the processing chain. | 1.15        |

See also the [notes](#notes) regarding the requirements 1.13 and 1.15 for a better understanding of how to use the fields best.

#### Projection

| Field Name                            | Description                                                  | Req.      |
| ------------------------------------- | ------------------------------------------------------------ | --------- |
| proj:epsg / proj:wkt2 / proj:projjson | **REQUIRED.** At least one of the three properties `proj:epsg`, `proj:wkt2` or `proj:projjson` is required. It MUST specify the coordinate reference system (1.5) and MAY specify the map projection (1.6). | 1.5 / 1.6 |

#### View

| Field Name           | Description                                                  | Req. |
| -------------------- | ------------------------------------------------------------ | ---- |
| view:off_nadir       | **REQUIRED.** The average off-nadir angle, for per-pixel angles, refer to the asset with the key `off-nadir`. Convert to degree, if required. | 2.8  |
| view:incidence_angle | **REQUIRED.** The average incidence angle, for per-pixel angles, refer to the asset with the key `incidence-angle`. Convert to degree, if required. | 2.8  |
| view:azimuth         | **REQUIRED.** The average azimuth angle, for per-pixel angles, refer to the asset with the key `azimuth`. Convert to degree, if required. | 2.8  |
| view:sun_azimuth     | **REQUIRED.** The average sun azimuth angle, for per-pixel angles, refer to the asset with the key `sun-azimuth`. Convert to degree, if required. | 2.8  |
| view:sun_elevation   | **REQUIRED.** The average sub elevation angle, for per-pixel angles, refer to the asset with the key `sun-elevation`. Convert to degree, if required. | 2.8  |

### STAC Item Links

| Relation Type        | Description                                                  | Req.  |
| -------------------- | ------------------------------------------------------------ | ----- |
| card4l-document      | **REQUIRED.** Provides at least one link to the CARD4L specification document. Word (media type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and/or PDF (media type: `application/pdf`). | *n/a* |
| derived_from         | Points back to the source's STAC Item. May be multiple items, if the product is derived from multiple acquisitions. | *n/a* |
| about                | Link to algorithms used in the generation process. See also the [notes](#notes) regarding req. 1.13. | 1.13  |
| related              | Link to the sources of ancillary or auxiliary data used in the generation process. Excludes DEMs, which use the relation `elevation-model` instead. | 1.14  |
| access               | Link to data access information.                             | 1.16  |
| sensor-calibration   | Link to the sensor calibration parameters.                   | 1.11  |
| radiometric-accuracy | Link describing the assessed absolute radiometric uncertainty of the version of the data or product. | 1.12  |
| geometric-correction | Link to the Geometric Correction algorithm details.          | 1.7   |
| elevation-model      | Links to the Digital Elevation Models. Preferably links to a STAC Item with additional metadata for the DEMs. | 1.14  |
| geometric-accuracy   | Link to documentation of estimate of absolute localization error. | 1.8   |

### STAC Item Assets

Whether the metadata are provided in a single record relevant to all pixels, or separately for each pixel, is at the discretion of the data provider. 

Each of the assets can either be exposed individually or grouped together in any form. In the latter case the role names can simply be merged to a set of unique role names. 

The italic role names are proposed to be the asset's key.

| Role Name(s)                           | Additional properties                                        | Description                                                  | Req.  |
| -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----- |
| *card4l*, metadata                     | `type`                                                       | Points to a metadata file in XML format, which follows the CARD4L examples. Media type: `application/xml` | *n/a* |
| *off-nadir*, metadata                  | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel off-nadir angles.            | 2.8   |
| *incidence-angle*, metadata            | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel incidence angles.            | 2.8   |
| *azimuth*, metadata                    | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel azimuth angles.              | 2.8   |
| *sun-azimuth*, metadata                | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel sun azimuth angles.          | 2.8   |
| *sun-elevation*, metadata              | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel sun elevation angles.        | 2.8   |
| *date*, metadata                       | `type`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | Points to a file with per-pixel acquisition timestamps.      | 1.3   |
| (*reflectance* or *temperature*), data | `type`, `created`, `eo:bands`, `file:data_type`, `file:byte_order`, `card4l:bits_per_sample` | **REQUIRED.** Points to the actual measurements.             | 3.1   |

#### Additional Asset Properties

| Field Name             | Data Type  | Description                                                  | Req.  |
| ---------------------- | ---------- | ------------------------------------------------------------ | ------- |
| type                   | string     | **REQUIRED.** The media type of the file format.             | *n/a* |
| created                | string     | The time of the processing is specified via the `created` property of the asset as specified in the [STAC Common metadata](../../item-spec/common-metadata.md#date-and-time). | *n/a* |
| eo:bands               | \[[Band Object](../eo/README.md#band-object)\] | **REQUIRED.** Bands with at least the following fields included: `name` and `center_wavelength`. Add additional fields such as `full_width_half_max` to better meet the *target (desired) requirements*. See the CARD4L requirement 1.10 for further details. | 1.10 |
| file:data_type         | string     | One of the [Data Types](#data-types). | *n/a*     |
| file:byte_order        | string     | One of `big-endian` or `little-endian` | *n/a*    |
| card4l:bits_per_sample | integer    | Bits per sample, e.g. 8, 16, 32, ... | *n/a*      |

##### Data Types

- `int8`: 8-bit integer
- `int16`: 16-bit integer
- `int32`: 32-bit integer
- `uint8`: unsigned 8-bit integer
- `unit16`: unsigned 16-bit integer
- `uint32`: unsigned 32-bit integer
- `float32`: 32-bit float
- `float64`: 64-big float
- `cint16`: 16-bit complex integer
- `cint32`: 32-bit complex integer
- `cfloat32`: 32-bit complex float
- `cfloat64`: 64-bit complex float

## Notes

1.13: The algorithms can be given either in `proc:software` or as link with relation type `about`. One of them is **required** by CARD4L.

1.15: STAC only mandates to use `processing:lineage` to describe processing chains, but you may also include or link to a more machine-readable processing chain description such as a Dask graph, a openEO process or a SNAP graph.

1.17: Other data quality flags than `eo:cloud_cover` should be set.

ToDo: 2.2 - 2.7, 3.2, 3.3, 4.1
