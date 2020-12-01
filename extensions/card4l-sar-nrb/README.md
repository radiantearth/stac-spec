# STAC CARD4L SAR Normalized Radar Backscatter (NRB) Extension

This extension specifies how to create STAC Items that comply to the [CEOS CARD4L](http://ceos.org/ard/) product family specification for *SAR Normalized Radar Backscatter* products in version 5.0. Please see the following CARD4L specifications for more details:

- Product Family Specification ([PDF](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.pdf), [Word](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.docx))
- Metadata specification ([XLSX](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L_METADATA-spec_NRB-v5.0.xlsx))

This extension doesn't define new fields for STAC Items, but specifies which extensions, fields and other conventions to use.

This extension requires to use the following STAC extensions:

- [Projection](../projection/README.md)
- [SAR](../sar/README.md)
- [Satellite](../sat/README.md)

**To be discussed:**

+ Does view:azimuth correspond to PlatformHeading?
+ [Does it make sense to fill  view:incidence_angle with the central angle between IncAngleNearRange and IncAngleFarRange?](https://github.com/radiantearth/stac-spec/issues/912)
+ Replace the Asset role `card4l` to `card4l-sar-nrb`?
+ Should product type be `NRB` or `RTC`?

**To do:**

* Use new [proc extension](https://github.com/radiantearth/stac-spec/pull/907) once available, for `ProductAttributes`
* Make recommendations for STAC Collections.
* Check whether all fields required here are also required by CARD4L. Otherwise, don't require them.

## STAC Item 

| Field Name      | XML Tag                   | Description                                                  |
| --------------- | ------------------------- | ------------------------------------------------------------ |
| stac_extensions | *n/a*                     | **REQUIRED.** Must contain at least the following values: `card4l-sar-nrb`, `projection`, `sar`, `sat` |
| id              | `ProductID`               | **REQUIRED.**                                                |
| geometry        | *n/a*                     | **REQUIRED.** The geometry of the acquisition.               |
| bbox            | `GeographicalBoundingBox` | **REQUIRED.** The bounding box of the acquisition.           |

## STAC Item Properties

### Common Metadata

| Field Name     | XML Tag                             | Description                                                  |
| -------------- | ----------------------------------- | ------------------------------------------------------------ |
| datetime       | *n/a*                               | **REQUIRED.** Recommended to set to the central timestamp between `start_datetime` and `end_datetime`. |
| start_datetime | `FirstAcquistionDate`               | **REQUIRED.** Start time of the first acquisition.           |
| end_datetime   | `LastAcquistitionDate`              | **REQUIRED.** End time of the last acquisition.              |
| instruments    | `Instrument`                        | **REQUIRED.** Check STAC for potential values, example: `c-sar` for Sentinel-1 |
| constellation  | *n/a*, derived from `SatelliteName` | If part of a constellation (e.g. `sentinel-1` for Sentinel 1A and 1B), lower-case |
| platform       | `SatelliteName`                     | **REQUIRED.** If part of constellation, use specific name, e.g. `sentinel-1a`. *Must not* duplicate `constellation`, lower-case |

### Projection

| Field Name                            | XML Tag                     | Description                                                  |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------ |
| proj:epsg / proj:wkt2 / proj:projjson | `CoordinateReferenceSystem` | **REQUIRED.** At least one of the three fields needs to be populated, *preferably* `proj:epsg`. |

### SAR

| Field Name                | XML Tag                | Description                              |
| ------------------------- | ---------------------- | ---------------------------------------- |
| sar:instrument_mode       | `ObservationMode`      | **REQUIRED.**                            |
| sar:frequency_band        | `RadarBand`            | **REQUIRED.**                            |
| sar:center_frequency      | `RadarCenterFrequency` | **REQUIRED.** Convert to GHz if required |
| sar:polarizations         | `Polarizations`        | **REQUIRED.**                            |
| sar:product_type          | *n/a*                  | **REQUIRED.** Always `NRB`               |
| sar:observation_direction | `AntennaPointing`      | **REQUIRED.** Lower-case                 |

### Satelite

| Field Name         | XML Tag         | Description              |
| ------------------ | --------------- | ------------------------ |
| sat:orbit_state    | `PassDirection` | **REQUIRED.** Lower-case |
| sat:relative_orbit | *n/a*           | *Recommended.*           |
| sat:absolute_orbit | *n/a*           | *Recommended.*           |

## STAC Item Links

| Relation Type      | XML Tag       | Description              |
| ------------------ | ------------------------ | ------------------ |
| derived_from  | *n/a* | *Recommended.* Points back to the source's STAC Item. The STAC Item *should* contain a representation of the metadata from the `SourceAttributes` XML tag. |
| source | based on `SourceDataRepository` | **REQUIRED.** Points back to the source data. |
| about | `NRAlgorithm`, `RTCAlgorithm`, `DEMReference`, `EGMReference`, `AccuracyReference` | *Recommended.* Links from the given XML tags can be added as additional information about the product. |
| related | `SensorCalibration`, `PerformanceIndicators` | *Recommended.* Links from the given XML tags can be added as additional information about the source data. |

## STAC Item Assets

| Asset Key | Role Name(s) | Additional properties | XML Tag       | Description              |
| ------------------ | --------------- | --------------- | --------------- | --------------- |
| angle | data | `proj:shape`, `proj:transform` | `LocalIncAngle` | **REQUIRED.** Points to the local incidence angle file. |
| area | data | `proj:shape`, `proj:transform` | `LocalContributingArea` | **REQUIRED.** Points to the normalized scattering area file. |
| hh / hv / vh / vv | data | `proj:shape`, `proj:transform`, `sar:polarizations` | `BackscatterMeasurementData` | **REQUIRED.** Points to the polarization file. |
| mask | data | `proj:shape`, `proj:transform` | `DataMask` | **REQUIRED.** Points to the data mask file. |
| metadata | metadata *and* card4l | - | *n/a* | **REQUIRED.** Points to the CARD4L metadata XML file. Media type: `application/xml` |
