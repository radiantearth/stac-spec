# STAC Collections

The STAC [Collection specification](collection-spec.md) provides JSON fields to describe a set of Items, to help enable discovery. 
It builds on the [Catalog Specification](../catalog-spec/catalog-spec.md), using the flexible structure detailed there to 
further define and explain logical groups of [Items](../item-spec/item-spec.md). It shares the same fields and therefore every 
Collection is also a valid Catalog - the JSON structure extends the core Catalog definition. Collections can have both parent Catalogs 
and Collections as well as child Items, Catalogs and Collections. 

The Collection concept can be used very flexibly - it just provides additional metadata about a set of Items. But it generally
is used to describe a set of assets that are defined with the same properties and share higher level metadata. There is no standardized 
name for this, and others called it: dataset series (ESA, ISO 19115), collection (CNES, NASA), dataset (JAXA), product (JAXA). Or
viewed in GIS terms, the Items are '[features](https://en.wikipedia.org/wiki/Simple_Features)' (that link to assets) and a 
Collection is the 'layer'. STAC uses the same terms as the [OGC Features API](https://ogcapi.ogc.org/features/), and indeed
a STAC Collection is a valid [Feature API Collection](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#example_4), extending
it with additional fields.

Thus the additional fields in a Collection detail the type of information a user would want to know about the set of Items it
contains. Items are required to provide a link back to their collection definition. But the Collection is independent of STAC Items and 
STAC Catalogs, and thus other parties can also use this specification standalone, as a way to describe collections in a lightweight way. 
For more details on how the STAC specs fit together see the [overview](../overview.md) document. 

## In this directory

**The Specification:** The main STAC Collection specification is in *[collection-spec.md](collection-spec.md)*. It includes an overview and in depth explanation of the 
structures and fields.

**Schemas:** The schemas to validate the STAC Collection definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[collection.json](json-schema/collection.json)*.

## Collection Flexibility

STAC Collections are defined for flexibility. They only require a handful of fields, and
implementors are free to add most any JSON field or object that they want via extensions. This flexibility and extensibility is a design goal, so that it is quite easy to implement a collection and be able to adapt it to most any data model.

Implementors are encouraged to do what makes sense for them, and to check out the [examples](../examples/) and 
[other implementations](https://stacindex.org/catalogs) for current best practices.
