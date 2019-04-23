## STAC API Specification

The STAC Collection spec is designed to be compatible with the WFS `/collections/{collectionId}` endpoint's response. This enables
WFS + STAC implementations to just extend the WFS collections with a bit more information to be STAC compliant Collection
definitions.
The scenario that using a WFS with a STAC search endpoint that makes the most sense is when a data provider wants to provide more
insight in to heterogenous data that is exposed on a STAC search. For example they might have imagery data from different satellite providers
and even some drone data. These will all have different fields. A single STAC endpoint can be used to expose them all. But it can be quite
useful to let users inspect a particular data type. That area of the `/collections/{name}` hierarchy can be used to expose additional
metadata and validation schemas that give more insight in to that data, as well as a place to query just that data.

In general it is recommended to provide as much information about different types of data as possible, so using WFS is recommended. But
the standalone option is there for those who just want to expose their data as quickly and easily as possible. Note a WFS can
provide heterogenous data from any of its collections endpoints, but the STAC API recommendation is to use one collection per
logical data type.


A full STAC API is a valid [Web Feature Service 3 API](https://github.com/opengeospatial/WFS_FES). WFS3 defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any `Feature`, which in the STAC specification is referred to as an `Item` whereas a STAC `Collection` is as a WFS3 `Collection` (with fields specific to STAC Collections).

STAC starts with a core WFS3 interface and adds extensions to support STAC specific capabilities. The core WFS3 endpoints are shown below, with details provided in an [OpenAPI specification document](definitions/WFS3-core.yaml).

| Endpoint      | Returns          | Description        |
| ------------ | ------------- | ---------------------- |
| / | JSON        | Landing page, links to API capabilities |
| /conformance | JSON | Info about standards the API conforms to       |
| /collections | Collections | List of Collections contained in the catalog |
| /collections/{collection_id} | Collection | Returns single Collection JSON |
| /collections/{collection_id}/items | Items | GeoJSON FeatureCollection of Items in Collection |
| /collections/{collection_id}/items/{item_id} | Item | Returns single Item GeoJSON |

### WFS Structure

A Web Feature Service is a standard API that represents collections of geospatial data.

Lists the collections of data on the server that can be queried ([7.11](https://rawgit.com/opengeospatial/WFS_FES/master/docs/17-069.html#_feature_collections_metadata)),
and each describes basic information about the geospatial data collection, like its name and description, as well as the
spatial and temporal extents of all the data contained. The collections returned are compliant to both WFS Collections and
[STAC collections](../collections-spec/README.md). A STAC search extension would only query those collections which
have data that validates as STAC Items - with a datetime field and references to assets. But a STAC can live alongside
other WFS collections, like an organization might choose to have their building and road data in WFS collections, alongside
their STAC-compatible imagery data.

```
GET /collections/{name}/items?bbox=160.6,-55.95,-170,-25.89
```

Requests all the data in the collection that is in New Zealand. The filtering is made to be compatible with the STAC API,
and the two specs seek to share the general query and filtering patterns. The key difference is that a STAC search endpoint
will do cross collection search. A typical WFS will have multiple collections, and each will just offer search for its particular
collection.

## STAC

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. Note that a STAC API does not need to implement WFS3, in which case it would only support the endpoints given below. See the [OpenAPI specification document](definitions/STAC-standalone.yaml).

```
| Endpoint      | Returns          | Description        |
| ------------ | ------------- | ---------------------- |
| /stac | Catalog        | Root catalog |
| /stac/search | Items | GeoJSON FeatureCollection of Items found |
```

## Browsable API

An additional best practice is to use the WFS items available in `/collections/{collectionId}/items` as the "canonical" web
location. Then the STAC Catalogs returned from `/stac/` can either link directly to those (from the appropriate sub-catalog -
for example `/stac/landsat8/42/31/2017/` would be a catalog consisting of links to `/collections/`). Or it can return JSON
in the link structure (like `/stac/landsat8/42/31/2017/item203123.json`), and have that returned JSON use a link with `rel=canonical` that goes back to the `Item` that is in the collection.