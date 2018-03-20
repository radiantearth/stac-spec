STAC Core is intending to provide a minimal set of features so that there is a low bar to entry for catalog
implementations. The core concepts in STAC are Spatial and Temporal data, so those are the only filters we want
to support in Core.

Filters should be as simple as possible for a client to construct. Since we are returning json, we want to also
consume json. This allows clients to support filtering without additional tools. So the core filters will be 
JSON based. The search enpoint will accept application/json format queries, and GET on the collection will 
support URL encoded JSON. POST search the is recommended way to filter results to avoid the URL encoding 
issues that can happen with GET.

Searching using POST will accept a JSON object where the top level keys are specifying which type of filter
to apply. Those same top level key names can be used as query string parameters for the GET request. Items in the collection 
should match all filters to be returned when querying. This implies a logical AND operation. If
an OR operation is needed, it should be specified through an extension filter.

For the spatial query, we are starting with the simplest form for a client to generate: a bbox. The bbox query 
is a simple array of WGS84 Longitude and Latitude values. They are in this order: [west, south, east, north]. 
This query will perform an intersects operation on the geometry values of the items in the catalog. Some GeoJSON 
objects may provide a bbox property in addition to geometry, but it should not be used for the bbox filter since
it is an optional field in GeoJSON.

example
```
{
  "bbox": [-180,-90,180,90]
}
```

The temporal query will be based on ISO 8601 and should support time ranges as well as equality. To support range
queries, we are using a simple JSON based language. Ranges will be specified as an object with keys indicating the comparison to use.

Equality is specified as `{"time": "2018-03-20T16:11:44.353Z"}`  
Before is `{"time":{"lt":"2018-03-20T16:11:44.353Z"}}`  
After is `{"time":{"gt":"2018-03-20T16:11:44.353Z"}}`  
Before with Equality is `{"time":{"lte":"2018-03-20T16:11:44.353Z"}}`  
After with Equality is `{"time":{"gte":"2018-03-20T16:11:44.353Z"}}`  

__Filter Extensions__

Spatial and Temporal filtering is not enough for many use cases. STAC is designed to be extensible, so we encourage additional filters to be provided as extensions.

Filter extensions are intended to provide a place to specify additional filter types and behavior. Some filters may need to target vendor specific fields or use a more complex structure when defining the filter. For example, a geospatial intersection filter that supports a polygon as input.

Filter extensions should be specified as an openapi fragment. This is a section of YAML that can be incorporated into the larger api definition. These fragments can then be combined into an implementation specific api definition that describes the full api.

Example fragment:
```
  IntersectsFilter:
    type: object
    description: >-
          Only returns items that intersect with the provided polygon.
    properties:
      intersects:
        $ref: '#/definitions/Polygon'
  Polygon:
    type: object
    properties:
      type:
        type: string
        enum:
          - polygon
      coordinates:
        $ref: '#/definitions/Polygon2D'
    required:
      - type
      - coordinates
  Polygon2D:
    type: array
    minItems: 1
    items:
      $ref: '#/definitions/LinearRing2D'
  LinearRing2D:
    type: array
    minItems: 4
    items:
      $ref: '#/definitions/Point2D'
    example: [[-104,35],[-103,35],[-103,34],[-104,34],[-104,35]]
  Point2D:
    description: A 2d geojson point
    type: array
    minimum: 2
    maximum: 2
    items:
      type: number
      format: double
    example:
      - -104
      - 35
```

It is likely that there are schemas that should be used in common for types of filters that target different fields. We should define a common set of filter types that can be used in defining filters for different fields.
- NumberRange
- TimeRange
- Text
- ArrayIncludes
- Etc

When defining a new filter fragment you would reference these common filter types.
```
CloudCover:
    type: object
    description: >-
          Filter items by desired cloud coverage.
    properties:
      cloudcover:
        $ref: '#/definitions/NumberRange'
```

Some additional extensions that have been discussed:

CQL support for generic queries:  
{"CQL": "CQL Select String"}

Time intervals:  
{"time": "P1Y"} // Assume Duration/now if no time specified?
{"time": "2018/P1M"} // Any time in january of 2018
