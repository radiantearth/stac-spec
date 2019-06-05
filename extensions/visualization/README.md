# Visualization Parameter Specification (`visualization`)

## Item Fields

| Field Name                    | Type       | Description                                                                                     |
|-------------------------------|------------|-------------------------------------------------------------------------------------------------|
| vis:display_name              | string     | Name of the displayed visualization.                                                            |
| vis:vis                       | \*         | Parameters for visualizing the dataset as an image.                                             |
| vis:lookat                    | LatLonZoom | Coordinate on which the visualization is initially centered.                                    |
| vis:filter                    | Filter     | Optional structure translating to a query into the dataset.                                     |
| vis:preview_image_script_name | string     | Optional URL linking to the JavaScript script used to create the sample/thumbnail image.        |
| vis:earth_engine_script_name  | string     | Optional URL linking to the JavaScript script file used for the Earth Engine site code snippet. |

\* = One of the Image Visualization, Table Visualization, or Polygon Visualization, defined below:

### Image Visualization

| Field Name | Type    | Description                                            |
|------------|---------|--------------------------------------------------------|
| band_vis   | BandVis | Vis args for the given band_names.                     |
| global_vis | BandVis | If vis_args are present here, they apply to all bands. |
| image_id   | string  | Specific image to use for visualization.               |

### Table Visualization

| Field Name    | Type   | Description                                                                                                                                       |
|---------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| property_name | string | Property name to select (optional)                                                                                                                |
| color         | string | Name of a color or RGB hex code.                                                                                                                  |
| point_size    | int    | Default size in pixels of the point markers.                                                                                                      |
| point_shape   | string | Default shape of the marker to draw at each point location. ( TODO - list acceptable strings/find a way to express something similar to an enum ) |
| width         | double | Default line width for lines and outlines for polygons/point shapes.                                                                              |
| fill_color    | string | The color for filling polygons and point shapes. Defaults to 'color' at opacity 0.66.                                                             |

### Polygon Visualization

| Field Name    | Type    | Description                                              |
|---------------|---------|----------------------------------------------------------|
| property_name | string  | The property to visualize.                               |
| property_vis  | BandVis | Parameters for the visualization of the resulting image. |

BandVis is defined as follows:

## Band Visualization

| Field Name | Type     | Description                                                                                    |
|------------|----------|------------------------------------------------------------------------------------------------|
| min        | [double] | Minimum value of each band. If only one value then it is applied as the minimum for all bands. |
| max        | [double] | Maximum value of each band. If only one value then it is applied as the maximum for all bands. |
| gamma      | [double] | Gamma correction factor for each band. If only one value then it is applied to all bands.      |
| gain       | [double] | Scaling factor for pixels in each band. If only one value then it is applied to all bands.     |
| bias       | [double] | Value to add to pixels for each band. If only one value then it is applied to all bands.       |
| palette    | [string] | List of colors for visualization. Only makes sense if exactly one band is present.             |
| bands      | [string] | List of either one or three (R, G, B) bands to display.                                        |

LatLonZoom is defined as follows:

## Lat/Lon/Zoom

| Field Name | Type   | Description                   |
|------------|--------|-------------------------------|
| lat        | double | Latitude of the coordinates.  |
| lon        | double | Longitude of the coordinates. |
| zoom       | double | Zoom level.                   |

Filter is defined as follows:

## Filter

| Field Name     | Type   | Description                                                                                                |
|----------------|--------|------------------------------------------------------------------------------------------------------------|
| filter_name    | string | Operation to apply. One of ["FILTER_UNSPECIFIED", "EQUALS", "LIST_CONTAINS", "LAST_N_DAYS", "DATE_RANGE"]. |
| property_name  | string | Name of the property to use in the filter.                                                                 |
| property_value | string | Value of property to filter.                                                                               |
| time_start     | string | ISO 8601 string specifying the start time of the filter.                                                   |
| time_end       | string | ISO 8601 string specifying the end time of the filter.                                                     |
