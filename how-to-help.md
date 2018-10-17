## Introduction

The SpatioTemproal Asset Catalog is a specification to help interoperability, but the key to achieve that goal is a community
of like-minded collaborators who are building software and exposing data in a standard way. The specification is really 
the result of that collaboration, and the aim is to provide a flexible base that others can extend and innovate on top of.
If others in the community create similar functionality with their geospatial access API's then the community will hopefully
evolve extension standards that enable increased interoperability.

Right now we are in the very early days of the collaboration. So while there is a core specification there is still quite a 
few best practices to evolve and [improvements](roadmap.md) to the spec that will be needed. 

## Implementations and Feedback

The best way to help out with STAC is to try to implement the specification, either a [static catalog](catalog-spec/README.md), a 
[catalog api](api-spec/README.md) or even both. This can be done by extending existing catalog software, creating new software, or 
standing up a service end point that exposes data. Implementations using the specification as it stands will likely 
have to make a number of decisions while building, as there is a lot that is left unspecified. The best thing to do 
is to document those decisions, and share them with the core STAC group. Ideally make mini-specifications, but even just
a write up with some sample output is great. 

If you want to help out with STAC but don't have an obvious project - a piece of software, or data you want to expose - then
read on for ideas.

## Implementation Roadmap

This section lays out a path of implementations that will be necessary to make this a truly great specification. It describes
the hoped for ecosystem of tools and data that hopefully will come to pass. Many are things anyone could help out with an 
implement. Some depend on particular knowledge or background, like deep involvement with an open source project. And some
only a few people are able to do, since they depend on working for a particular company.

In time we may try to track these in their own project, but for now this list should be sufficient. It is a complement
to the [roadmap](roadmap.md), which is just for the specification itself. But that roadmap will only evolve with this
set of work on real implementations to inform it.

### Tier 1

These tools are seen as the bare minimum to move STAC spec to a broader release, so that it has a base line of feedback from
real world implementations, and basic tooling to help data providers get their data out as STAC

**Static Catalog Creation Tooling** - At the core this should enable a user to take a directory of GeoTIFF's and create 
a fully linked static catalog. It should autogenerate the time and geography fields, and prompt the user for additional information.
Ideally it would evolve to start to understand common metadata formats, to populate from existing metadata (and provide links
to the extended metadata). Command line tooling would be ideal, but could easily start requiring language specific scripting.

**STAC Validator** - A STAC validator tool would be able to take a root document of a static catalog or catalog API and crawl
all the links, checking for specification compliance. The core validation can leverage the JSON Schemas defined in the spec,
adding crawling on top of that. Ideally this could be stood up as a web service, to point at online STAC instances and check
compliance, but a command line / scripting language tool is fine to start. Would be cool if it also reported stats on the 
catalogs validated - number of records, number of asset files, total asset data size referenced, etc.

**Online SpatioTemporal Asset Catalogs** - Ideally there are at least 5 different catalog instances, and at least 2 each of static
catalogs and catalog API's. These should be public services that people can hit to try out (though don't need to aim for
high reliability - it's ok if they go down sometimes). Can be open source or proprietary software (or obviously just
generated static files) - just the service should be public. Don't need to be the entire archives, but ideally at least
thousands of records.

**Open Source API Implementation** - There should be some open source code that shows how a STAC API can work, that anyone
can install and try out. Could be written in any language, and ideally there are implementations in many common languages.

**STAC Client Library** - A good first STAC client library would first enable searching and download of data from a STAC API. 
Next steps could include crawling a static STAC and enabling querying of the crawled data (perhaps store in a geopackage), as
well as a nice command line tool.

### Tier 2

**API -> Static catalog tool** - Building on top of core client and server tooling in tier one can introduce some cool value add tools.
A client library that crawls a STAC API and can create a static STAC can be used as a 'backup' tool for an API, making a copy
of the catalog that can't go down (ideally this would extend the spec to have a link 'rel' type that refers back to the source
data as a [spec extension](https://github.com/radiantearth/stac-spec/blob/dev/roadmap.md#provenance--duplication-tracking). 

**Static catalog -> API tool** - The flip of the previous tool,  a STAC API could crawl a static catalog and serve as a 
dynamic query service on top of the core.

**Javascript Search Tools** - A javascript library that can search a STAC API and enable online querying of results. Hopefully
a core library, and then a full online implementation integrated with OpenLayers/Leaflet. Cool extensions would be integration
with a tiled server to display COG's (or javascript reading COG's directly), and the ability to read static catalogs 
(potentially storing data in local storage). 

**HTML STAC Implementations** - Though little work has been done yet the HTML versions of STAC are super important so the catalogs
are useful to people, not just machines. Ideally the static catalogs all have accompanying html files with interactive maps that
lets you zoom in to cloud-optimized geotiff's (or potentially even with html files generated on the file with javascript). And
there are also STAC API's that have html as an output in addition to json. Aiming for at least 5 html implementations.

**GDAL Implementation** - As the most used geospatial library it is important that GDAL be a tool that can query STAC catalogs,
both dynamic and static ones. Ideally GDAL could also create static catalogs as an output format. 

**STAC Extension Implementations** - It is important that implementations start to create extensions to the core STAC fields,
for things like earth observation metadata fields, derived data, mosaics, point clouds, DEM/DSM, etc. 

## Tier 3

**Major Public Data as static catalogs** - Ideally Landsat, Sentinel (1 & 2), NAIP, OpenAerialMap and at least a couple other public data
sources (CBERS? NASA data?)

**Vendors with STAC implementations** - Hopefully the data and software vendors also expose their major holdings & user's
data as STAC. Planet, DigitalGlobe, Airbus, Urthecast for providers, and ENVI, Erdas, Esri, etc for data. This may be a 
mix of static catalogs (hopefully at least for open data) and catalog API's.

**Major Open Source Implementations** - Should aim for the leading open source libraries (GDAL, GeoTools) and tools (QGIS, GeoServer,
MapServer, OpenLayers, GeoNetwork, pycsw, GeoTrellis/RasterFoundry) to develop at least plugins to talk to and/or implement STAC

### Tier 4

**Additional Implementations** - More STAC API's, static API generation code and client libraries, in a variety of languages
and integrations, are always desired. 

**Extensive metadata translation tools** - Static catalog generators ideally understand most any metadata format, to create
catalogs from all the existing metadata in the world.

**Syncing STACs** - An implementation where on catalog could subscribe to 'changes' of another catalog to stay in sync. Could
be two STAC API's, or could be a static catalog with an updating stream of file changes that a STAC API reads. The 'child'
catalog could be syncing with just a portion of the main one, like for their area of interest.

**Global STAC stats tools** - A tool that can crawl all publicly exposed STACs and present numbers on the total number of 
records indexed in the network.

**STAC Libraries in all major languages** - There should be client libraries and server bindings for all major programming
languages. 

**Cool Extensions** - STAC should be a core that others build cool advanced catalog functionality on. Things like aggregation,
both spatial (coverage maps) and fields (total stats, histograms), offline catalogs, crossfilter querying, faceted search,
etc.

