## Intro

This document explains the fields of a SpatioTemporal Catalog Item. Each item is a GeoJSON feature, specifically a spatiotemporal feature.

## Specification Description 

| element         | type info       | name                       | description                           										                    | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| id              | string          | Provider ID                | Provider ID for the item                       													| 
| geometry        | geojson         | Geometry                   | Bounding Box + Footprint of the item in lat/long (EPSG 4326)										|
| start_date_time      | date and time   | Date Start                 | First date/time in UTC (Combined date and time representation)    								| 
| end_date_time        | date and time   | Date End                   | Last date/time in UTC (Combined date and time representation)         							| 
| links           | dict            | Resource Links             | Dictionary of links to resources and related URLs (self and thumbnail required) 	|
| assets          | dict            | Assets            | Dictionary of asset objects that can be be download 	|
| provider        | string          | Provider     (optional)    | Provider name  																					|
| license         | string          | Data License (optional)    | Item's license name based on SPDX License List or following guidlines for non-SPDX licenses 		|