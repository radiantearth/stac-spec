# Overhead Sensor Extension Specification (`os`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the Overhead Sensor Extension to a STAC Item. Overhead Sensor adds metadata related to angles of sensors that make earth observations from above. It will often be combined with other extensions that describe the actual data, such as the `eo`, `sat` or `sar` extensions. It is not necessary, but recommended to place common fields in [STAC Collections](../../collection-spec/collection-spec.md) using the [Commons extension](../commons/).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| os:off_nadir     | number                   | The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| os:incidence       | number        | The incidence angle is the angle between the vertical (normal) to the intercepting surface and the line of sight back to the satellite at the scene center. Measured in degrees (0-90). |
| os:azimuth       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |

### Viewing and sun geometry

The `off_nadir` and `incidence` are angles measured on a 2d plane formed: overhead sensor location, sub-sensor point on the earth, the sun, and the center of the viewed area.

The off-nadir angle and the incidence angle are related. When the off-nadir angle is low (high incidence angle) then the two angles sum to about 90, so one can be calculated from the other. However, at high off-nadir angles with high altitude sensors the curvature of the earth has an impact and their sum will be less than 90. If only providing one of the two angles, the off-nadir angle is preferred.

The angle `azimuth` indicates the position of the viewed scene by the angle from true north, as shown below.


Example:
```
{
  "stac_version": "0.9.0-rc1",
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
    "os:off_nadir": 0,
    "os:incidence": 90,
    "os:azimuth": 23.9,
    "eo:sun_elevation": 45.0,
    "eo:sun_azimuth": 56.4,
    "sat:orbit_state": "descending",
    "sat:relative_orbit": 4
  }
}
```

## Implementations

- No implementations yet

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to Overhead Sensor data.