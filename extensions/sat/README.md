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
| off_nadir_angle     | number                   | The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| incidence_angle       | number        | The incidence angle is the angle between the vertical (normal) to the intercepting surface and the line of sight back to the satellite at the scene center. Measured in degrees (0-90). |
| azimuth_angle       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| sun_azimuth_angle   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| sun_elevation_angle | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |
| orbit_state        | string  | The state of the orbit. Either `ascending` or `descending` for polar orbiting satellites, or `geostationary` for geosynchronous satellites |
| relative_orbit        | integer       | The relative orbit number at the time of acquisition. |

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

**orbit_state** indicates the type and current state of orbit. Satellites are either geosynchronous in which case they have one state: `geostationary`, or they are sun synchronous (i.e., polar orbiting satellites) in which case they are either `ascending` or `descending`. For sun synchronous satellites it is daytime during one of these states, and nighttime during the other.

**relative_orbit** is a count of orbits from 1 to the number of orbits contained in a repeat cycle, where relative orbit 1 starts from a specific reference location of the sub-satellite point (the point on the earth directly below the satellite). It resets to 1 when the sub-satellite point revisits the refernece location.

### Viewing and sun geometry

The 2d angles (off_nadir_angle, incidence_angle, and sun_elevation) are angles measured on a 2d plane formed: satellite location, sub-satellite point on the earth, the sun, and the center of the viewed area. These angles are illustrated below.

The off-nadir angle (off_nadir_angle) and the incidence angle (incidence_angle) are related. When the off-nadir angle is low (high incidence angle) then the two angles sum to about 90, so one can be calculated from the other. However, at high off-nadir angles with high altitude sensors the curvature of the earth has an impact and their sum will be less than 90. If only providing one of the two angles, the off-nadir angle is preferred.

<diagram of 2d angles (off-nadir, incidence, sun_elevation)>

The azimuth angles indicate the position of the viewed scene and the sun by the angle from true north, as shown below.

<diagram of 3d angles (azimuth and sun_azimuth)>


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
    "off_nadir_angle": 0,
    "incidence_angle": 90,
    "sun_elevation_angle": 45.0,
    "azimuth_angle": 23.9,
    "sun_azimuth_angle": 56.4,
    "orbit_state": "descending",
    "relative_orbit": 4
  }
}
```

## Implementations



## Extensions

The [extensions page](../README.md) gives an overview about related extensions.