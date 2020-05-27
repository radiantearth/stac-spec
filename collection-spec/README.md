# STAC Collections

[STAC Items](../item-spec/README.md) are focused on search within a collection*. Another topic of 
interest is the search of collections, instead of within a collection. The [STAC Collection specification](collection-spec.md)
is independent of STAC Items and 
[STAC Catalogs](../catalog-spec/README.md). Items are required to provide a link back to their collection definition. Other parties 
can also use this specification standalone, as a way to describe collections in a lightweight way.

The STAC Collection specification is a set of JSON fields to describe a set of Items in a STAC Catalog, to help enable discovery. It builds on 
the [Catalog Spec](../catalog-spec/README.md), using the flexible structure specified there to further define and explain logical 
groups of Items. It shares the same fields and therefore every Collection is also a valid Catalog - the JSON structure extends
the core Catalog definition. Collections can have both parent Catalogs and Collections and child Items, Catalogs and Collections. 

*\* There is no standardized name for the concept we are describing here, a set of assets that are defined with the same 
properties and share higher level metadata. Others called it: dataset series (ESA, ISO 19115), collection (CNES, NASA), dataset (JAXA), product (JAXA).*

## In this directory

**The Specification:** The main STAC Collection specification is in *[collection-spec.md](collection-spec.md)*. It includes an overview and in depth explanation of the 
structures and fields.

**Examples:** For samples of how Collections can be implemented the *[examples/](examples/)* folder contains a sample collection. 

**Schemas:** The schemas to validate the STAC Collection definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[collection.json](json-schema/collection.json)*.

## Schema Validation

Instruction on schema validation for STAC Items can be found in the [validation instructions](../validation/README.md).

## Collection Flexibility

STAC Collections are defined for flexibility. They only require a handful of fields, and
implementors are free to add most any JSON field or object that they want via extensions. This flexibility and extensibility is a design goal, so that it is quite easy to implement a collection and be able to adapt it to most any data model.

But it is expected that some more firm recommendations and even requirements will emerge, so that clients will be able to glean more meaningful information. In the meantime implementors are encouraged to do what makes sense for them, and to check out the [examples](examples/) and [other implementations](https://stacspec.org/#examples) for emerging best practices.

## Collection Evolution 

The Collection specification is maturing, but it is still relatively early days. As real world
implementations innovate in different ways, we will update the core fields to handle.

The goal of the Collection spec is not to reinvent the wheel by making yet another set of fields for metadata. The hope is to 
align with the latest efforts of the Open Geospatial Consortium, particularly their work around OGC API - Features (OAFeat) and hopefully OGC API - Catalogue. 
Indeed the field names are chosen to fully align with OAFeat, so a OAFeat `collections/{collectionId}` endpoint can return
a valid STAC Collection that is also a valid OAFeat Collection.

Effort will also be made to align with Dublin Core and [DCAT](https://www.w3.org/TR/vocab-dcat/), though it is likely to
start using it as a microformat in STAC Browser HTML output to start. But future iterations could align with a JSON-LD DCAT
and/or [GeoDCAT](https://github.com/SEMICeu/GeoDCAT-AP) recommendation.

The immediate goal is to just be a simple explanation of fields to describe a collection, and as the spec evolves it will look to
continually align with other efforts. Indeed it could make sense in the future to just 'use' another spec by subsetting it 
and explaining it. But nothing was found that exactly matched the needs of STAC to keep things very approachable to developers.
