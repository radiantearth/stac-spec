

## Catalog Design Discussion

As we aim to bring together diverse catalog implementations there are a set of topics to work out. This document presents some 
initial thinking on where the group may go.

## Decoupling Search Content from API functionality

A majority of imagery catalog API's essentially hardcode the metadata fields directly in to their API. These are the query 
paramters that users can enter to refine their search - the GSD, cloud cover, sun angle, date, etc. One might have parameters 
for maxCloudCover and minCloudCover, another may have a 'cloud_cover' parameter that takes a value range. A client library 
written against each must understand the particular parameters of each. 

Ideally the mechanics of each catalog api would be the same, even if the metadata properties that one wishes to expose are 
different. Queries for individual images would use a common filter language, and would have common structures that API clients 
could standardize on. One attractive implementation principle that should help with this is to make catalogs of imagery be 
'self-describing'. They would report out what metadata fields can be queried, and API clients would be able to then form the 
proper requests based on that information.

OGC specifications did have a self-description mechanism that leveraged XML Schema functionality. Unfortunately the client 
binding support for fully generating from XML Schema was never very strong, especially with the complexity of GML. Planet's 
Catalog API had a compelling alternative, which was that each catalog end point would return a swagger document at its /spec 
endpoint, which would describe the metadata fields that could be queried on. With swagger's extensive client binding support 
this made it easy to auto-generate a client library that worked against the fields a catalog used to describe itself. 

## Standardization of core catalog fields

It is essential to standardize the core catalog fields, even though the decoupling of content from API functionality could be 
seen as an invitation to not actually standardize the content of catalogs. Every standard imagery catalog should have core, 
standard fields with documented values and input. The fields in the [OIN-Metadata-Spec](https://github.com/openimagerynetwork/oin-metadata-spec) 
are one of the better representations of those core values. They are the ones that appear across every imagery catalog online.
Ideally we would standardize an abstract representation of the 'core imagery metadata', and then OIN-Metadata and a Catalog 
API profile would be two instantiations of that. 

An open question is how to handle additional fields that providers wish to provide. One answer is to just provide two catalog 
end points, one that's fully standard, one that is self-describing but has other fields. The other route is to allow an 
'extension' of the core fields. Both are worth pursuing, and the former is easy to pursue.

## Modular Components

One of the main collaboration principles is to specify small pieces that are loosely coupled. This can enable them to be used 
in other API's, and can encourage alternative bundles of functionality and experiments with new interfaces. But what should 
those components be? How do we keep the core as small and simple as possible? Ideally each piece is its own swagger 
specification, and these should be able to reference other component swagger specs.

### Filtering

One of the more obvious pieces to break out is the filtering of data. Limiting your searches on geometry, date range and 
various metadata attributes. This is inline with the OGC filter specification, but ideally updated for REST+JSON. The OGC 
Filter specification is a bit overcomplicated for most uses, as it includes all 9 geometry operations (touches, crosses, etc), 
when the vast majority of applications will use bounding box and intersects for the vast majority of their queries. So ideally
a filter specification has geometry extensions, instead of including every obscure geometry operation.

One issue in this topic is doing filtering on GET queries, POST queries, or both. The problem in the geospatial domain with 
GET queries is that including a complex geometry can hit the limits of what GET can use. So some services only enable a 
POSTing of a query to a search end point. But the GET approach can be more friendly to new users/developers, as it's easier to
experiment with, and works better in generated Swagger documentation. One approach should be picked as the default, with the 
other as an extension for those who wish to implement, so that everyone knows which is preferred.

### Paging

This may be a bit too modular, but it could be good to separately specify how paging through results works, along with how to
request different page sizes and what the maximum page size is.

### Assets / Activation

Some API's include an 'activation' mechanism so they don't have to store every data product, but can produce them on the fly 
and cache them. A 'core' might just include data products that are already activated, to simplify the process some. But more 
advanced API's likely need some mechanism to advertise that they 'could' make a certain data product, that it's available to 
the user, but it will take more than a couple seconds to get a response.

### Saved Searches

Another feature that some services offer is the ability to 'save' a given search, and then revisit it or get notifications of 
it. That may make sense as its own little specification.

## Capabilities / Extension mechanisms

One other major piece that needs lots of thought is how Catalog API's can enable interesting extensions. And then likely there
is need for a 'capabilities' type request to communicate what operations the service is capable of. 

Then there are a number of potentially interesting extensions - bulk export (don't make users page through all results), 
statistics (give counts or totals of metadata fields) against queries, geometry simplification (on input for better query 
responses, or on output for display online), alternate formats (Geopackage or Shapefile output instead of GeoJSON), 
notifications, offline caching / updating, web tiles, etc.

### Caching / Updating

Just a quick selective dump on one of the extension topics. The main geo catalog paradigm that has never really worked seems to be that you'd send out requests to a number of different catalogs and then try to parse responses from all of them. It seems time to flip that model around, where there are catalogs that also crawl and cache other catalogs. Indeed the simplest catalog profile could not even offer up 'search' - it'd work as crawlable links and flat files hosted on a cloud storage bucket. 

But a more advanced catalog should offer up a way for other catalogs to subscribe to updates they care about and get notifications. An agriculture company might pull satellite imagery from 5 catalogs, but they only pull the corn belt in the US, where they do their analytics. So they could just have a 'caching catalog', that knows the canonical record is somewhere else (and refers to it). But it stays up to date, and is able to offer sub-second responses to searches on the cached catalogs. And indeed ideally ranks the searches across all the 5 catalogs.
