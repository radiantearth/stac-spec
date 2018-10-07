# STAC Datasets

[Items](https://github.com/radiantearth/stac-spec/item-spec/) are focused on search within a dataset*. Another topic of 
interest is the search of datasets, instead of within a dataset. The Dataset Spec is independent of Items and 
[Catalogs](../catalog-spec/). STAC Items are *strongly recommended* to provide a link to a dataset definition. Other parties 
can also  use this spec standalone, as a way to describe datasets in a lightweight way. Datasets are defined in full in the 
Dataset Specification.

The Dataset Spec is a set of JSON fields to describe a set of `Item`s in a `Catalog`, to help enable discovery. It builds on 
the [Catalog Spec](../catalog-spec/), using the flexible structure specified there to further define and explain logical 
groups of `Item`s. It shares the same fields and therefore every Dataset is also a valid Catalog - the JSON structure extends
the core Catalog definition. Datasets can have both parent Catalogs and Datasets and child Items, Catalogs and Datasets. 

*\* There is no standardized name for the concept we are describing here, a set of assets that are defined with the same 
properties and share higher level metadata. Others called it: dataset series (ISO 19115), collection (CNES, NASA), dataset 
(JAXA), dataset series (ESA), product (JAXA).*

## In this directory

**The Specification:** The main Dataset specification is in *[dataset-spec.md](dataset-spec.md)*. It includes an overview and in depth explanation of the 
structures and fields.

**Examples:** For samples of how Datasets can be implemented the *[examples/](examples/)* folder contains a sample dataset. 

**Schemas:** The schemas to validate the core `Dataset` definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[dataset.json](json-schema/dataset.json)*.


## Schema Validation

Instruction on schema validation for STAC Items can be found in the [validation instructions](validation/README.md).

## Dataset Flexibility

STAC Datasets are defined for flexibility. They only require a handful of fields, and
implementors are free to add most any JSON field or object that they want via extensions. This is a design goal, so
that it is quite easy to implement a dataset and be able to adapt it to most any data model.

But it is expected that some more firm recommendations and even requirements will emerge, so that clients will be able to glean
more meaningful information. In the meantime implementors are encouraged to do what makes sense for
them, and to check out the [examples](examples/) and [other implementations](../implementations.md) for emerging best practices.

## Dataset Evolution 

The Dataset specification is maturing, but it is still relatively early days. As real world
implementations innovate in different ways, we will update the core fields to handle.

The goal of the Dataset spec is not to reinvent the wheel by making yet another set of fields for metadata. The hope is to 
align with the latest efforts of the Open Geospatial Consortium, particularly their work around WFS 3 and hopefully CSW 4. 
Indeed the field names are chosen to fully align with WFS 3, so a WFS 3 `collections/{collectionId}` endpoint can return
a valid STAC Dataset that is also valid for their response.

Effort will also be made to align with Dublin Core and [DCAT](https://www.w3.org/TR/vocab-dcat/), though it is likely to
start using it as a microformat in STAC Browser HTML output to start. But future iterations could align with a JSON-LD DCAT
recommendation.

The immediate goal is to just be a simple explanation of fields to describe a dataset, and as the spec evolves it will look to
continually align with other efforts. Indeed it could make sense in the future to just 'use' another spec by subsetting it 
and explaining it. But nothing was found that exactly matched the needs of STAC to keep things very approachable to developers.
