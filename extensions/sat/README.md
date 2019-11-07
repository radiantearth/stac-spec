# sat Extension Specification (-)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the sat Extension to a STAC Item. Sat adds metadata related to a satellite that carries an instrument for collecting data. It will often be combined with other extensions that describe the actual data, such as the `eo` or `sar` extensions. In many instances, satellite data will share common properties about the spacecraft across all of the Items. It is not necessary, but recommended to place common fields in [STAC Collections](../../collection-spec/collection-spec.md#common-fields-and-standalone-collections).

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name       | Type                     | Description |
| ---------------- | ------------------------ | ----------- |
| platform      | string                   | **REQUIRED.** Unique name of the specific platform to which the instrument is attached. |
| instrument    | string                   | **REQUIRED.** Name of instrument or sensor used (e.g., MODIS, ASTER, OLI, Canon F-1). |
| pass_direction        | string\|null  | Direction of the orbit, either `ascending` or `descending`. |
| constellation | string                   | Name of the constellation to which the platform belongs. |
| off_nadir     | number                   | Viewing angle. The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90). |
| azimuth       | number                   | Viewing azimuth angle. The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise from north in degrees (0-360). |
| sun_azimuth   | number                   | Sun azimuth angle. From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360). |
| sun_elevation | number                   | Sun elevation angle. The angle from the tangent of the scene center point to the sun. Measured from the horizon in degrees (0-90). |
| absolute_orbit        | integer       | An absolute orbit number associated with the acquisition. |
| relative_orbit        | integer       | A relative orbit number associated with the acquisition. |
| incidence_angle       | number        | The center incidence angle is the angle defined by the incident radar beam at the scene center and the vertical (normal) to the intercepting surface. Measured in degrees (0-90). |

**platform** is the unique name of the specific platform the instrument is attached to. For satellites this would 
be the name of the satellite, whereas for drones this would be a unique name for the drone. Examples include 
`landsat-8` (Landsat-8), `sentinel-2a` and `sentinel-2b` (Sentinel-2), `terra` and `aqua` (part of NASA EOS, 
carrying the MODIS instruments), `mycorp-uav-034` (hypothetical drone name), and `worldview02` 
(Maxar/DigitalGlobe WorldView-2).
 
**instrument** is the name of the sensor used, although for Items which contain data from
multiple sensors this could also name multiple sensors. For example, data from the Landsat-8
platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed
together and commonly referred to as OLI_TIRS. Examples include `oli_tirs` (Landsat-8), `msi` (Sentinel-2), 
`aster` (Terra), and `modis` (Terra and Aqua).

**constellation** is the name of a logical collection one or more platforms that have similar payloads and have 
their orbits arranged in a way to increase the temporal resolution of acquisitions of data with similar geometric and 
radiometric characteristics. This field allows users to search for related data sets without needing to specify which 
specific platform the data came from, for example, from either of the Sentinel-2 satellites. Examples include `landsat-8` 
(Landsat-8, a constellation consisting of a single platform), `sentinel-2` ([Sentinel-2](https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-2/Satellite_constellation)), 
`rapideye` (operated by Planet Labs), and `modis` (NASA EOS satellites Aqua and Terra).  In the case of `modis`, this
is technically referring to a pair of sensors on two different satellites, whose data is combined into a series of 
related products. Additionally, the Aqua satellite is technically part of the A-Train constellation and Terra is not 
part of a constellation, but these combine to form the logical collection referred to as MODIS. 


```
Planet example:

```
{
  "stac_version": "0.8.1",
  "stac_extensions": ["eo"],
  "id": "20171110_121030_1013",
  "type": "Feature",
  ...
  "properties": {
    ...
    "eo:bands": [
      {
        "full_width_half_max": 0.08,
        "center_wavelength": 0.63,
        "common_name": "red"
      },
      {
        "full_width_half_max": 0.09,
        "center_wavelength": 0.545,
        "common_name": "green"
      },
      {
        "full_width_half_max": 0.06,
        "center_wavelength": 0.485,
        "common_name": "blue"
      },
      {
        "full_width_half_max": 0.08,
        "center_wavelength": 0.82,
        "common_name": "nir"
      }
    ]
  },
  "assets": {
    "analytic": {
      "href": "https://api.planet.com/data/v1/assets/eyJpIjogIjIwMTcxMTEwXzEyMTAxMF8xMDEzIiwgImMiOiAiUFNTY2VuZTRCYW5kIiwgInQiOiAiYW5hbHl0aWMiLCAiY3QiOiAiaXRlbS10eXBlIn0",
      "title": "PSScene4Band GeoTIFF (COG)",
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "eo:bands": [0,1,2,3]
    }
  }
}
```

## Implementations

A number of implementations listed on [STAC Implementations page](../../implementations.md) are making use of the core EO 
properties, including the SpaceNet, CBERS, sat-api and Planet implementations. This is not marked as more mature because
the eo:bands portion is still being fleshed out.

## Extensions

The [extensions page](../README.md) gives an overview about related extensions.