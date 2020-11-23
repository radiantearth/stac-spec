# STAC CARD4L SAR Normalized Radar Backscatter (NRB) Extension

This extension specifies how to create STAC Items that comply to the [CEOS CARD4L](http://ceos.org/ard/) product family specification for *SAR Normalized Radar Backscatter* products in version 5.0. Please see the following CARD4L specifications for more details:

- Product Family Specification ([PDF](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.pdf), [Word](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L-PFS_Normalised_Radar_Backscatter-v5.0.docx))
- Metadata specification ([XLSX](http://ceos.org/ard/files/PFS/NRB/v5.0/CARD4L_METADATA-spec_NRB-v5.0.xlsx))

This extension doesn't define new fields for STAC Items, but specifies which extensions, fields and other conventions to use.

This extension requires to use the following STAC extensions:

- [Projection](../projection/README.md)
- [SAR](../sar/README.md)
- [Satelitle](../sat/README.md)

## STAC Item 


| Field Name      | XML Tag                   | Description                                                  |
| --------------- | ------------------------- | ------------------------------------------------------------ |
| stac_extensions | *n/a*                     | Must contain at least the following values: `projection`, `sar`, `sat` |
| id              | `ProductID`               |                                                              |
| geometry        |                           |                                                              |
| bbox            | `GeographicalBoundingBox` |                                                              |


## STAC Item Properties

### Common Metadata

| Field Name     | XML Tag                | Description                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| datetime       | ``                     |                                                              |
| start_datetime | `FirstAcquistionDate`  |                                                              |
| end_datetime   | `LastAcquistitionDate` |                                                              |
| instruments    | `Instrument`           | Check STAC for potential values, example: `c-sar` for Sentinel-1 |
| constellation  | `SatelliteName`        | If part of a constellation (e.g. `sentinel-1` for Sentinel 1A and 1B), lower-case |
| platform       | `SatelliteName`        | If part of constellation, use specific name, e.g. `sentinel-1a`. Should not duplicate `constellation`, lower-case |

### Projection

| Field Name                            | XML Tag                     | Description                                                  |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------ |
| proj:epsg / proj:wkt2 / proj:projjson | `CoordinateReferenceSystem` | At least one of the three fields needs to be populated, preferably `proj:epsg`. |

### SAR

| Field Name                | XML Tag                | Description                |
| ------------------------- | ---------------------- | -------------------------- |
| sar:instrument_mode       | `ObservationMode`      |                            |
| sar:frequency_band        | `RadarBand`            |                            |
| sar:center_frequency      | `RadarCenterFrequency` | Convert to GHz if required |
| sar:polarizations         | `Polarizations`        |                            |
| sar:product_type          | ``                     | Always `NRB`               |
| sar:observation_direction | `AntennaPointing`      | Lower-case                 |

### Satelite

| Field Name         | XML Tag         | Description |
| ------------------ | --------------- | ----------- |
| sat:orbit_state    | `PassDirection` | Lower-case  |
| sat:relative_orbit | ``              |             |
| sat:absolute_orbit | ``              |             |

Use PlatformHeading?

Use new proc extension for ProductAttributes?

## STAC Item Links

* root / collection
* derived_from (via?)
* self

## STAC Item Assets

- angle
- area
- {polarization}
- mask
- metadata