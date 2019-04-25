# STAC API

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns STAC [Catalogs](../catalog-spec/README.md), [Collections](../collection-spec/README.md), or [Items](../item-spec/README.md), depending on the endpoint. Catalogs and Collections are JSON, while Items are GeoJSON Features (single Item) or Feature Collections (multiple Items returned from a search).

A STAC API is a [Web Feature Service 3 (WFS3) API](https://github.com/opengeospatial/WFS_FES), in that WFS3 defines many of the endpoints that STAC uses. A STAC API should be compatible and usable with WFS3 clients. However, WFS3 is still under development and while STAC tries to stay in sync with WFS3 developments, there may be discrepencies prior to final versions of both specifications.

## In this directory

**The Specification:** The main definition of the STAC API specification is in the *[api-spec.md](api-spec.md)* file. It includes an overview and in depth explanation of the REST endpoints and parameters.

**Extensions:** API Extensions are given in the *[extensions](extensions/)* folder. YAML fragments are provided for each extension with details provided in the *[README](extensions/README.md)*.

**Examples:** For samples of how the STAC API can be queries, see the *[examples/](examples/)* folder.

**Schemas:** The API is described by the OpenAPI specification documents in the *[openapi](openapi/)* folder.

## Schemas (OpenAPI definitions)

The definitive specification for STAC is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is contained within several YAML files in the [definitions](definitions/) and [extensions](extensions/) directories.

In the definitions directory there are two files: WFS3.yaml and STAC.yaml. The WFS3.yaml file is the WFS3 OpenAPI definition **as currently used by STAC**. The STAC.yaml file contains additional endpoints and components that STAC uses, which is treated as a WFS3 extension. A basic STAC implementation would implement both the WFS3 and STAC specifications.

The YAML files in the extensions dolder are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document, and must be merged with a complete OpenAPI document to be usable. This way extensions can be kept separate, and implementors can combine just the extensions they want to use in order to create a custom OpenAPI document that can be used to generate docuemntation.

Editing should be done on the files in the definitions/ and extensions/ directories, *not* the `STAC-core.yaml` and `STAC-full.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs to overwrite the files:

```
$ npm install
$ npm run generate-all
```

Create your own OpenAPI document by combinining the definitions and extensions you want by creating a `myapi.merge.yaml` file. This file should contain a line indicating the files that need to be merged:

```
!!files_merge_append ["STAC-core.yaml", "extensions/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```
$ npm install
$ yaml-files myapi.merge.yaml myapi.yaml
```

## API Evolution

The STAC API is still a work in progress. It currently tries to adhere to the WFS3 API specification, with some STAC specific extensions, but WFS3 is also evolving and not finalized.

The core API is defined in the OpenAPI document *[STAC-core.yaml](STAC-core.yaml)*, and will only change upon changes to WFS3. The OpenAPI fragments in the *(extensions)[extensions/]* folder are WFS3 extensions specific to STAC, and may change depending on chnages in WFS3 or the STAC specification.

The evolution of the STAC Item spec will take place in this repository, primarily informed by the real world implementations that people create. The goal is for the core API spec to remain quite small and stable, with most all the evolution taking place in extensions. Once there is a critical mass of implementations utilizing different extensions the core Item spec will lock down to a 1.0.