# STAC Examples

This directory contains various examples for all parts of the STAC specification. It is structured to be a valid STAC, meaning
it should successfully load in various tools. It does not follow *all* the [best practices](../best-practices.md) for STAC, mostly
due to the fact that it's a necessarily contrived example to show the spec, and to do it in github. But we note below where it differs
from an ideal catalog.

The various fields are all fictional, to be able to demonstrate the various aspects of the spec as tersely as possible. To get a sense
of real world STAC implementations we recommend exploring the [stac-examples](http://github.com/stac-utils/stac-examples) repo, which 
gathers in one place copies of STAC Items and Collections from a number of different production catalogs that all follow good STAC
practices. And you should also explore the various catalogs listed on [STAC Index](http://stacindex.org), to see full catalogs in production.

## Organization

TODO: Describe the structure and what each example represents

extended-item - all extension fields
collectionless-item - demonstrate the common metadata that is only used when an Item does not have a collection. It is recommended to organize items in collections, but we wanted to show how this works. 

Notes - remotedata.io has not been set up, so any of those links will not work. At some point we might try to populate it so everything truly works. 

rd: prefix doesn't have a schema. We should make one and then put it in a location where it can be downloaded to demonstrate how that works.

## Best Practices differences

TODO: Describe how this differs from best practices. Especially discussion of rel vs absolute links, self links, etc.

TODO: Keep the self links in the files up to date with the tags, so that they work.





