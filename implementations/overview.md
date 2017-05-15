## Overview

This folder contains sub-folders of the various implementations of catalogs that are active in the world. Each sub-folder should
have a swagger document of its latest implementation (yaml or json are both fine), as well as one or more documents discussing
what the API handles and what choices were made in creating it. 

To add an implementation create a new folder with the swagger and overview documents, and add it to the 'In Collaboration' list 
below.

### In Collaboration

[planet/](planet/) includes the swagger document for the current [Data API](https://www.planet.com/docs/reference/) as well as
some information on previous catalog iterations.

### Top Potential Collaborators

Azavea's [RasterFoundry](http://rasterfoundry.org) - They already have a swagger spec up at https://github.com/azavea/raster-foundry/blob/develop/docs/swagger/spec.yml
It has lots more than just querying imagery, but there's definitely pieces to collaborate on.

[Pixia](http://pixia.com) HiPERLook - This product catalogs vast amounts of imagery and serves it up as OGC standards. Their
experience with Full Motion Video (FMV) could also be interesting, to also catalog time series formats.

Development Seed's [Landsat API](https://api.developmentseed.org/satellites/landsat) - Provides an API wrapper to access Landsat
data.

DigitalGlobe's GDBX [Catalog API V2)(https://gbdxdocs.digitalglobe.com/docs/catalog-v2-course) - A recent iteration of the DG
catalog API, which is simplified compared to V1 and more in line with others mentioned.

Open Aerial Maps' [OAM Catalog](https://github.com/hotosm/oam-catalog) - Provides an API for all imagery in the Open Imagery Network.

Urthecast [API's](https://urthecast.github.io/urthecast-api-presentation/#/) - There have been few updates recently, but it 
should be reviewed as new API's are considered.

AstroDigital [Platform](https://docs.astrodigital.com/) - Looks like it already has a swagger document, given the presentation of 
the interactive API. The [search endpoint](https://docs.astrodigital.com/v2.0/docs/search) is the most relevant.

### Others

ESRI's Image Server and web service API's would be great to collaborate with. But need to figure out which part of their 
extensive ecosystem makes sense. GeoNode and GeoNetwork may be interesting, though neither is focused on cataloging imagery. 
But they do catalog geospatial layers, so some collaboration could be good. Once a core is established with one or two 
implementations it would be ideal to get clients testing on it - QGIS, ArcGIS, OpenLayers, GDAL, GeoTools, etc. 
