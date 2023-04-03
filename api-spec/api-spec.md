# STAC API Specification

The STAC API is intended to be a superset of the *OGC API - Features - Part 1: Core* (OAFeat) standard. STAC API 
currently bases on [OAFeat version 1.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html), previously known as 
OGC Web Feature Service (WFS). We'll try to align with 
[upcoming versions](https://github.com/opengeospatial/ogcapi-features).

The OGC API - Features is a standard API that represents collections of geospatial data. It is the latest iteration of 
that standard and defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With 
OAFeat you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an 
`Item` is a `Feature`, with additional required fields for `datetime` and `assets`. OAFeat also defines the concept of 
a Collection, which contains Features. A STAC `Collection` aligns with (and extends slightly) a OAFeat `Collection`; it 
contains Items.

In OAFeat Collections are the sets of data that can be queried 
([7.11](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)), and each describes basic information 
about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data 
contained. [STAC collections](../collection-spec/README.md) contain this same information, along with other STAC 
specific fields and thus are compliant with both OAFeat Collections and STAC Collections and is returned from the 
`/collections/{collection_id}` endpoint.

In OAFeat Features are the individual records within a Collection and are provided in GeoJSON format. 
[STAC Items](../item-spec/README.md) are analogous to OAFeat Features, are in GeoJSON, and are returned from the 
`/collections/{collection_id}/items/{item_id}` endpoint.

A typical OAFeat will have multiple collections, and each will just offer simple search for its particular collection at 
`GET /collections/{collectionId}/items`.
The main STAC endpoint specified beyond what OAFeat offers is `/search`, which offers cross-collection search. A primary
use case of STAC is to search diverse imagery collections (like Landsat, Sentinel, MODIS) by location and cloud cover for any
relevant image. So the ability to do searches across Collections is required, and is not yet specified by OAFeat. Due to the 
limited parameter support in OGC API - Features, it is recommended to use the STAC API endpoint 
`POST /search` for advanced queries, as it supports richer options.
The filtering is made to be compatible between STAC API and OGC API - Features whenever feasible, and the two specs seek 
to share the general query and filtering patterns, and STAC will align with OGC API when it offers advanced filtering.

Implementations may **optionally** provide support for the full superset of STAC API query parameters to the 
`/collections/{collectionId}/items` endpoint,
where the collection ID in the path is equivalent to providing that single value in the `collections` query parameter in 
STAC API.

## HTTP Request Methods and Content Types

The OAFeat and STAC APIs follow a RESTful model. A core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns"). This section describes how these are used in the OAFeat and STAC endpoints. 

#### GET

**Required**: OAFeat 1.0 only specifies GET query parameters, and they are all required. STAC's cross-collection `/search` also requires
GET queries for all implementations, and generally aligns with OAFeat's single Collection search. 

#### POST

1. **Recommended** STAC `/search` is strongly recommended to implement POST `Content-Type: application/json`, where the content body is a JSON 
object representing a query and filter, as defined in the [STAC API OpenAPI specification document](STAC.yaml). 
2. **Prohibited** OAFeat: POST `Content-Type: application/json` on the `/collections/{collectionId}/items`, where the content body is a JSON 
object representing a filter, is not allowed. This is prohibited due to conflict with the 
[Transaction Extension](extensions/transaction/README.md), which defines a POST `Content-Type: application/json` 
operation to create an Item. Any query against a single OAFeat collection endpoint should be possible against the STAC `/search` endpoint, specifying
the collection name in the `collections` query parameter.

It is recommended for clients use POST for querying (if the STAC API supports it), especially when using the 
`intersects` query parameter, for two reasons:

1. In practice, the allowed size for an HTTP GET request is significantly less than that allowed for a POST request, 
so if a large geometry is used in the query it may cause a GET request to fail.
2. The parameters for a GET request must be escaped properly, making it more difficult to construct when using JSON 
parameters (such as intersect).

**STAC API extensions** allow for more sophisticated searching, such as the ability to search by geometries and 
searching on specific Item properties.

#### PUT / PATCH / DELETE

The other HTTP verbs are not supported in the core STAC specification. The [Transaction Extension](extensions/transaction/README.md)
does implement them, for STAC and OAFeat implementations that want to enable writing and deleting items. 

## OGC API - Features Endpoints

The core OGC API - Features endpoints are shown below, with details provided in an 
[OpenAPI specification document](openapi/OAFeat.yaml).

| Endpoint     | Returns       | Description |
| ------------ | ------------- | ----------- |
| /            | JSON          | Landing page, links to API capabilities |
| /conformance | JSON          | Info about standards to which the API conforms |
| /collections | [Collection]  | List of Collections contained in the catalog |
| /collections/{collectionId}  | Collection | Returns single Collection JSON |
| /collections/{collectionId}/items | ItemCollection | GeoJSON FeatureCollection-conformant entity of Items in collection |
| /collections/{collectionId}/items/{featureId} | Item | Returns single Item (GeoJSON Feature) |

The `/collections/{collection_id}/items` endpoint accepts parameters for filtering the results (also called filters). 
Items in the collection should match all filters to be returned when querying. This implies a logical AND operation. If 
an OR operation is needed, it should be specified through an extension filter.

## STAC Endpoints

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. 
Note that a STAC API does not need to implement OAFeat, in which case it would only support the endpoints given below. 
See the [OpenAPI specification document](openapi/STAC.yaml).

| Endpoint      | Returns | Description |
| ------------- | ------- | ----------- |
| /             | Catalog | Extends `/` from OAFeat to return a full STAC catalog. |
| /search       | [ItemCollection](../item-spec/itemcollection-spec.md) | Retrieves a group of Items matching the provided search predicates, probably containing search metadata from the `search` extension |

The `/` endpoint should function as a complete `Catalog` representation of all the data contained in the API and linked 
to in some way from root through `Collections` and `Items`.

The `/search` endpoint is similar to the `/collections/{collectionId}/items` endpoint in OGC API - Features in that it 
accepts parameters for filtering, however it performs the filtering across all collections. The parameters accepted are 
the same as the Filter Parameters above, however the *[extensions](extensions/README.md)* also provide advanced querying 
parameters.

If the `/search` endpoint is implemented, it is **required** to add a link with the `rel` type set to `search` to the 
`links` array in `/` that refers to the search endpoint in the `href` property.

## Filter Parameters and Fields

Unless otherwise noted by **Path-only**, these filters are passed as query string parameters, form parameters, or JSON 
entity fields.  For filters that represent a set of values, query and form parameters should use comma-separated 
string values and JSON entity attributes should use JSON Arrays. 

| Parameter    | Type             | APIs         | Description        |
| -----------  | ---------------- | ------------ | ---------------------- |
| collectionId | string           | OAFeat       | **Path-only** Single Collection ID to include in the search for items. Only Items in one of the provided Collection will be searched |
| limit        | integer          | OAFeat, STAC | The maximum number of results to return (page size). Defaults to 10 |
| bbox         | [number]         | OAFeat, STAC | Requested bounding box.  Represented using either 2D or 3D geometries. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum. |
| datetime     | string           | OAFeat, STAC | Single date+time, or a range ('/' seperator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use double dots `..` for open date ranges. |
| intersects   | GeoJSON Geometry | STAC         | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| ids | [string] | STAC | Array of Item ids to return. All other filter parameters that further restrict the number of search results (except `next` and `limit`) are ignored |
| collections  | [string]         | STAC         | Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched |

Only one of either **intersects** or **bbox** should be specified.  If both are specified, a 400 Bad Request response 
should be returned. 

## Reserved Parameters

 Additionally, there are several reserved parameters over STAC search that have no meaning in the base STAC API 
 specification, but which are reserved exclusively for the use of API Extensions.  API implementations are free to 
 add additional implementation-specific parameters, but they **MUST NOT** use following parameters unless implementing 
 the syntax and semantics of an API Extension attached to that parameter.  If no API Extension for that parameter is 
 implemented by an API, then if that parameter has a non-empty value in the request a 400 Bad Request status code must 
 be returned. 

### Fields Extension

These parameters and fields are reserved for the Fields extension.

| Parameter | Type              | APIs       | Description |
| --------- | ----------------- | ---------- | ----------- |
| fields    | string \| [Field] | Placeholder parameter for [API Fields Extension](extensions/fields/README.md). |

### Sort Extension

These parameters and fields are reserved for the Sort extension.

| Parameter | Type             | APIs       | Description |
| --------- | ---------------- | ---------- | ----------- |
| sort      | string \| [Sort] | Placeholder parameter for [API Sort Extension](extensions/sort/README.md). |

### Query Extension

These parameters and fields are reserved for query extensions. 

All Extensions **should** use attribute names qualified from the root of Item, rather than Item Properties.

| Parameter | Type                  | APIs       | Description |
| --------  | --------------------- | ---------- | ----------- |
| query     | string \| QueryFilter | Placeholder parameter for [API Query Extension](extensions/query/README.md) query value. |

 **query** Represents a query in the query language.

### Paging Extension

OGC API supports paging through hypermedia links and STAC follows the same pattern for the cross collection search. For 
GET requests, a link with `rel` type `next` is supplied.  This link may contain any URL parameter that is necessary 
for the implementation to understand how to provide the next page of results, eg: `page`, `next`, `token`, etc.  The 
parameter name is defined by the implementor and is not necessarily part of the API specification.  For example:

```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search?page=2"
        }
    ]
}
```

The href may contain any arbitrary URL parameter:

* `http://api.cool-sat.com/search?page=2`
* `http://api.cool-sat.com/search?next=8a35eba9c`
* `http://api.cool-sat.com/search?token=f32890a0bdb09ac3`

OAFeat does not support POST requests for searches, however the STAC API spec does. Hypermedia links are not designed 
for anything other than GET requests, so providing a next link for a POST search request becomes problematic. STAC has 
decided to extend the `link` object to support additional fields that provide hints to the client as to how it should 
execute a subsequent request for the next page of results.

The following fields have been added to the `link` object specification for the API spec:

| Parameter | Type             | Description |
| --------- | ---------------- | ----------- |
| method    | string           | The HTTP method of the request, usually `GET` or `POST`. Defaults to `GET` |
| headers   | object           | A dictionary of header values that should be included in the next request |
| body      | object           | A JSON object containing fields/values that should be included in the body of the next request |
| merge     | boolean          | If `true`, the headers/body fields in the `next` link should be merged into the original request and be sent combined in the next request. Defaults to `false` | 

The implementor has the freedom to decide exactly how to apply these extended fields for their particular pagination 
mechanism.  The same freedom that exists for GET requests, where the actual URL parameter used to defined the next page 
of results is purely up to the implementor and not defined in the API spec, if the implementor decides to use headers, 
there are no specific or required header names defined in the specification.  Implementors may use any names or fields 
of their choosing. Pagination can be provided solely through header values, solely through body values, or through some 
combination.  

To avoid returning the entire original request body in a POST response which may be arbitrarily large, the  `merge` 
property can be specified. This indicates that the client should send the same post body that it sent in the original 
request, but with the specified headers/body values merged in. This allows servers to indicate what needs to change 
to get to the next page without mirroring the entire query structure back to the client.

Example requests can be found in the [examples document](./examples.md#paging).
