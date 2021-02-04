# STAC CARD4L SAR Extension

- **Title: CARD4L SAR**
- **Identifier: card4l-sar**
- **Field Name Prefix: card4l** (shared with the CARD4L Optical Extension)
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
- *SAR Polarimetric Radar* (POL) metadata specification
  ([XLSX](http://ceos.org/ard/files/PFS/POL/v3.0/CARD4L_METADATA-spec_POL-v3.0.xlsx)).

**Document structure:** In general, the fields required in this extension are required to either meet the *threshold (minimum) requirements* by the CEOS CARD4L metadata specification *or* are required fields in STAC. Any additional optional field provided will lead to a higher percentage for the CARD4L *target (desired) requirements*.

The column *Field Name* refers to the STAC field names.
The column *XML Tag* refers to the XML tag proposed in the CARD4L metadata specification documents. *Src* and *Prod* define whether they apply for the STAC Item of the Source and Product respectively and give the requirement number in the CARD4L documents.

- ✓ = Applies
- (✓) = Not mentioned in CEOS CARD4L requirements, but recommended to be added, for example for better data discovery through STAC.
- ✗ = Does not apply

**STAC Extensions:** This extension makes use of a number of existing STAC extensions:

- [File](../file/README.md)
- [Processing](../processing/README.md)
- [Projection](../projection/README.md)
- [SAR](../sar/README.md)
- [Satellite](../sat/README.md)
- [View](../view/README.md) (optional)

You have to read the STAC extensions in combination with this extension as this extension just provides the mapping between the STAC fields and the CARD4L requirements, but this extension doesn't give information on the data type or an actual detailed description about the fields.

**Additional resources:**

- [Examples](examples/) (ToDo)
- [JSON Schema](json-schema/schema.json) (ToDo)

## STAC Collections

CARD4L lists a lot of requirements (and fields) that have common values across all generated STAC Items and assets.
Thus, it is **recommended** to provide a STAC Collection for the Items and put common fields (in the STAC Item `properties`)
into [Collection `summaries`](../../collection-spec/collection-spec.md#collection-fields).
While the STAC Item fields still need to be in the Item, too, you can de-duplicate links and assets by putting common
links once into the STAC Collection links. Also, common assets can be just put once into the STAC Collection using the
STAC extension [Collection Assets](../collection-assets/README.md).
All this is still CARD4L compliant as CARD4L doesn't require all information to be in a single file.

## STAC Items

CARD4L requires metadata for both source data (*Src*) and the product (*Prod*) which STAC can better deliver in two separate files. This extension assumes that a STAC Item for the source is available and follows this extension or a new STAC Item for the source data will be created following this extension. In principle, all metadata for the source data could also be provided in a (proprietary) format like XML and linked to from the product STAC Item, but this case will not be explained in-depth in this extension.

STAC Items must always be valid, but not all STAC Item requirements are covered here, only additional requirements and mappings to fulfill the CARD4L requirements are listed here:

| Field Name      | XML Tag                                                      | Description                                                  | Src     | Prod    |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- | ------- |
| stac_extensions | *n/a*                                                        | **REQUIRED.** Must contain all extensions used, for the product at least the following values: `card4l-sar`, `file`, `processing`, `projection`, `sar`, `sat`, `view`. | ✓       | ✓       |
| id              | `ProductID`                                                  | **REQUIRED.**                                                | ✓ 1.6.6 | ✓       |
| geometry        | `GeodeticCoordinates`, `Latitude`, `Longitude`, `Height` (Src), `GeographicalExtent` (Prod) | **REQUIRED.** The geometry of the acquisition. May include the height as every third element. | ✓ 1.6.7 | ✓ 1.7.6 |
| bbox            | derived from `geometry` (Src), `GeographicalBoundingBox` (Prod) | **REQUIRED.** The bounding box of the acquisition. May include the height as every third element. | ✓ 1.6.7 | ✓ 1.7.5 |

### STAC Item Properties

#### CARD4L

| Field Name                             | Data Type                                               | XML Tag                                                      | Description                                                  | Src         | Prod        |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------- | ----------- |
| card4l:specification                   | string                                                  | `DocumentIdentifier` / `Product`, attribute `type` (Prod)    | **REQUIRED.** The CARD4L specification implemented, either `NRB` (SAR, Normalized Radar Backscatter) or `POL` (SAR, Polarimetric Radar). | ✓ 1.4 / 1.3 | ✓ 1.4 / 1.3 |
| card4l:specification_version           | string                                                  | `DocumentIdentifier`                                         | **REQUIRED.** The CARD4L specification version. Currently always `5.0` for `NRB` and `3.0` for `POL`. | ✓ 1.4       | ✓ 1.4       |
| card4l:beam_id                         | string                                                  | `BeamID`                                                     | **REQUIRED.**                                                | ✓ 1.6.4     | ✗           |
| card4l:orbit_data_source               | string                                                  | `OrbitDataSource`                                            | **REQUIRED.** One of `predicted`, `definitive`, `downlinked`. Applies to *Prod*, if additional orbit correction has been applied. | ✓ 1.6.5     | (✓)         |
| card4l:orbit_mean_altitude             | number                                                  | `OrbitMeanAltitude`                                          | Platform (mean) altitude in meters.                          | ✓ 1.6.5     | ✗           |
| card4l:incidence_angle_near_range      | number                                                  | `IncAngleNearRange`                                          | **REQUIRED.** Convert to degree, if required.                | ✓ 1.6.7     | ✗           |
| card4l:incidence_angle_far_range       | number                                                  | `IncAngleFarRange`                                           | **REQUIRED.** Convert to degree, if required.                | ✓ 1.6.7     | ✗           |
| card4l:noise_equivalent_intensity      | float                                                   | `NoiseEquivalentIntensity`                                   | **REQUIRED.** Convert to decibel, if required.               | ✓ 1.6.9     | ✗           |
| card4l:noise_equivalent_intensity_type | string                                                  | `NoiseEquivalentIntensity`, attribute `type`                 | **REQUIRED.** One of `beta0` or `sigma0`                     | ✓ 1.6.9     | ✗           |
| card4l:noise_removal_applied           | boolean                                                 | `NoiseRemovalApplied`                                        | **REQUIRED.** Specifies whether noise removal has been applied (`true`) or not (`false`). If set to `true`, a [link with relation type](#stac-item-links) `noise-removal` is **required**, too. | ✗           | ✓ 3.3       |
| card4l:mean_faraday_rotation_angle     | float                                                   | `MeanFaradayRotationAngle`                                   | Convert to degree, if required.                              | ✓ 1.6.11    | ✗           |
| card4l:ionosphere_indicator            | boolean                                                 | `IonosphereIndicator`                                        | Flag indicating whether the imagery is “significantly impacted” by the ionosphere (`false` - no, `true` – yes). | ✓ 1.6.12    | ✗           |
| card4l:speckle_filtering               | [Speckle Filter Object](#speckle-filter-object) \| null | `Filtering`, `FilterApplied`                                 | **REQUIRED.** Set to `null` if `FilterApplied` would be set to `false`. Otherwise make it an [Speckle Filter Object](#speckle-filter-object). | ✗           | ✓ 1.7.4     |
| card4l:border_pixels                   | integer                                                 | `NumBorderPixels`                                            | Number of border pixels (**required** if applicable). To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗           | ✓ 1.7.7     |
| card4l:pixel_coordinate_convention     | string                                                  | `PixelCoordinateConvention`                                  | **REQUIRED.** One of `center` (pixel center), `upper-left` (pixel ULC) or `lower-left` (pixel LLC) | ✗           | ✓ 1.7.8     |
| card4l:conversion_eq                   | string                                                  | `BackscatterConversionEq` (NRB), `ScalingConversionEq` (POL) | **REQUIRED.** Indicate equation to convert from the data to logarithmic decibel scale, see the CARD4L specification (3.2) for details. | ✗           | ✓ 3.2       |
| card4l:relative_rtc_accuracy           | number                                                  | `Relative` in `RTCAccuracy`                                  | Relative accuracy of the Radiometric Terrain Correction in decibel. | ✗           | ✓ 3.5       |
| card4l:absolute_rtc_accuracy           | number                                                  | `Absolute` in `RTCAccuracy`                                  | Absolute accuracy of the Radiometric Terrain Correction in decibel. | ✗           | ✓ 3.5       |
| card4l:northern_geometric_accuracy     | number                                                  | `NorthernRMSE` in `GeoCorrAccuracy`                          | **REQUIRED.** An estimate of the northern geometric accuracy in meters. | ✗           | ✓ 4.3       |
| card4l:eastern_geometric_accuracy      | number                                                  | `EasternRMSE` in `GeoCorrAccuracy`                           | **REQUIRED.** An estimate of the eastern geometric accuracy in meters. | ✗           | ✓ 4.3       |
| card4l:gridding_convention             | string                                                  | `GriddingConvention`                                         | **REQUIRED.** One of `center` (center), `upper-left` (UL) or `lower-right` (LR) | ✗           | ✓ 4.4       |

##### Speckle Filter Object

The following fields are all specified in CARD4L requirement 1.7.4. It is **required** to add all speckle filter parameters to this object.

| Field Name       | Data Type | XML Tag           | Description                        |
| ---------------- | --------- | ----------------- | ---------------------------------- |
| type             | string    | `FilterType`      | **REQUIRED.**                      |
| window_size_col  | integer   | `WindowSizeCol`   |                                    |
| window_size_line | integer   | `WindowSizeLine`  |                                    |
| ...              | ...       | `OtherParameters` | Add all speckle filter parameters. |

#### Common Metadata

| Field Name     | XML Tag                                         | Description                                                  | Src     | Prod    |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------ | ------- | ------- |
| license        | `Product`, attribute `Copyright`                | Recommended to be specified in a STAC Collection.            | ✓ 1.3   | ✓ 1.3   |
| datetime       | *n/a*                                           | **REQUIRED.** Recommended to set to the central timestamp between `start_datetime` and `end_datetime`. | ✓       | ✓       |
| start_datetime | `FirstAcquistionDate` (Prod), `StartTime` (Src) | **REQUIRED.** Start time of the first acquisition.           | ✓ 1.6.3 | ✓ 1.5   |
| end_datetime   | `LastAcquistitionDate` (Prod), `EndTime` (Src)  | **REQUIRED.** End time of the last acquisition.              | ✓ 1.6.3 | ✓ 1.5   |
| instruments    | `Instrument`                                    | **REQUIRED.** Check STAC for potential values, example: `c-sar` for Sentinel-1 | ✓ 1.6.2 | (✓)     |
| constellation  | *n/a*                                           | Constellation name in lower-case. Only if part of a constellation, e.g. `sentinel-1` for Sentinel 1A and 1B. Can often be derived from `platform`. | ✓ 1.6.2 | (✓)     |
| platform       | `Satellite`                                     | **REQUIRED.** Platform name in lower-case. Use a specific name such as `sentinel-1a` if part of constellation. MUST NOT duplicate `constellation`. | ✓ 1.6.2 | (✓)     |
| gsd            | `ProductColumnSpacing` / `ProductRowSpacing`    | **REQUIRED.** Convert to meters, if required. Currently, there's no way to express separate ground sample distances for x and y. | ✗       | ✓ 1.7.3 |

#### Processing

| Field Name          | XML Tag                                                      | Description                                                  | Src     | Prod    |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- | ------- |
| processing:facility | `ProcessingFacility`                                         | **REQUIRED.**                                                | ✓ 1.6.6 | ✓ 1.7.1 |
| processing:software | `SoftwareVersion`                                            | **REQUIRED.** String likely needs to be split into software name and version number. | ✓ 1.6.6 | ✓ 1.7.1 |
| processing:lineage  | `RangeLookBandwidth`,  `AzimuthLookBandwidth`, `lutApplied` (1.6.6), `ResamplingMethod` (4.1) | Additional processing information and parameters, e.g. Range- and Azimuth Look Bandwidth and LUT applied (Src only) or the resampling method for geometric correction. | ✓ 1.6.6 | ✓ 4.1   |

#### Projection

| Field Name     | XML Tag                              | Description                                                  | Src  | Prod     |
| -------------- | ------------------------------------ | ------------------------------------------------------------ | ---- | -------- |
| proj:shape     | `NumberLines`, `NumberPixelsPerLine` | **REQUIRED.** To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗    | ✓ 1.7.7  |
| proj:epsg      | `CoordinateReferenceSystem`          | See comment below*.                                          | (✓)  | ✓ 1.7.9  |
| proj:wkt2      | `MapProjection`                      | See comment below*.                                          | (✓)  | ✓ 1.7.10 |
| proj:transform | *n/a*                                | To be specified either globally for all assets with role `data` or individually [per asset](#stac-item-assets). | ✗    | (✓)      |

\* At least one of the three properties `proj:epsg`, `proj:wkt2` or `proj:projjson` is **required**. It must specify the coordinate reference system (1.7.9) and map projection (1.7.10). For target (desired) requirements, CARD4L asks that the CRS is an EPSG code and the Map Projection a human readable code such as WKT.

#### SAR

| Field Name                | XML Tag                                                      | Description                                                  | Src     | Prod    |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- | ------- |
| sar:instrument_mode       | `ObservationMode`                                            | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)     |
| sar:frequency_band        | `RadarBand`                                                  | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)     |
| sar:center_frequency      | `RadarCenterFrequency`                                       | **REQUIRED.** Convert to GHz if required.                    | ✓ 1.6.4 | (✓)     |
| sar:polarizations         | `Polarizations`                                              | **REQUIRED.**                                                | ✓ 1.6.4 | (✓)     |
| sar:product_type          | `ProductLevel` (Src), `Measurements`, attribute `type` (Prod, POL only) | **REQUIRED.** *Src*: Find suitable [product type in the SAR extension](../sar/README.md#item-fields). *Prod*: `NRB` for Normalized Radar Backscatter products, `COVMAT` for Normalized Radar Covariance Matrix products or `PRD` for Polarimetric Radar Decomposition products. | ✓       | ✓ 3.1   |
| sar:observation_direction | `AntennaPointing`                                            | **REQUIRED.** Lower-case                                     | ✓ 1.6.4 | (✓)     |
| sar:looks_azimuth         | `AzimuthNumberOfLooks`                                       | **REQUIRED.**                                                | ✓ 1.6.6 | ✗       |
| sar:looks_range           | `RangeNumberOfLooks`                                         | **REQUIRED.**                                                | ✓ 1.6.6 | ✗       |
| sar:pixel_spacing_azimuth | `AzimuthPixelSpacing`                                        | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗       |
| sar:pixel_spacing_range   | `RangePixelSpacing`                                          | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗       |
| sar:resolution_azimuth    | `AzimuthResolution`                                          | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗       |
| sar:resolution_range      | `RangeResolution`                                            | **REQUIRED.** Convert to meters, if required.                | ✓ 1.6.7 | ✗       |
| sar:measurement_type      | `BackscatterMeasurement` (NRB)                               | **REQUIRED.** Must be set to `gamma0`.                       | ✗       | ✓ 3.1   |
| sar:measurment_convention | `BackscatterConvention` (NRB)                                | **REQUIRED.** Must be set to `amplitude`, `power` or `angle` (POL only). | ✗       | ✓ 3.1   |

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
| view:incidence_angle | *n/a*             | Center between `card4l:incidence_angle_near_range` and `card4l:incidence_angle_far_range`. This is the sensor incidence angle. For per-pixel incidence angles, refer to the asset with the role `local-incidence-angle`. | ✓ 1.6.5 | ✗    |

### STAC Item Links

| Relation Type                  | XML Tag                    | Description                                                  | Src      | Prod    |
| ------------------------------ | -------------------------- | ------------------------------------------------------------ | -------- | ------- |
| card4l-document                | `DocumentIdentifier`       | **REQUIRED.** Instead of the document identifier, provide links to the Word (media type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and PDF (media type: `application/pdf`) document. | (✓)      | ✓ 1.4   |
| derived_from                   | *n/a*                      | **REQUIRED.** Points back to the source's STAC Item, which must comply to the *Src* requirements. May be multiple items, if the product is derived from multiple acquisitions. The number of acquisitions (`NumberOfAcquisitions`) is the number of links with this relation type. | ✗        | ✓ 1.6   |
| about                          | *n/a*                      | Link to other algorithms used in the generation process.     | ✗        | (✓)     |
| related                        | `AncillaryData`            | Link to the sources of ancillary or auxiliary data used in the generation process. Excludes DEMs, which use the relation `elevation-model` instead. | ✗        | ✓ 1.7.2 |
| access                         | *n/a*                      | Link to data access information.                             | ✓ 1.6.1  | ✓ 1.7.1 |
| performance-indicators         | `PerformanceIndicators`    | Link to performance indicators on data intensity mean noise level. | ✓ 1.6.9  | ✗       |
| orbit-data-file                | `OrbitDataFile`            | Link to orbit data file containing state vectors.            | ✓ 1.6.5  | ✗       |
| sensor-calibration             | `SensorCalibration`        | Link to the sensor calibration parameters.                   | ✓ 1.6.8  | ✗       |
| pol-cal-matrices               | `PolCalMatrices`           | Link to the complex-valued polarimetric distortion matrices with the channel imbalance and the cross-talk applied for the polarimetric calibration. | ✓ 1.6.10 | ✗       |
| referenced-faraday-rotation    | `ReferenceFaradayRotation` | Link to the method or paper used to derive the estimate for the mean Faraday rotation angle. | ✓ 1.6.11 | ✗       |
| noise-removal                  | `NRAlgorithm`              | **REQUIRED,** if noise removal has been applied. Link to the noise removal algorithm details. | ✗        | ✓ 3.3   |
| radiometric-terrain-correction | `RTCAlgorithm`             | **REQUIRED.** Link to the Radiometric Terrain Correction algorithm details. | ✗        | ✓ 3.4   |
| geometric-correction           | `GeoCorrAlgorithm`         | Link to the Geometric Correction algorithm details.          | ✗        | ✓ 4.1   |
| elevation-model                | `DigitalElevationModel`    | Links to the Digital Elevation Models, both for elevation and surface. Preferably links to a STAC Item with additional metadata for the DEMs such as the line-spacing, column-spacing, horizontal and vertical accuracy. | ✗        | ✓ 4.2   |
| geometric-accuracy             | `GeometricCorrAccuracy`    | Link to documentation of estimate of absolute localization error. | ✗        | ✓ 4.3   |

### STAC Item Assets

Whether the metadata are provided in a single record relevant to all pixels, or separately for each pixel, is at the discretion of the data provider. 

Each of the assets can either be exposed individually or grouped together in any form. In the latter case the role names can simply be merged to a set of unique role names. 

The italic role names are proposed to be the asset's key. All additional properties are required, except the once in *italic*.

| Role Name(s)                          | Additional properties                                        | XML Tag                      | Description                                                  | Src  | Prod        |
| ------------------------------------- | ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------ | ---- | ----------- |
| *card4l*, metadata                    | `type`                                                       | *n/a*                        | Points to a metadata XML file that follows the CARD4L metadata specification. Media type: `application/xml` | ✗    | ✓ 2.1       |
| *mask*, metadata                      | `type`, `file:values`, `file:nodata`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample` | `DataMask`                   | **REQUIRED.** Points to the data mask file.                  | ✗    | ✓ 2.2       |
| *contributing-area*, metadata         | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample`, `file:unit` | `LocalContributingArea`      | **REQUIRED.** Points to the normalized scattering area file. `file:unit` is usually `degree`. | ✗    | ✓ 2.3       |
| *local-incidence-angle*,  metadata    | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample`, `file:unit` | `LocalIncAngle`              | **REQUIRED.** Points to the local incidence angle file. `file:unit` is usually `degree`. | ✗    | ✓ 2.4       |
| *ellipsoid-incidence-angle*, metadata | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample`, *`card4l:ellipsoidal_height`*, `file:unit` | `EllipsoidIncAngle`          | `file:unit` is usually `degree`.                             | ✗    | ✓ 2.5       |
| *noise-power*, card4l, metadata       | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample`, `file:unit` | `NoisePower`                 | `file:unit` is usually NESZ or NEBZ.                         | ✗    | ✓ 2.6       |
| *gamma-sigma*, metadata               | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample` | `GammaToSigmaRatio`          |                                                              | ✗    | ✓ 2.7       |
| *date-offset*, metadata               | `type`, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample` | `AcquisitionDate`            | **REQUIRED for multi -source products only.**                | ✗    | ✓ 2.8       |
| *backscatter*, data                   | `type`, `created`, `sar:polarizations`, *`file:header_size`*, `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample` | `BackscatterMeasurementData` | **REQUIRED for *NRB*.** Points to the backscatter measurements for the polarizations specified in `sar:polarizations`. | ✗    | ✓ 3.1 (NRB) |
| (*covmat* or *prd*), data             | `type`, `created`, `sar:polarizations` (CovMat only), `file:data_type`, `file:byte_order`, *`file:header_size`*, `file:bits_per_sample` | `Measurements`               | **REQUIRED for *POL*.** Points to the Normalized Polarimetric Radar Covariance Matrix (CovMat) *or* the Polarimetric Radar Decomposition (PRD) | ✗    | ✓ 3.1 (POL) |

#### Additional Asset Properties

For all assets of with the role set to `data`, the following additional properties can be specified globally (in [STAC Item Properties](#stac-item-properties)) or individually per asset: `proj:shape`, `proj:transform`, `card4l:num_border_pixels`. See the respective field specifications above.

Some additional properties are always specified per asset: 

| Field Name                | Data Type                                              | XML Tag                                         | Description                                                  | Src     | Prod    |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ------- | ------- |
| type                      | string                                                 | `DataFormat`                                    | **REQUIRED.** The media type of the file format.             | (✓)     | ✓       |
| created                   | string                                                 | `ProcessingDate` (Src), `ProcessingTime` (Prod) | **REQUIRED.** The time of the processing is specified via the `created` property of the asset as specified in the [STAC Common metadata](../../item-spec/common-metadata.md#date-and-time). | ✓ 1.6.6 | ✓ 1.7.1 |
| sar:polarizations         | \[string\]                                             | *n/a*                                           | **REQUIRED**. The polarization(s) of the asset.              | (✓)     | ✓       |
| file:header_size          | integer                                                | `HeaderSize`                                    | File header size in bytes (**required** if applicable to the file format). | ✗       | ✓ 1.7.7 |
| file:data_type            | string                                                 | `DataType`                                      | **REQUIRED.** One of the [Data Types](../file/README.md#data-types). | ✗       | ✓       |
| file:byte_order           | string                                                 | `ByteOrder`                                     | **REQUIRED.** One of `big-endian` or `little-endian`         | ✗       | ✓       |
| file:bits_per_sample      | integer                                                | `BitsPerSample`                                 | **REQUIRED.** Bits per sample, e.g. 8, 16, 32, ...           | ✗       | ✓       |
| file:unit                 | string                                                 | `SampleType`                                    | **REQUIRED.** The unit of the values in the asset, preferably compliant to [UDUNITS-2](https://ncics.org/portfolio/other-resources/udunits2/). | ✗       | ✓       |
| file:values               | \[[Mapping Object](../file/README.md#mapping-object)\] | `ValidData` and `InvalidData` in `BitValues`    | **REQUIRED** for the data mask. Specify value(s) for valid and invalid data separately. | ✗       | ✓ 2.2   |
| file:nodata               | \[any]                                                 | `NoData` in `BitValues`                         | **REQUIRED** for the data mask. Value(s) for no-data.        | ✗       | ✓ 2.2   |
| card4l:ellipsoidal_height | number                                                 | `EllipsoidalHeight`                             | Indicate which ellipsoidal height was used, in meters.       | ✗       | ✓       |

## Notes

1.6.1 / 1.7.1: `SourceDataRepository` and `RepositoryURL` are covered by STAC link structures. All CARD4L compliant STAC Catalog are **required** to make intensive use of STAC link relation types such as `root`, `parent`, `child`, `item` and `collection`.

1.6.9: `SideLobeLevel`, `IntegratedSideLobeRatio`, `CrossCorrelationWidth`, `CrossCorelationPeakLoc` are *recommended* to be included in the resource linked to with the relation type [`performance-indicators`](#stac-item-links).
