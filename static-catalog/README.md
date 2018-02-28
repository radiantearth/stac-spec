# STAC Static Catalog Spec

## Overview

A STAC Static Catalog is the simplest possible catalog of spatiotemporal items. It is designed
to work as a set of flat files on an http web server or an object store like S3 or Google Cloud Storage.

As such the catalog cannot be queried - it is simply a set of interconnected links that can be crawled.
A static catalog is designed to be as reliable as possible, and can serve as the canonical source for
more dynamic Catalog API's.

The core `Item`s listed in a static catalog are the exact same form as those returned by a Catalog API.
So both forms of STAC can be crawled in the same way.

The STAC JSON specifications for the JSON representation of elements returned by a  STAC.
It also defines the JSON files that will be found in a Static Catalog.

## Static Catalog Definitions

Static Catalogs define a network of linked assets for the purpose of automated
crawling. The top level element of a Static Catalog is one or more linked `Catalog`s.

There are two requred element types of a STAC Static Catalog: `Catalog`s and `Item`s. 

The core STAC `Item` is defined in the [JSON Spec](../json-spec/), and is of the same form as those
returned from a Catalog API, but the following will explain it in context, as well as the other element types.

Catalogs make liberal use of the [rel](https://www.w3schools.com/tags/att_link_rel.asp) attribute on links to describe 
relationships, so that `Catalog`s and `Item`s always link to where they fit in and what else they are related to.

### Catalog

A `Catalog` contains links out to `Item`s. Each of the `Catalog`s can link to `Item`s and other downstream `Catalog`s.


For example, a catalog of [NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/) might look something like this:

_Root catalog_
```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery",

  "license": "PDDL-1.0",

  "links": [
    { "rel": "self", "href": "naip.json" },
    { "rel": "child", "href": "naip/30087.json" },
    ...
  ],

  "contact": {
    "name": "Supervisor Customer Services Section",
    "email": "apfo.sales@slc.usda.gov",
    "phone": "801-844-2922",
    "url": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/"
  },

  "formats": ["geotiff", "cog"],

  "keywords": ["aerial"],
  "homepage": "http://wherever",

  "provider": {
      "scheme": "s3",
      "region": "us-east-1",
      "requesterPays": "true"
  }
}
```

A 'Root Catalog' should contains all the metadata that applies to all items in its catalog. It is typically where
the contact information goes, as well as links to the products contained. It usually links to one or more 'Linked Catalogs',
who inherit its catalog level metadata and in turn link to other catalogs or items. A relatively small Root Catalog could
also choose to only link to items, with no Linked Catalogs.

_Linked Catalog_
```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery - 30087",

  "links": [
    { "rel": "self", "href": "naip-root.json" },
    { "rel": "parent", "href": "naip/30087.json"}
    { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130805.json" },
    { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130806.json" },
    ...
  ]
}
```

A 'Linked Catalog' is generally used to breakup massive numbers of catalog items in to some logical grouping, so
that each page of links is not huge. Most commonly data is split up by date (month and day) or geography (country,
  state). But any scheme of splitting can be used. It is a general best practice to keep the size of each linked
  catalog under a a megabyte.

The only required fields for a `Catalog` are `name`, `description` and `links`. A root catalog is strongly recommended to contain 
additional metadata fields that contains common metadata fields that do not make sense to repeat in each `Item`.

The links section must include a `self` url, and at least one `item` or `child`. Non-root catalogs should include
a link to their `parent`.

**TODO: Define Catalog Schema for validation, and create Catalog examples**.

### Item

An `Item` represents a single record in the catalog, and it must have a geometry, start and end datetimes,
a thumbnail, links to its relationships and links to its 'assets' - these must represent data pertaining to a location
for some time. They are fully defined in the [JSON spec](../json-spec/json-spec.md), see the json-spec folder's
[README](../json-spec/README.md) for links to samples and validation code.

`Item`s can also link to other related `Item`s; it's possible to have an `Item` which
only links to other `Item`s. `Item`s are represented by GeoJSON elements,
and so represent [SimpleFeature](https://en.wikipedia.org/wiki/Simple_Features)s (specifically
Polygons and MultiPolygons). They are also tagged with temporal component, and so fix
a location at a specific time or time range.

#### Links

The [rel](https://www.w3schools.com/tags/att_link_rel.asp) attribute of HTML links is used
liberally to describe the relationships of various items and catalogs. Every `Item` must
define a `thumb` link, as well as a `self` link. It is recommended that the self link is an
absolute URL, so that copies of catalogs that are downloaded continue to link to their source
(though a later version of the spec should include a rel link to indicate that an Item is
a copy of an online location). Items should link back to their root catalog, but that is
not required, and an `Item` could theoretically have multiple parents.

`Item`s are defined very flexible, and a naive catalog crawler would enable search of every single
`Item` defined in a catalog. Some domains may choose to use `rel` links to describe more complex
relationships between catalog items, and crawlers aware of those domains may customize their search
results using knowledge of the relationships.

#### Assets

An `Asset` represents the lowest level element in a STAC. As an example, for satellite imagery,
an `Asset` could be the GeoTiff file that makes up a specific band of the `Item` representing the
"scene".

All static catalogs must contain at least 1 `Asset`, as the point of the SpatioTemporal Asset Catalog
is to be link to actual actual data, not to just reference metadata (though it is not required that all 
users have permissions to access the asset).

Assets are represented as an array of JSON Objects. Currently the only required field in an `Asset` object
is `href`, which is the link to the actual asset. The recommendations and requirements over how to describe
assets are still evolving.

Generally a single `Item` should not contain a huge multitude of assets, they should represent the set of
files a user would reasonably want to download. They should not try to represent every single format and 
option that a user _could_ download - the additional options can be represented in multiple items, or 
defined on the fly by processing engines.

#### Item Example

To continue with the NAIP example, an `Item` could represent one "scene", with two assets
that live in the [AWS public dataset bucket](https://aws.amazon.com/public-datasets/naip/): an
RGB [COG](http://www.cogeo.org/) and an RGBIR GeoTiff. 


```json
    "id": "30087/m_3008718_sw_16_1_20130805",
    "type": "Feature",
    "geometry": {
        "coordinates": [
            [
                [
                    -87.875,
                    30.625
                ],
                [
                    -87.875,
                    30.6875
                ],
                [
                    -87.8125,
                    30.6875
                ],
                [
                    -87.8125,
                    30.625
                ],
                [
                    -87.875,
                    30.625
                ]
            ]
        ],
        "type": "Polygon"
    },
    "links": [
        { "rel": "self", "href": "30087/m_3008718_sw_16_1_20130805.json" },
        { "rel": "catalog", "href": "naip-root.json"}
    ],

    "properties": {
        "startDate": "2013-08-05T00:00:00+00:00",
        "endDate": "2013-08-06T00:00:00+00:00",
        ...
    }
}
```

There are additional examples, fully 
validated, in the [examples](examples/) folder, as well as in the [json spec examples](../json-spec/examples/)
folder.

### Static Catalog Flexibility

Currently Static Catalogs are defined to be incredibly flexible. They only require a handful of fields,
and implementors are free to add in most any json field or object that they want. This is a design goal,
so that it is quite easy to implement a catalog and be able to adapt it to most any data model. 

But it is expected that some more firm recommendations and even requirements will emerge, especially around
asset definition, links and catalog level metadata, so that clients will be able to glean more meaningful
information for users. In the meantime implementors are encouraged to do what makes sense for them, and 
to check out the examples and other implementations for emerging best practices.

## Static Catalog Validation

Static catalogs will have flexible validation tools. The first step will be simple JSON schemas that will 
be quite liberal in what they accept. In time online and commandline validation tools will be implemented.
This section will link to those.



### Schema Validation 

**TODO:** This needs to be implemented. The stac-item.json can be reused from the core json, but this
should also include a `Catalog` schema.



## Static Catalog Evolution 

Static Catalogs are still a work in progress, and feedback is very much appreciated. The core concept is
to be able to flexibly represent full catalogs of assets. Many organizations have very complex data models,
representing a number of real world variables. Static Catalogs are focused on search of the data, and 
so items should contain the core metadata fields and downloadable assets. So things like satellite ephemeris and 
obscure metadata fields only relevant to ortho-rectification experts is less the primary goal. 
But organizations are encouraged to adapt the core concepts to more complex relationships, extending in a 
variety of ways. The hope is that naive clients can always garner the space and time of geospatial assets, while
creating an open community of evolving shared practices and metadata fields to expose all geospatial asset
information in a common way.

Thus the 'core' static catalog spec will aim to remain relatively simple, but will always look to build in the
right extension mechanisms for others to use the core in ways that are valuable for their domain or company. 

### Recommendations

The evolution of static catalogs will take place in this repository, primarily in the 'example-implementations'
folder. This will show how a variety of providers at least could represent their catalogs in STAC static catalogs 
(and as things mature the examples will mirror their production catalogs). The various recommendations can 
be viewed in the [Static Catalog Recommendations](static-recommendations.md) document. Some of these will likely
evolve to be requirements, or at least documented specification options and extensions. 









