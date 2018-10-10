# Scientific Extension Specification (`sci`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

This document explains the fields of the STAC Scientific Extension to a STAC Catalog. Scientific
metadata is considered to be data that indicate from which publication a collection (dataset) originates and how
the collection itself should be cited or referenced. Overall, it helps to increase reproducibility and
citability.

Human-readable references and [DOIs](https://www.doi.org/) can be used in this extension. DOIs are
persistent digital interoperable identifier that uniquely identify for digital publications. They
can be registered at registration agencies affiliated with the
[International DOI Foundation](https://www.doi.org/).

- [Example](example-merraclim.json)
- [JSON Schema](schema.json)

## Catalog Fields

| Field Name       | Type                 | Description |
| ---------------- | -------------------- | ----------- |
| sci:doi          | string               | The DOI name of the collection, e.g. `10.1000/xyz123`. This MUST NOT be a DOIs link. For all DOI names respective DOI links SHOULD be added to the links section of the catalog (see chapter "Relation types"). |
| sci:citation     | string               | The recommended human-readable reference (citation) to be used by publications citing this collection. No specific citation style is suggested, but the citation should contain all information required to find the publication distinctively. |
| sci:publications | [Publication Object] | List of relevant publications referencing and describing this collection. |

### Publication Object

| Field Name | Type   | Description                                            |
| ---------- | ------ | ------------------------------------------------------ |
| doi        | string | DOI of a publication referencing this collection.      |
| citation   | string | Citation of a publication referencing this collection. |

**doi** - The DOI name of a publication which describes and references the collection. The publications
should include more information about the collection and how it was processed. This MUST NOT be a DOI
link. For all DOI names respective DOI links SHOULD be added to the links section of the catalog
(see chapter "Relation types").

**citation** - Human-readable reference (citation) of a publication which describes and references
the collection. The publications should include more information about the collection and how it was
processed. No specific citation style is suggested, but a citation should contain all information
required to find the publication distinctively.

## Relation types

This extension adds the following types as applicable `rel` types for the Link Object of a Catalog:

| Type    | Description |
| ------- | ----------- |
| cite-as | For all DOI names specified in a Catalog the respective DOI links SHOULD be added to the links section of the catalog with the `rel` type `cite-as` (see the [IETF draft](https://tools.ietf.org/id/draft-vandesompel-citeas-03.html)). |
