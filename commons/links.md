# Links <!-- omit in toc -->

- [Link Object](#link-object)
  - [HTTP headers](#http-headers)
- [Media Types](#media-types)
  - [STAC Media Types](#stac-media-types)
- [Relation Types](#relation-types)
  - [Hierarchical relations](#hierarchical-relations)
    - [`self` relation](#self-relation)
    - [`root` and `parent` relation](#root-and-parent-relation)
    - [`child` relation](#child-relation)
    - [`collection` and `item` relation](#collection-and-item-relation)

## Link Object

This object describes a relationship with another entity. Data providers are advised to be liberal
with the links section, to describe things like the Catalog an Item is in, related Items, parent or
child Items (modeled in different ways, like an 'acquisition' or derived data).

| Field Name | Type                             | Description                                                                                                                                                                    |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| href       | string                           | **REQUIRED.** The actual link in the format of an URL. Relative and absolute links are both allowed. [Trailing slashes are significant.](../best-practices.md#consistent-uris) |
| rel        | string                           | **REQUIRED.** Relationship between the current document and the linked document. See chapter "Relation types" for more information.                                            |
| type       | string                           | Media type of the referenced entity.                                                                                                                                           |
| title      | string                           | A human readable title to be used in rendered displays of the link.                                                                                                            |
| method     | string                           | The HTTP method that shall be used for the request to the target resource, in uppercase. `GET` by default                                                                      |
| headers    | Map<string, string \| \[string]> | The HTTP headers to be sent for the request to the target resource.                                                                                                            |
| body       | any                              | The HTTP body to be sent to the target resource.                                                                                                                               |

For a full discussion of the situations where relative and absolute links are recommended see the
['Use of links'](../best-practices.md#use-of-links) section of the STAC best practices.

### HTTP headers

The field `headers` allows to describe a dictionary of HTTP headers that are required to be sent by the client.
The keys of the dictionary are the header names, and the values are either a single string or an array of strings.
In case of an array, the header is expected to be sent multiple times with the different values.

## Media Types

One of the best ways to help inform web clients about the content in a link is to use a common
[Media Type](https://en.wikipedia.org/wiki/Media_type) in the `type` field.
In STAC the `type` field is used in both the [Link Object](#link-object) and in the [Asset Object](assets.md#asset-object).
It is quite useful for STAC browsers to better determine what to render and display to users searching and browsing the Catalog.
Media types are sometimes referred to by the now deprecated term "MIME types".

### STAC Media Types

The following table lists the Media Types to use for STAC entities.

| Media Type             | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `application/geo+json` | A STAC [Item](../item-spec/item-spec.md)                   |
| `application/json`     | A STAC [Catalog](../catalog-spec/catalog-spec.md)          |
| `application/json`     | A STAC [Collection](../collection-spec/collection-spec.md) |

## Relation Types

STAC Entities use a variety of `rel` types in the Link Object,
to describe the exact nature of the link between the STAC object and the entity it is linking to.
It is recommended to use the official
[IANA Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml) where possible.

### Hierarchical relations

The following table lists the STAC-specific `rel` types that are used in the `links` object of a STAC entity
to link with other STAC entities in the same catalog.

| Type       | Description                                                                                                         | Media Type                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| self       | *Absolute* URL to the location that the STAC file can be found online, if available.                                | application/json                                     |
| root       | URL to the root STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)).   | application/json                                     |
| parent     | URL to the parent STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)). | application/json                                     |
| child      | URL to a child STAC entity ([Catalog](../catalog-spec/README.md) or [Collection](../collection-spec/README.md)).    | application/json                                     |
| collection | URL to the parent Collection. *Absolute* URLs should be used whenever possible.                                     | application/json                                     |
| item       | URL to a STAC Item.                                                                                                 | application/geo+json (preferred) or application/json |

#### `self` relation

The `self` relation is used to link to the STAC entity itself.
This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from.

#### `root` and `parent` relation

The `root` and `parent` relations are used to link to the root and parent STAC entity,
which is either a [Catalog](../catalog-spec/README.md) or a [Collection](../collection-spec/README.md).
Conceptually, STAC entities SHALL have no more than one parent entity.
As such, STAC entities also can have no more than one root entity.
Therefore, there's usually just one link with `root` or `parent` relationship
unless different variations of the same conceptual entity exist (identified by the ID).
Different variations could be:

- a different encoding (see the `type` property), e.g. a HTML version in addition to JSON
- a different language (see the `hreflang` property). e.g. a German version in addition to English

#### `child` relation

The `child` relation is **ONLY** used to link a catalog or collection to a child catalog or collection.

#### `collection` and `item` relation

The `collection` and `item` relations are used to link to the parent collection and a child Item, respectively.
It is RECOMMENDED to link an `item` from a collection and not directly from a catalog.
All Items linked from a Collection MUST refer back to its Collection with the `collection` relation type
The referenced Collection is STRONGLY RECOMMENDED to implement the same STAC version as the Collection.
