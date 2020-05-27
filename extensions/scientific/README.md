# Scientific Extension Specification

- **Title: Scientific**
- **Identifier: scientific**
- **Field Name Prefix: sci**
- **Scope: Item, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Scientific metadata is considered to be data that indicate from which publication a data originates and how
the data itself should be cited or referenced. Overall, it helps to increase reproducibility and citability.

Human-readable references and [DOIs](https://www.doi.org/) can be used in this extension. DOIs are
persistent digital interoperable identifier that uniquely identify for digital publications. They
can be registered at registration agencies affiliated with the
[International DOI Foundation](https://www.doi.org/).

This extension applies to STAC Items and STAC Collections.
As these scientific information are often closely bound to the collection level and therefore are shared across all items,
it is recommended adding the fields to the corresponding [STAC Collection](../../collection-spec/README.md).

- Examples: [Collection](examples/collection.json), [Item](examples/item.json)
- [JSON Schema](json-schema/schema.json)

## Item and Collection Fields

For Items, the fields are placed in the `properties`. For Collections, the fields are placed on the top level of the Collection.

| Field Name       | Type                 | Description |
| ---------------- | -------------------- | ----------- |
| sci:doi          | string               | The DOI name of the data, e.g. `10.1000/xyz123`. This MUST NOT be a DOIs link. For all DOI names respective DOI links SHOULD be added to the links section (see chapter "Relation types"). |
| sci:citation     | string               | The recommended human-readable reference (citation) to be used by publications citing the data. No specific citation style is suggested, but the citation should contain all information required to find the publication distinctively. |
| sci:publications | [[Publication Object](#publication-object)] | List of relevant publications referencing and describing the data. |

*At least one of the fields must be specified.*

### Publication Object

| Field Name | Type   | Description |
| ---------- | ------ | ----------- |
| doi        | string | DOI of a publication referencing the data. |
| citation   | string | Citation of a publication referencing the data. |

**doi** - The DOI name of a publication which describes and references the data. The publications
should include more information about the data and how it was processed. This MUST NOT be a DOI
link. For all DOI names respective DOI links SHOULD be added to the links section
(see chapter "Relation types").

**citation** - Human-readable reference (citation) of a publication which describes and references
the data. The publications should include more information about the data and how it was
processed. No specific citation style is suggested, but a citation should contain all information
required to find the publication distinctively.

## Relation types

This extension adds the following types as applicable `rel` types for the [Link Object](../../item-spec/item-spec.md#link-object):

| Type    | Description |
| ------- | ----------- |
| cite-as | For all DOI names specified the respective DOI links SHOULD be added to the links section with the `rel` type `cite-as` (see the [IETF draft](https://tools.ietf.org/id/draft-vandesompel-citeas-03.html)). |

## Implementations

None yet, still in proposal stage.
