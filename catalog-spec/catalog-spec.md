# STAC Catalog Specification <!-- omit in toc --> 

- [Catalog fields](#catalog-fields)
  - [Additional Field Information](#additional-field-information)
    - [stac\_version](#stac_version)
    - [stac\_extensions](#stac_extensions)
  - [Link Object](#link-object)
    - [Relation types](#relation-types)
- [Media Types](#media-types)
  - [Media Type for STAC Catalogs](#media-type-for-stac-catalogs)
  - [STAC Media Types](#stac-media-types)
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

| Element         | Type                          | Description                                                                                                                                                            |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | string                        | **REQUIRED.** Set to `Catalog` if this Catalog only implements the Catalog spec.                                                                                       |
| stac_version    | string                        | **REQUIRED.** The STAC version the Catalog implements.                                                                                                                 |
| stac_extensions | \[string]                     | A list of extension identifiers the Catalog implements.                                                                                                                |
| id              | string                        | **REQUIRED.** Identifier for the Catalog.                                                                                                                              |
| title           | string                        | A short descriptive one-line title for the Catalog.                                                                                                                    |
| description     | string                        | **REQUIRED.** Detailed multi-line description to fully explain the Catalog. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| links           | [[Link Object](#link-object)] | **REQUIRED.** A list of references to other documents.                                                                                                                 |

### Additional Field Information

#### stac_version

In general, STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind.

#### stac_extensions

A list of extensions the Catalog implements.
The list consists of URLs to JSON Schema files that can be used for validation.
This list must only contain extensions that extend the Catalog specification itself,
see the 'Scope' for each of the extensions.
This must **not** declare the extensions that are only implemented in child Collection objects or child Item objects.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                                                                    |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. [Trailing slashes are significant.](../best-practices.md#consistent-uris) |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter ["Relation types"](#relation-types) for more information.                         |
| type       | string | [Media type](#media-types) of the referenced entity.                                                                                                                           |
| title      | string | A human readable title to be used in rendered displays of the link.                                                                                                            |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

#### Relation types

All the [common relation types](../item-spec/common-metadata.md#relation-types) can be used in catalog.
A `self` and a `root` links are STRONGLY RECOMMENDED.
Non-root Catalogs SHOULD include a `parent` link to their parent.

> \[!NOTE] A link to at least one `item` or `child` (Catalog or Collection) is **RECOMMENDED**, but empty catalogs are
> allowed if there is an intent to populate it or its children were removed.

## Media Types

One of the best ways to help inform web clients about the content in a link is to use a common [Media 
Type](https://en.wikipedia.org/wiki/Media_type) in the `type` field. In STAC the `type` field is used in both the 
'[Link](#link-object)'' and '[Asset](../item-spec/item-spec.md#asset-object)' Objects. It is quite useful for STAC browsers to better determine
what to render and display to users searching and browsing the Catalog.  Media types are often referred to by the 
now deprecated term "MIME types". 

### Media Type for STAC Catalogs

A STAC Catalog is a JSON file ([RFC 8259](https://tools.ietf.org/html/rfc8259)), and thus should use the 
[`application/json`](https://tools.ietf.org/html/rfc8259#section-11) as the [Media Type](https://en.wikipedia.org/wiki/Media_type) 
(previously known as the MIME Type). 

### STAC Media Types

The following table lists the Media Types to use for STAC structures.

| Media Type             | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `application/geo+json` | A STAC [Item](../item-spec/item-spec.md)                   |
| `application/json`     | A STAC Catalog                                             |
| `application/json`     | A STAC [Collection](../collection-spec/collection-spec.md) |

## Extensions

The [extensions page](../extensions/) gives an overview about relevant extensions for STAC Catalogs.
