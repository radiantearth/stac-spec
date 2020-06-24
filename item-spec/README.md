# STAC Items

The core of a SpatioTemporal Asset Catalog (STAC) is a set of JSON fields defined by the 
[STAC Item spec](item-spec.md). These fields define an Item - the atomic units that contain 
metadata for search as plus links to the actual assets that they represent. Their main function 
is as the leaf nodes of a [Catalog](../catalog-spec/README.md), and are also returned from the search
endpoints of a `/search` endpoint. See the [overview](../overview.md) document for more information on how all the
pieces fit together.

## In this directory

**Item Specification:** The main definition of the STAC Item specification is in 
*[item-spec.md](item-spec.md)*. It includes an overview and an in-depth explanation of the fields.

**Common Metadata:** A set of commonly used metadata fields for STAC Items is listed in 
*[common-metadata.md](common-metadata.md)*.

**Examples:** For samples of how STAC Items can be implemented the *[examples/](examples/)* folder 
contains a number of real world examples. See the [readme](examples/README.md) for additional 
discussion of the examples.

**Schemas:** The schemas to validate the core Item definitions are found in the 
*[json-schema/](json-schema/)* folder. The *[item.json](json-schema/item.json)* validates items overall
and the additional schemas validate the various groups of *[Common Metadata](common-metadata.md)*.
