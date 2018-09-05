# STAC Catalog Spec

This document explains the structure and content of a STAC `Catalog`. A STAC Catalog is a 
collection of SpatioTemporal `Item`s. These `Item`s can be linked to directly from a Catalog,
or the Catalog can link to other Catalogs (often called sub-Catalogs) that contain links to Items.
The division of sub-catalogs is up to the implementor, but is generally done to aid the ease of 
online browsing by people.

Catalogs are not intended to be queried - their purpose is more to be browsed by people and crawled
by machines to build a search index. A Catalog can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Catalog.

- [Examples](examples.md)
- [JSON Schema](json-schema/catalog.json) - please see the [validation instructions](../validation/README.md)

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before
everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too
drastically. Using the specification now will ensure that needed changes can be made before
everything is locked in. So now is an ideal time to implement, as your feedback will be directly
incorporated.

## Catalog Definitions

There are two required element types of a Catalog: Catalog and Item. A STAC Catalog
points to [STAC Items](../item-spec/), or to other STAC catalogs. The top-most parent catalog is
called the "root" catalog. The root catalog generally defines information about the catalog as a
whole, such as name, description, licensing, contact information and so forth. However, it is
strongly recommended that a "root" catalog define metadata fields that apply to the entire `catalog`
(such that child catalogs and items simply inherit these field values). Catalogs below the root
generally have less information and serve to create a directory structure for categorizing and
grouping item data. The contents of a catalog are flexible and STAC makes no assumptions for where
or how catalog metadata is defined within a catalog. For example, a non-root catalog could redefine
or add different licensing or copyright terms.

STAC makes no formal distinction between a "root" catalog and the "child" catalogs. A root catalog
is simply a top-most `catalog` (which has no parent). A nested `catalog` structure is useful (and
recommended) for breaking up massive numbers of catalog items into logical groupings. For example,
it might make sense to organize a `catalog` by date (year, month, day), or geography (continent,
country, state/prov). Any scheme may be used, but it's considered a best practice to keep the size
of each `catalog` under a a megabyte.

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

This example might be considered a somewhat "typical" structure. However, catalogs and items can
describe a number of different relationships. The following shows various relationships between
catalogs and items:

- `Catalog` -> `Item` (this is a common structure for a catalog to list links to items)
- `Catalog` -> `Catalog` (this is a common tree structure to group sets of items. Each catalog in
  this relationship may also include item links as well as catalog links)
- `Item` -> `Catalog` (example: an item may point to a catalog to describe a set of derived assets,
  where it may be desirable to have the origin asset as a "parent", such as NDVI generated from
  RGB/IR)
- `Item` -> `Item` (example: this relationship may be used to describe a 1-1 parent-child
  relationship, such as a single derived item from one parent item)

The core Items listed in a static catalog are the exact same form as those returned by a Catalog
API. Ideally, STAC enables both a static and dynamic API to be crawled in the same way.

Catalogs should be defined using the file name `catalog.json` to distinguish from item other JSON
type files. In order to support multiple "root" catalogs, the recommended practice is to place the
`catalog.json` in namespaces "directories". For example:

- current/catalog.json
- archive/catalog.json

### Catalog Flexibility

STAC Catalogs are defined for flexibility. They only require a handful of fields, and
implementors are free to add most any json field or object that they want. This is a design goal, so
that it is quite easy to implement a catalog and be able to adapt it to most any data model.

But it is expected that some more firm recommendations and even requirements will emerge, especially
around asset definition, links, and catalog level metadata, so that clients will be able to glean
more meaningful information. In the meantime implementors are encouraged to do what makes sense for
them, and to check out the examples and other implementations for emerging best practices.

### Catalog Evolution

The core concept is to be able to flexibly represent full catalogs of assets. Many organizations
have very complex data models, representing a number of real world variables. Catalogs are
focused on search of the data, and so items should contain the core metadata fields and downloadable
assets. So things like satellite ephemeris and obscure metadata fields only relevant to
ortho-rectification experts is less the primary goal. But organizations are encouraged to adapt the
core concepts to more complex relationships, extending in a variety of ways. The hope is that naive
clients can always garner the space and time of geospatial assets, while creating an open community
of evolving shared practices and metadata fields to expose all geospatial asset information in a
common way.

Thus the 'core' static catalog spec will aim to remain relatively simple, but will always look to
build in the right extension mechanisms for others to use the core in ways that are valuable for
their domain or company.

#### Recommendations

The evolution of static catalogs will take place in this repository, primarily in the
'example-implementations' folder. This will show how a variety of providers at least could represent
their catalogs in STAC static catalogs (and as things mature the examples will mirror their
production catalogs). The various recommendations can be viewed in the
[Static Catalog Recommendations](static-recommendations.md) document. Some of these will likely
evolve to be requirements, or at least documented specification options and extensions.

## Catalog fields

| Element     | Type            | Description                                                                                                                                                                                                                           |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | string          | **REQUIRED.** Name for the catalog.                                                                                                                                                                                                   |
| description | string          | **REQUIRED.** Detailed multi-line description to fully explain the catalog. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation.                                                                |
| license     | string          | License as a [SPDX License identifier](https://spdx.org/licenses/) or `proprietary` if the license is not on the SPDX license list. Proprietary licensed data SHOULD add a link to the license text, see the `license` relation type. |
| keywords    | [string]        | List of keywords describing the catalog.                                                                                                                                                                                              |
| provider    | Provider Object | Storage information for the catalog.                                                                                                                                                                                                  |
| contact     | Contact Object  | Contact information about the organization providing the catalog.                                                                                                                                                                     |
| homepage    | string          | Homepage for the catalog.                                                                                                                                                                                                             |
| links       | [Link Object]   | **REQUIRED.** A list of references to other documents.                                                                                                                                                                                |

**Examples:**

A _"root" catalog_ of
[NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/)
might look something like this:

```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery",
  "license": "PDDL-1.0",

  "links": [
    { "rel": "self", "href": "catalog.json" },
    { "rel": "child", "href": "naip/30087/catalog.json" },
    {
      "rel": "root",
      "href": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/catalog.json"
    }
  ],

  "contact": {
    "name": "Supervisor Customer Services Section",
    "email": "apfo.sales@slc.usda.gov",
    "phone": "801-844-2922",
    "url": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/"
  },

  "keywords": ["aerial"],
  "homepage": "http://wherever",

  "provider": {
    "scheme": "s3",
    "region": "us-east-1",
    "requesterPays": "true"
  }
}
```

_Child catalog:_

```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery - 30087",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/my-real-home/naip/30087/catalog.json" },
    { "rel": "parent", "href": "catalog.json" },
    {
      "rel": "root",
      "href": "https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/catalog.json"
    },
    { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130805.json" },
    { "rel": "item", "href": "30087/m_3008718_sw_16_1_20130806.json" }
  ]
}
```

### Contact Object

| Field Name | Type   | Description                                     |
| ---------- | ------ | ----------------------------------------------- |
| name       | string | The name of the organization or the individual. |
| email      | string | Email of the catalog provider.                  |
| phone      | string | Phone number of the catalog provider.           |
| url        | string | Homepage of the catalog provider.               |

### Provider Object

The objects provides information about the storage provider hosting the data.

| Field Name     | Type    | Description                                        |
| -------------- | ------- | -------------------------------------------------- |
| scheme         | string  | The protocol/scheme used to access the data.       |
| region         | string  | Provider specific region where the data is stored. |
| requester_pays | boolean | `true` if requester pays, `false` if host pays.    |

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | MIME-type of the referenced entity.                                                                                                 |

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Dataset:

| Type    | Description                                                                                                                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self    | **REQUIRED.** _Absolute_ URL to the catalog file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | **REQUIRED.** _Absolute_ URL to the root [STAC Catalog](../catalog-spec/), even if it's the root and points to itself.                                                                                                                                                                  |
| parent  | URL to the parent [STAC Catalog](../catalog-spec/). Non-root catalogs should include a link to their parent.                                                                                                                                                                            |
| child   | URL to a child [STAC Catalog](../catalog-spec/).                                                                                                                                                                                                                                        |
| item    | URL to a [STAC Item](../item-spec/).                                                                                                                                                                                                                                                      |
| license | The license URL for the catalog SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC catalog with the license text in separate file and link to this file.                           |

**Note:** A link to at least one `item` or `child` catalog is _required_.
