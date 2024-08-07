# STAC Catalog Specification <!-- omit in toc -->

- [Catalog fields](#catalog-fields)
  - [stac\_version](#stac_version)
  - [stac\_extensions](#stac_extensions)
  - [links](#links)
    - [Relation types](#relation-types)
- [Media Type for STAC Catalogs](#media-type-for-stac-catalogs)
- [Extensions](#extensions)

This document explains the structure and content of a STAC **Catalog** object. A STAC Catalog object
represents a logical group of other Catalog,
[Collection](../collection-spec/collection-spec.md), and [Item](../item-spec/item-spec.md) objects.
These Items can be linked to directly from a Catalog, or the Catalog can link to other Catalogs (often called
sub-catalogs) that contain links to Collections and Items. The division of sub-catalogs is up to the implementor,
but is generally done to aid the ease of online browsing by people.

A Catalog object will typically be the entry point into a STAC catalog. Their
purpose is discovery: to be browsed by people or be crawled
by clients to build a searchable index.  

Any JSON object that contains all the required fields is a valid STAC Catalog object.

- [Examples](../examples/)
  - See an example [catalog.json](../examples/catalog.json). The [collection.json](../examples/collection.json) is also a valid
  Catalog file, demonstrating linking to items (it is also a Collection, so has additional fields)
- [JSON Schema](json-schema/catalog.json)

The [Catalog section of the Overview](../overview.md#catalog-overview) document provides background information on
the structure of Catalogs as well as links to best practices. This specification lays out the requirements
and fields to be compliant.

This Catalog specification primarily defines a structure for information to be discoverable. Any use
that is publishing a set of related spatiotemporal assets is strongly recommended to also use the
STAC Collection specification to provide additional information about the set of Items
contained in a Catalog, in order to give contextual information to aid in discovery.
STAC Collections all have the same fields as STAC Catalogs, but with different allowed
values for `type` and `stac_extensions`.

## Catalog fields

| Element         | Type                    | Description                                                                                                                                                            |
| --------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | string                  | **REQUIRED.** Set to `Catalog` if this Catalog only implements the Catalog spec.                                                                                       |
| stac_version    | string                  | **REQUIRED.** The STAC version the Catalog implements.                                                                                                                 |
| stac_extensions | \[string]               | A list of extension identifiers the Catalog implements.                                                                                                                |
| id              | string                  | **REQUIRED.** Identifier for the Catalog.                                                                                                                              |
| title           | string                  | A short descriptive one-line title for the Catalog.                                                                                                                    |
| description     | string                  | **REQUIRED.** Detailed multi-line description to fully explain the Catalog. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| links           | [[Link Object](#links)] | **REQUIRED.** A list of references to other documents.                                                                                                                 |

### stac_version

In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

### stac_extensions

A list of extensions the Catalog implements.
The list consists of URLs to JSON Schema files that can be used for validation.
This list must only contain extensions that extend the Catalog specification itself,
see the 'Scope' for each of the extensions.
This must **not** declare the extensions that are only implemented in child Collection objects or child Item objects.

### links

Each link in the `links` array must be a [Link Object](../commons/links.md#link-object).

#### Relation types

All the [common relation types](../commons/links.md#relation-types) can be used in catalog.
A `self` and a `root` links are STRONGLY RECOMMENDED.
Non-root Catalogs SHOULD include a `parent` link to their parent.

> \[!NOTE] A link to at least one `item` or `child` (Catalog or Collection) is **RECOMMENDED**, but empty catalogs are
> allowed if there is an intent to populate it or its children were removed.

## Media Type for STAC Catalogs

A STAC Catalog is a JSON file ([RFC 8259](https://tools.ietf.org/html/rfc8259)), and thus should use the
[`application/json`](https://tools.ietf.org/html/rfc8259#section-11) as the
[Media Type](https://en.wikipedia.org/wiki/Media_type) (previously known as the MIME Type).

## Extensions

STAC Catalogs are [extensible](../extensions/README.md).
Please refer to the [extensions overview](https://stac-extensions.github.io) to find relevant extensions for STAC Catalogs.
