# STAC ItemCollections

A STAC ItemCollection is a group of related [STAC Item](item-spec.md) entities. A primary use is for the results returned by the endpoints of a `/stac/search` endpoint.

## In this directory

**The Specification:** The main definition of the STAC ItemCollection specification is in 
*[itemcollection-spec.md](itemcollection-spec.md)*. It includes an overview and in depth explanation of the fields.

**Examples:** For samples of how STAC ItemCollections can be implemented the *[examples/](examples/)* folder 
contains a number of examples. See the [readme](examples/README.md) for additional 
discussion of the examples.

**Schemas:** The schemas to validate the core Item definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[itemcollection.json](json-schema/itemcollection.json)*.


## Schema Validation

Instruction on schema validation for STAC ItemCollections can be found in the [validation instructions](validation/README.md).
