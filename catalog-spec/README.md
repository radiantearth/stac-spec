# STAC Catalog Spec

## Overview

While an [Item](../item-spec/item-spec.md) is the atomic unit of a SpatioTemporal Asset Catalog, 
the Catalog JSON definition is the core structure that enables browsers and crawlers to access
the sets of `Item`s. A Catalog consists of links to other Catalogs and Items, and can include
additional metadata to further describe its holdings. It is defined in full in the 
[Catalog Specification](catalog-spec.md)

## In this directory

**The Specification:** The main Catalog specification is in 
*[catalog-spec.md](catalog-spec.md)*. It includes an overview and in depth explanation of the 
structures and fields.

**Examples:** For samples of how Catalogs can be implemented the *[examples/](examples/)* folder 
contains a full sample catalog. 

**Schemas:** The schemas to validate the core `Catalog` definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[catalog.json](json-schema/catalog.json)*.


## Schema Validation

Instruction on schema validation for STAC Items can be found in the [validation instructions](validation/README.md).


## Catalog Spec Evolution 

The Catalog specification is maturing, but it is still relatively early days. As real world 
implementations innovate in different ways we will update the core fields to handle 