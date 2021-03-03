# View Geometry Extension Specification

- **Title: View Geometry**
- **Identifier: view**
- **Field Name Prefix: view**
- **Scope: Item**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @matthewhanson

This document explains the fields of the View Geometry Extension to a STAC [Item](../../item-spec/item-spec.md). View Geometry adds metadata related to angles of sensors and other radiance angles that affect the view of resulting data. It will often be combined with other extensions that describe the actual data, such as the `eo`, `sat` or `sar` extensions.

- [Example](../../examples/extended-item.json)
- [JSON Schema](json-schema/schema.json)

## Item Properties and Item Asset fields

| Field Name           | Type                     | Description |
| -------------------- | ------------------------ | ----------- |
| view:off_nadir       | number               | The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| view:incidence_angle | number               | The incidence angle is the angle between the vertical (normal) to the intercepting surface and the line of sight back to the satellite at the scene center. Measured in degrees (0-90). |
| view:azimuth         | number               | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| view:sun_azimuth     | number               | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| view:sun_elevation   | number               | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (`-90`-`90`). Negative values indicate the sun is below the horizon, Negative values indicate the sun is below the horizon, e.g. sun elevation of -10° means the data was captured during [nautical twilight](https://www.timeanddate.com/astronomy/different-types-twilight.html). |

*At least one of the fields must be specified.*

The angles `off_nadir`, `incidence_angle`, and `sun_elevation` are angles measured on a 2d plane formed: sensor location, sub-sensor point on the earth, the sun, and the center of the viewed area.

The off-nadir angle and the incidence angle are related. When the off-nadir angle is low (high incidence angle) then the two angles sum to about 90, so one can be calculated from the other. However, at high off-nadir angles with high altitude sensors the curvature of the earth has an impact and their sum will be less than 90. If only providing one of the two angles, the off-nadir angle is preferred.

The angles `azimuth` and `sun_azimuth` indicate the position of the viewed scene and the sun by the angle from true north, as shown below.

Example:
```js
{
  "stac_version": "1.0.0-rc.1",
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

## Best Practices

One of the emerging best practices is to use [Asset Roles](../../item-spec/item-spec.md#asset-roles) to provide clients with more 
information about the assets in an item. The following list includes a shared vocabulary for some common EO assets. This list should
not be considered definitive, and implementors are welcome to use other asset roles. If consensus and tooling consolidates around
these role names then they will be specified in the future as more standard than just 'best practices'. The roles listed below
all tend to be additional files that contain specific values for every single pixel. It is recommended to use them all with the role
of 'metadata'.

| Role Name | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| incidence-angle | Points to a file with per-pixel incidence angles. |
| azimuth | Points to a file with per-pixel azimuth angles. |
| sun-azimuth | Points to a file with per-pixel sun azimuth angles. |
| sun-elevation | Points to a file with per-pixel sun elevation angles. |
| terrain-shadow | Points to a file that indicates whether a pixel is not directly illuminated due to terrain shadowing. |
| terrain-occlusion | Points to a file that indicates whether a pixel is not visible to the sensor due to terrain occlusion during off-nadir viewing. |
| terrain-illumination | Points to a file with coefficients used for terrain illumination correction are provided for each pixel. |
