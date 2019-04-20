# STAC API Specification

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns STAC [Catalogs](../catalog-spec/README.md), [Collections](../collection-spec/README.md), or [Items](../item-spec/README.md), depending on the endpoint. Catalogs and Collections are JSON, while Items are GeoJSON Features (single Item) or Feature Collections (multiple Items returned from a search).

## WFS3
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


## OpenAPI Documents

The definitive specification for STAC is the [OpenAPI](http://openapis.org/) 3.0 YAML document. This is available in several forms. The most straightforward for an implementor new to STAC is the [STAC-standalone.yaml](STAC-standalone.yaml).
This gives a complete service with the main STAC endpoint. See the [online documentation](https://app.swaggerhub.com/apis/cholmesgeo/STAC-standalone/) for the API rendered interactively.


The OpenAPI specification is contained within several YAML files in the [definitions](definitions/) and [extensions](extensions/) directories.

The YAML files are either complete OpenAPI documents that can be used as such (e.g., generating documentation with Swagger), or they are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document (such as to define an extension), and must be merged with a complete OpenAPI document to be usable.

This way extensions can be kept separate, and implementors can combine just the extensions they want to use in order to create a custom OpenAPI document that can be used to generate docuemntation.

### Updating the OpenAPI documents

Editing should be done on the files in the definitions/ and extensions/ directories, *not* the `STAC-core.yaml` and `STAC-full.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs with:

```
$ npm install
$ npm run generate-all
```

which will overwrite the files. 

### Creating your own OpenAPI document

Create your own OpenAPI document by combinining the definitions and extensions you want by creating a `myapi.merge.yaml` file. This file should contain a line indicating the files that need to be merged:

```
!!files_merge_append ["STAC-core.yaml", "extensions/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```
$ npm install
$ yaml-files myapi.merge.yaml myapi.yaml
```

The STAC API should be simple to implement and extensible. To support that goal, the extensions are broken out into fragments.
These fragments should allow an implementor to layer on additional functionality as needed.

We have structured our OpenAPI YAML files so that that can be joined together with `import` statements to prevent copying the
extensions into every possibly combination. In the [`api-spec` folder](.) you can expect to find complete OpenAPI definitions that are
useable as-is.

