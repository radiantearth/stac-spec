# Aerial Extension Specification (`aerial`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Aerial Extension to a STAC Item.  Aerial data is considered to be data which has been captured from any sensor mounted on an aerial vehicle such as an airplane or drone.

A lot of EO data will have common metadata across many Items. It is not necessary, but recommended	
to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).
The exact metadata that would appear in a STAC Collection record will vary depending on the dataset.

## Item fields

| Field Name                | Type          | Description                                                  |
| ------------------------- | ------------- | ------------------------------------------------------------ |
| aerial:platform              | string        | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| aerial:constellation         | string        | Name of the constellation to which the platform belongs. |
| aerial:instrument            | [string]        | **REQUIRED.** Name(s) of the sensor(s) used. |
| aerial:campaign              | string        | Name of the campaign, project, or sequence associated to which the Item belongs.    |

**aerial:platform** is the unique name of the specific platform the instrument is attached to. For aerial imagery, this would be the name of the airplane (ex. `Hawker Beechcraft King Air 350CER`), whereas for drones this would be a unique name for the drone (ex. `DJI Phantom 4`).  

**aerial:constellation** is the name of a logical collection of one or more platforms that have similar instruments with geometric and radiometric characteristics.  This field allows users to search for related data sets without needing to specify from which specific platform the data came.  

**aerial:instrument** is the name of the sensor used, although for Items which contain data from multiple sensors this could also name multiple sensors.  Examples include `Ultracam Osprey` and `Micasense Altum`.

### Date and Time
In aerial imagery it is often desirable to specify start and end times.  This is particularly true for drones, where the image is usually produced by stitching together multiple images taken at varying times.  To describe this information it is recommended to use the [Datetime Range Extension Specification](../datetime-range/README.md).  The center time of the acquisition should be specified with the `datetime` property for [STAC Items](../../item-spec/item-spec.md).

### Payload Specific Metadata
Since aerial vehicles may contain a wide variety of payloads, it is recommended to pull fields from the appropriate extension specification such as [SAR](../sar/README.md#band-object) and [EO](../eo/README.md#band-object).  For example, an aerial vehicle with an RGB electro-optical camera might use the `eo:gsd` and `eo:epsg` fields from the EO extension.

When specifying bands, it is also recommended to use the Band object from the appropriate extension specification, for example the [SAR Band object](../sar/README.md#band-object) and the [EO Band object](../eo/README.md#band-object).

## Extensions
The [extensions page](../README.md) gives an overview about related extensions.
* the [Datetime Range Extension Specification](../datetime-range/README.md) to describe frame start and end time.
* the [EO Extension Specification](../eo/README.md) to describe electro-optical payloads.
* the [SAR Extension Specification](../sar/README.md) to describe SAR payloads.