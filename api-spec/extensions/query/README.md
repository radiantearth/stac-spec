# Filters in SpatioTemporal Asset Catalogs

The core of the STAC API is intending to provide a minimal set of features so that there is a low bar to entry for catalog
implementations. The core concepts in STAC are Spatial and Temporal data, so those are the only filters that are in core
and are required to be supported.

The filters are designed to be simple as possible for a client to construct. To match the default JSON responses the
encoding of filters is done by default in JSON. This allows clients to support filtering without additional tools. The
search endpoint will accept application/json format queries, and GET on the collection will support URL encoded JSON. POST
search the is recommended way to filter results to avoid the URL encoding issues that can happen with GET.

Searching using POST will accept a JSON object where the top level keys are specifying which type of filter
to apply. Those same top level key names can be used as query string parameters for the GET request. Items in the collection
should match all filters to be returned when querying. This implies a logical AND operation. If
an OR operation is needed, it should be specified through an extension filter.

For the spatial query, we are starting with the simplest form for a client to generate: a bbox. The bbox query
is a simple array of WGS84 Longitude and Latitude values. They are in this order: [west, south, east, north].
This query will perform an intersects operation on the geometry values of the items in the catalog. Some GeoJSON
objects may provide a bbox property in addition to geometry, but it should not be used for the bbox filter since
it is an optional field in GeoJSON.


### Searching

The `/stac/search` endpoint accepts a JSON object specifying a bounding box and date/time.

```json
{
  "bbox": [5.5, 46, 8, 47.4],
  "time": "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
}
```

This tells the server to return all the catalog items it has that are from the second half of March, 2018 and
that intersect with this area:

![swiss_bbox](https://user-images.githubusercontent.com/407017/38382405-b5e69344-38be-11e8-90dc-35738678356d.png)

_Map © OpenStreetMap contributors_

The return format is a [GeoJSON](http://geojson.org/) `FeatureCollection` with features compliant with the [Item spec](../item-spec/README.md) for STAC.

It returns up to `limit` Items optionally requested by the client, and includes
`next` links to iterate through any results past that `limit`.

The `POST` endpoint is required for all STAC API implementations. The fields of the JSON object can also be used
for a `GET` endpoint, which are included in the OpenAPI specifications. The `GET` requests are designed to reflect the same
fields as the `POST` fields, and are based on WFS 3 requests. It is recommended for implementations to implement both, but
only `POST` is required.

### Filtering

The core STAC API includes two filters - Bounding Box and Time. All STAC Items require space and time, and thus any STAC
client can expect to be able to filter on them. Most data will include additional data that users would like to query on,
so there is a mechanism to also specify more filters. See the [Filtering](filters.md) document for additional information
on the core filters as well as how to extend them. It is anticipated that "extensions" for domains (e.g. earth observation
imagery) will require additional fields to query their common fields.


## Examples

### To filter by spatial extent

`POST`:

```json
{
  "bbox": [-180, -90, 180, 90]
}
```

`GET`:

```
?bbox=[-180,-90,180,90]
```

The temporal query is based on [RFC 3339](https://tools.ietf.org/html/rfc3339) and should support time ranges as well as equality. It will compare against the datetime property of the STAC Item.

### To find items with an exact date

POST:

```json
{
  "time": "2007-03-01T13:00:00Z"
}
```

GET:

```
?time=2007-03-01T13:00:00Z
```

### To find items within an interval

To specify a time range, use the interval syntax.

POST:

```json
{
  "time": "2007-03-01T13:00:00Z/2008-05-11T15:30:00Z"
}
```

GET:

```
?time=2007-03-01T13:00:00Z/2008-05-11T15:30:00Z
```

Intervals can also be specified using the duration syntax:

```
2007-03-01T13:00:00Z/P1Y2M10DT2H30M
```

If time is a period without a start or end date, the end date is assigned to "now":

`P1Y2M10DT2H30M` is the same as `"P1Y2M10DT2H30M/" + new Date().toISOString()`

## Filter Extensions

Spatial and temporal filtering is not enough for many use cases. STAC is designed to be extensible, so we encourage additional filters to be provided as extensions.

Filter extensions are intended to provide a place to specify additional filter types and behavior. Some filters may need to target vendor specific fields or use a more complex structure when defining the filter. For example, a geospatial intersection filter that supports a polygon as input.

Filter extensions should be specified as an openapi fragment. This is a section of YAML that can be incorporated into the larger api definition. These fragments can then be combined into an implementation specific api definition that describes the full api.

Example fragment:

```yaml
IntersectsFilter:
  type: object
  description: >-
    Only returns items that intersect with the provided polygon.
  properties:
    intersects:
      $ref: "#/definitions/Polygon"
Polygon:
  type: object
  properties:
    type:
      type: string
      enum:
        - polygon
    coordinates:
      $ref: "#/definitions/Polygon2D"
  required:
    - type
    - coordinates
Polygon2D:
  type: array
  minItems: 1
  items:
    $ref: "#/definitions/LinearRing2D"
LinearRing2D:
  type: array
  minItems: 4
  items:
    $ref: "#/definitions/Point2D"
  example: [[-104, 35], [-103, 35], [-103, 34], [-104, 34], [-104, 35]]
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

- `NumberRange`
- `TimeRange`
- `Text`
- `ArrayIncludes`
- Etc.

When defining a new filter fragment, you would reference these common filter types:

```yaml
CloudCover:
  type: object
  description: >-
    Filter items by desired cloud coverage.
  properties:
    cloudcover:
      $ref: "#/definitions/NumberRange"
```

Some additional extensions that have been discussed:

CQL support for generic queries:

```json
{
  "CQL": "CQL Select String"
}
```

## Adding filters to search

Filters should be documented as properties in the `searchBody`:

```yaml
searchBody:
  description: The search criteria
  type: object
  allOf:
    - $ref: "#/components/schema/bboxFilter"
    - $ref: "#/components/schema/TimeFilter"
    - $ref: "#/components/schema/IntersectsFilter"
```

### A note on the POST semantics

Though `POST` in a pure REST sense is just for creating new objects, the semantics of this `POST` is on a `/search/` resource, so
it can be thought of us `POST`ing to create an implicit search object that is then read right away with a `GET`. It seemed
onerous to require users to `POST` a new search object and then request it back in a `GET`.

Note that the `items` returned in a search are not at their canonical location, and following the `self` links back to
its home location will be in the collection that can be `POST`ed to, following proper REST semantics.
