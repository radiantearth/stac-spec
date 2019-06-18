# STAC API Specification

The STAC API is intended to be a superset of the WFS 3 API specification.

The Web Feature Service is a standard API that represents collections of geospatial data. The [Web Feature Service 3.0 API](https://github.com/opengeospatial/WFS_FES), currently under development, is the latest iteration of that standard. WFS 3 defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an `Item` is a `Feature`, with additional required fields for `datetime` and `assets`. WFS also defines the concept of a Collection, which contains `Feature`s. A STAC `Collection` aligns with (and extends slightly) a WFS 3 `Collection`; it contains `Item`s.

In WFS 3 Collections are the sets of data that can be queried ([7.11](http://docs.opengeospatial.org/DRAFTS/17-069r1.html#_feature_collections)), and each describes basic information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data contained. [STAC collections](../collection-spec/README.md) contain this same information, along with other STAC specific fields and thus are compliant with both WFS Collections and STAC Collections and is returned from the `/collections/{collection_id}` endpoint.

In WFS 3 Features are the individual records within a Collection and are provided in GeoJSON format. [STAC Items](../item-spec/README.md) are analogous to WFS 3 Features, are in GeoJSON, and are returned from the `/collections/{collection_id}/items/{item_id}` endpoint.

Explicit note here that these paths are relative to some URI root, e.g., it doesn't have to be http://example.com/stac/search, that http://example.com/api/v1/stac/search is fine, and root URI is `http://example.com/api/v1`

## HTTP Request Methods and Content Types

For WFS3-compliance, it is **required** only that `GET` is implemented for the WFS3 endpoints.  Also, it is **required** only that `GET` is implemented for the STAC endpoints. 

Since STAC adds additional filter parameters that may have much larger values, like `intersects`, it is **recommended** to also support `POST` for both the WFS3 and STAC endpoints that
 accept filter parameters (e.g., `/collections/{collection_id}/items` and `/stac/search`). 
 
It is **recommended** that these `Content-Type` options be supported when using POST:

APIs may provide additional parameters, but for the parameter names in this core API specification or for an extension that the API proports to implement, the API must not implement parameter validation or semantics that differ from those in the specification. 

1. POST with the `Content-Type` header set to `application/x-www-form-urlencoded` with the appropriate content body format.
2. POST with the `Content-Type` header set to `multipart/form-data` with the appropriate content body format.
3. POST with the `Content-Type` header set to `application/json`, where the content body is a JSON object with the same names as the filter parameters, as defined in the [STAC API OpenAPI specification document](STAC.yaml).  

GraphQL Extension:
4. POST with the `Content-Type` header set to `application/graphql`, where the content body is a JSON object with the same names as the filter parameters, as defined in the [STAC API OpenAPI specification document](STAC.yaml).  

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

Catalog extension to describe capabilities:

GET/POST Parameters
POST JSON (this should not be required)
GET/POST Parameter extensions
POST JSON extensions

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

Additionally, there are several reserved parameters over STAC search that have no meaning in the base API Specification, but which are reserved exclusively for the use of API Extensions.  API implementations are free to add additional implementation-specific filter parameters, but they **MUST NOT** use following parameters unless implementing the syntax and semantics of an API Extension attached to that parameter.  If no API Extension for that parameter is implemented by an api, then if that parameter has a non-empty value in the request a 400 Bad Request status code must be returned. 

| Parameter    | Type             | APIs       | Description        |
| -----------  | ---------------- | ---------- | ---------------------- |
| fields | string | Placeholder parameter for API Fields Extension. |
| sort | string | Placeholder parameter for API Sort Extensions. |
| query_profile | string | Placeholder parameter for API Query Extension profile (e.g., `cql`). |
| query | string | Placeholder parameter for API Query Extension. |
| operationName | string | Placeholder for GraphQL operationName parameter. |
| variables | string | Placeholder for GraphQL variables parameter. |

**query_profile** semantics TBD if you only implement one query extension, or if you choose to auto-detect? maybe that's 
the disambiguator, and it's only required that a 400 status code result if the query cannot be parsed wrt to the specified query_profile.

Should the GraphQL Extension be allowed to specify that fields and sort should be ignored?

**fields** 
Example for (likely) the only Fields Extension:

    fields=@summary,-geometry

**query**
Example CQL Query Extension:

    query_profile=cql&query=properties.eo:cloud_cover<1 AND properties.landsat:wrs_row=28

Example GraphQL Query Extension:
    
    query_profile=graphql&query={item{id}}

**sort**
Example for (likely) the only  Sort Extension:

    sort=properties.datetime|asc,id|desc

Note: Jive API did this with a hardcoded set of sorts, with names like datetimeAsc, idAsc, usernameDesc. Pipe syntax seems reasonable to me to allow arbitrary ones.

## Filter JSON Body

Used with `POST Content-Header: application/json`

All Extensions are **recommended** to use attribute names qualified from the root of Item, rather than Item Properties.

Like Filter Parameters, these attribute names are reserved for extensions, must not implement different semantics.

**TBD** how to allow multiple different extensions format. Partially for allowing multiple to be implemented by the same impl, but more so that you don't accidentally get different semantics because a different format was expected -- need good error handling w/ bad query

| Parameter    | Type             | APIs       | Description        |
| -----------  | ---------------- | ---------- | ---------------------- |
| fields | Fields | Placeholder parameter for API Fields Extension. |
| sort | Sort | Placeholder parameter for API Sort Extensions. |
| query_profile | string | Placeholder parameter for API Query Extension Type (e.g., `cql`). |
| query | Query | Placeholder parameter for API Query Extension. |
| operationName | string | Placeholder for GraphQL operationName parameter. |
| variables | string | Placeholder for GraphQL variables parameter. |

### Fields fields

This object describes a Fields Extension format.

| Field Name | Type  | Description |
| ---------- | --------- | ----------- |
| type       | string    | the Fields Extension name that is used for this, e.g., `include_exclude_csv` |
| value      | object    | an extension-specific object representing the field filter |

**type** the type as described in the Fields Extension 

**value** the object representing whatever a field definitions means as specified by `type`.  This is completely implementation-specific.

Example:

```
{ 
  ...
  "fields": {
    "type": "include_exclude_array",
    "value": {
      "description": ["id","properties.eo:cloud_cover","properties.proj:geometry","properties.proj:crs"]
    }
  }
  ...
}
```

```
{ 
  ...
  "fields": {
    "type": "include_exclude_csv",
    "value": {
      "description": "@summary,-geometry"
    }
  }
  ...
}
```


### Query fields

This object describes a Query Extension format.

| Field Name | Type  | Description |
| ---------- | --------- | ----------- |
| query_profile       | string    | the Query Extension name that is used for this, e.g., `cql` |
| query      | object    | an extension-specific object representing the query filter |

**type** the type as described in the Query Extension 

**value** the object representing whatever a query means in the Query Extension specified by `type`.  This is completely implemenation-specific.

Query Extensions are **recommended** to use attribute names qualified from the root of Item, rather than Item Properties.

Example:

A query profile like the existing Query Extension, but that uses arrays of name/op/value instead of a fixed structure. 

I think it's important to have a Query Extension like this that, even though it is custom to STAC, is extremely simple to 
implement and requires no string parsing like CQL does (because all of the tokens are already separated).  

```
{ 
  ...
  "query_profile": "existing_query_extension_but_with_arrays",
  "query": {
    "predicates": [
      {
        "name": "properties.eo:cloud_cover",
        "op": "lt", // or "<" ?
        "value": 10
      },
      {
        "name": "properties.eo:cloud_cover",
        "op": "gte", // or "<" ?
        "value": 0
      }
    ]
  }
  ...
}
```

A query profile that uses CQL:

```
{ 
  ...
  "query_profile": "cql",
  "query": {
    "predicate": "properties.eo:cloud_cover<1 AND properties.landsat:wrs_row=28"
  }
  ...
}
```

### Sort fields

This object describes a Sort Extension format.

| Field Name | Type  | Description |
| ---------- | --------- | ----------- |
| type       | string    | the Sort Extension name that is used for this, e.g., `phil_sort` |
| value      | object    | an extension-specific object representing the sort |

**type** the type as described in the Sort Extension 

**value** the object representing whatever a sort definitions means as specified by `type`.  This is completely implementation-specific.

Example:

```
{ 
  ...
  "fields": {
    "type": "phil_sort",
    "value": {
      "description": "properties.datetime|asc,id|desc"
    }
  }
  ...
}
```
