
# SpatioTemporal Asset Catalog API Specification

## Overview

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns [STAC Items](../json-spec/json-spec.md) 
(GeoJSON objects with required links time stamp and links to assets) from search queries on a RESTful endpoint.

The core of the spec is a single endpoint:

```
/search/stac
```

It takes a JSON object that can filter on date and time:

```

{
  "bbox": [ 5.5, 46, 8, 47.4 ],
  "time": {
    "gt": "2018-03-15T00:00:00.000Z",
    "lt": "2018-04-01T00:00:00.000Z"
  }
}
```

This tells the server to return all the catalog items it has that are from the second half of March, 2018 and 
that fall within this area:

![swiss_bbox](https://user-images.githubusercontent.com/407017/38281083-bd77d01c-375d-11e8-96ed-69a5403ff288.png)


## Specification

The definitive specification for STAC is the [OpenAPI](http://openapis.org) 3.0 yaml document. This is available
in several forms. The most straightforward for an implementor new to STAC is the [STAC-standalone.yaml](STAC-standalone.yaml).
This gives a complete service with the main STAC endpoint.

The easiest way to explore the specification in a more human readable way is to load the file up in to the 
[online swagger editor](http://editor.swagger.io). You can import the spec by just selectiong 'file' -> 
'import url' and enter <https://raw.githubusercontent.com/radiantearth/stac-spec/dev/api-spec/STAC-standalone.yaml>. 

This will display the documentation and examples for the specification. You can also generate code for
clients and servers in a variety of languages from the editor as well, so you can get a sense of how it 
will work.

### WFS 3.0 Integration

At the [Ft Collins Sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co) the
decision was made to integrate STAC with the [WFS 3 specification](https://github.com/opengeospatial/WFS_FES), as
they are quite similar in spirit and intention. It is anticipated that most STAC implementations will also implement 
WFS, and indeed most additional functionality that extends STAC will be done as WFS extensions. 

This folder thus also provides an [openapi fragment](STAC-fragment.yaml), as well as an [example service](WFS3core+STAC.yaml) 
for those interested in what a server that implements both STAC and WFS would look like. Those interested in learning more
can read the [deeper discussion of WFS integration](wfs-stac.md).


### GET requests

The POST endpoint is required for all STAC API implementations. The fields of the JSON object can also be used
for a GET endpoint, which will be specified in full soon.


