## Introduction

Raster Foundry's API supports creating, searching, and analyzing imagery and raster data. With Raster Foundry's API users are
able to gain insight from geospatial data quickly, repeatably, and at any scale. The API powers [Raster Foundry](https://app.rasterfoundry.com)
the web application and a [python library](https://pypi.python.org/pypi/rasterfoundry/0.1.0) that exposes the API in a pythonic interface.
Data is added to Raster Foundry from public sources like Landsat and Sentinel archives and allows users to add their own imagery or
raster data obtained via satellite, drones, manned flights, or other means. Access to the API requires an API key and at this time
signups are limited to a small set of users during beta testing.

The portion of Raster Foundry's spec provided here excludes resources and endpoints that are not relevant to catalog functionality. The
full specification can be obtained at https://spec.rasterfoundry.com and the [documentation site](https://docs.rasterfoundry.com) includes
additional information on the full API functionality.

## Background

Raster Foundry is an imagery and raster discvovery, analysis, and publishing platform with support from NASA (NNX16CS04C)
and the US Dept. of Energy (DE-SC0013134). The API supports both querying and creating new resources. Raster Foundry itself does
not produce data for analysis, instead it pulls in data from NASA, USGS, ESA, and other public sources to allow users to find
data to analyze and publish. Additionally, users are able to upload their own data to analyze and publish.

The project is still under active development and the API is not yet versioned as additional requirements are gleamed from users;
however, we do not expect major deviations from the spec provided here.

## Core Resources

### Scene

Within Raster Foundry, a `Scene` is the base unit of imagery. Scenes are single or multi-image rasters where every image within
the scene shares the same metadata characteristics and are always associated with a datasource. This simplest example of a scene
is a single-band image like a land classification raster. The most complex example is a multi-image scene made up of multi-band images,
like a pre-tiled aerial image where each tile is one piece of a larger coherent scene.

### Datasource

Datasources contain information common to all scenes associated with them, such as the number of bands to expect in images associated
with that datasource. A datasource can be specific (e.g. a particular earth observation satellite) or generic
(e.g. a 3-band sensor on a UAV). All scenes must have an associated datasource. Additionally, datasources can define common false-color
composites for thematic visualization.

### Image

Images are single or multi-band rasters that can be viewed and edited as a single unit but are always associated with a parent scene.
They are sometimes synonymous with their parent scenes and other times just one of several images associated with their parent scenes.
One common example of an image is a multispectral satellite image; another is a land classification raster.

### Project

Projects are user-defined collections of scenes and are the fundamental unit that tools act on, can be published as a tile layer,
or can be exported as GeoTIFFs.

## Core Functionality

Raster Foundry supports creating, searching, analyzing, and publishing imagery and raster data. Endpoints are designed around the core
resources outlined above and use HTTP verbs to define actions on those resources. Creating and searching is accomplished primarily through
the resources outlined above. Analysis and publishing may be outside the scope of defining a catalog API spec and are excluded here; however,
all resources are available at Raster Foundry's [documentation site](https://docs.rasterfoundry.com).

To search for data, users make `GET` requests on `/api/scenes/` using query parameters to filter results in the API. For example, users are
able to limit results to certain datasources, imagery they uploaded, or data acquired over certain periods of time. All query parameters are
[documented](https://docs.rasterfoundry.com/#Scenes) in the API specification that powers the documentation site.

The same endpoint supports adding new data to the API via a `POST` request and is used in the project internally when adding imagery but
also by users as they add imagery. Updates are supported via `PUT` requests and the object itself is designed to be updated in an ad hoc
manner as thumbnails, footprints, and new files are added to scenes.


## Additional Functionality

In addition to providing an API to search and add imagery, there is some additional functionality.

### Thumbnails

Thumbnails are generated either automatically based on user requests or can be added via the API if thumbnails exist for user uploaded data.

### Tile Service

Scenes that are grouped into a "project" can be served out as a tile service. Additionally, projects can be color corrected in Raster Foundry's
UI for optimal viewing or users can create false-color composites to create thematic maps. Ordering of scenes and color corrections are defined on
mosaic definitions and ordering defined between the project and its component scenes. Tile layers can be made public or kept private,
if private a map token is required for each tile layer and can be added as a query parameter to tile requests.

### Analysis

In addition to publishing projects as a tile layer, analysis can be performed on 1 or more projects and served out as a tile layer. For instance,
an NDWI pixel-based change detection algorithm can be created from two projects with imagery from the same area at two different points in time.
The resulting analysis tiles can be served as a tile layer and embedded in an external application.

Analysis is done using "tools" and "tool runs." A tool is a formula for performing an operation with undefined parameters and a tool run sets those
parameters (for instance, defining which projects a tool should use). The analysis itself is encoded in JSON and interpreted by back-end servers.

Future work in this area will include the ability for users to define alerts based on analysis results or exporting vector results such as polygonizing
areas of water, vegetation, or zones of concern based on analysis. Currently only local map algebra operations are supported; however, plans are underway
to add support for the rest of map algebra operations and user defined functions.

### Area of Interest Monitoring

A special type of project can be created to monitor an area for new imagery that matches certain criteria. For instance, a user could define a polygon
of interest and limit new imagery added to those with less than 10 percent cloud cover and only from Sentinel 2. As new scenes are added to Raster Foundry
they are evaluated against these user defined filters and automatically added to a project. This allows a user to create a constantly updated basemap
of new imagery by using a project tile URL for an area-of-interest project. In the future users will be able to hook an analysis pipeline to an area of
interest project that gets run when new imagery is added.

### Scene Grid

When browsing for imagery it is useful to allow an additional tile layer that summarizes the amount of available data for a web mercator tile at a zoom
level. This information is returned by the `/scene-grids/` endpoint and accepts the same query parameters as the `/scenes/` endpoint and is read-only.
