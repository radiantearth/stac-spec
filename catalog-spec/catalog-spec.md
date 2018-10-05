# STAC Catalog Specification

This document explains the structure and content of a STAC `Catalog`. A STAC Catalog is a 
collection of SpatioTemporal `Item`s. These `Item`s can be linked to directly from a Catalog,
or the Catalog can link to other Catalogs (often called sub-Catalogs) that contain links to Items.
The division of sub-catalogs is up to the implementor, but is generally done to aid the ease of 
online browsing by people.

Catalogs are not intended to be queried - their purpose is more to be browsed by people and crawled
by machines to build a search index. A Catalog can be represented in JSON format. Any JSON object that contains all the required fields is a valid STAC Catalog.

- [Examples](examples/) and [Implementations](../implementations.md)
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

## Catalog fields

| Element     | Type          | Description                                                  |
| ----------- | ------------- | ------------------------------------------------------------ |
| name        | string        | **REQUIRED.** Name for the catalog.                          |
| description | string        | **REQUIRED.** Detailed multi-line description to fully explain the catalog. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| links       | [Link Object] | **REQUIRED.** A list of references to other documents.       |

**Examples:**

A catalog of
[NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/)
might look something like this:

```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/naip/catalog.json" },
    { "rel": "child", "href": "30087/catalog.json" },
    { "rel": "root", "href": "https://www.fsa.usda.gov/catalog.json"
    }
  ]
}
```

In addition, the catalog shown above is strongly recommended to also follow the [Dataset specification](../dataset-spec/dataset-spec.md) to add more information about the NAIP imagery such as the spatial and temporal extents, a license and more.

A typical '_child_' catalog could look similar:

```json
{
  "name": "NAIP",
  "description": "Catalog of NAIP Imagery - 30087",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/naip/30087/catalog.json" },
    { "rel": "parent", "href": "../catalog.json" },
    { "rel": "root", "href": "https://www.fsa.usda.gov/catalog.json" },
    { "rel": "item", "href": "m_3008718_sw_16_1_20130805.json" },
    { "rel": "item", "href": "m_3008718_sw_16_1_20130806.json" }
  ]
}
```

The `root` catalog in this example could hold a set of catalogs with different datasets, e.g. data from other satellites or processed variants of the NAIP imagery.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | Media type of the referenced entity.                                                                                                 |

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Dataset:

| Type    | Description                                                                                                                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self    | **REQUIRED.** _Absolute_ URL to the catalog file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | **REQUIRED.** _Absolute_ URL to the root [STAC Catalog](../catalog-spec/), even if it's the root and points to itself.                                                                                                                                                                  |
| parent  | URL to the parent [STAC Catalog](../catalog-spec/). Non-root catalogs should include a link to their parent.                                                                                                                                                                            |
| child   | URL to a child [STAC Catalog](../catalog-spec/).                                                                                                                                                                                                                                        |
| item    | URL to a [STAC Item](../item-spec/).                                                                                                                                                                                                                                                      |

**Note:** A link to at least one `item` or `child` catalog is _required_.
