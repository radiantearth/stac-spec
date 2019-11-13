# Instrument Extension Specification (-)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Instrument Extension to a STAC Item, which adds metadata specifying a platform and instrument used in a data collection mission. It will often be combined with other extensions that describe the actual data, such as the `eo` or `sar` extensions. In many instances, the instrument fields added here will share common properties across all of the Items. It is not necessary, but recommended to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| platform      | string                   | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| instruments    | [string]                   | **REQUIRED.** Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1). |
| constellation | string                   | Name of the constellation to which the platform belongs. |
| mission | string                   | Name of the mission for which data is collected. |

**platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include 
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS, 
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02` 
(Maxar/DigitalGlobe WorldView-2).

**instruments** is an array of all the sensors used in the creation of the data. For example, data from the Landsat-8 platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed together so would be specified as ['oli', 'tirs']. Other instrument examples include `msi` (Sentinel-2), `aster` (Terra), and `modis` (Terra and Aqua), `c-sar` (Sentinel-1) and `asar` (Envisat).

**constellation** is the name of a logical collection one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without needing to specify which 
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8` 
(Landsat-8, a constellation consisting of a single platform), `sentinel-2` ([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)), 
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of 
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not 
part of a constellation, but these combine to form the logical collection referred to as MODIS.

**mission** is the name of the mission or campaign for collecting data. This could be a discrete set of data collections over a period of time (such as collecting drone imagery), or could be a set of tasks of related tasks from a satellite data collection.


Example:
```
{
  "stac_version": "0.9.0",
  "stac_extensions": [
    "sat"
  ],
  "id": "20171110",
  "type": "Feature",
  ...
  "properties": {
    "platform": "mysatellite",
    "instruments": ["mycamera1", "mycamera2"],
    "constellation": "allmysatellites",
    "mission": "mymission"
  }
}
```

## Implementations



## Extensions

The [extensions page](../README.md) gives an overview about related extensions.