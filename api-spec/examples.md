# STAC API Examples

A STAC API supports both GET and POST requests. It is best to use POST when using the intersects query for two reasons:

1. the size limit for a GET request is less than that of POST, so if a complex geometry is used GET may fail.
2. The parameters for a GET request must be escaped properly, making it more difficult to construct when using JSON parameters (such as intersect)

## Core examples

```
GET /collections/{name}/items?bbox=160.6,-55.95,-170,-25.89
```

Requests all the data in the collection that is in New Zealand. The filtering is made to be compatible with the STAC API,
and the two specs seek to share the general query and filtering patterns. The key difference is that a STAC search endpoint
will do cross collection search. A typical WFS will have multiple collections, and each will just offer search for its particular
collection.

Request all the data in mycollection that is in New Zealand:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89
```

Request 100 results in mycollection from New Zealand:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&limit=100
```

Request results 101-200 in mycollection from New Zealand:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&page=2&limit=100
```

Request all the data in mycollection that is in New Zealand from January 1st, 2019:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&time=2019-01-01
```

Request all the data in mycollection from between January 1st and April 1st, 2019:

```
GET /collections/mycollection/items?time=2019-01-01/2019-04-01
```

Request all catalog items it has that are from the second half of March, 2018 and that intersect with this area:

```
POST /collections/mycollection/items
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
POST /collections/mycollection/items
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

## Extension examples

The API Extensions allow for more sophisticated searching, such as the ability to search by geometries and searching on specific Item properties.

Use the *[Query](extensions/query/README.md)* extension to search for any data falling within a specific geometry collected between Jan 1st and May 1st, 2019:

```
POST /stac/search
```

Body:
```json
{
    "limit": 100,
    "intersects": {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-77.08248138427734, 38.788612962793636], [-77.01896667480469, 38.788612962793636],
                [-77.01896667480469, 38.835161408189364], [-77.08248138427734, 38.835161408189364],
                [-77.08248138427734, 38.788612962793636]
            ]]
        }
    },
    "time": "2019-01-01/2019-05-01"
}
```
