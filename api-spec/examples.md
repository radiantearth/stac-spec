# STAC API Examples

## OGC API - Features (OAFeat)

Note that the OAFeat endpoints _only_ supports HTTP GET. HTTP POST requests are not supported.

Request all the data in `mycollection` that is in New Zealand:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89
```

Request 100 results in `mycollection` from New Zealand:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&limit=100
```

Request all the data in `mycollection` that is in New Zealand from January 1st, 2019:

```
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&datetime=2019-01-01T00:00:00Z/2019-01-01T23:59:59ZZ
```

Request 10 results from the data in `mycollection` from between January 1st (inclusive) and April 1st, 2019 (exclusive):

```
GET /collections/mycollection/items?datetime=2019-01-01T00:00:00Z/2019-03-31T23:59:59Z&limit=10
```

## STAC API

Use the *[Query](extensions/query/README.md)* extension to search for any data falling within a specific geometry 
collected between Jan 1st and May 1st, 2019:

```
POST /search
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

### Paging

Simple GET based search just uses the standard next link:
```
HTTP GET /search?bbox=-110,39.5,-105,40.5
```

Response:
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

For more complex post searches:
```json
HTTP POST /search

{
    "bbox": [-110, 39.5, -105, 40.5]
}
```

Response:
```json
200 OK
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search",
            "method": "POST",
            "body": {
                "page": 2,
                "limit": 10
            },
            "merge": true
        }
    ]
}
```

This tells the client to post to the search endpoint with a body of:
```json
POST /search
{
    "bbox": [-110, 39.5, -105, 40.5],
    "page": 2,
    "limit": 10
}
```

This can be even more effective when using continuation tokens on the server.

```json
{
    "rel": "next",
    "href": "http://api.cool-sat.com/search",
    "method": "POST",
    "body": {
        "next": "token"
    }
}
```
The above link tells the client not to merge (default of false) so it is only required to pass the token.

```json
POST /search
{
    "next": "token"
}
```