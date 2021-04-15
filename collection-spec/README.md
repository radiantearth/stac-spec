# STAC Collection Specification

A STAC [Collection](collection-spec.md) object is used to describe a group of related 
Items. It builds on fields defined for a [Catalog](../catalog-spec/catalog-spec.md) object
by further defining and explaining logical groups of [Items](../item-spec/item-spec.md). A
Collection can have parent Catalog and Collection objects, as well as child Item, Catalog, 
and Collection objects. These parent-child relationships among objects of these types, as there is no 
subtyping relationship between the Collection and Catalog types, even through they share field names.

A Collection provides a flexible mechanism to provide additional metadata about a set of Items.  
Generally, is used to describe a set of assets that 
are defined with the same properties and share higher-level metadata. There is no 
standardized name for this sort of logical grouping, but other places it is called a "
dataset series" (ESA, ISO 19115), "collection" (CNES, NASA), "dataset" (JAXA), or "product"
(JAXA). In GIS terms, the Items are
'[features](https://en.wikipedia.org/wiki/Simple_Features)' (that link to assets) and 
a Collection is the 'layer'. STAC uses the same terms as the
[OGC Features API](https://ogcapi.ogc.org/features/). A STAC Collection is a valid 
[Feature API Collection](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#example_4), 
extending it with additional fields.

Thus, the additional fields in a Collection detail the type of information a user would want to 
know about the group of Items it contains. Items are required to provide a link back to their 
collection definition. But the Collection is independent of STAC Items and STAC Catalogs, and thus 
other parties can also use this specification standalone, as a way to describe collections in a 
lightweight way. For more details on how the STAC specs fit together see the [overview](../overview.md) 
document. 

## In this directory

**Specification:** The main STAC Collection specification is in *[collection-spec.md](collection-spec.md)*.
It includes an overview and in depth explanation of the 
structures and fields.

**Schemas:** The schemas to validate the STAC Collection definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[collection.json](json-schema/collection.json)*.

## Collection Flexibility

STAC Collections are defined for flexibility. They only require a handful of fields, and
implementors are free to add most any JSON field or object that they want via extensions.
This flexibility and extensibility is a design goal, so that it is quite easy to implement
a collection and be able to adapt it to most any data model.

Implementors are encouraged to do what makes sense for them, and to check out the [examples](../examples/) and 
[other implementations](https://stacindex.org/catalogs) for current best practices.
