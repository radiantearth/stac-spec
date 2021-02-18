# Object Storage Extension Specification

- **Title: Object Storage**
- **Identifier: storage**
- **Field Name Prefix: -**
- **Scope: Item, Assets**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @davidraleigh

This document describes the Object Storage Extension. This extension adds fields to STAC Item and Asset objects. This allows for details related to cloud storage access and costs for assets to be associated with a STAC Item.

This extension does not cover NFS solutions provided by PaaS cloud companies. 

- [Example (Landsat 8)](examples/example-landsat8.json)
- [JSON Schema](json-schema/schema.json)

## Asset fields

| Field Name  | Type   | Description |
| ----------- | ------ | ----------- |
| storage:cloud_platform        | string    | The [cloud provider](#providers) where data is stored |
| storage:manager               | string    | The entity in charge of managing the data. |
| storage:regions               | [string]  | The region(s) where the data is stored. Relevant to speed of access and inter region egress costs (as defined by PaaS provider) |
| storage:bucket                | string    | The bucket for the asset, used along with object path |
| storage:object_path           | string    | The object_path for the asset, used along with bucket |
| storage:requester_pays        | bool      | Is the data requester pays or is it data manager/cloud provider pays |
| storage:tier                  | string    | The title for the tier type (as defined by PaaS provider) |
| storage:tier_duration         | integer   | Minimum storage duration required before additional fees |
| storage:date_stored           | string    | Date and time the corresponding asset placed into the current storage tier (relevant for tier_duration > 0). Format is RFC 3339. |
| storage:first_byte_latency    | string    | time unit (milliseconds, minutes or hours) for accessing first byte of data |

## Item fields

| Field Name  | Type   | Description |
| ----------- | ------ | ----------- |
| storage:min_tier_duration   | string  | Date and timestamp type describing the shortest time tier restrictions on access of assets. If `storage:archived_small` is false then thumbnails and other small overviews (implementer's discretion) are not included in `min_tier_duration` calculation |
| storage:max_tier_duration   | string  | Date and timestamp type describing the longest time tier restrictions on access of assets. |
| storage:archived_small         | bool      | Should the thumbnails or other small data be assumed to be included in the `min_tier_duration` and `max_tier_duration` |
| storage:archived              | bool      | descriptor for whether the data is "properly" archived according to implementers discretion |

## Providers
Currently this document is arranged to support object storage users of the following PaaS solutions:

- Alibaba
- AWS
- Azure
- Google Cloud Platform
- IBM
- Oracle

## Cloud Provider Storage Tiers

| Duration      | Google Cloud  | AWS                   | Azure         | IBM           | Oracle    | Alibaba           |
| ------------- | ------------- | --------------------- | ------------- |-------------  | --------- | ---------         |
| 0 days        | STANDARD      | Standard              | Hot Tier      | Standard      | Standard  | Standard          |
| 30 days       | NEARLINE      | Standard-IA           | Cool Tier     | Vault         | N/A       | Infrequent Access |
| 60 days       | N/A           | N/A                   | N/A           | N/A           | N/A       | Archive           |
| 90 days       | COLDLINE      | Glacier               | N/A           | Cold Vault    | Archive   | N/A |
| 180 days      | N/A           | Glacier Deep Archive  | Archive Tier  | N/A           | N/A       | Cold Archive |
| 365 days      | ARCHIVE       | N/A                   | N/A           | N/A           | N/A       | N/A |

References for the above table:

IBM: https://cloud.ibm.com/objectstorage/create#pricing

Google Cloud: https://cloud.google.com/storage/docs/storage-classes

Microsoft: https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-storage-tiers

AWS: https://aws.amazon.com/s3/storage-classes/

Oracle: 
 - https://www.oracle.com/cloud/storage/pricing.html
 - https://www.oracle.com/cloud/storage/archive-storage-faq.html

Alibaba: 
 - https://www.alibabacloud.com/product/oss/pricing
 - https://www.alibabacloud.com/help/doc-detail/51374.htm

All timestamps MUST be formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
