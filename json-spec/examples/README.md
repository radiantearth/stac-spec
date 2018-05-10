# STAC JSON Examples

## Overview

This directory contains a number of more 'real world' examples of how a STAC `Item` could be implemented. As of right
now none of these are actual production implementations - they are more adaptations of current catalogs to the STAC
specifications. In time these will evolve to be examples of truly real world implementations.

This document also contains discussion of the various examples in this folder.

## In this directory

**DigitalGlobe** The [DigitalGlobe sample](digitalglobe-sample.json) is taken from the proposed DigitalGlobe static catalog
[pull request](https://github.com/radiantearth/stac-spec/pull/33), with minor field updates to validate against the the 
stac-item specification.

**Landsat8** The [Landsat8 sample](landsat8-sample.json) is meant to be an example of how an S3-based catalog like the 
[Landsat on AWS](https://landsatonaws.com/) public data set could be a STAC static catalog. It includes the 'collection'
concept, which is explained more in the [/extensions/examples/ folder](../extensions/examples/).

**NAIP** The [NAIP sample](naip-sample.md) is a similar example to Landsat8, but focused on the NAIP dataset, which 
is a bit different as it's aerial imagery instead of satellites. It demonstrates a few different patterns of how
an implementation can be approached.

**Planet** The [Planet sample](planet-sample.md) is an adaption of Planet's [Data API](https://www.planet.com/docs/reference/data-api/) 
returned JSON, with minor tweaks to have it fit in to a STAC Item.


## Example Discussion

These examples demonstrate that there is a range of potential implementations of STAC `Item`s. Most were made by adapting
the current implementations as minimally as possible. The hope is that there will emerge more consensus and best practices
on the things outside of the core fields, to increase interoperability. 

### Static Catalogs vs Catalog APIs

The Planet example is likely the least 'static' of the examples, as it was taken from Planet's Data API and just added on a
few fields. DigitalGlobe's made a bit more changes to make it static, but still has that lineage. Landsat8 and NAIP are
primarily made thinking about how they are laid out on Amazon Web Services.

Catalog API's will tend to have more absolute links, while the static examples tend more towards relative links, representing
actual files that are next to them. Planet's API shows a set of 'activation' assets that present a workflow to enable the
data to be downloaded. This is not a desired end-state - ideally the data is more readily available in a Catalog API, or at least
has a better workflow - but it shows how the asset field can be adapted.

### Asset definition

Currently the additional metadata on assets is quite minimal - only a link is required, and 'name' is the only other specified
field. Some of the examples use the name, some just use their own convention. DigitalGlobe defines its bands in properties,
while Landsat8 and Planet contain a demonstration of how they could reference a 'Product' definition that's more at the catalog
level (though each Item could theoretically define its own product as well).

### Permissions

The Planet example has some small bits about 'permissions'. The DigitalGlobe catalog would have similar concerns. The core idea
would be that assets should provide links to the data, even if a user doesn't have permissions to actually access the data.

### Prefixes

The Landsat and NAIP examples show an idea of using 'prefixes' like *eo:* or *l8:* to help differentiate metadata fields that
would be validated by different schemas. EO could be a shared earth observation schema. Using prefixes could also help point the 
way towards JSON-LD type validation.









