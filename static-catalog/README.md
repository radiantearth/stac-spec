# STAC Static Catalog Spec


## Overview

A STAC Static Catalog is the simplest possible catalog of spatiotemporal items. It is designed
to work as a set of flat files on an http web server or an object store like Amazon S3 or Google Cloud Storage.

Static Catalogs define a network of linked items for the purpose of automated crawling.
A static catalog is not intended to be queried.
A static catalog is designed to be as reliable as possible, and can serve as the canonical source for dynamic Catalog API's.
For example, a crawler could walk a static catalog to create a search index for queries.

## Static Catalog Definitions

There are two required element types of a STAC Static Catalog: `Catalog` and `Item`.
An `item` contains one or more `assets` which are artifacts defining some kind of media or product, such as a geotiff.
A `Catalog` points to `Item`s, or to other `Catalog`s.
The top-most parent `Catalog` is called the "root" catalog.
The root catalog generally defines information about the catalog as a whole, such as name, description, licensing, contact information and so forth.
Catalogs below the root generally have less information and serve to create a directory structure for categorizing and grouping `item` data.
The contents of a `catalog` are flexible and STAC makes no assumptions for where or how catalog metadata is defined within a `catalog`.
For example, a non-root catalog could redefine or add different licensing or copyright terms.

A simple Catalog structure might look like this:
```
catalog (root)
  - catalog
    - catalog
      - item
        - asset
      - item
        - asset
    - item
      - asset
      - asset
```
This example might be considered a somewhat "typical" structure.
However, `catalog`s and `item`s can describe a number of different relationships.
The following shows various relationships between `catalog`s and `item`s:

- `Catalog` -> `Item` (this is a common structure for a `catalog` to list links to `items`)
- `Catalog` -> `Catalog` (this is a common tree structure to group sets of items. Each `catalog` in this relationship may also include `item` links as well as `catalog` links)
- `Item` -> `Catalog` (example: an item may point to a catalog to describe a set of derived assets, where it may be desirable to have the origin asset as a "parent", such as NDVI generated from RGB/IR)
- `Item` -> `Item` (example: this relationship may be used to describe a 1-1 parent-child relationship, such as a single derived item from one parent item)

The core `Item`s listed in a static catalog are the exact same form as those returned by a Catalog API.
Ideally, STAC enables both a static and dynamic API to be crawled in the same way.

An `Item` in STAC is compatible with a WFS 3.0 `Item`.

Catalogs make liberal use of the [rel](https://www.w3schools.com/tags/att_link_rel.asp) attribute on links to describe relationships, so that `Catalog`s and `Item`s always link to where they fit in and what else they are related to.

### Catalog

A `Catalog` contains links out to `Item`s. Each of the `Catalog`s can link to `Item`s and other downstream `Catalog`s.

For example, a catalog of [NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/) might look something like this:

_"Root" Catalog_
```json
{
    "name": "NAIP",
    "description": "Catalog of NAIP Imagery",

    "license": "PDDL-1.0",

    "links": [
        { "rel": "self", "href": "catalog.json" },
        { "rel": "child", "href": "naip/30087/catalog.json" },
        { "rel": "root", "href": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/catalog.json"},
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

A root `Catalog` should contain all the metadata that applies to all items in its catalog. It is typically where the contact information goes, as well as links to the items it contains. It usually links to one or more `catalogs`, who inherit its catalog-level metadata and in turn link to other `catalog`s or `item`s.
A root `catalog` could also choose to include `item`s, with `catalog` links.
Below is an example of a sub-`catalog` (that would inherit metadata from It's parent)

_"Child" Catalog_
```json
{
    "name": "NAIP",
    "description": "Catalog of NAIP Imagery - 30087",

    "links": [
        { "rel": "self", "href": "https://www.fsa.usda.gov/my-real-home/naip/30087/catalog.json" },
        { "rel": "parent", "href": "catalog.json"},
        { "rel": "root", "href": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/catalog.json"},
        { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130805.json" },
        { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130806.json" },
        ...
    ]
}
```

STAC makes no formal distinction between a "root" catalog and the "child" catalogs.
A root catalog is simply a top-most `catalog` (which has no parent).
A nested `catalog` structure is useful (and recommended) for breaking up massive numbers of catalog items into logical groupings.
For example, it might make sense to organize a `catalog` by date (year, month, day), or geography (continent, country, state/prov).
Any scheme may be used, but it's considered a best practice to keep the size of each `catalog` under a a megabyte.

The only required fields for a `Catalog` are the following:
- `name`
- `description`
- `links`

However, it is strongly recommended that a "root" catalog define metadata fields that apply to the entire `catalog` (such that child catalogs and items simply inherit these field values).

The `links` section must include:
- `self` absolute url (that points to itself)
- `root` absolute url (that points back to the root - even if it's the root and points to itself)
- a link to at least one `item` or child `catalog`.

Non-root catalogs should include a link to their `parent`.

`Catalog`s should be defined using the file name `catalog.json` to distinguish from item json type files.
In order to support multiple "root" catalogs, the recommended practice is to place the `catalog.json` in namespaces "directories."
For example:
- current/catalog.json
- archive/catalog.json

A `catalog.html` is recommended with each `catalog.json` to make the catalog crawl-compatible.
(Search engines do not recognize json as a crawlable data type)


**TODO: Define Catalog Schema for validation, and create Catalog examples**.

### Item

An `item` follows the WFS 3.0 definition of an `item`.

An `Item` represents a single record in the catalog. An `item` must define the following:
- id
- type
- geometry
- links (0 or more links to items or catalogs)
- assets (a link to at least one `asset` (data that pertains to a location and time))

A link to a thumbnail is strongly recommended.

An `Item`s is fully defined in the [JSON spec](../json-spec/json-spec.md).
See the json-spec folder's [README](../json-spec/README.md) for links to samples and validation code.

`Item`s can also link to other related `Item`s.
It's possible to have an `Item` which only links to other `Item`s.
`Item`s are represented by GeoJSON elements, and so represent [SimpleFeature](https://en.wikipedia.org/wiki/Simple_Features)s (specifically
Polygons and MultiPolygons).
They are also tagged with temporal component, and so fix a location at a specific time or time range.


#### Links

Links are defined in `catalog` and `item`.
The [rel](https://www.w3schools.com/tags/att_link_rel.asp) attribute of HTML links is used liberally to describe the relationships of various items and catalogs.
The required fields for a link are:

- `rel`
- `href`

Every item must define a `self` link. The self link must be an absolute URL, so that copies of catalogs that are downloaded continue to link to their source (though a later version of the spec
should include a `rel` link to indicate that an `Item` is a copy of an online location).

Items should link back to their root catalog, but this is not required.

A `thumb` `link` is strongly recommended to provide previews of the data.

Note: `Item`s are defined to be flexible, allowing a naive crawler to walk the structure to discover every item defined
in the catalog.
The primary use case for crawling is to enable search by populating an index.

Some domains may choose to use `rel` links to describe more complex relationships between catalog items, and crawlers aware of those domains may customize their search results using knowledge of the relationships.


#### Assets

An `Asset` represents the lowest level element in a STAC. As an example, for satellite imagery, an `Asset` could be the GeoTiff file that makes up a specific band of the `Item` representing the
"scene".

All static catalogs must contain at least 1 `Asset`, as the point of the SpatioTemporal Asset Catalog is to be link to actual actual data, not to just reference metadata (though it is not required that all users have permissions to access the asset).

Assets are represented as an array of JSON Objects. Currently the only required field in an `Asset` object is `href`, which is the link to the actual asset.
The recommendations and requirements over how to describe assets are still evolving.

Generally a single `Item` should not contain a huge number of assets and should represent the set of files a user would reasonably want to download. Items should not try to represent every single format and option that a user _could_ download - the additional options can be represented in multiple items, or defined on the fly by processing engines.

#### Item Example

To continue with the NAIP example, an `Item` could represent one "scene", with two assets that live in the [AWS public dataset bucket](https://aws.amazon.com/public-datasets/naip/):
an RGB [COG](http://www.cogeo.org/) and an RGBIR GeoTiff.

```json
{
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
        { "rel": "self", "href": "https://www.fsa.usda.gov/my-real-home/naip/30087/m_3008718_sw_16_1_20130805.json" },
        { "rel": "root", "href": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/catalog.json"}
    ],

    "properties": {
        "start": "2013-08-05T00:00:00+00:00",
        "end": "2013-08-06T00:00:00+00:00",
        ...
    }
}
```

There are additional examples, fully validated, in the [examples](examples/) folder, as well as in the [json spec examples](../json-spec/examples/) folder.

### Static Catalog Flexibility

Static STAC Catalogs defined for flexibility.
They only require a handful of fields, and implementors are free to add most any json field or object that they want.
This is a design goal, so that it is quite easy to implement a catalog and be able to adapt it to most any data model.

But it is expected that some more firm recommendations and even requirements will emerge, especially around asset definition, links, and catalog level metadata, so that clients will be able to glean more meaningful information.
In the meantime implementors are encouraged to do what makes sense for them, and to check out the examples and other implementations for emerging best practices.

## Static Catalog Validation

Static catalogs will have flexible validation tools.
The first step will be simple JSON schemas that will be quite liberal in what they accept. In time online and commandline validation tools will be implemented.
This section will link to those.

### Schema Validation

**TODO:** This needs to be implemented.
The stac-item.json can be reused from the core json, but this should also include a `Catalog` schema.


## Static Catalog Evolution

Static Catalogs are still a work in progress, and feedback is very much appreciated.
The core concept is to be able to flexibly represent full catalogs of assets.
Many organizations have very complex data models, representing a number of real world variables.
Static Catalogs are focused on search of the data, and so items should contain the core metadata fields and downloadable assets.
So things like satellite ephemeris and obscure metadata fields only relevant to ortho-rectification experts is less the primary goal.
But organizations are encouraged to adapt the core concepts to more complex relationships, extending in a variety of ways.
The hope is that naive clients can always garner the space and time of geospatial assets, while creating an open community of evolving shared practices and metadata fields to expose all geospatial asset information in a common way.

Thus the 'core' static catalog spec will aim to remain relatively simple, but will always look to build in the right extension mechanisms for others to use the core in ways that are valuable for their domain or company.

### Recommendations

The evolution of static catalogs will take place in this repository, primarily in the 'example-implementations' folder.
This will show how a variety of providers at least could represent their catalogs in STAC static catalogs (and as things mature the examples will mirror their production catalogs).
The various recommendations can be viewed in the [Static Catalog Recommendations](static-recommendations.md) document.
Some of these will likely evolve to be requirements, or at least documented specification options and extensions.
