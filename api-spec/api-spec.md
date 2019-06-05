## STAC API Specification

The Web Feature Service is a standard API that represents collections of geospatial data. The [Web Feature Service 3.0 API](https://github.com/opengeospatial/WFS_FES), currently under development, is the latest iteration of that standard. WFS 3 defines the RESTful interface to query geospatial data, with GeoJSON as a main return type. With WFS you can return any `Feature`, which is a geometry plus any number of properties. In the STAC specification an `Item` is a `Feature`, with additional required fields for `datetime` and `assets`. WFS also defines the concept of a Collection, which contains `Feature`s. A STAC `Collection` aligns with (and extends slightly) a WFS 3 `Collection`; it contains `Item`s.

In WFS 3 Collections are the sets of data that can be queried ([7.11](https://rawgit.com/opengeospatial/WFS_FES/master/docs/17-069.html#_feature_collections_metadata)), and each describes basic information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all the data contained. [STAC collections](../collections-spec/README.md) contain this same information, along with other STAC specific fields and thus are compliant with both WFS Collections and STAC Collections and is returned from the `/collections/{collection_id}` endpoint.

In WFS 3 Features are the individual records within a Collection and are provided in GeoJSON format. [STAC Items](../item-spec/README.md) are analagous to WFS 3 Features, are in GeoJSON, and are returned from the `/collections/{collection_id}/items/{item_id}` endpoint.

### WFS3 Endpoints

The core WFS 3 endpoints are shown below, with details provided in an [OpenAPI specification document](definitions/WFS3.yaml).

| Endpoint      | Returns          | Description        |
| ------------ | ------------- | ---------------------- |
| / | JSON        | Landing page, links to API capabilities |
| /conformance | JSON | Info about standards the API conforms to       |
| /collections | Collections | List of Collections contained in the catalog |
| /collections/{collection_id} | Collection | Returns single Collection JSON |
| /collections/{collection_id}/items | Items | GeoJSON FeatureCollection of Items in Collection |
| /collections/{collection_id}/items/{item_id} | Item | Returns single Item GeoJSON |

The `/collections/{collection_id}/items` endpoint accepts parameters for filtering the results (also called filters). Searching using POST will accept a JSON object where the top level keys specify which type of filter to apply (e.g., bbox=[...]). Those same key names can be used as query string parameters for the GET request. 

Items in the collection should match all filters to be returned when querying. This implies a logical AND operation. If an OR operation is needed, it should be specified through an extension filter.

### Filter Parameters

| Parameter      | Type          | Description        |
| ------------ | ------------- | ---------------------- |
| bbox | [number]       | Requested bounding box [west, south, east, north] |
| time | string | Single date, date+time, or a range ('/' separator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6) |
| intersects | GeoJSON FeatureCollection, Feature, Polygon, or MultiPolygon  | Searches items by performing intersection between their geometry and provided GeoJSON |
| page | number | The page number of results. Defaults to 1 |
| limit | number | The maximum number of results to return (page size). Defaults to 10 |
| ids | [string] | Array of Item ids to return. All other filter parameters that further restrict the number of search results (except `page` and `limit`) are ignored |
| collections | [string] | Array of Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched |

## STAC Endpoints

STAC provides some additional endpoints for the root Catalog itself, as well as the capability to search the Catalog. Note that a STAC API does not need to implement WFS 3, in which case it would only support the endpoints given below. See the [OpenAPI specification document](definitions/STAC-standalone.yaml).

| Endpoint      | Returns          | Description        |
| ------------- | -------------- | ---------------------- |
| /stac         | Catalog        | Root catalog |
| /stac/search  | SearchResult   | Object containing a GeoJSON FeatureCollection of Items matching query and other metadata |  

### SearchResult fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| results           | GeoJSON FeatureCollection | **REQUIRED.** GeoJSON FeatureCollection containing results |
| count             | number                    | the total number of results for this query.  This is not required to be precise, and may represent an estimate. |
| aggregations      | [Aggregation Object]      | aggregations over values, similar to those offered by Elasticsearch |
| properties | Properties Object | A dictionary of additional metadata for the search.  For example, this could pass back query execution information.|
| next | string | a URI containing query parameters that should the user submit the same query again will give the next page of data. If this does not exist, there are no more results |
| prev | string | a URI containing query parameters that should the user submit the same query again will give the previous page of data.  If this does not exist, the query represents the first page of the results |

### Aggregation fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| name           | string          | **REQUIRED.** the name of the item attribute or property key being aggregated over |
| buckets        | [Bucket Object] | **REQUIRED.** an array of buckets that this aggregations values have been counted over |

### Bucket fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| key           | string        | **REQUIRED.** the key for this bucket as the native type (e.g, timestamp, number) |
| key_as_string | string        | **REQUIRED.** the key for this bucket as a string.  Dates, times, and datetimes should use RFC 3339 |
| count         | number        | **REQUIRED.** the count of items whose value is contained in this bucket | 

**Examples:**

```
{
  "featureCollection": { 
    "type":"FeatureCollection"
    ...
  },
  "count" : 42,
  "aggregations" : [
    {
      "name": "datetime",
      "buckets": [
         {
           "key_as_string": "2014-08-01T00:00:00.000Z",
           "key": 1406851200000,
           "count": 4
         }, 
        {
          "key_as_string": "2014-09-01T00:00:00.000Z",
          "key": 1806851200000,
          "count": 9
        }
      ]
    },
    {
    
    }
  ],
  "properties": {
        "search": {
          "endpoint": "https://vpc-asset-catalog-prod-l3b3dcedj4nkjcergw6fohsrzm.us-east-1.es.amazonaws.com:443",
          "executionDuration": 1038,
          "index": "items_test",
          "path": "POST:/items_test/item/_search?",
          "query": "{\"query\":{\"bool\":{\"filter\":[{\"terms\":{\"properties.vendor:product\":[\"landsat8_sr\"]}}]}},\"size\":2000,\"_source\":{\"excludes\":[\"title\",\"*.eo:common_name\",\"*.eo:name\",\"*.href\",\"*.eo:gsd\"]},\"aggs\":{\"datetime\":{\"date_histogram\":{\"interval\":\"1M\",\"field\":\"properties.datetime\"}},\"product\":{\"terms\":{\"field\":\"properties.vendor:product.keyword\"}},\"product_family\":{\"terms\":{\"field\":\"properties.vendor:product_family.keyword\"}},\"cloud_cover\":{\"range\":{\"field\":\"properties.eo:cloud_cover\",\"ranges\":[{\"to\":5.0},{\"from\":5.0,\"to\":15.0},{\"from\":15.0,\"to\":40.0},{\"from\":40.0}]}},\"spatial_resolution\":{\"range\":{\"field\":\"assets.eo:gsd\",\"ranges\":[{\"to\":1.0},{\"from\":1.0,\"to\":5.0},{\"from\":5.0,\"to\":10.0},{\"from\":10.0,\"to\":30.0},{\"from\":30.0,\"to\":100.0},{\"from\":100.0,\"to\":250.0},{\"from\":250.0,\"to\":500.0},{\"from\":500.0,\"to\":1000.0},{\"from\":1000.0}]}}}}"
        }
  }
}
```
  
The `/stac` endpoint should function as a complete `Catalog` representation of all the data contained in the API and linked to in some way from root through `Collections` and `Items`.

The `/stac/search` endpoint is similar to the `items` endpoint in WFS3 in that it accepts parameters for filtering, however it performs the filtering across all collections. The parameters accepted are the same as the Filter Parameters above, however the *[extensions](extensions/README.md)* also provide advanced querying parameters.

If the `/stac/search` endpoint is implemented, it is **required** to add a link with the `rel` type set to `search` to the `links` array in `GET /stac` that refers to the search endpoint in the `href` property.

