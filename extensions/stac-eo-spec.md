# STAC EO Profile 

This document explains the fields of the STAC Earth Observation (EO) Profile, which adds to the core fields of a STAC `Item`. EO data is considered to be data that 
represents a snapshot of the earth for a single date and time. It could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO data
 include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8), as well as SAR 
 instruments (e.g. Sentinel-1).

## EO Extension Description
These are fields that extend the `Item` object, as well as the items's assets field and `Collection` level metadata. The EO Profile generally assumes that you are
using the [STAC collection extension](stac-collection-spec.md), so puts all the repetitive fields at the `Collection` level. Since the collection extension is still
being fleshed out it is also acceptable to just put the required Collection fields as `Item` level properties.

## Item additions

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| eo:gsd | float | Ground Sample distance | The minimum distance between pixel centers available, in meters |
| eo:crs     | string    | ref system             | CRS of the datasource in full WKT format. null if no crs
| eo:cloud_cover     | integer (optional)   | Cloud Cover Pct    | Percent of cloud cover (1-100) | 
| eo:off_nadir      | float (optional)   | Off nadir    | Viewing angle. 0-90 degrees, measured from nadir
| eo:azimuth      | float (optional)   | Azimuth    | Viewing azimuth angle. 0-360 degrees, measured clockwise from north
| eo:sun_azimuth    | float (optional)   | Sun Azimuth | Sun azimuth angle. 0-360 degrees, measured clockwise from north
| eo:sun_elevation  | float (optional)   | Sun Elevation | Sun elevation angle. 0-90 degrees measured from horizon
| eo:collection             | string  (optional  | Collection Name       | The name of the STAC `Collection` this `Item` belongs to |


All of these values go in the 'properties' object of the STAC Item. As can be seen most are optional, though they are highly recommended for Earth Observation
imagery. It is likely more optional fields will be added as multiple providers expose the fields they use and consensus as to common names and values emerge.
For now if you are a provider with fields you'd like to add just put them under your own prefix, but also propose its use in an [issue](https://github.com/radiantearth/stac-spec/issues). 


### Item Field Descriptions in Properties

**eo:gsd** is the nominal Ground Sample Distance for the data, as measured in meters on the ground. Since GSD can vary across a scene depending on projection, this should be the average GSD in the center of the image. If the data includes multiple bands with different GSD values, this should be the best GSD available. If there are different
GSD values in the bands those should be specified in the `eo:bands` section of the Collection, specified below.

**eo:crs**: The Coordinate Reference System (CRS) is the native reference system (sometimes called a 'projection') used by the data, provided in [Well-Known Text (WKT) format](https://en.wikipedia.org/wiki/Well-known_text). This field is required. If the data does not have a CRS, such as in the case of non-rectified imagery with Ground Control Points, eo:crs should be set to null.

**eo:cloud_cover**: An estimate of cloud cover as a percentage of the entire scene. If not available the field should not be provided.

**eo:off_nadir**: The angle from the sensor between nadir (straight down) and the scene center. Measured in degrees (0-90).

**eo:azimuth**: The angle measured from the sub-satellite point (point on the ground below the platform) between the scene center and true north. Measured clockwise in degrees (0-360)

**eo:sun_azimuth**: From the scene center point on the ground, this is the angle between truth north and the sun. Measured clockwise in degrees (0-360).

**eo:sun_elevation**: This is the angle from the tangent of ths scene center point to the sun. Measured in degrees (0-90).

**eo:collection**: This should refer to the `collection_name` field in the Collection metadata that is referenced in the `links` section of the `Item`. This is 
used to enable filtering between different collections, which is important when more than one collection is contained in a single catalog.

### Item:links additions

Additionally there should be an entry in the `links` array that is called `collection`, as specified in the [STAC collection extension](stac-collection-spec.md). 

```
{ "rel": "collection", "href": "link/to/collection/record" }
```

See that spec for more information.

### Item:assets additions

One of the unique features of Earth Observation data is that providers arrange their assets in all sorts of different ways. Some, like Landsat, provide a file for 
each band, while others combine bands in to multiple files. Some provide multi-band 'analytic' products as well as 3 band 'visual' ones, and then the order of the 
bands that they include are often different. 

The EO profile includes a full definition of the bands in the `Collection` file, but then each asset will specify what bands it covers, and in what order. 

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| eo:bands | string array | Bands (optional) | An array of strings that index the `eo:bands` field in a `Collection`.

The strings in the array should be the lookup for the dictionary of the `eo:bads` section of a `Collection`, specified below.

## Collection additions

These fields belong in the `Collection` file, which is a dependency of the EO profile (if you are experimenting withnot using a collection link
then these fields are still required, and should be in the Item properties - they will just be duplicative). The `collection_name` is required for the
extension, and is used in the `Item` to enable search by collection. It is also recommended to use the `collection_description` so a more informative
description can be displayed to users.

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| eo:platform            | string                      | Unique name of platform | Specific name of the platform (e.g., landsat-8, sentinel-2A, larrysdrone) | 
| eo:instrument        | string                      | Instrument used     | Name of instrument or sensor (e.g., MODIS, ASTER, OLI, Canon F-1) |
| eo:bands  | dictionary    | Band Info | Band specific metadata (see below)

**eo:platform** is the name of the specific platform the instrument is attached to. For satellites this would be the name of the satellite (e.g., landsat-8, sentinel-2A), whereas for drones this would be a unique name for the drone.

**eo:instrument** The instrument is the name of the sensor used, although for Items which contain data from multiple sensors this could also name multiple sensors. For example, data from the Landsat-8 platform is collected with the OLI sensor as well as the TIRS sensor, but the data is distributed together and commonly referred to as OLI_TIRS.

**eo:bands** This is a dictionary of band information where each key in the dictionary is an identifier for the band (e.g., "B01", "B02", "B1", "B5", "QA"). See below for more information on band metadata.

### eo:bands in Collection
The bands field of a `Collection` is a dictionary where the index identifies a specific band. This is often a band number (e.g., 1, B1, B01), but can be a string (like 'udm' for an unusable data mask band, and can be any unique identifier. It is used in the `eo:bands` property of an asset in an `Item

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| common_name | string (optional) | Common name | The name commonly used to refer to this specific band (see below)
| gsd | float (optional) | Ground sample distance | The average distance between pixel centers as measured in meters on the ground. Defaults to eo:gsd if not provided
| accuracy | float (optional) | Geolocation Accuracy | The expected accuracy of the scene registration, in meters
| center_wavelength | float (optional) | Center wavelength | The center wavelength of the band, in microns
| full_width_half_max | float (optional) | Full width at half maximum | The width of the band, as measured at half the maximum transmission, in microns

### eo:bands in Collection Field Descriptions

**common_name** is a name commonly used to refer to the band to make it easier to search for bands across instruments. See below for a list of accepted common names.

**gsd** is the nominal Ground Sample Distance for this band, as measured in meters on the ground. Since GSD can vary across a scene depending on projection, this should be the average GSD in the center of the image.

**accuracy** is the expected error between the measured location and the true location of a pixel, in meters on the ground.

**center_wavelength** is the center wavelength of the band, measured in microns.

**full_width_half_max** (FWHM) is a common way to describe the size of a spectral band. It is the width, in microns, of the bandpass measured at a half of the maximum transmission. Thus, if the maximum transmission of the bandpass was 80%, the FWHM is measured as the width of the bandpass at 40% transmission.

### Common Band Names
The band's common_name is the name that is commonly used to refer to that band's spectral properties. The table below shows the common name based on the average band range for the band numbers of several popular instruments.

| Common Name     | Band Range (μm) | Landsat 5 | Landsat 7 | Landsat 8 | Sentinel 2 | MODIS |
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------|------------------------------------|------------------------------------|------------------------------------| 
| coastal |  0.40 - 0.45 |      |            |     1    |     1    |            
|blue    |  0.45 - 0.5 |  1    |      1     |     2    |     2    |       3    
|green   |  0.5 - 0.6  |  2    |      2     |     3    |     3     |      4    
|red     |  0.6 - 0.7  |  3    |      3     |     4    |     4      |     1    
|pan     |  0.5 - 0.7  |       |      8    |     8     |            |         
|nir     |  0.77 - 1.00 | 4    |      4     |     5     |    8       |    2    
|cirrus  |  1.35 - 1.40 |       |           |     9     |    10      |    26   
|swir16    | 1.55 - 1.75 | 5     |     5     |     6    |     11     |     6    
|swir22     |2.1 - 2.3  |  7     |     7     |     7     |    12     |     7        
|lwir11    | 10.5 - 11.5 |       |           |     10     |          |      31   
|lwir12    | 11.5 - 12.5 |        |          |     11     |          |      32

### Sample data

See the [examples/](examples/) folder for a full landsat definition.