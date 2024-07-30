# STAC Item Specification

The [STAC Item](item-spec.md) object is the most important object in a STAC system. An
**Item** is the entity that contains metadata for a scene and links to the assets. 

Item objects are the leaf nodes for a graph of [Catalog](../catalog-spec/catalog-spec.md) 
and [Collection](../collection-spec/collection-spec.md) objects. See the 
[overview](../overview.md) document for more information about how these objects relate 
to each other.

## In this directory

**Specification:** The STAC Item specification is in 
*[item-spec.md](item-spec.md)*. It includes an overview and an in-depth explanation of the fields.

**Schemas:** The OpenAPI specification in *[item.json](json-schema/item.json)* 
defines an **Item** object. The [basics](json-schema/basics.json), 
[datetime](json-schema/datetime.json), [instrument](json-schema/instrument.json), 
[licensing](json-schema/licensing.json), and [provider](json-schema/provider.json)
schemas validate additional fields defined in *[Common Metadata](common-metadata.md)*.

**Common Metadata:** A set of commonly-used fields for STAC Items is listed in 
*[common-metadata.md](common-metadata.md)*.

> \[!NOTE]
> In cases where a set of Items is grouped together (e.g. for providing search results),
> the [ItemCollection](https://github.com/radiantearth/stac-api-spec/blob/main/fragments/itemcollection/README.md)
> object has been defined in the STAC API specification.
> 
> Similarly to the relationship between a GeoJSON Feature and a STAC Item,
> a STAC ItemCollection should be a valid GeoJSON [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3)
> to allow interoperability with existing tools that support GeoJSON.
