
# STAC Roadmap

This document lays out a rough prioritization for the evolution of the STAC specification and related extensions.
A small number initial priorities will likely be reflected in the core specs, but in the spirit of making small
spec pieces that are loosely coupled many will likely become extensions. Effort will also be made to break out
smaller reusable pieces.

Soon the top priority items in this document will be migrated to the [issue tracker](https://github.com/radiantearth/stac-spec/issues)
and scheduled against 'releases'. Also included here are some more future design discussions. Nothing listed her is set in stone, and
the overall priority will likely shift as real world implementations come along and need additional functionality. The main
way the items on this roadmap will evolve and become part of the spec will be starting as software implementations with 
spec changes discusses on a pull request, merging once there is community consensus. See also the 
[how to help](how-to-help.md) document for the implementation plan that complements this roadmap.

## Roadmap

### Asset definitions

Currently the 'Asset' items in the array only require a link to the asset, and contain an optional 'title' and media 'type'.
There is likely quite a bit more that can be standardized in a useful way - at the very least some optional fields to help providers
describe more of what they're doing. Another idea is to require a link to a 'product definition' that an asset must
implement, which would provide the needed fields. This would increase the burden on the client, to follow or cache
the definitions, but would also decrease the repetition of the same fields over and over again. There is additional
discussion on this topic in the [static catalog recommendations](catalog-spec/static-recommendations.md#asset-definition).
Part of this is also tracked in [Issue 23](https://github.com/radiantearth/stac-spec/issues/23)

### Querying and Filtering

The [STAC API](api-spec/) does not yet have a robust filtering mechanism, it just returns items. This was punted on
at the [boulder sprint](http://github.com/radiantearth/boulder-sprint), but is an essential feature. Ideally this is
in line with [WFS 3.0](https://github.com/opengeospatial/WFS_FES), but they have also not defined more robust querying.
Another idea is to use [ECQL](http://docs.geoserver.org/latest/en/user/filter/ecql_reference.html) - but it could
probably benefit from being pulled out to a standard instead of just in the GeoTools documentation, and it is pretty
complicated to fully implement (though a subset could be good). Another source of inspiration is 
[Backand queries](http://backand-docs.readthedocs.io/en/latest/apidocs/nosql_query_language/index.html). 
[Issue #31](https://github.com/radiantearth/stac-spec/issues/31).

### Catalog Definition

The JSON that defines a 'Catalog' is not really specified right now. There needs to be thought on the required
and optional fields. And some decisions on the philosophy of what type of metadata should live in a Catalog
resource, as well as fleshing out more linked catalogs vs root catalogs, and things like inheritance of metadata. But
it is potentially a good place to put data that applies to all the Items in the catalog, things like in depth
contact information and license data. The individual items could then just reference the catalog they come 
from instead of repeating each field.

### Domain and Vendor extensions

Ideally there is a way for domains (like Earth Observation / satellite imagery) or specific vendors to publish
more meta information about the additional fields they use. The STAC mechanisms should enable a full `Item` with
all the extra fields included to be self-describing, so clients could understand more than just the core fields.
This likely would involve ways of defining additional schemas, and ways to share those schemas and validate a
response against several schemas. This could be some additional mechanics in Catalog API (likely optional, to
not make a basic implementation too complicated), and also ways for static catalogs to link to schemas. It is
likely worth exploring things like linked data, http://schema.org and JSON-LD to see if they can be used to
leverage web best practices to share core schema definitions across different STAC implementations.

The schema definition mechanism part of this is defined in [Issue 30](https://github.com/radiantearth/stac-spec/issues/30).

### EO Extension

The top priority for many of the initial STAC implementors is to share more fields between data than just
date and time. At the [boulder sprint](http://github.com/radiantearth/boulder-sprint) the metadata group
initially came up with around 20 fields to standardize. Most all of them were quite useful to satellite
imagery (and less useful for other data, which is why they didn't make the final cut for STAC core). It
is a goal to make that list an 'extension' for the domain, so that different vendors can share a single cloud
cover definition. Right now one might have parameters for maxCloudCover and minCloudCover ranging from 0 to 100, 
another may have a 'cloud_cover' parameter that takes a value range from 0 to 1.

Ideally the main fields that users utilize to search for imagery would have shared definitions that would be
used across all satellite imagery providers. After this core extension is established it would be great to
create more extensions for other data types, as well as downstream imagery products (mosaics, band mathed, 
land cover, etc)

### Additional rel Link definitions 

While there is liberal use of the 'rel' attribute on the STAC Item 'Links' there is little consensus definition.
It makes sense to extend the core definitions, but it would be good to standardize on at least some of the core
uses, as well as best practices. 

### Provenance & Duplication tracking

It would likely be useful to leverage rel links to describe relationships like when an NDVI derived data product
in one catalog comes from another data that is referenced in another catalog. It might be able to use a 'rel'='source'
type link back to it. Similarly one can imagine STAC catalogs that are just duplications of other catalogs on
different clouds - indeed Landsat8 data is on USGS, Amazon and Google. It would be great if STAC could represent
that each of those is 'the same', and link to the others, so that algorithms could make a choice on which to use
based on their location.

### Extension mechanisms

There should be clearly documented ways to extend the core STAC specification for new interesting functionality, as
well as clearly documenting how to extend the core fields for domains and vendors in valid ways. 
Many of these should likely have their own specification and even their own end point, but it could be useful for
a STAC catalog to at least report the other endpoints that are available for the data that is represented.

### HTML

To embrace the principles of the web in general, and the [Spatial Data on the Web Best Practices](https://w3c.github.io/sdw/bp/)
in particular, there should be a human-readable HTML web pages for all STAC `Items`. The core design was
to use links generously, which should easily populate a good HTML page. And a nice page would utilize the
thumbnail and potentially even a [cloud optimized geotiff](http://cogeo.org) asset with a dynamic tile
server to render a zoomable map on every STAC Item webpage. This may just be a set of best practices 
instead of hard requirements, though it is likely worth specifying a few core things that each HTML
page should have, and recommendations on how to format links and implement microformats. [Issue #32](https://github.com/radiantearth/stac-spec/issues/32)

### Align with microformats / linked data

Following on from HTML versions of STAC we aim to align with the best practices of the 'linked data' community.
This will take more research on what exactly we should do. But likely candidates include defining [JSON-LD](https://json-ld.org/)
versions of the spec, leveraging http://schema.org or defining a similar canonical location for geospatial schemas,
and defining microformats to go in the html versions.

### Additional extensions

This item will hopefully continously happen, as real world implementations come online. But we should evolve the
schemas people define to become best practices and defined extensions. We may also need some 'type'
definitions to help clients more easily recognize known schemas. Candidates for additional extensions include
derived data (like NDVI), including even specific types of derived data that might add more information, mosiacs,
DEMs / DSMs, LiDAR, SAR, hyperspectral imagery, and many more.

### Granular components

It is likely worthwhile once things are more mature to pull out some small pieces from the core that could 
be reused. Things like the queries on the Catalog API (which could be reused for like a stats API or 
a subscription API), the 'filter' language used in the query, or the 'paging' mechanism to navigate through
GeoJSON results in a Catalog API. Effort should be made to pull those out and let others reuse them.

### WFS 3.0 alignment.

Since much of a STAC is very similar to general feature querying, and much of the approach (RESTful, JSON,
OpenAPI definition, etc) is also in line, we should try to align STAC (at least the Catalog API part) so 
that it *is* a WFS 3.0. This will likely involve giving feedback to the [WFS 3.0](https://github.com/opengeospatial/WFS_FES)
group, utilizing their github.

## Potential Extensions

This section will list potential extensions that aren't really core, but would be cool additional services providing
value around the core. Many are things that one or two providers has needed to implement for their customers, and some
would be good to standardize and encourage.

TODO: Figure out if this should break out into its own document.

TODO: Port over most of the ideas from the extension [workstream](https://github.com/radiantearth/boulder-sprint/blob/master/workstreams/extensions/extensions-overview.md#questions-to-discuss) and [notes](https://github.com/radiantearth/boulder-sprint/blob/master/workstreams/extensions/extensions-notes.md) from the boulder sprint.



#### Assets / Activation

Some API's include an 'activation' mechanism so they don't have to store every data product, but can produce them on the fly 
and cache them. A 'core' might just include data products that are already activated, to simplify the process some. But more 
advanced API's likely need some mechanism to advertise that they 'could' make a certain data product, that it's available to 
the user, but it will take more than a couple seconds to get a response.

#### Saved Searches

Another feature that some services offer is the ability to 'save' a given search, and then revisit it or get notifications of 
it. That may make sense as its own little specification.

#### Caching / Updating

Just a quick selective dump on one of the extension topics. The main geo catalog paradigm that has never really worked seems to be that you'd send out requests to a number of different catalogs and then try to parse responses from all of them. It seems time to flip that model around, where there are catalogs that also crawl and cache other catalogs. Indeed the simplest catalog profile could not even offer up 'search' - it'd work as crawlable links and flat files hosted on a cloud storage bucket. 

But a more advanced catalog should offer up a way for other catalogs to subscribe to updates they care about and get notifications. An agriculture company might pull satellite imagery from 5 catalogs, but they only pull the corn belt in the US, where they do their analytics. So they could just have a 'caching catalog', that knows the canonical record is somewhere else (and refers to it). But it stays up to date, and is able to offer sub-second responses to searches on the cached catalogs. And indeed ideally ranks the searches across all the 5 catalogs.
