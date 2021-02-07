# STAC Examples

This directory contains various examples for all parts of the STAC specification. It is structured to be a valid STAC, meaning
it should successfully load in various tools. It does not follow *all* the [best practices](../best-practices.md) for STAC, mostly
due to the fact that it's a necessarily contrived example to show the spec, and to do it in github. But we note below where it differs
from an ideal catalog.

The various fields are all fictional, to be able to demonstrate the various aspects of the spec as tersely as possible. To get a sense
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

Notes - remotedata.io has not been set up, so any of those links will not work. At some point we might try to populate it so everything truly works. 

rd: prefix doesn't have a schema. We should make one and then put it in a location where it can be downloaded to demonstrate how that works.

## Best Practices differences

TODO: Describe how this differs from best practices. Especially discussion of rel vs absolute links, self links, etc.

TODO: Keep the self links in the files up to date with the tags, so that they work.

## Example Discussion

These examples demonstrate that there is a range of potential implementations of STAC Items. Most were made by adapting
the current implementations as minimally as possible. The hope is that there will emerge more consensus and best practices
on the things outside of the core fields, to increase interoperability. 

### Asset definition

Currently the additional metadata on assets is quite minimal - only a link is required. 'title' and 'type' are the only other specified
fields.

### Prefixes & Schemas

todo
