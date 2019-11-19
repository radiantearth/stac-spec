# Satellite Extension Specification (`sat`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Satellite Extension to a STAC Item. Sat adds metadata related to a satellite that carries an instrument for collecting data. It will often be combined with other extensions that describe the actual data, such as the `eo` or `sar` extensions. In many instances, satellite data will share common properties about the spacecraft across all of the Items. It is not necessary, but recommended to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).

The Satellite extension requires the (Instrument extension)[../instrument/README.md].

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| sat:off_nadir_angle     | number                   | The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| sat:incidence_angle       | number        | The incidence angle is the angle between the vertical (normal) to the intercepting surface and the line of sight back to the satellite at the scene center. Measured in degrees (0-90). |
| sat:azimuth_angle       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| sat:sun_azimuth_angle   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| sat:sun_elevation_angle | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |
| sat:orbit_state        | string  | The state of the orbit. Either `ascending` or `descending` for polar orbiting satellites, or `geostationary` for geosynchronous satellites |
| sat:relative_orbit        | integer       | The relative orbit number at the time of acquisition. |

**sat:orbit_state** indicates the type and current state of orbit. Satellites are either geosynchronous in which case they have one state: `geostationary`, or they are sun synchronous (i.e., polar orbiting satellites) in which case they are either `ascending` or `descending`. For sun synchronous satellites it is daytime during one of these states, and nighttime during the other.

**sat:relative_orbit** is a count of orbits from 1 to the number of orbits contained in a repeat cycle, where relative orbit 1 starts from a specific reference location of the sub-satellite point (the point on the earth directly below the satellite). It resets to 1 when the sub-satellite point revisits the refernece location.

### Viewing and sun geometry

The angles `off_nadir_angle`, `incidence_angle`, and `sun_elevation_angle` are angles measured on a 2d plane formed: satellite location, sub-satellite point on the earth, the sun, and the center of the viewed area.

The off-nadir angle and the incidence angle are related. When the off-nadir angle is low (high incidence angle) then the two angles sum to about 90, so one can be calculated from the other. However, at high off-nadir angles with high altitude sensors the curvature of the earth has an impact and their sum will be less than 90. If only providing one of the two angles, the off-nadir angle is preferred.

The angles `azimuth_angle` and `sun_azimuth_angle` indicate the position of the viewed scene and the sun by the angle from true north, as shown below.


Example:
```
{
  "stac_version": "0.9.0",
  "stac_extensions": [
    "sat",
    "instrument"
  ],
  "id": "20171110",
  "type": "Feature",
  ...
  "properties": {
    "platform": "mysatellite",
    "instruments": ["mycamera1", "mycamera2"],
    "constellation": "allmysatellites",
    "sat:off_nadir_angle": 0,
    "sat:incidence_angle": 90,
    "sat:sun_elevation_angle": 45.0,
    "sat:azimuth_angle": 23.9,
    "sat:sun_azimuth_angle": 56.4,
    "sat:orbit_state": "descending",
    "sat:relative_orbit": 4
  }
}
```

## Implementations



## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to sat data:

* the [Instrument Extension Specification](../instrument/README.md), required when using the `sat` extension, which contains fields about the sensor and platform used to collect the data.