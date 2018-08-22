# STAC JSON Spec

## Overview

The core of a SpatioTemporal Asset Catalog (STAC) is set of JSON fields defined by the [STAC json spec](json-spec.md).
These define an `Item` of a catalog, which can be served up in static or dynamic catalogs. 

## In this directory


**The Specification:** The main definition of the STAC JSON specification is in *[json-spec.md](json-spec.md)*. It includes an 
overview and in depth explanation of the fields.

**Samples:** Two json `Item` files are included - *[sample.json](sample.json)* for a minimal example, as well as 
*[sample-full.json](sample-full.json)* for a more fleshed example that contains a number of current best practices. See below
for addition discussion of the samples.

**Additional Examples:** For more samples of how STAC Items can be implemented the *[examples/](examples/)* folder contains
a number of real world examples. See the [readme](examples/README.md) for additional discussion of the examples.

**Schemas:** The schemas to validate the core `Item` definition are found in the *[json-schema/](json-schema/)* folder. 
The primary one is *[stac-item.json](json-schema/stac-item.json)*, and it also includes the necessary *[geojson.json](json-schema/geojson.json)*
schema definition, which is a dependency.

**Schema Validation:** The *[package.json](package.json)* file defines packaging for node.js NPM module installation to do
actual schema valiadtion. The instructions are below.

## Sample Discussion

The first sample, **[sample.json](sample.json)** is the most minimal possible compliant `Item` record. Most all data will
include additional fields, as STAC is designed to be a minimal common subset. But it is useful for showing exactly what is
required.

The second one, **[sample-full.json](sample-full.json)** is a more realistic example, for a hypothetical analytic image 
acquisition from a satellite company called 'cool sat'. It includes additional fields, including some from the Earth 
Observation extension, as well as some vendor specific additions. It also links to a variety of assets that is typical for
satellite imagery, as most providers include a number of complementary files.

## Schema Validation

Any JSON Schema validation tool can be used, just run the json data to test against the stac-item.json schema, and be sure to
include geojson.json schema in the testing. 

This directory includes installation instructions for a javascript validator, the following shows how to use it.

### Initialization

In this directory run:

```bash
npm install
```
This installs node.js validation modules, in a node_modules directory created in this directory.

### Validation

To run the validation call the ajv binary in the newly created folder:

```bash
node_modules/.bin/ajv validate -s json-schema/stac-item.json -r json-schema/geojson.json -d sample.json --verbose
node_modules/.bin/ajv validate -s json-schema/stac-item.json -r json-schema/geojson.json -d examples/landsat8-sample.json --verbose
```

These should return as valid. The same validate command can be used for any other sample data.

**Warning** - Not all validation is fully complete. The validator does not yet check for self links. The href checking is probably
too loose right now, it just checks for a string, see the 'relative vs absolute links' section above for reasons why. 


## Static Catalog Evolution 

STAC Items are still a work in progress, and feedback is very much appreciated. The core fields were designed to be 
quite flexible, adapting to many different data organization schemes. Organizations are encouraged to adapt 
the core fields to their needs, finding any limitations that would need to be addressed the specification.

Implementors are encouraged to publish their implementations, ideally contributing to the examples folder.
This will enable a spreading of best practices, and it is hoped that additional specification extensions can
become best practices or their own specifications.

There is also interest in representing additional domain-specific information. The core STAC fields were
made to be flexible to a variety of assets. But there is a lot of value in shared fields that may not apply
to every STAC data type, but are shared by a certain domain. There is a just released 'extension' for
Earth Observation, see the [extensions/](../extensions/) folder in the top directory for a set of recommended
fields if you are providing earth observation data.

### Recommendations

The evolution of the STAC JSON spec will take place in this repository, primarily informed by the 'examples' folder. 
This will show how a variety of providers at least could represent their catalogs in STAC static catalogs 
(and as things mature the examples will mirror their production catalogs). The various recommendations can 
be viewed in the **TODO** [recommendations](recommendations.md) document. Some of these will likely
evolve to be requirements, or at least documented specification options and extensions. 






