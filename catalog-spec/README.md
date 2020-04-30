# STAC Catalogs

While a [STAC Item](../item-spec/item-spec.md) is the atomic unit of a SpatioTemporal Asset Catalog,
the Catalog JSON definition is the core structure that enables browsers and crawlers to access
the sets of Items. A Catalog consists of links to other Catalogs and Items, and can include
additional metadata to further describe its holdings. It is defined in full in the 
[STAC Catalog Specification](catalog-spec.md).

While STAC Catalogs mostly describe a structure of links and Items, a key related specification is the [STAC Collection Specification](../collection-spec/),
which extends Catalogs with additional fields to further describe the set of Items in a Catalog. STAC Collections share the same 
fields with Catalogs and therefore every Collection is also a valid Catalog.

Catalogs are designed so that a simple file server on the web or object store like Amazon S3 can store JSON that defines a 
full Catalog. More dynamic services can also return a Catalog structure, and the [STAC API](https://github.com/radiantearth/stac-api-spec)
specification contains an OpenAPI definition of the standard way to do this, at the `/` endpoint. 

## In this directory

**The Specification:** The main Catalog specification is in *[catalog-spec.md](catalog-spec.md)*.
It includes in depth explanation of the structures and fields.

**Examples:** For samples of how Catalogs can be implemented the *[examples/](examples/)* folder
contains a full sample catalog. 

**Schemas:** The schemas to validate the core Catalog definition are found in the *[json-schema/](json-schema/)* folder.
The primary one is *[catalog.json](json-schema/catalog.json)*.

## Schema Validation

Instruction on schema validation for STAC Catalog can be found in the [validation instructions](../validation/README.md).

## Catalog Evolution 

The Catalog specification is maturing, but it is still relatively early days. The core of Catalog has been defined very
narrowly, to just describe a structure that can be followed by people or machines, so most additional functionality will
be defined in additional specifications and extensions. The only anticipated changes to the core of Catalog are to add in
additional extension mechanisms for others to use.
