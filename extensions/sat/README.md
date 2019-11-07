# sat Extension Specification (-)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the sat Extension to a STAC Item. Sat adds metadata related to a satellite that carries an instrument for collecting data. It will often be combined with other extensions that describe the actual data, such as the `eo` or `sar` extensions. In many instances, satellite data will share common properties about the spacecraft across all of the Items. It is not necessary, but recommended to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| platform      | string                   | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| instruments    | [string]                   | **REQUIRED.** Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1). |
| constellation | string                   | Name of the constellation to which the platform belongs. |
| off_nadir     | number                   | Viewing angle. The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| incidence_angle       | number        | The center incidence angle is the angle defined by the incident radar beam at the scene center and the vertical (normal) to the intercepting surface. Measured in degrees (0-90). |
| azimuth       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| sun_azimuth   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| sun_elevation | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |
| pass_direction        | string\|null  | Direction of the orbit, either `ascending` or `descending`. |
| absolute_orbit        | integer       | An absolute orbit number associated with the acquisition. |
| relative_orbit        | integer       | A relative orbit number associated with the acquisition. |


**platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include 
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS, 
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02` 
(Maxar/DigitalGlobe WorldView-2).

**instruments** is an array of all the sensors used in the creation of the data. For example, data from the Landsat-8 platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed together so would be specified as ['oli', 'TItirsRS']. Other instrument examples include `msi` (Sentinel-2), `aster` (Terra), and `modis` (Terra and Aqua).

**constellation** is the name of a logical collection one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without needing to specify which 
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8` 
(Landsat-8, a constellation consisting of a single platform), `sentinel-2` ([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)), 
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of 
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not 
part of a constellation, but these combine to form the logical collection referred to as MODIS. 

**absolute_orbit** usually corresponds to the number of orbits elapsed since satellite launch (e.g. ALOS, ERS-1/2, JERS-1, RADARSAT-1 and Sentinel-1). For airborne SAR such as UAVSAR it can be the [Flight ID](http://uavsar.jpl.nasa.gov/cgi-bin/data.pl) or a similar concept. The center orbit number should be specified if readily available, otherwise the orbit number at the start of the flight can be used instead.

**relative_orbit** is a count of orbits from 1 to the number of orbits contained in a repeat cycle, where relative orbit 1 starts from a defined reference for a given satellite. This property is usually not set for airborne SAR such as UAVSAR. The center orbit number should be specified if readily available, otherwise the orbit number at the start of the flight can be used instead.


```
Planet example:

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
    "instrument": "mycamera",
    "constellation": "allmysatellites"
  }
}
```

## Implementations



## Extensions

The [extensions page](../README.md) gives an overview about related extensions.