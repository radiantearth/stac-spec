# STAC API Examples

A STAC API supports both GET and POST requests. It is best to use POST when using the intersects query for two reasons:

1. the size limit for a GET request is less than that of POST, so if a complex geometry is used GET may fail.
2. The parameters for a GET request must be escaped properly, making it more difficult to construct when using JSON 
parameters (such as intersect)

## Core examples

Requests all the items in the collection that is in New Zealand:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89
```

Request all the items in `mycollection` that is in New Zealand:

```
GET /stac/search/items?bbox=160.6,-55.95,-170,-25.89&collections=mycollection
```

Request 100 items in `mycollection` from New Zealand:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&limit=100&collections=mycollection
```

Request all the items in `mycollection` that is in New Zealand from January 1st, 2019:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01&collections=mycollection
```

Request 100 items in `mycollection` or `yourcollection` that is in New Zealand from January 1st, 2019:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01&limit=100&collections=mycollection,yourcollection
```

Request all the items in any collection that is in New Zealand from January 1st, 2019:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01
```

Request all the items in any collection that is in New Zealand and has the id `1` or `2`:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01&ids=1,2
```

Request 100 items in `mycollection` or `yourcollection` that is in New Zealand and has the id `1` or `2`:

```
GET /stac/search?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01&limit=100&collections=mycollection,yourcollection&ids=1,2
```

```
POST /stac/search
```

Body:
```json
{
  "bbox": [160.6, -55.95, -170, -25.89],
  "time": "2019-01-01",
  "limit": 100,
  "collections": ["mycollection", "yourcollection"],
  "ids": ["1", "2"]
}
```

Request all the items in `mycollection` from between January 1st and April 1st, 2019:

```
GET /stac/search?time=2019-01-01/2019-04-01&collections=mycollection
```

Request all catalog items it has that are from the second half of March, 2018 and that intersect with this area:

```
POST /stac/search
```

Body:
```json
{
  "bbox": [5.5, 46, 8, 47.4],
  "time": "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
}
```

![swiss_bbox](https://user-images.githubusercontent.com/407017/38382405-b5e69344-38be-11e8-90dc-35738678356d.png)

_Map © OpenStreetMap contributors_


To specify a time range, use the interval syntax.

```
POST /stac/search
```

```json
{
  "time": "2007-03-01T13:00:00Z/2008-05-11T15:30:00Z"
}
```

```
GET /collections/mycollection/items?time=2007-03-01T13:00:00Z/2008-05-11T15:30:00Z
```

Intervals can also be specified using the duration syntax:

```
2007-03-01T13:00:00Z/P1Y2M10DT2H30M
```

If time is a period without a start or end date, the end date is assigned to "now":

`P1Y2M10DT2H30M` is the same as `"P1Y2M10DT2H30M/" + new Date().toISOString()`

## Querying the collections endpoint

The collections endpoint does support the following query parameters to remain in alignment with WFS3:  `time`, `bbox`, 
and `limit`.  Due to the limited parameter support, it is recommended to use the `/stac/search` endpoint for dynamic 
STAC queries.  Some STAC implementations may choose to provide support for the full superset of STAC query parameters 
to the collections endpoint, where the collection ID in the path variable is used as the single value in the 
`collections` query parameter array in order to ensure the results are limited to that collection.  This is purely 
optional and neither required nor a recommendation.

Request 100 items in `mycollection` from New Zealand using the collections endpoint:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&limit=100
```

Note that the collections endpoint _only_ supports HTTP GET. HTTP POST requests are not supported.

## Extension examples

The API Extensions allow for more sophisticated searching, such as the ability to search by geometries and searching on 
specific Item properties.

Use the *[Query](extensions/query/README.md)* extension to search for any items falling within a specific geometry 
collected between Jan 1st and May 1st, 2019:

```
POST /stac/search
```

Body:
```json
{
    "limit": 100,
    "intersects": {
        "type": "Polygon",
        "coordinates": [[
            [-77.08248138427734, 38.788612962793636], [-77.01896667480469, 38.788612962793636],
            [-77.01896667480469, 38.835161408189364], [-77.08248138427734, 38.835161408189364],
            [-77.08248138427734, 38.788612962793636]
        ]]
    },
    "time": "2019-01-01/2019-05-01"
}
```
