# SIngle Item Extension Specification (`item`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Provides a way to specify several fields in individual Items that usually reside on the collection-level such as license and providers.

- [Example](example.json)
- [JSON Schema](schema.json)

## Item fields

| Field Name        | Type              | Description                                                  |
| ----------------- | ----------------- | ------------------------------------------------------------ |
| item:license      | string            | Item's license(s) as a SPDX [License identifier](https://spdx.org/licenses/) or [expression](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60) or `proprietary` if the license is not on the SPDX license list. Proprietary licensed data SHOULD add a link to the license text, see the `license` relation type. |
| item:providers    | [Provider Object] | A list of providers, which may include all organizations capturing or processing the data or the hosting provider. Providers should be listed in chronological order with the most recent provider being the last element of the list. |

### Provider Object

The object provides information about a provider. A provider is any of the organizations that captured or processed the content of the collection and therefore influenced the data offered by this collection. May also include information about the final storage provider hosting the data.

| Field Name  | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| name        | string    | **REQUIRED.** The name of the organization or the individual. |
| description | string    | Multi-line description to add further provider information such as processing details for processors and producers, hosting details for hosts or basic contact information. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| roles       | [string]  | Roles of the provider. Any of `licensor`, `producer`, `processor` or `host`. |
| url         | string    | Homepage on which the provider describes the dataset and publishes contact information. |

**roles**: The provider's role(s) can be one or more of the following elements:

* *licensor*: The organization that is licensing the dataset under the license specified in the collection's `license` field.
* *producer*: The producer of the data is the provider that initially captured and processed the source data, e.g. ESA for Sentinel-2 data.
* *processor*: A processor is any provider who processed data to a derived product.
* *host*: The host is the actual provider offering the data on their storage. There should be no more than one host, specified as last element of the list. 

## Relation types

The following types are commonly used as `rel` types in the Link Object of an Item:

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| license | The license URL for the item SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC Item with the license text in a separate file and link to this file. |

## Implementations

None yet, still in proposal stage.
