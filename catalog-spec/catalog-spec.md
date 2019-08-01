# STAC Catalog Specification

This document explains the structure and content of a STAC Catalog. A STAC Catalog is a 
collection of [STAC Items](../item-spec/). These Items can be linked to directly from a Catalog,
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
[STAC Collection specification](../collection-spec/) to provide additional information about a set of Items 
contained in a catalog, to give contextual information to aid in discovery. Every STAC Collection is 
also a valid STAC Catalog.

## WARNING

**This is still an early version of the STAC spec, expect that there may be some changes before
everything is finalized.**

Implementations are encouraged, however, as good effort will be made to not change anything too
drastically. Using the specification now will ensure that needed changes can be made before
everything is locked in. So now is an ideal time to implement, as your feedback will be directly
incorporated.

## Catalog Definitions

There are two required element types of a Catalog: Catalog and Item. A STAC Catalog
points to [STAC Items](../item-spec/README.md), or to other STAC catalogs. It provides a simple
linking structure that can be used recursively so that many Items can be included in 
a single Catalog, organized however the implementor desires. 

STAC makes no formal distinction between a "root" catalog and the "child" catalogs. A root catalog
is simply a top-most catalog (which has no parent). A nested catalog structure is useful (and
recommended) for breaking up massive numbers of catalog items into logical groupings. For example,
it might make sense to organize a catalog by date (year, month, day), or geography (continent,
country, state/prov). Any scheme may be used, but it's considered a best practice to keep the size
of each catalog under a megabyte.

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

As all STAC Collections are also valid STAC Catalogs, all Catalogs described here could also be Collections.

The relationships are all described by a common `links` object structure, making use of
the `rel` attribute to further describe the relationship. 

There are a few types of catalogs that implementors occasionally refer to. These get defined by the `links` structure.

 * A **sub-catalog** is a Catalog that is linked to from another Catalog that is used to better organize data. For example a Landsat collection
 might have sub-catalogs for each Path and Row, so as to create a nice tree structure for users to follow.
 * A **root catalog** is a Catalog that only links to sub-catalogs. These are typically entry points for browsing data. Often
 they will contain the [STAC Collection](../collection-spec) definition, but in implementations that publish diverse information it may
 contain sub-catalogs that provide a variety of collections.
 * A **parent catalog** is the Catalog that sits directly above a sub-catalog. Following parent catalog links continuously
 will naturally end up at a root catalog definition.
 
It should be noted that a Catalog does not have to link back to all the other Catalogs that point to it. Thus a published 
root catalog might be a sub-catalog of someone else's structure. The goal is for data providers to publish all the 
information and links they want to, while also encouraging a natural web of information to arise as Catalogs and Items are
linked to across the web.

There are a number of emerging 'best practices' for how to organize and implement good catalogs. These can be found in
the [best practices document](catalog-best-practices.md), and include things like catalog layout, use of self links, 
publishing catalogs, and more. This specification is designed for maximum flexbility, but the best practices provide
guidance for good recommendations when implementing.

### Catalog Types

Though it is technically an implementation detail outside the scope of the core specification, it is worth mentioning
that implementations generally fall into two different 'types':

* **Static Catalogs** can be implemented as simply files online, often stored in an cloud storage service like [Amazon S3](https://aws.amazon.com/s3/). 
or [Google Cloud Storage](https://cloud.google.com/storage/).
The core JSON documents and link structures are encoded in the file, and work as long as things are structured properly.
* **Dynamic Catalogs** are implemented in software, returning the JSON documents and links dynamically. This is mostly 
used when data holdings are already exposed through a dynamic interface, and STAC can be an alternate facade on the 
same core database or search cluster.

The two catalog types both implement the same fields and links, and can be treated as the same by clients. For more 
details on the two types and how you might use them see the [Static and Dynamic Catalogs](catalog-best-practices.md#static-and-dynamic-catalogs) section of the best practices document.

## Catalog fields

| Element      | Type          | Description                                                  |
| ------------ | ------------- | ------------------------------------------------------------ |
| stac_version | string        | **REQUIRED.** The STAC version the catalog implements.       |
| id           | string        | **REQUIRED.** Identifier for the catalog.                    |
| title        | string        | A short descriptive one-line title for the catalog.          |
| description  | string        | **REQUIRED.** Detailed multi-line description to fully explain the catalog. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| summaries    | Map<string, [*]\|Range Object> | A map of property summaries, either a set of values or a range. |
| links        | [Link Object] | **REQUIRED.** A list of references to other documents.       |

**stac_version**: It is not allowed to mix STAC versions. The root catalog or the root collection respectively MUST specify the implemented STAC version. Child Catalogs and child Collections MUST NOT specify a different STAC version.

**summaries**: You can optionally summarize the potential values that are available as part of the `properties` in STAC Items.
Summaries are used to inform users about values they can expect from items without having to crawl through them. It also helps do fully define collections, especially if they don't link to any Items.
Summaries are either a range (i.e. the minimum and the maxmimum value) or a unique set of all values.
Ranges can specify the potential range of values, but it is recommended to be as precise as possible. The set of values must contain at least one element and it is strongly recommended to list all values.
It is recommended to list as many properties as reasonable so that consumers get a full overview about the properties included in the Items. Nevertheless, it is not very useful to list all potential `title` values of the Items. Also, a range for the `datetime` property may be better suited to be included in the STAC Collection. In general, properties that are covered by the Collection specification (e.g. `providers` and `license`) may not be repeated in the summaries.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.                                |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter ["Relation types"](#relation-types) for more information. |
| type       | string | Media type of the referenced entity.                                                                                                |
| title      | string | A human readable title to be used in rendered displays of the link.                                                                 |

A more complete list of possible 'rel' types can be seen at the [IANA page of Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

Please see the chapter 'relative vs absolute links' in the [Item spec](../item-spec/item-spec.md#relative-vs-absolute-links)
 for a discussion on that topic, as well as the [use of links](catalog-best-practices.md#use-of-links) section of the 
 catalog best practices document.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a STAC Collection:

| Type    | Description |
| ------- | ----------- |
| self    | STRONGLY RECOMMENDED. _Absolute_ URL to the location that the catalog file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | STRONGLY RECOMMENDED. URL to the root STAC Catalog or [Collection](../collection-spec/README.md). Catalogs should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC Catalog or [Collection](../collection-spec/README.md). Non-root catalogs should include a link to their parent. |
| child   | URL to a child STAC Catalog or [Collection](../collection-spec/README.md). |
| item    | URL to a STAC [Item](../item-spec/item-spec.md). |

**Note:** A link to at least one `item` or `child` catalog is **REQUIRED**.

### Range Object

Ranges can be specified for [ordinal](https://en.wikipedia.org/wiki/Level_of_measurement#Ordinal_scale) values only, which means they need to have a rank order.
Therefore, ranges can only be specified for numbers and some special types of strings. Examples: grades (A to F), dates or times.

| Field Name | Type           | Description |
| ---------- | -------------- | ----------- |
| min        | number\|string | **REQUIRED.** Minimum value of the range. |
| max        | number\|string | **REQUIRED.** Maximum value of the range. |

## Examples

A catalog of
[NAIP imagery](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/)
might look something like this:

```json
{
  "stac_version": "0.7.0",
  "id": "NAIP",
  "description": "Catalog of NAIP Imagery",
  "links": [
    { "rel": "self", "href": "https://www.fsa.usda.gov/naip/catalog.json" },
    { "rel": "child", "href": "https://www.fsa.usda.gov/naip/30087/catalog.json" },
    { "rel": "root", "href": "https://www.fsa.usda.gov/catalog.json" }
  ]
}
```

In addition, the catalog shown above is strongly recommended to also follow the [STAC Collection specification](../collection-spec/collection-spec.md) 
to add more information about the NAIP imagery such as the spatial and temporal extents, a license and more.

A typical '_child_' sub-catalog could look similar:

```json
{
  "stac_version": "0.7.0",
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

## Extensions

There are emerging best practices, which in time will evolve in to specification extensions for
particular domains or uses.

The [extensions page](../extensions/) gives an overview about relevant extensions for STAC Catalogs.
