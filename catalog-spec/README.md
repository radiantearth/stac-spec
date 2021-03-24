# STAC Catalog Specification

A STAC [Catalog](catalog-spec.md) is a top-level object that logically groups other Catalog, Collection, 
and [Item](../item-spec/item-spec.md) objects.  A Catalog contains an array of Link objects to these other 
objects and can include additional metadata to describe the objects contained therein. It is defined in full 
in the [STAC Catalog Specification](catalog-spec.md).

For more information on how the parts of STAC fit
together see the [overview](../overview.md) document

A Catalog is typically the "entry point" into a STAC object hierarchy. For example, the root endpoint ("landing page") of a STAC API implementation is a Catalog. For many static STAC catalogs (e.g., those defined only by a set of files on disk or in a cloud object store), the root URL points to a Catalog that acts as the starting point to traverse the entire catalog of Catalog, Collection, and Item objects. 

What's the diff between a Catalog and Collection?

While STAC Catalogs mostly describe a structure of links and Items, a key related specification is the [STAC Collection Specification](../collection-spec/collection-spec.md),
which extends Catalogs with additional fields to further describe the set of Items in a Catalog. 

A STAC Catalog requires a subset of the fields required by a Collection. These are distinguished from one another by the `type` field, which will have the value `Catalog` or `Collection`.  This means that a Collection can be changed to a Catalog simply by changing this `type` field. 

Catalogs are designed so that a simple file server on the web or object store like Amazon S3 can store JSON that defines a 
full Catalog. More dynamic services can also return a Catalog structure, and the [STAC API](https://github.com/radiantearth/stac-api-spec)
specification contains an OpenAPI definition of the standard way to do this, at the `/` endpoint. 

## In this directory

**Specification:** The main Catalog specification is in *[catalog-spec.md](catalog-spec.md)*.
It includes in depth explanation of the structures and fields.

**Schemas:** The schemas to validate the core Catalog definition are found in the *[json-schema/](json-schema/)* folder.
The primary one is *[catalog.json](json-schema/catalog.json)*.

## Catalog Evolution 

The Catalog specification is maturing, but it is still relatively early days. The core of Catalog has been defined very
narrowly, to just describe a structure that can be followed by people or machines, so most additional functionality will
be defined in additional specifications and extensions. The only anticipated changes to the core of Catalog are to add in
additional extension mechanisms for others to use.
