## Intro

This document specifies the JSON instantiation of the core [imagery metadata abstract spec](../abstract-spec.md). 

## Specification Description 

| element         | type info       | name                       | description                           										                    | 
|-----------------|-----------------|----------------------------|--------------------------------------------------------------------------------------------------| 
| id              | string          | Provider ID                | Provider ID for the item                       													| 
| geometry        | geojson         | Geometry                   | Bounding Box + Footprint of the item in lat/long (EPSG 4326)										|
| start_date      | date and time   | Date Start                 | First date/time in UTC (Combined date and time representation)    								| 
| end_date        | date and time   | Date End                   | Last date/time in UTC (Combined date and time representation)         							| 
| links           | dict            | Resource Links             | Dictionary of links to resources, could be download or other URLs (self and thumbnail required) 	|
| provider        | string          | Provider     (optional)    | Provider name  																					|
| license         | string          | Data License (optional)    | Item's license name based on SPDX License List or following guidlines for non-SPDX licenses 		|