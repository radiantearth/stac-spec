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


| Field Name      | XML Tag | Description                                                  |
| --------------- | ------- | ------------------------------------------------------------ |
| stac_extensions |         | Must contain at least the following values: `projection`, `sar`, `sat` |
| id              |         |                                                              |
| geometry        |         |                                                              |
| bbox            |         |                                                              |


## STAC Item Properties

### Common Metadata

| Field Name     | XML Tag | Description |
| -------------- | ------- | ----------- |
| datetime       | ``      |             |
| start_datetime | ``      |             |
| end_datetime   | ``      |             |
| instruments    | ``      |             |
| constellation  | ``      |             |
| platform       | ``      |             |

### Projection

| Field Name                            | XML Tag | Description                                            |
| ------------------------------------- | ------- | ------------------------------------------------------ |
| proj:epsg / proj:wkt2 / proj:projjson | ``      | At least one of the three fields needs to be populated |

### SAR

| Field Name                | XML Tag | Description  |
| ------------------------- | ------- | ------------ |
| sar:instrument_mode       | ``      |              |
| sar:frequency_band        | ``      |              |
| sar:center_frequency      | ``      |              |
| sar:polarizations         | ``      |              |
| sar:product_type          | ``      | Always `NRB` |
| sar:observation_direction | ``      |              |

### Satelite

| Field Name         | XML Tag | Description |
| ------------------ | ------- | ----------- |
| sat:orbit_state    | ``      |             |
| sat:relative_orbit | ``      |             |
| sat:absolute_orbit | ``      |             |

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