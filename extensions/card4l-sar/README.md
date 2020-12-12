# STAC CARD4L SAR Extension

- **Title: CARD4L SAR**
- **Identifier: card4l-sar**
- **Field Name Prefix: card4l** (shared with a future CARD4L Optical Extension)
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This extension specifies how to create STAC Items that comply to the [CEOS CARD4L](http://ceos.org/ard/) product family specification for either
- *SAR Normalized Radar Backscatter* (NRB) products in version 5.0
  ([PDF](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.pdf),
  [Word](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.docx))
  *or*
- *SAR Polarimetric Radar* (POL) products in version 3.0
  ([PDF](http://ceos.org/ard/files/PFS/POL/v3.0/CARD4L-PFS_Polarimetric_Radar-v3.0.pdf),
  [Word](http://ceos.org/ard/files/PFS/POL/v3.0/CARD4L-PFS_Polarimetric_Radar-v3.0.docx)).

The following CARD4L metadata specifications lists requirements and maps them to a proposal of XML tags.
We will refer to the included XML Tags throughout this document:

- *SAR Normalized Radar Backscatter* (NRB) metadata specification
  ([XLSX](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L_METADATA-spec_NRB-v5.0.xlsx))
- *SAR Polarimetric Radar* (POl) metadata specification
  ([XLSX](http://ceos.org/ard/files/PFS/POL/v3.0/CARD4L_METADATA-spec_POL-v3.0.xlsx)).

**Modes:** This extension can be used in two different variants:

1. *XML mode*: A STAC entry without CARD4L specific fields is published in addition to the complete XML file proposed by CEOS. This is recommended if no STAC Item exists for the source file. Also, CARD4L (2.1) has in the *threshold (minimum) requirements* that 

   > metadata is formatted in accordance with CARD4L [...] Metadata Specifications, v.5.0.
   
    The CARD4L Metadata Specification is XML-based.

2. *STAC mode*: Two STAC files are published (one for the source file, one for the product file). No additional XML file is required. This is recommended if you derive the CARD4L compliant product from a STAC Item.

**Document structure:** In general, the fields required in this extension are required to either meet the *threshold (minimum) requirements* by the CEOS CARD4L metadata specification *or* are required fields in STAC. Any additional optional field provided will lead to a higher percentage for the CARD4L *target (desired) requirements*.

The column *Field Name* refers to the STAC field names.
The column *XML Tag* refers to the XML tag proposed in the CARD4L metadata specification documents. *Src* and *Prod* define whether they apply for the STAC Item of the Source and Product respectively and give the requirement number in the CARD4L documents.

- ✓ = Applies
- (✓) = Not mentioned in CEOS CARD4L requirements, but recommended by STAC for better data discovery, especially in XML Mode.
- ✗ = Does not apply

**STAC Extensions:** This extension requires a number of existing STAC extensions and, for *STAC mode*, adds additional fields:

- [Processing](../processing/README.md)
- [Projection](../projection/README.md)
- [SAR](../sar/README.md)
- [Satellite](../sat/README.md)
- [View](../view/README.md)

**Additional resources:**

- [Examples](examples/)
  - [NRB in XML Mode](examples/nrb/xml-mode/)
- [JSON Schema](json-schema/schema.json) (ToDo: update)

## STAC Items

A STAC Item for the Source (*Src*) is only required in STAC mode. Otherwise a XML file can be provided.

STAC Items must always be valid STAC Item. Requirements directly specified in the STAC Item specification are not covered here, only additional requirements and mappings to fulfill the CARD4L requirements are listed here:

| Field Name      | XML Tag                                                      | Description                                                  | Src     | Prod    |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- | ------- |
| stac_extensions | *n/a*                                                        | **REQUIRED.** Must contain all extensions used, for the product at least the following values: `card4l-sar`, `processing`, `projection`, `sar`, `sat`, `view` | ✓       | ✓       |
| id              | `ProductID`                                                  | **REQUIRED.**                                                | ✓ 1.6.6 | ✗       |
| geometry        | `GeodeticCoordinates`, `Latitude`, `Longitude`, `Height` (Src), `GeographicalExtent` (Prod) | **REQUIRED.** The geometry of the acquisition. May include the height as every third element. | ✓ 1.6.7 | ✓ 1.7.5 |
| bbox            | derived from `geometry` (Src), `GeographicalBoundingBox` (Prod) | **REQUIRED.** The bounding box of the acquisition. May include the height as every third element. | ✓ 1.6.7 | ✓ 1.7.4 |

### STAC Item Properties

#### CARD4L

All these fields are **required** in **STAC mode** only! In XML Mode they are expected to be in the XML file.

| Field Name                             | Data Type                                               | XML Tag                                      | Description                                                  | Src      | Prod    |
| -------------------------------------- | ------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ | -------- | ------- |
| card4l:beam_id                         | string                                                  | `BeamID`                                     | **REQUIRED.**                                                | ✓ 1.6.4  | ✗       |
| card4l:orbit_data_source               | string                                                  | `OrbitDataSource`                            | **REQUIRED.** One of `predicted`, `definitive`, `downlinked` | ✓ 1.6.5  | ✗       |
| card4l:orbit_mean_altitude             | number                                                  | `OrbitMeanAltitude`                          | Platform (mean) altitude in meters.                          | ✓ 1.6.5  | ✗       |
| card4l:incidence_angle_near_range      | number                                                  | `IncAngleNearRange`                          | **REQUIRED.** Convert to degree, if required.                | ✓ 1.6.7  | ✗       |
| card4l:incidence_angle_far_range       | number                                                  | `IncAngleFarRange`                           | **REQUIRED.** Convert to degree, if required.                | ✓ 1.6.7  | ✗       |
| card4l:noise_equivalent_intensity      | float                                                   | `NoiseEquivalentIntensity`                   | **REQUIRED.** Convert to decibel, if required.               | ✓ 1.6.9  | ✗       |
| card4l:noise_equivalent_intensity_type | string                                                  | `NoiseEquivalentIntensity`, attribute `type` | **REQUIRED.** One of `Beta0` or `Sigma0`                     | ✓ 1.6.9  | ✗       |
| card4l:mean_faraday_rotation_angle     | float                                                   | `MeanFaradayRotationAngle`                   | Convert to degree, if required.                              | ✓ 1.6.11 | ✗       |
| card4l:ionosphere_indicator            | boolean                                                 | `IonosphereIndicator`                        | Flag indicating whether the backscatter imagery is “significantly impacted” by the ionosphere (`false` - no, `true` – yes). | ✓ 1.6.12 | ✗       |
| card4l:speckle_filtering               | [Speckle Filter Object](#speckle-filter-object) \| null | `Filtering`, `FilterApplied`                 | **REQUIRED.** Set to `null` if `FilterApplied` would be set to `false`. Otherwise make it an Speckle Filter Object. | ✗        | ✓ 1.7.4 |
| card4l:border_pixels                   | integer                                                 | `NumBorderPixels`                            | Number of border pixels (**required** if applicable). To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗        | ✓ 1.7.7 |
| card4l:pixel_coordinate_convention     | string                                                  | `PixelCoordinateConvention`                  | **REQUIRED.** One of `center` (pixel centre), `upper-left` (pixel ULC) or `lower-left` (`pixel LLC`) | ✗        | ✓ 1.7.7 |

##### Speckle Filter Object

The following fields are all specified in CARD4L requirement 1.7.4. It is **required** to add all speckle filter parameters to this object.

| Field Name       | Data Type | XML Tag           | Description                        |
| ---------------- | --------- | ----------------- | ---------------------------------- |
| type             | string    | `FilterType`      | **REQUIRED.**                      |
| window_size_col  | integer   | `WindowSizeCol`   |                                    |
| window_size_line | integer   | `WindowSizeLine`  |                                    |
| ...              | ...       | `OtherParameters` | Add all speckle filter parameters. |

#### Common Metadata

| Field Name     | XML Tag                                         | Description                                                  | Src     | Prod  |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------ | ------- | ----- |
| license        | `Product`, attribute `Copyright`                | Recommended to be specified in a STAC Collection.            | ✓ 1.3   | ✓ 1.3 |
| datetime       | *n/a*                                           | **REQUIRED.** Recommended to set to the central timestamp between `start_datetime` and `end_datetime`. | ✓       | ✓     |
| start_datetime | `FirstAcquistionDate` (Prod), `StartTime` (Src) | **REQUIRED.** Start time of the first acquisition.           | ✓ 1.6.3 | ✓ 1.5 |
| end_datetime   | `LastAcquistitionDate` (Prod), `EndTime` (Src)  | **REQUIRED.** End time of the last acquisition.              | ✓ 1.6.3 | ✓ 1.5 |
| instruments    | `Instrument`                                    | **REQUIRED.** Check STAC for potential values, example: `c-sar` for Sentinel-1 | ✓ 1.6.2 | (✓)   |
| constellation  | *n/a*                                           | If part of a constellation (e.g. `sentinel-1` for Sentinel 1A and 1B), can often be derived from `Satellite`, lower-case | ✓ 1.6.2 | (✓)   |
| platform       | `Satellite`                                     | **REQUIRED.** If part of constellation, use specific name, e.g. `sentinel-1a`. *Must not* duplicate `constellation`, lower-case | ✓ 1.6.2 | (✓)   |

#### Processing

| Field Name          | XML Tag                                                     | Description                                                  | Src     | Prod    |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | ------- | ------- |
| processing:facility | `ProcessingFacility`                                        | **REQUIRED.**                                                | ✓ 1.6.6 | ✓ 1.7.1 |
| processing:software | `SoftwareVersion`                                           | **REQUIRED.** String likely needs to be split into software name and version number. | ✓ 1.6.6 | ✓ 1.7.1 |
| processing:lineage  | `RangeLookBandwidth`,  `AzimuthLookBandwidth`, `lutApplied` | Additional processing information and parameters, e.g. Range- and Azimuth Look Bandwidth and LUT applied (Src only) | ✓ 1.6.6 |         |

#### Projection

| Field Name     | XML Tag                              | Description                                                  | Src  | Prod     |
| -------------- | ------------------------------------ | ------------------------------------------------------------ | ---- | -------- |
| proj:shape     | `NumberLines`, `NumberPixelsPerLine` | **REQUIRED.** To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗    | ✓ 1.7.7  |
| proj:epsg      | `CoordinateReferenceSystem`          | See comment below*.                                          | (✓)  | ✓ 1.7.9  |
| proj:wkt2      | `MapProjection`                      | See comment below*.                                          | (✓)  | ✓ 1.7.10 |
| proj:transform | *n/a*                                | To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗    | (✓)      |

\* At least one of the three properties `proj:epsg`, `proj:wkt2` or `proj:projjson` is **required**. It must specify the coordinate reference system (1.7.9) and map projection (1.7.10). For target (desired) requirements, CARD4L asks that the CRS is an EPSG code and the Map Projection a human readable code such as WKT.

#### SAR

| Field Name                | XML Tag                                                  | Description                                                  | Src     | Prod  |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ | ------- | ----- |
| sar:instrument_mode       | `ObservationMode`                                        | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)   |
| sar:frequency_band        | `RadarBand`                                              | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)   |
| sar:center_frequency      | `RadarCenterFrequency`                                   | **REQUIRED.** Convert to GHz if required.                    | ✓ 1.6.4 | (✓)   |
| sar:polarizations         | `Polarizations`                                          | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)   |
| sar:product_type          | `ProductLevel` (Src), `Product`, attribute `type` (Prod) | **REQUIRED.** `NRB` for NRB products, `POL` for POL products. | ✓       | ✓ 1.3 |
| sar:observation_direction | `AntennaPointing`                                        | **REQUIRED.** Lower-case                                     | ✓ 1.6.4 | (✓)   |
| sar:looks_azimuth         | `AzimuthNumberOfLooks`                                   | **REQUIRED.**                                                | ✓ 1.6.6 | ✗     |
| sar:looks_range           | `RangeNumberOfLooks`                                     | **REQUIRED.**                                                | ✓ 1.6.6 | ✗     |
| sar:pixel_spacing_azimuth | `AzimuthPixelSpacing`                                    | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗     |
| sar:pixel_spacing_range   | `RangePixelSpacing`                                      | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗     |
| sar:resolution_azimuth    | `AzimuthResolution`                                      | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗     |
| sar:resolution_range      | `RangeResolution`                                        | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗     |

#### Satellite

| Field Name         | XML Tag         | Description              | Src     | Prod |
| ------------------ | --------------- | ------------------------ | ------- | ---- |
| sat:orbit_state    | `PassDirection` | **REQUIRED.** Lower-case | ✓ 1.6.5 | (✓)  |
| sat:relative_orbit | *n/a*           |                          | ✓       | (✓)  |
| sat:absolute_orbit | *n/a*           |                          | ✓       | (✓)  |

#### View

| Field Name           | XML Tag           | Description                                                  | Src     | Prod |
| -------------------- | ----------------- | ------------------------------------------------------------ | ------- | ---- |
| view:azimuth         | `PlatformHeading` | Convert to degree, if required.                              | ✓ 1.6.5 | ✗    |
| view:incidence_angle | *n/a*             | Center between `card4l:incidence_angle_near_range` and `card4l:incidence_angle_far_range`. This is the sensor incidence angle. For per-pixel incidence angles, refer to the asset with the key `angle`. | ✓ 1.6.5 | ✗    |

### STAC Item Links

| Relation Type               | XML Tag                                                      | Description                                                  | Src      | Prod    |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- | ------- |
| card4l-document             | `DocumentIdentifier`                                         | **REQUIRED.** Instead of the document identifier, provide links to the Word (media type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and PDF (media type: `application/pdf`) document. | ✗        | ✓ 1.5   |
| derived_from                | *n/a*                                                        | **REQUIRED in *STAC Mode*.** Points back to the source's STAC Item, which must comply to the *Src* requirements. May be multiple items, if the product is derived from multiple acquisitions. The number of acquisitions (`NumberOfAcquisitions`) is the number of links with this relation type. | ✗        | ✓ 1.6   |
| via                         | *n/a*                                                        | **REQUIRED in *XML Mode*.** Points back to the CARD4L compliant XML file as it is proposed in the CARD4L metadata specification (see the XSLX file). | ✗        | ✓       |
| about                       | `NRAlgorithm`, `RTCAlgorithm`, `DEMReference`, `EGMReference`, `AccuracyReference`, `Filtering` (1.7.10) | Links from the given XML tags can be added as additional information about the product. |          |         |
| performance-indicators      | `PerformanceIndicators`                                      | Link to performance indicators on data intensity mean noise level. | ✓ 1.6.9  | ✗       |
| orbit-data-file             | `OrbitDataFile`                                              | Link to orbit data file containing state vectors.            | ✓ 1.6.5  | ✗       |
| sensor-calibration          | `SensorCalibration`                                          | Link to the sensor calibration parameters.                   | ✓ 1.6.8  | ✗       |
| pol-cal-matrices            | `PolCalMatrices`                                             | Link to the complex-valued polarimetric distortion matrices with the channel imbalance and the cross-talk applied for the polarimetric calibration. | ✓ 1.6.10 | ✗       |
| referenced-faraday-rotation | `ReferenceFaradayRotation`                                   | Link to the method or paper used to derive the estimate for the mean Faraday rotation angle. | ✓ 1.6.11 | ✗       |
| ancillary-data              | `AncillaryData`                                              | Link to the sources of ancillary data such as DEMs used in the generation process. | ✗        | ✓ 1.7.2 |

ToDo: Male relation types from XML Tags

### STAC Item Assets

| Asset Key           | Role Name(s)          | Additional properties          | XML Tag                      | Description                                                  | Src  | Prod  |
| ------------------- | --------------------- | ------------------------------ | ---------------------------- | ------------------------------------------------------------ | ---- | ----- |
| local-inc-angle     | data *and* metadata              | `created`                      | `LocalIncAngle`              | **REQUIRED.** Points to the local incidence angle file.      | ✗    | ✓ 2.4 |
| area                | data *and* metadata              | `created`                      | `LocalContributingArea`      | **REQUIRED.** Points to the normalized scattering area file. | ✗    | ✓ 2.3 |
| hh / hv / vh / vv   | data                  | `sar:polarizations`, `created` | `BackscatterMeasurementData` | **REQUIRED.** Points to the polarization file.               | ✗    | ✓ 3.1 |
| mask                | data *and* metadata              | `created`                      | `DataMask`                   | **REQUIRED.** Points to the data mask file.                  | ✗    | ✓ 2.2 |
| metadata            | metadata *and* card4l | -                              | *n/a*                        | **REQUIRED in *XML Mode*.** Points to the CARD4L metadata XML file. Media type: `application/xml` | ✗    | ✓ 2.1 |
| ellipsoid-inc-angle | data *and* metadata   |                                | `EllipsoidIncAngle`          |                                                              | ✗    | ✓ 2.5 |
| noise-power         | data *and* metadata              |                                | `NoisePower`                 |                                                              | ✗    | ✓ 2.6 |
| gamma-sigma         | data *and* metadata              |                                | `GammaToSigmaRatio`          |                                                              | ✗    | ✓ 2.7 |
| date                | data *and* metadata              |                                | `AcquisitionDate`            |                                                              | ✗    | ✓ 2.8 |

#### Additional Asset Properties

For all assets of with the role set to `data`, the following additional properties can be specified globally (in [STAC Item Properties](#stac-item-properties)) or individually per asset: `proj:shape`, `proj:transform`, `card4l:num_border_pixels`. See the respective field specifications above.

Some additional properties are always specified per asset: 

| Field Name         | XML Tag                                         | Description                                                  | Src     | Prod    |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ------- | ------- |
| created            | `ProcessingDate` (Src), `ProcessingTime` (Prod) | **REQUIRED.** The time of the processing is specified via the `created` property of the asset as specified in the [STAC Common metadata](../../item-spec/common-metadata.md#date-and-time). | ✓ 1.6.6 | ✓ 1.7.1 |
| sar:polarizations  | *n/a*                                           | **REQUIRED**. The polarization(s) of the asset.              | (✓)     | ✓       |
| card4l:header_size | `HeaderSize`                                    | File header size in bytes (**required** if applicable).      | ✗       | ✓ 1.7.7 |

## Notes

1.6.1 / 1.7.1: `SourceDataRepository` and `RepositoryURL` are covered by STAC link structures. All CARD4L compliant STAC Catalog are **required** to make intensive use of STAC link relation types such as `root`, `parent`, `child`, `item` and `collection`.

1.6.9: `SideLobeLevel`, `IntegratedSideLobeRatio`, `CrossCorrelationWidth`, `CrossCorelationPeakLoc` are *recommended* to be included in the resource linked to with the relation type [`performance-indicators`](#stac-item-links).

1.7.3: `ProductColumnSpacing`, `ProductRowSpacing` are not sufficiently specified in the CARD4L specifications (unit missing). Therefore they are missing here at the moment. (ToDo: Can we re-use `sar:pixel_spacing_azimuth` and `sar:pixel_spacing_range`?)
