# STAC API Specification

The STAC API is intended to be a superset of the *OGC API - Features - Part 1: Core* (OAFeat) standard. STAC API currently bases on [OAFeat version 1.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html), previously known as OGC Web Feature Service (WFS). We'll try to align with [upcoming versions](https://github.com/opengeospatial/ogcapi-features).

The OGC API - Features is a standard API that represents collections of geospatial data. It is the latest iteration of that standard and defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With OAFeat you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an `Item` is a `Feature`, with additional required fields for `datetime` and `assets`. OAFeat also defines the concept of a Collection, which contains Features. A STAC `Collection` aligns with (and extends slightly) a OAFeat `Collection`; it contains Items.

In OAFeat Collections are the sets of data that can be queried ([7.11](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)), and each describes basic information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data contained. [STAC collections](../collection-spec/README.md) contain this same information, along with other STAC specific fields and thus are compliant with both OAFeat Collections and STAC Collections and is returned from the `/collections/{collection_id}` endpoint.

In OAFeat Features are the individual records within a Collection and are provided in GeoJSON format. [STAC Items](../item-spec/README.md) are analogous to OAFeat Features, are in GeoJSON, and are returned from the `/collections/{collection_id}/items/{item_id}` endpoint.

## HTTP Request Methods and Content Types

The OAFeat and STAC APIs follow a RESTful model. A core principal of this is the use of HTTP Request Methods (verbs) and the `Content-Type` header to drive behavior. This section describes how these are used in the OAFeat and STAC endpoints. 

1. **Required** GET (both OAFeat and STAC)
2. **Recommended** POST `Content-Type: application/x-www-form-urlencoded` with the corresponding content body format.
3. **Recommended** POST `Content-Type: multipart/form-data` with the corresponding content body format.
4. **Optional** **STAC endpoint /stac/search only** POST `Content-Type: application/json`, where the content body is a JSON object representing a filter, as defined in the [STAC API OpenAPI specification document](STAC.yaml).  
5. **Prohibited** **OAFeat endpoints only** POST `Content-Type: application/json`, where the content body is a JSON object representing a filter. This is prohibited due to conflict with the [Transaction Extension](extensions/transaction/README.md), which defines a POST `Content-Type: application/json` operation to create an Item.

## OGC API - Features Endpoints

The core OGC API - Features endpoints are shown below, with details provided in an [OpenAPI specification document](openapi/WFS3.yaml).

| Endpoint     | Returns       | Description |
| ------------ | ------------- | ----------- |
| /            | JSON          | Landing page, links to API capabilities |
| /conformance | JSON          | Info about standards to which the API conforms |
| /collections | [Collection]  | List of Collections contained in the catalog |
| /collections/{collectionId}  | Collection | Returns single Collection JSON |
| /collections/{collectionId}/items | ItemCollection | GeoJSON FeatureCollection-conformant entity of Items in collection |
| /collections/{collectionId}/items/{featureId} | Item | Returns single Item (GeoJSON Feature) |

The `/collections/{collection_id}/items` endpoint accepts parameters for filtering the results (also called filters). 
Items in the collection should match all filters to be returned when querying. This implies a logical AND operation. If an OR operation is needed, it should be specified through an extension filter.

## STAC Endpoints

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. Note that a STAC API does not need to implement OAFeat, in which case it would only support the endpoints given below. See the [OpenAPI specification document](openapi/STAC.yaml).

| Endpoint      | Returns | Description |
| ------------- | ------- | ----------- |
| /stac         | Catalog | Root catalog |
| /stac/search  | [ItemCollection](../item-spec/itemcollection-spec.md) | Retrieves a group of Items matching the provided search predicates, probably containing search metadata from the `search` extension |

The `/stac` endpoint should function as a complete `Catalog` representation of all the data contained in the API and linked to in some way from root through `Collections` and `Items`.

The `/stac/search` endpoint is similar to the `/collections/{collectionId}/items` endpoint in OGC API - Features in that it accepts parameters for filtering, however it performs the filtering across all collections. The parameters accepted are the same as the Filter Parameters above, however the *[extensions](extensions/README.md)* also provide advanced querying parameters.

If the `/stac/search` endpoint is implemented, it is **required** to add a link with the `rel` type set to `search` to the `links` array in `GET /stac` that refers to the search endpoint in the `href` property.

## Filter Parameters and Fields

Unless otherwise noted by **Path-only**, these filters are passed as query string parameters, form parameters, or JSON 
entity fields.  For filters that represent a set of values, query and form parameters should use comma-separated 
string values and JSON entity attributes should use JSON Arrays. 

| Parameter    | Type             | APIs         | Description        |
| -----------  | ---------------- | ------------ | ---------------------- |
| collectionId | [string]         | OAFeat       | **Path-only** Single Collection ID to include in the search for items. Only Items in one of the provided Collection will be searched |
| limit        | integer          | OAFeat, STAC | The maximum number of results to return (page size). Defaults to 10 |
| bbox         | [number]         | OAFeat, STAC | Requested bounding box.  Represented using either 2D or 3D geometries. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum. |
| datetime     | string           | OAFeat, STAC | Single date+time, or a range ('/' seperator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use double dots `..` for open date ranges. |
| intersects   | GeoJSON Geometry | STAC         | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| next         | string           | STAC         | The token to retrieve the next set of results, e.g., offset, page, continuation token|
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