# STAC Static Catalog Spec

## Overview

A STAC Static Catalog is the simplest possible catalog of spatiotemporal items. It is designed
to work as a set of flat files on an http web server or an object store like S3 or Google Cloud Storage.

As such the catalog can not be queried - it is simply a set of interconnected links that can be crawled.
A static catalog is designed to be as reliable as possible, and can serve as the canonical source for
more dynamic Catalog API's.

The core `Item`s listed in a static catalog are the exact same form as those returned by a Catalog API.
So both forms of STAC can be crawled in the same way.

The STAC JSON specifications for the JSON representation of elements returned by a  STAC.
It also defines the JSON files that will be found in a Static Catalog.

## Static Catalog Definitions

Static Catalogs define a network of linked assets for the purpose of automated
crawling. The top level element of a Static Catalog is one or more linked `Catalog`s.

There are four element types of a STAC Static Catalog: `Catalog`s, `Item`s, `Asset`s, and `Product`s.

The core STAC `Item` is defined in the [JSON Spec](../json-spec/), and is of the same form as those
returned from a Catalog API, but the following will explain it in context, as well as the other element types.

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
the contact information goes, as well as links to the products contained. It links to one or more other catalogs,
who inherit its catalog level metadata.

_Linked Catalog_
```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery - 30087",

  "links": [
    { "rel": "self", "href": "naip/30087.json" },
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


### Item

An `Item` represents a single record in the catalog, and it must have a geometry, a time,
a thumbnail and links to 'assets' - these must represent data pertaining to a location
for some time. `Item`s can also link to other related `Item`s; it's possible to have an `Item` which
only links to other `Item`s. `Item`s are represented by GeoJSON elements,
and so represent [SimpleFeature](https://en.wikipedia.org/wiki/Simple_Features)s (specifically
Polygons and MultiPolygons). They are also tagged with temporal component, and so fix
a location at a specific time or time range.

The [rel](https://www.w3schools.com/tags/att_link_rel.asp) attribute of HTML links is used
liberally to describe the relationships of various items and catalogs. Every `Item` must
define a `thumb` link, as well as a `self` link. It is recommended that the self link is an
absolute URL, so that copies of catalogs that are downloaded continue to link to their source
(though a later version of the spec should include a rel link to indicate that an Item is
  a copy of an online location).

`Item`s are defined very flexible, and a naive catalog crawler would enable search of every single
`Item` defined in a catalog. Some domains may choose to use `rel` links to describe more complex
relationships between catalog items, and crawlers aware of those domains may

To continue with the NAIP example, an `Item` could represent one "scene", with two assets
that live in the [AWS public dataset bucket](https://aws.amazon.com/public-datasets/naip/): an
RGB [COG](http://www.cogeo.org/) and an RGBIR GeoTiff.
In this example, one of the assets is linked, another is embedded:

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
        { "rel": "asset", "href": "30087/m_3008718_sw_16_1_20130805/rgb.json" },
        { "rel": "asset",
          "href": "s3://aws-naip/al/2013/1m/rgbir/30087/m_3008718_sw_16_1_20130805.tif",
          "product": "naip/rgbir.json",
          "format": "geotiff" }
    ],

    "properties": {
        "startDate": "2013-08-05T00:00:00+00:00",
        "endDate": "2013-08-05T00:00:00+00:00",
        "sourceMetadata": { ... }
    }
}
```

### Asset

An `Asset` represents the lowest level element in a STAC. As an example, for satellite imagery,
an `Asset` could be the GeoTiff file that makes up a specific band of the `Item` representing the
"scene".

An `Asset` must have a "product" field that specifies a uri to a JSON file that represents the `Product`.

Assets contain the metadata that is specific to the format of the asset. The
asset must state its format. The Static Catalog does not have specific
requirements for participation in the network; the spec of the formats is a
downstream concern of the definition of the Static Catalog. e.g. the formats (e.g. "jpg2000", "cog", "laz")
is the key into knowing what metadata to expect inside the `Asset`.

While assets in Catalog APIs can easily represent files that are generated on demand, a static
catalog should only list assets that already exist online. This increases the reliability and speed
of the catalog and makes it easier to fully duplicate or back-up a static catalog.

Example:

```json
{ "rel": "asset",
  "href": "s3://aws-naip/al/2013/1m/rgb/30087/m_3008718_sw_16_1_20130805.tif",
  "product": "naip/rgb.json",
  "format": "cog".
  ...
}
```


### Product

A `Product` describes general metadata about the `Asset`, which can apply to a broad set of `Asset`s.

For the NAIP example, at a minimal level we could have:

```json
{
    "bands": [
        "Red",
        "Green",
        "Blue"
    ]
}
```

## Concepts

STAC elements exhibit the following general characteristics:

### Rel Links

The `Catalog`s link to `Item`s and other `Catalog`s, and `Item`s link to `Asset`s and other `Item`s,
via a rel-link style json object. These objects specify a `rel`, which represents
[link relations](https://spdx.org/licenses/), as well as an `href` to the linked element.

### Forwarding of properties

The properties of an element that can apply to the child links *will* apply,
unless overridden by the child element.


### Embedding of linked elements

Any link inside of an element to a JSON file of another element may
have the JSON directly embedded, either partially or fully, into the link object's body.
Embedding is optional and there  may be no embedded data,
a partial set of data for an asset or linked node, or fully
embed all information contained in the element that is linked to.

__TODO__: Enumerate potential "rel" values.

### URI's

URIs may be HTTP, but can also be URIs from other providers (e.g. S3). There will be metadata from
the `Catalog`, `Item` or `Asset` that will describe the provider,
to allow for details on how to connect to that URI.


# Schema Validation [TODO - fix up]

## Initialization

```bash
npm install
```

## Validation

```bash
node_modules/.bin/ajv test -s asset.json -r geojson.json -d landsat-scene.json --valid --verbose
node_modules/.bin/ajv test -s catalog.json -r asset.json -r geojson.json -d node.json --valid --verbose
```
