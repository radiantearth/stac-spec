# STAC Catalogs

While an [Item](../item-spec/item-spec.md) is the atomic unit of a SpatioTemporal Asset Catalog, the Catalog JSON definition is the core structure that enables browsers and crawlers to access
the sets of Items. A Catalog consists of links to other Catalogs and Items, and can include
additional metadata to further describe its holdings. It is defined in full in the 
[Catalog Specification](catalog-spec.md).

A special type of Catalogs are [Datasets](../dataset-spec/), which extend Catalogs with additional fields to describe the set of Items in Catalogs. Datasets share the same fields with Catalogs and therefore every Dataset is also a valid Catalog.

## In this directory

**The Specification:** The main Catalog specification is in
*[catalog-spec.md](catalog-spec.md)*. It includes an overview and in depth explanation of the 
structures and fields.

**Examples:** For samples of how Catalogs can be implemented the *[examples/](examples/)* folder
contains a full sample catalog. 

**Schemas:** The schemas to validate the core `Catalog` definition are found in the *[json-schema/](json-schema/)* folder. The primary one is *[catalog.json](json-schema/catalog.json)*.


## Schema Validation

Instruction on schema validation for STAC Catalog can be found in the [validation instructions](validation/README.md).


## Catalog Evolution 

The Catalog specification is maturing, but it is still relatively early days. As real world implementations innovate in different ways, we will update the core fields to handle.

Thus the catalog spec will aim to remain relatively simple, but will always look to
build in the right extension mechanisms for others to use the core in ways that are valuable for
their domain or company.

#### Recommendations

The evolution of static catalogs will take place in this repository. This will show how a variety of providers at least could represent
their catalogs in STAC static catalogs (and as things mature the examples will mirror their
production catalogs). The various recommendations can be viewed in the
[Static Catalog Recommendations](static-recommendations.md) document. Some of these will likely
evolve to be requirements, or at least documented specification options and extensions.