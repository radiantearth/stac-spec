# View Geometry Extension Specification

- **Title: View Geometry**
- **Identifier: view**
- **Field Name Prefix: view**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the View Geometry Extension to a STAC Item. View Geometry adds metadata related to angles of sensors and other radiance angles that affect the view of resulting data. It will often be combined with other extensions that describe the actual data, such as the `eo`, `sat` or `sar` extensions.

- [Example (Landsat 8)](../eo/examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name           | Type                     | Description |
| -------------------- | ------------------------ | ----------- |
| view:off_nadir       | number               | The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| view:incidence_angle | number               | The incidence angle is the angle between the vertical (normal) to the intercepting surface and the line of sight back to the satellite at the scene center. Measured in degrees (0-90). |
| view:azimuth         | number               | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| view:sun_azimuth     | number               | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| view:sun_elevation   | number               | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |

*At least one of the fields must be specified.*

The angles `off_nadir`, `incidence_angle`, and `sun_elevation` are angles measured on a 2d plane formed: sensor location, sub-sensor point on the earth, the sun, and the center of the viewed area.

The off-nadir angle and the incidence angle are related. When the off-nadir angle is low (high incidence angle) then the two angles sum to about 90, so one can be calculated from the other. However, at high off-nadir angles with high altitude sensors the curvature of the earth has an impact and their sum will be less than 90. If only providing one of the two angles, the off-nadir angle is preferred.

The angles `azimuth` and `sun_azimuth` indicate the position of the viewed scene and the sun by the angle from true north, as shown below.

Example:
```js
{
  "stac_version": "1.0.0-beta.2",
  "stac_extensions": [
    "view",
    "sat"
  ],
  "id": "20171110",
  "type": "Feature",
  ...
  "properties": {
    "platform": "mysatellite",
    "instruments": ["mycamera1", "mycamera2"],
    "constellation": "allmysatellites",
    "view:off_nadir": 0,
    "view:incidence_angle": 90,
    "view:azimuth": 23.9,
    "view:sun_elevation": 45.0,
    "view:sun_azimuth": 56.4,
    "sat:orbit_state": "descending",
    "sat:relative_orbit": 4
  }
}
```

## Implementations

- No implementations yet

## Extensions

The [extensions page](../README.md) gives an overview about related extensions. Of particular relevance to View Geometry data.
