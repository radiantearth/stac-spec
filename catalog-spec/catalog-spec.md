# STAC Catalog Specification

- [Catalog fields](#catalog-fields)
  - [Additional Field Information](#additional-field-information)
    - [stac_extensions](#stac_extensions)
  - [Link Object](#link-object)
    - [Relation types](#relation-types)
- [Media Types](#media-types)
  - [Media Type for STAC Catalogs](#media-type-for-stac-catalogs)
  - [STAC Media Types](#stac-media-types)
- [Extensions](#extensions)

This document explains the structure and content of a STAC Catalog. A STAC Catalog is a 
[Collection](../collection-spec/collection-spec.md) of [STAC Items](../item-spec/item-spec.md). These Items can be 
linked to directly from a Catalog, or the Catalog can link to other Catalogs (often called sub-Catalogs) that contain 
links to Items. The division of sub-catalogs is up to the implementor, but is generally done to aid the ease of 
online browsing by people.

Catalogs are not intended to be queried. Their purpose is discovery: to be browsed by people and crawled
by machines to build a search index. A Catalog can be represented in JSON format. Any JSON object 
that contains all the required fields is a valid STAC Catalog.

- [Examples](../examples/)
  - See an example [catalog.json](../examples/catalog.json). The [collection.json](../examples/collection.json) is also a valid
  catalog file, demonstrating linking to items (it is also a Collection, so has additional fields)
- [JSON Schema](json-schema/catalog.json)

The [Catalog section of the Overview](../overview.md#catalog-overview) document provides background information on 
the structure of Catalogs as well as links to best practices. This specification lays out the requirements
and fields to be compliant.

This Catalog specification primarily defines a structure for information to be discoverable. Any use 
that is publishing a set of related spatiotemporal assets is strongly recommended to also use the 
STAC Collection specification to provide additional information about the set of Items 
contained in a Catalog, in order to give contextual information to aid in discovery. Every STAC Collection is 
also a valid STAC Catalog.

## Catalog fields

| Element         | Type          | Description                                                  |
| --------------- | ------------- | ------------------------------------------------------------ |
| stac_version    | string        | **REQUIRED.** The STAC version the catalog implements. STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind. |
| type            | string        | **REQUIRED.** Set to `Catalog` if this catalog only implements the catalog spec, or `Collection` if it additional meets the [collection](../collection-spec/collection-spec.md) requirements and should be treated by clients as such. |
| stac_extensions | \[string]     | A list of extension identifiers the Catalog implements.                 |
| id              | string        | **REQUIRED.** Identifier for the Catalog.                    |
| title           | string        | A short descriptive one-line title for the Catalog.          |
| description     | string        | **REQUIRED.** Detailed multi-line description to fully explain the Catalog. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| summaries       | Map<string, \[*]\|[Stats Object](../collection-spec/collection-spec.md#stats-object)> | A map of property summaries, either a set of values or statistics such as a range. More info in the [Collection spec](../collection-spec/collection-spec.md#summaries). |
| links           | [[Link Object](#link-object)] | **REQUIRED.** A list of references to other documents.       |

### Additional Field Information

#### stac_extensions

A list of extensions the Catalog implements. This does NOT declare the extensions of children or Items. The list contains URLs to the JSON Schema files it can be validated against. For official [content extensions](../extensions/README.md#list-of-stac-extensions), a "shortcut" can be used. This means you can specify the folder name of the extension, for example `single-file-stac` for the Point Cloud extension. If the versions of the extension and the Catalog diverge, you can specify the URL of the JSON schema file.
This list must only contain extensions that extend the Catalog itself, see the the 'Scope' column in the list of extensions.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.        |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter ["Relation types"](#relation-types) for more information. |
| type       | string | [Media type](#media-types) of the referenced entity.                               |
| title      | string | A human readable title to be used in rendered displays of the link.                                         |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a STAC Catalog:

| Type    | Description |
| ------- | ----------- |
| self    | STRONGLY RECOMMENDED. *Absolute* URL to the location that the catalog file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | STRONGLY RECOMMENDED. URL to the root STAC Catalog or [Collection](../collection-spec/README.md). Catalogs should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC Catalog or Collection. Non-root Catalogs should include a link to their parent. |
| child   | URL to a child STAC Catalog or Collection. |
| item    | URL to a STAC Item. |

**Note:** A link to at least one `item` or `child` Catalog is **REQUIRED**.

There are additional `rel` types in the [Using Relation Types](../best-practices.md#using-relation-types) best practice, but as 
they are more typically used in Collections, as Catalogs tend to just be used to structure STAC organization, so tend to just use
the ones above.

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

| Media Type                     | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| `application/geo+json`	     | A STAC [Item](../item-spec/item-spec.md)                        |
| `application/json`             | A STAC [Catalog](#stac-catalog-specification)                |
| `application/json`             | A STAC [Collection](../collection-spec/collection-spec.md)            |

## Extensions

The [extensions page](../extensions/) gives an overview about relevant extensions for STAC Catalogs.
