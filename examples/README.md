# STAC Examples

This directory contains various examples for all parts of the STAC specification. It is structured to be a valid STAC, meaning
it should successfully load in various tools. It does not follow *all* the [best practices](../best-practices.md) for STAC, mostly
due to the fact that it's a necessarily contrived example to show the spec, and to do it in github. But we note below where it differs
from an ideal catalog.

The various fields are mostly fictional, to be able to demonstrate the various aspects of the spec as tersely as possible. To get a sense
of real world STAC implementations we recommend exploring the [stac-examples](http://github.com/stac-utils/stac-examples) repo, which 
gathers in one place copies of STAC [Items](../item-spec/item-spec.md) and [Collection](../collection-spec/collection-spec.md) 
from a number of different production catalogs that all follow good STAC practices. And you should also explore the various catalogs
listed on [STAC Index](http://stacindex.org), to see full catalogs in production.

## Organization

This directory contains two STAC implementations, both valid, but simplified a bit from following all the best practices. 

### Simple Collection

This STAC implementation consists of three files, all contained at the root of the examples directory

**[collection.json](collection.json)** is a minimal Collection, that links to three items. 

**[simple-item.json](simple-item.json)** is the most minimal possible compliant Item record. Most all data will
include additional fields, as STAC is designed to be a minimal common subset. But it is useful for showing exactly what is
required.

**[full-item.json](full-item.json)** is a more realistic example, for a hypothetical analytic image 
acquisition from a satellite company called 'Remote Data'. It includes additional fields covering the [common 
metadata](../item-spec/common-metadata.md). It also links to a variety of assets that is typical for
satellite imagery, as most providers include a number of complementary files.

**[extended-item.json](extended-item.json)** is arguably an even more realistic example, as it includes a number of the
[extensions](../extensions/) that are commonly used, to demonstrate how implementations tend to start with the core, and add in
a number of the core extensions. 

**[collectionless-item.json](collectionless-item.json)** demonstrates the common metadata that is only used when an Item does not have 
a collection. It is recommended to organize items in collections, but we wanted to show how this works. This is not technically in the
'simple collection', but it follows the same pattern, so is included here.

### Nested Catalog

This STAC implementation shows a common pattern, starting with a catalog that links to a number of distinct collections, which may
link down to a number of items.

**[catalog.json](catalog.json)** is a minimal catalog implementation, linking to two other collections.

**[collection-only/collection.json](collection-only/collection.json)** is a collection that does not link to any items. This
demonstrates how is is possible to make use of STAC Collections without needing items, to serve as nice summarizing metadata for 
tools that work with full layers / collections. This example collection is based on real Sentinel-2 values, so is not quite fictional,
but should be taken as just an example.

**[extensions-collection/collection.json](extensions-collection/collection.json)** contains a small number of items, that demonstrate
more functionality available in STAC [extensions](../extensions/). These are linked to directly from the individual extensions. These
items follow the recommendations for [Catalog Layout Best Practices](../best-practices.md#catalog-layout).

## In Depth

As mentioned above, the files in this examples directory form valid STAC implementations. They are all based on a 
fictional remote sensing company called 'Remote Data', with a URL at remotedata.io. This domain has not been set up, so those links
will not work, but any valid data provider should provide valid links to their homepage. 

The examples use the `rd:` prefix to show how providers can use custom fields when there are not set fields. In the examples these
do not link to a schema which is completely valid, but it is recommended that providers do write a JSON schema that can validate 
their custom fields (we will work to add a schema in the future). 

### Differences with STAC Best Practices

One of the most important documents in this repository is the one about [best practices](../best-practices.md). It describes a number
of practical recommendations gained by people actually implementing STAC. The core spec is designed to be as flexible as possible, so
that it is not too rigid and unable to handle unanticipated needs. But we recommend following as many of the best practices as is 
feasible, as it will help ensure various STAC tools work much better. The examples in this folder don't align with all the best
practices, mostly because they are meant to demonstrate things as tersely as possible, and also because they live directly inside
a github repository. As many people will look at these examples and take them as 'how things should be' we felt its important to
highlight where things here differ from the actual best practices.

#### Relative vs Absolute Links

One of the [main recommendations](../best-practices.md#use-of-links) of the best practices document is to aim for consistency in 
the use of relative versus absolute links. STAC implementations should use relative and absolute links as recommended by one of
the 'catalog types': '[self-contained](../best-practices.md#self-contained-catalogs)', or '[published](../best-practices.md#published-catalogs)' - absolute or relative. 

The catalogs contained here don't follow any of the recommendations in full. They are closest to a 'relative published catalog',
as they use a self link at the root and then mostly have relative links. This enables them to be mostly portable, while also having
a stable online location that can be referenced. But they use absolute links to their assets, due to the fact that they are stored in 
github and we do not want to replicate the large asset files in every branch in github. A true relative published catalog will only
have absolute links for the self, so that the rest is completely portable. 

#### Catalog Layout

Another important recommendations concerns the [layout of STAC catalogs](../best-practices.md#catalog-layout). This is important
for tools to be able to expect a certain layout, and most tools will follow the described layout. The simple collection that consists
of the collection.json and its 3 linked items violates this. This is done to be able to show item examples directly in the root of
the 'examples' folder, so people don't have to dig deep into folders to get a quick example. But a proper catalog layout would
put the items in sub-directories, along with their assets.
