# STAC EO Extension JSON Spec

This document explains the fields of the STAC Earth Observation (EO) Extension to a STAC `Item`. EO data is considered to be data that represents a snapshot of the earth for a single date and time. It could consist of multiple spectral bands in any part of the electromagnetic spectrum. Examples of EO data include sensors with visible, short-wave and mid-wave IR bands (e.g., the OLI instrument on Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8), as well as SAR instruments (e.g. Sentinel-1).

## EO Extension Description
These are the additional fields to appear under a STAC `Item`, as well as the items's assets field and `Collection` level metadata.

### `Item` additions
| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| eo:collection             | string                      | Collection Name       | The name of the STAC `Collection` this `Item` belongs to |
| eo:crs     | reference system    | ref system             | CRS of the datasource in full WKT format. null if no crs
| eo:cloud_cover     | number (optional)   | Cloud Cover Pct    | Percent of cloud cover | 
| eo:off_nadir      | number (optional)   | Off nadir    | The viewing angle measured from nadir, in degrees
| eo:azimuth      | number (optional)   | Azimuth    | The viewing azimuth angle, in degrees
| eo:sun_azimuth    | number (optional)   | Sun Azimuth | The sun azimuth angle, in degrees
| eo:sun_elevation  | number (optional)   | Sun Elevation | The sun elevation angle, in degrees
| eo:supported_assets | array of asset names | Supported Assets | A list of the key names for the asset types that are available now.

### `Item:assets` additions

| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| bands | string array | Bands | An array of strings that index the `eo:bands` field in a `Collection`.

### `Collection` additions
In addition, the EO Extension defines additional fields under a STAC `Collection`.
| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| eo:platform            | string                      | Unique name of platform | Specific name of the platform (e.g., landsat-8, sentinel-2A, larrysdrone) | 
| eo:instrument        | string                      | Instrument used     | Name of instrument or sensor (e.g., MODIS, ASTER, OLI, Canon F-1) |
| eo:bands               |   dict                       | Bands                    | A dictionary of band properties |

#### `Collection:bands`
The bands field of a `Collection` is a dictionary where the index identifies a specific band. This is often a band number (e.g., 1, B1, B01), but could be any unique identifier.
| element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| common_name | string (optional) | Common name | The name commonly used to refer to this specific band (e.g., red, blue, nir)
| gsd | float (optional) | Ground sample distance | The average distance between pixel centers as measured in meters on the ground
| accuracy | float (optional) | Geolocation Accuracy | The expected accuracy of the scene registration, in meters
| wavelength | float (optional) | Center wavelength | The center wavelength of the band, in microns
| fwhm | float (optional) | Full width at half maximum | The width of the band, as measured at half the maximum transmission, in microns

##### Common Band Names
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

