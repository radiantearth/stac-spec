# STAC Catalog Specification

This document explains the structure and content of a STAC Catalog. A STAC Catalog is a 
collection of SpatioTemporal Items. These Items can be linked to directly from a Catalog,
or the Catalog can link to other Catalogs (often called sub-Catalogs) that contain links to Items.
The division of sub-catalogs is up to the implementor, but is generally done to aid the ease of 
online browsing by people.

Catalogs are not intended to be queried. Their purpose is discovery: to be browsed by people and crawled
by machines to build a search index. A Catalog can be represented in JSON format. Any JSON object 
that contains all the required fields is a valid STAC Catalog.

- [Examples](examples/) and [Implementations](../implementations.md)
- [JSON Schema](json-schema/catalog.json) - please see the [validation instructions](../validation/README.md)

This Catalog specification primarily defines a structure for information to be discoverable. Any use 
that is publishing a set of related spatiotemporal assets is strongly recommended to also use the 
[STAC Collection specification](../dataset-spec/) to provide additional information about a set of Items 
contained in a catalog, to give contextual information to aid in discovery.

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before
everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too
drastically. Using the specification now will ensure that needed changes can be made before
everything is locked in. So now is an ideal time to implement, as your feedback will be directly
incorporated.

## Catalog Definitions


There are two required element types of a Catalog: Catalog and Item. A STAC Catalog
points to [STAC Items](../item-spec/), or to other STAC catalogs. It provides a simple
linking structure that can be used recursively so that many `Items` can be included in 
a single Catalog, organized however the implementor desires. 

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

These relationships are all described by a common `links` object structure, making use of
the *rel* attribute to further describe the relationship. 

There are a few types of catalogs that implementors occasionally refer to. These get defined by the `links` structure.

 * A **sub-catalog** is a Catalog that is linked to from another Catalog that is used to better organize data. For example a Landsat dataset might have sub-catalogs for each Path and Row, so as to create a nice tree structure for users to follow.
 * A **root catalog** is a Catalog that only links to sub-catalogs. These are typically entry points for browsing data. Often
 they will contain the [STAC Collection](../dataset-spec) definition, but in implementations that publish diverse information it may
 contain sub-catalogs that provide a variety of collections.
 * A **parent catalog** is the Catalog that sits directly above a sub-catalog. Following parent catalog links continuously
 will naturally end up at a root catalog definition.
 
It should be noted that a Catalog does not have to link back to all the other Catalogs that point to it. Thus a published 
root catalog might be a sub-catalog of someone else's structure. The goal is for data providers to publish all the 
information and links they want to, while also encouraging a natural web of information to arise as Catalogs and Items are
linked to across the web.

### Catalog Types

The core `Item`s and `Catalog`s of a SpatioTemporal Asset Catalog are designed for ease of implementation. 
With the same core JSON documents and link structures it can be implemented in a way that is just files available online,
or easily implementable with modern REST service infrastructures. These represent two different types of catalogs, the 
'static catalog' and the 'dynamic catalog', which can operate a bit differently though they can be treated the same by
clients.


 But any server can implement the same JSON and link structure, creating responses
dynamically as REST calls. These are referred to as 'dynamic catalogs'.

#### Static Catalogs

A main target for STAC has been object storage services like [Amazon S3](https://aws.amazon.com/s3/), 
[Google Cloud Storage](https://cloud.google.com/storage/) and [Azure Storage](https://azure.microsoft.com/en-us/services/storage/), 
so that users can stand up a full STAC implementation with static files. Implementations created with just files online
are referred to as 'static catalogs'. These include not just the cloud services, but any type of file server that is online.

Static Catalogs tend to make extensive use of *sub-catalogs* to organize their `Item`s in to sensible browsing structures, 
as they can only have a single representation of their catalog, as the static nature means the structure is baked in. 
While it is up to the implementor to organize the catalog, it is recommended to arrange the in a way that would make sense 
for a human to browse a set of STAC Items in an intuitive matter.

Static catalogs a recommended to be defined using the file name `catalog.json` to distinguish from item other JSON
type files. In order to support multiple catalogs, the recommended practice is to place the
`catalog.json` in namespaces "directories". For example:

- current/catalog.json
- archive/catalog.json

#### Dynamic Catalogs

Dynamic STAC Catalogs are those that generate their JSON responses programmatically instead of relying on a set of
already defined files. Typically a dynamic catalog implements the full [STAC API](../stac-api/) which enables 
search of the Items indexed. But the `/stac/` endpoint returns the exact same `Catalog` and `Item` structures as a
static catalog, enabling the same discovery from people browsing and search engines crawling. But dynamic API's that
just seek to expose some data can also choose to only implement a Catalog the `/stac/` endpoint that returns dynamically.
For example a Content Management Service like Drupal or an Open Data Catalog like CKAN could choose to expose its content
as linked STAC Items by implementing a dynamic catalog. 

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same `Items` in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another by
providers, and users could browse down to both. The leaf `Item`s should just be linked to in a single canonical location (or at least use a *rel* link that indicates the location of the canonical one.

The STAC API is also made to be compatible with WFS3, which has a set structure for the canonical location of its features.
STAC `Item`s should use the WFS3 location as their canonical location, and then in the `/stac/` browse structure would just
link to those locations. 

## Catalog fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| stac_version | string        | **REQUIRED.** The STAC version the catalog implements.       |
| id           | string        | **REQUIRED.** Identifier for the catalog.                    |
| title        | string        | A short descriptive one-line title for the catalog.          |
| description  | string        | **REQUIRED.** Detailed multi-line description to fully explain the catalog. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| links        | [Link Object] | **REQUIRED.** A list of references to other documents.       |

**stac_version**: It is not allowed to mix STAC versions. The root catalog or the root collection respectively MUST specify the implemented STAC version. Child Catalogs and child Collections MUST NOT specify a different STAC version.

**Examples:**

A catalog of
[NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/)
might look something like this:

```json
{
  "stac_version": "0.6.0",
  "id": "NAIP",
  "description": "Catalog of NAIP Imagery",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/naip/catalog.json" },
    { "rel": "child", "href": "https://www.fsa.usda.gov/naip/30087/catalog.json" },
    { "rel": "root", "href": "https://www.fsa.usda.gov/catalog.json" }
  ]
}
```

In addition, the catalog shown above is strongly recommended to also follow the [STAC Collection specification](../dataset-spec/dataset-spec.md) 
to add more information about the NAIP imagery such as the spatial and temporal extents, a license and more.

A typical '_child_' sub-catalog could look similar:

```json
{
  "stac_version": "0.6.0",
  "id": "NAIP",
  "description": "Catalog of NAIP Imagery - 30087",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/naip/30087/catalog.json" },
    { "rel": "parent", "href": "../catalog.json" },
    { "rel": "root", "href": "https://www.fsa.usda.gov/catalog.json" },
    { "rel": "item", "href": "https://www.fsa.usda.gov/naip/30087/m_3008718_sw_16_1_20130805.json" },
    { "rel": "item", "href": "https://www.fsa.usda.gov/naip/30087/m_3008718_sw_16_1_20130806.json" }
  ]
}
```

The `root` catalog in this example could hold a set of sub-catalogs with different STAC collections, e.g. data from other satellites or processed variants of the NAIP imagery.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type       | string | Media type of the referenced entity.                                                                                                 |

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a STAC Collection:

| Type    | Description                                                                                                                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self    | **REQUIRED.** _Absolute_ URL to the catalog file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | **REQUIRED.** _Absolute_ URL to the root [STAC Catalog](../catalog-spec/), even if it's the root and points to itself.                                                                                                                                                                  |
| parent  | URL to the parent [STAC Catalog](../catalog-spec/). Non-root catalogs should include a link to their parent.                                                                                                                                                                            |
| child   | URL to a child [STAC Catalog](../catalog-spec/).                                                                                                                                                                                                                                        |
| item    | URL to a [STAC Item](../item-spec/).                                                                                                                                                                                                                                                      |

**Note:** A link to at least one `item` or `child` catalog is _required_.
