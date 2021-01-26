# STAC Catalog Specification

This document explains the structure and content of a STAC Catalog. A STAC Catalog is a 
collection of [STAC Items](../item-spec/). These Items can be linked to directly from a Catalog,
or the Catalog can link to other Catalogs (often called sub-Catalogs) that contain links to Items.
The division of sub-catalogs is up to the implementor, but is generally done to aid the ease of 
online browsing by people.

Catalogs are not intended to be queried. Their purpose is discovery: to be browsed by people and crawled
by machines to build a search index. A Catalog can be represented in JSON format. Any JSON object 
that contains all the required fields is a valid STAC Catalog.

- [Examples](examples/)
  - See a [minimal example](examples/catalog.json), as well a [fuller example](examples/catalog-items.json)
    includes links to several items. 
- [JSON Schema](json-schema/catalog.json)

The [Catalog section of the Overview](../overview.md#catalog-overview) document provides background information on 
the structure of catalogs as well as links to best practices. This specification lays out the requirements
and fields to be compliant.

This Catalog specification primarily defines a structure for information to be discoverable. Any use 
that is publishing a set of related spatiotemporal assets is strongly recommended to also use the 
[STAC Collection specification](../collection-spec/) to provide additional information about a set of Items 
contained in a catalog, to give contextual information to aid in discovery. Every STAC Collection is 
also a valid STAC Catalog.

## Catalog fields

| Element         | Type          | Description                                                  |
| --------------- | ------------- | ------------------------------------------------------------ |
| stac_version    | string        | **REQUIRED.** The STAC version the catalog implements. STAC versions can be mixed, but please keep the [recommended best practices](../best-practices.md#mixing-stac-versions) in mind. |
| stac_extensions | \[string]     | A list of extension identifiers the Catalog implements.                 |
| id              | string        | **REQUIRED.** Identifier for the catalog.                    |
| title           | string        | A short descriptive one-line title for the catalog.          |
| description     | string        | **REQUIRED.** Detailed multi-line description to fully explain the catalog. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| links           | [[Link Object](#link-object)] | **REQUIRED.** A list of references to other documents.       |

**stac_extensions**: A list of extensions the Catalog implements. This does NOT declare the extensions of children or Items. The list contains URLs to the JSON Schema files it can be validated against. For official [content extensions](../extensions/README.md#list-of-content-extensions), a "shortcut" can be used. This means you can specify the folder name of the extension, for example `single-file-stac` for the Point Cloud extension. If the versions of the extension and the catalog diverge, you can specify the URL of the JSON schema file.
This list must only contain extensions that extend the Catalog itself, see the the 'Scope' column in the list of extensions.

### Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with links.

| Field Name | Type   | Description                                                                                                                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| href       | string | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed.        |
| rel        | string | **REQUIRED.** Relationship between the current document and the linked document. See chapter ["Relation types"](#relation-types) for more information. |
| type       | string | [Media type](../item-spec/item-spec.md#media-types) of the referenced entity.                               |
| title      | string | A human readable title to be used in rendered displays of the link.                                         |

A more complete list of possible 'rel' types can be seen at the [IANA page of Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

Please see the chapter 'relative vs absolute links' in the [Item spec](../item-spec/item-spec.md#relative-vs-absolute-links)
for a discussion on that topic, as well as the [use of links](../best-practices.md#use-of-links) section of the 
catalog best practices document.

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a STAC Catalog:

| Type    | Description |
| ------- | ----------- |
| self    | STRONGLY RECOMMENDED. *Absolute* URL to the location that the catalog file can be found online, if available. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root    | STRONGLY RECOMMENDED. URL to the root STAC Catalog or [Collection](../collection-spec/README.md). Catalogs should include a link to their root, even if it's the root and points to itself. |
| parent  | URL to the parent STAC Catalog or [Collection](../collection-spec/README.md). Non-root catalogs should include a link to their parent. |
| child   | URL to a child STAC Catalog or [Collection](../collection-spec/README.md). |
| item    | URL to a STAC [Item](../item-spec/item-spec.md). |

**Note:** A link to at least one `item` or `child` catalog is **REQUIRED**.

There are additional `rel` types in the [Using Relation Types](../best-practices.md#using-relation-types) best practice, but as 
they are more typically used in Collections, as catalogs tend to just be used to structure STAC organization, so tend to just use
the oens above.

## Extensions

The [extensions page](../extensions/) gives an overview about relevant extensions for STAC Catalogs.
