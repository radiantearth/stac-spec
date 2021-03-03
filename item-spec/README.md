# STAC Items

The core of a SpatioTemporal Asset Catalog (STAC) is a set of JSON fields defined by the 
[STAC Item spec](item-spec.md). These fields define an **Item** - the entity that contains 
metadata for search as well as links to the actual assets that they represent. Their main function 
is as the leaf nodes of a [Catalog](../catalog-spec/catalog-spec.md).
See the [overview](../overview.md) document for more information on how all the pieces fit together.

## In this directory

**Item Specification:** The main definition of the STAC Item specification is in 
*[item-spec.md](item-spec.md)*. It includes an overview and an in-depth explanation of the fields.

**Common Metadata:** A set of commonly used metadata fields for STAC Items is listed in 
*[common-metadata.md](common-metadata.md)*.

**Schemas:** The schemas to validate the core Item definitions are found in the 
*[json-schema/](json-schema/)* folder. The *[item.json](json-schema/item.json)* validates items overall
and the additional schemas validate the various groups of *[Common Metadata](common-metadata.md)*.
