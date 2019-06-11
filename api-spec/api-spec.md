# STAC API Specification

The STAC API is intended to be a superset of the WFS 3 API specification.

The Web Feature Service is a standard API that represents collections of geospatial data. The [Web Feature Service 3.0 API](https://github.com/opengeospatial/WFS_FES), currently under development, is the latest iteration of that standard. WFS 3 defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an `Item` is a `Feature`, with additional required fields for `datetime` and `assets`. WFS also defines the concept of a Collection, which contains `Feature`s. A STAC `Collection` aligns with (and extends slightly) a WFS 3 `Collection`; it contains `Item`s.

In WFS 3 Collections are the sets of data that can be queried ([7.11](http://docs.opengeospatial.org/DRAFTS/17-069r1.html#_feature_collections)), and each describes basic information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data contained. [STAC collections](../collection-spec/README.md) contain this same information, along with other STAC specific fields and thus are compliant with both WFS Collections and STAC Collections and is returned from the `/collections/{collection_id}` endpoint.

In WFS 3 Features are the individual records within a Collection and are provided in GeoJSON format. [STAC Items](../item-spec/README.md) are analogous to WFS 3 Features, are in GeoJSON, and are returned from the `/collections/{collection_id}/items/{item_id}` endpoint.

## HTTP Request Methods and Content Types

For WFS3-compliance, it is **required** only that `GET` is implemented for the WFS3 endpoints.  Also, it is **required** only that `GET` is implemented for the STAC endpoints. 

Since STAC adds additional filter parameters that may have much larger values, like `intersects`, it is **recommended** to also support `POST` for both the WFS3 and STAC endpoints that
 accept filter parameters (e.g., `/collections/{collection_id}/items` and `/stac/search`). 
 
It is **recommended** that these `Content-Type` options be supported when using POST:

1. POST with the `Content-Type` header set to `application/x-www-form-urlencoded` with the appropriate content body format.
2. POST with the `Content-Type` header set to `multipart/form-data` with the appropriate content body format.
3. POST with the `Content-Type` header set to `application/json`, where the content body is a JSON object with the same names as the filter parameters, as defined in the [STAC API OpenAPI specification document](STAC.yaml).  

## WFS3 Endpoints

The core WFS 3 endpoints are shown below, with details provided in an [OpenAPI specification document](openapi/WFS3.yaml).

| Endpoint      | Returns          | Description        |
| ------------ | ------------- | ---------------------- |
| / | JSON        | Landing page, links to API capabilities |
| /conformance | JSON | Info about standards the API conforms to       |
| /collections | Collections | List of Collections contained in the catalog |
| /collections/{collection_id} | Collection | Returns single Collection JSON |
| /collections/{collection_id}/items | ItemCollection | GeoJSON FeatureCollection-conformant entity of Items in collection |
| /collections/{collection_id}/items/{item_id} | Item | Returns single Item (GeoJSON Feature)|

The `/collections/{collection_id}/items` endpoint accepts parameters for filtering the results (also called filters). 
Items in the collection should match all filters to be returned when querying. This implies a logical AND operation. If an OR operation is needed, it should be specified through an extension filter.

## STAC Endpoints

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. Note that a STAC API does not need to implement WFS 3, in which case it would only support the endpoints given below. See the [OpenAPI specification document](openapi/STAC.yaml).

| Endpoint      | Returns          | Description        |
| ------------ | ------------- | ---------------------- |
| /stac | Catalog        | Root catalog |
| /stac/search | Items | GeoJSON FeatureCollection of Items found |

The `/stac` endpoint should function as a complete `Catalog` representation of all the data contained in the API and linked to in some way from root through `Collections` and `Items`.

The `/stac/search` endpoint is similar to the `items` endpoint in WFS3 in that it accepts parameters for filtering, however it performs the filtering across all collections. The parameters accepted are the same as the Filter Parameters above, however the *[extensions](extensions/README.md)* also provide advanced querying parameters.

If the `/stac/search` endpoint is implemented, it is **required** to add a link with the `rel` type set to `search` to the `links` array in `GET /stac` that refers to the search endpoint in the `href` property.

## Filter Parameters

Unless otherwise noted by **Path-only**, these filters are passed as query string, form, or JSON entity parameters.  Query and form parameters should use comma-separated string values. JSON entity parameters should use JSON Arrays. 

| Parameter    | Type             | APIs       | Description        |
| -----------  | ---------------- | ---------- | ---------------------- |
| collectionId | [string]         | WFS3       | **Path-only** Single Collection ID to include in the search for items. Only Items in one of the provided Collection will be searched |
| limit        | integer          | WFS3, STAC | The maximum number of results to return (page size). Defaults to 10 |
| bbox         | [number]         | WFS3, STAC | Requested bounding box [west, south, east, north] |
| time         | string           | WFS3, STAC | Single date, date+time, or a range ('/' seperator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6) |
| intersects   | GeoJSON Geometry | STAC | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| page         | integer          | STAC       | The page number of results. Defaults to 1 |
| ids          | [string]         | STAC       | Array of Item ids to return. All other filter parameters that further restrict the number of search results (except `page` and `limit`) are ignored |
| collections  | [string]         | STAC       | Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched |
