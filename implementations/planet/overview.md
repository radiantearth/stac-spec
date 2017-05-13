## Introduction

Planet's Data API exposes a variety of sensors in a coherent API. It powers ['Planet Explorer'](http://planet.com/explorer), 
a javascript GUI for finding imagery. Data comes from Planet's Dove, RapidEye and soon SkySat satellites, as well as exposing
Landsat and Sentinel data. Access requires an API key, though anyone can sign up through Planet Explorer. The search functionality
is open to all API users. Download is constrained to data an organization has purchased. But Landsat and Sentinel data are 
available for free, and the [Open California](https://www.planet.com/products/open-california/) program also provides an archive of the full state of California, two weeks delayed.

## Background

Planet is currently on its third major catalog api iteration. The first (v0) was designed for Planet data only, with the structure of
the data baked in to the API. The fields of search were set to the fields of Planet's metadata. Landsat data was added, but
its relevant fields were adapted to Planet's naming schema. When RapidEye data had to be added, with customers needing access
to all its metadata fields, the need for a new API was clear.

Planet's next API was the Catalog API (v1). A core design principle was for catalogs to be self-describing. The v0 clients
(particularly GDAL) had to be updated as new fields were added. So the GDAL team requested that a catalog could report its 
fields. An innovative solution was implemented, with each catalog having a /spec endpoint that would return a swagger document
that described the metadata fields that could be queried. Catalogs would combine data from multiple 'providers' (ie RapidEye vs Dove), making all
available in a single end point. Bringing multiple sensors in exposed a core problem with the Catalog API, which was they
weren't strongly enough typed for different data sets. 

So the third API, the Data API (v1) did away with catalogs as collections of providers (though the construct could still be
revived). Instead each has its own ItemType end point, that specifies exactly what is in it. This is not just the metadata
fields (which are mostly the same), but also 'assets' - the data that is available for download from each. ItemTypes are
not yet self-describing, but it's on the roadmap to revive that.

## Core Functionality

Search of data is the core functionality provided. In Data V1 the searches are only available as POST, there is no GET endpoint.
The developers wanted a single path of access, and GET plus huge geometries can hit the limits of GET, so the decision was made
to go with posting a JSON of the 'filter' that is desired. Each ItemType requested must be specified, along with the fields and
geometry filters desired. An example filter from the [docs](https://www.planet.com/docs/reference/search-api/):

```
{
  "type": "AndFilter",
  "config": [
    {
      "field_name": "acquired",
      "config": {
        "gte": "2016-02-01T00:00:00Z",
        "lte": "2016-03-01T00:00:00Z"
      },
      "type": "DateRangeFilter"
    },
    {
      "field_name": "satellite_id",
      "config": ["RapidEye-3"],
      "type": "StringInFilter"
    }
  ]
}
```
A 'quicksearch' end point lets users start using their query right away. Or searches can be persisted to a saved search end point. 

The other 'core' construct that is a bit unique to Planet is the 'activation' mechanism. All the data products that are available
for an ItemType are listed as 'assets', but they are not all produced up front. Planet stores the core data format and produces
data products on the fly. To download a full data product developers must hit an 'activation' end point, which then creates
the data. V0 of Planet's API did not have an activation mechanism, but V1 is much more scalable from a storage perspective
as it only produces what is needed. 

There are deeper questions as to how this will evolve as more formats and asset options come online, especially through 'compute'
type operations. But it is likely a useful mechanism for a catalog to show what assets is capable of producing without having
to make them all available upfront. 

## Additional Functionality

Past the core data access API there are a few additions.

#### Tiles & Thumbnails

All data in the core catalog API is available as web tiles (overviews for all, full zoom to those with access) and thumbnails.
This is an orthogonal service for Planet, and no explicit links from the core API are provided. But the same ID's are used.

#### Cloud Optimized GeoTiff

Once data is activated it is stored on S3, which enables users to leverage HTTP Range access to query subsets of the data without
having to download the whole thing. Data is formatted as [Cloud Optimized Geotiff](https://trac.osgeo.org/gdal/wiki/CloudOptimizedGeoTIFF)
to facilitate efficient network access of parts of the data. See this [sub-area tutorial](https://www.planet.com/docs/guides/quickstart-subarea/)
in the Planet docs for more information. In Planet's case the S3 bucket itself is obscured, but the auth redirected URL is
backed by S3, so the same access patterns works fine.

#### Stats

There is an additional API that provides statistics from the same filter queries. This primarily drives GUI interactions, but is
also useful for clients wanting to understand the catalog's data holdings without having to download all the metadata. The
stats end point will return the count of items for a given query, and can also return that in time buckets (useful for driving
GUI timelines).

#### Basemaps

Though quite far outside the core catalog construct Planet also provides tile servers that serve up 'basemaps' - mosaics of
imagery in specific time ranges. These are useful to help users navigate through the GUI. 
