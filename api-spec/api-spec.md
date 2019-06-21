# STAC API Specification

The STAC API is intended to be a superset of the WFS 3 API specification.

The Web Feature Service is a standard API that represents collections of geospatial data. The [Web Feature Service 3.0 API](https://github.com/opengeospatial/WFS_FES), currently under development, is the latest iteration of that standard. WFS 3 defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an `Item` is a `Feature`, with additional required fields for `datetime` and `assets`. WFS also defines the concept of a Collection, which contains `Feature`s. A STAC `Collection` aligns with (and extends slightly) a WFS 3 `Collection`; it contains `Item`s.

In WFS 3 Collections are the sets of data that can be queried ([7.11](http://docs.opengeospatial.org/DRAFTS/17-069r1.html#_feature_collections)), and each describes basic information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data contained. [STAC collections](../collection-spec/README.md) contain this same information, along with other STAC specific fields and thus are compliant with both WFS Collections and STAC Collections and is returned from the `/collections/{collection_id}` endpoint.

In WFS 3 Features are the individual records within a Collection and are provided in GeoJSON format. [STAC Items](../item-spec/README.md) are analogous to WFS 3 Features, are in GeoJSON, and are returned from the `/collections/{collection_id}/items/{item_id}` endpoint.

## HTTP Request Methods and Content Types

The WFS 3 and STAC APIs follow a RESTful model.  A core principal of this is the use of HTTP Request Methods (verbs) and the `Content-Type` header to drive behavior. This section describes how these are used in the WFS 3 and STAC endpoints. 

1. **Required** GET (both WFS 3 and STAC)
2. **Recommended** POST `Content-Type: application/x-www-form-urlencoded` with the corresponding content body format.
3. **Recommended** POST `Content-Type: multipart/form-data` with the corresponding content body format.
4. **Optional** **STAC endpoint /stac/search only** POST `Content-Type: application/json`, where the content body is a JSON object representing a filter, as defined in the [STAC API OpenAPI specification document](STAC.yaml).  
5. **Prohibited** **WFS 3 endpoints only** POST `Content-Type: application/json`, where the content body is a JSON object representing a filter.  This is prohibited due to conflict with the [Transaction Extension](extensions/transaction/README.md), which defines a POST `Content-Type: application/json` operation to create an Item.

## WFS3 Endpoints

The core WFS 3 endpoints are shown below, with details provided in an [OpenAPI specification document](openapi/WFS3.yaml).

| Endpoint     | Returns       | Description |
| ------------ | ------------- | ----------- |
| /            | JSON          | Landing page, links to API capabilities |
| /api         | JSON          | API definition |
| /conformance | JSON          | Info about standards to which the API conforms |
| /collections | [Collection]   | List of Collections contained in the catalog |
| /collections/{collection_id} | Collection | Returns single Collection JSON |
| /collections/{collection_id}/items | ItemCollection | GeoJSON FeatureCollection-conformant entity of Items in collection |
| /collections/{collection_id}/items/{item_id} | Item | Returns single Item (GeoJSON Feature)|

While the `/api` endpoint is required by WFS 3 [7.3. API definition](https://rawcdn.githack.com/opengeospatial/WFS_FES/3.0.0-draft.1/docs/17-069.html#_api_definition_2), it does not appear in the WFS 3 OpenAPI Specification.

The `/collections/{collection_id}/items` endpoint accepts parameters for filtering the results (also called filters). 
Items in the collection should match all filters to be returned when querying. This implies a logical AND operation. If an OR operation is needed, it should be specified through an extension filter.

## STAC Endpoints

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. Note that a STAC API does not need to implement WFS 3, in which case it would only support the endpoints given below. See the [OpenAPI specification document](openapi/STAC.yaml).

| Endpoint      | Returns | Description |
| ------------- | ------- | ----------- |
| /stac         | Catalog | Root catalog |
| /stac/search  | [ItemCollection](../item-spec/itemcollection-spec.md) | Retrieves a group of Items matching the provided search predicates, probably containing search metadata from the `search` extension |

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
| intersects   | GeoJSON Geometry | STAC       | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| next         | string           | STAC       | The token to retrieve the next set of results, e.g., offset, page, continuation token|
| ids | [string] | Array of Item ids to return. All other filter parameters that further restrict the number of search results (except `next` and `limit`) are ignored |
| collections  | [string]         | STAC       | Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched |

In general, only one of **intersects** or **bbox** should be specified.  If both are specified, results should match both. 

Additionally, there are several reserved parameters over STAC search that have no meaning in the base API Specification, but which are reserved exclusively for the use of API Extensions.  API implementations are free to add additional implementation-specific filter parameters, but they **MUST NOT** use following parameters unless implementing the syntax and semantics of an API Extension attached to that parameter.  If no API Extension for that parameter is implemented by an api, then if that parameter has a non-empty value in the request a 400 Bad Request status code must be returned. 

| Parameter    | Type             | APIs       | Description        |
| -----------  | ---------------- | ---------- | ---------------------- |
| fields | string | Placeholder parameter for [API Fields Extension](extensions/fields/README.md). |
| sort | string | Placeholder parameter for [API Sort Extension](extensions/sort/README.md). |
| query_profile | string | Placeholder parameter for [API Query Extension](extensions/query/README.md) profile name (e.g., `cql`). |
| query | string | Placeholder parameter for [API Query Extension](extensions/query/README.md). |

**query_profile** semantics TBD. if you only implement one query extension, or if you choose to auto-detect? maybe this is just
the disambiguator, and it's only required that a 400 status code result if the query cannot be parsed wrt to the specified query_profile.

**query**
Example CQL Query Extension:

    query_profile=cql&query=properties.eo:cloud_cover<1 AND properties.landsat:wrs_row=28

**fields** 
Example for (likely) the only Fields Extension:

    fields=properties.eo:cloud_cover,-geometry
    
**sort**
Example for (likely) the only  Sort Extension:

    sort=properties.datetime|asc,id|desc

## Filter JSON Body

Used with `POST Content-Header: application/json`

All Extensions are **recommended** to use attribute names qualified from the root of Item, rather than Item Properties.

Like Filter Parameters, these attribute names are reserved for extensions, must not implement different semantics.

**TBD** how to allow multiple different extensions format. Partially for allowing multiple to be implemented by the same impl, but more so that you don't accidentally get different semantics because a different format was expected -- need good error handling w/ bad query

| Parameter | Type         | Description |
| --------- | ------------ | ----------- |
| fields    | FieldsFilter | Placeholder attribute for API Fields Extension. |
| sort      | SortFilter   | Placeholder attribute for API Sort Extensions. |
| query     | Query        | Placeholder attribute for an API Query Extension. |

### Query fields

Additions to JSON Search body entity:

| Field Name | Type      | Description |
| ---------- | --------- | ----------- |
| query      | object    | an extension-specific object representing the query filter |

This object describes a Query Extension format.

| Field Name | Type      | Description |
| ---------- | --------- | ----------- |
| profile    | string    | a value uniquely representing which query extension is being used |
| query      | object    | representation of what a query is in the query extension. |

**profile** the profile name as described in the Query Extension, e.g., `cql`

**query** the object representing whatever a query means in the Query Extension specified by `type`.  This is completely implemenation-specific.

Query Extensions are **recommended** to use attribute names qualified from the root of Item, rather than Item Properties.

Example:

A query profile like the existing Query Extension, but that uses arrays of name/op/value instead of a fixed structure. 

I think it's important to have a Query Extension like this that, even though it is custom to STAC, is extremely simple to 
implement and requires no string parsing like CQL does (because all of the tokens are already separated).  

```
{ 
  ...
  "query": {
    "profile": "existing_query_extension_but_with_arrays",
    "query": {
      "properties.eo:cloud_cover": {
        "gte": 0,
        "lte": 10
      }
    }
  }
  ...
}
```

A query profile that uses CQL:

```
{ 
  ...
  "query" : {
    "profile": "cql",
    "query": {
      "predicate": "properties.eo:cloud_cover<1 AND properties.landsat:wrs_row=28"
    }
  }
  ...
}
```
