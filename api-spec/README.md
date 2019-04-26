# STAC API

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns STAC [Catalogs](../catalog-spec/README.md), [Collections](../collection-spec/README.md), or [Items](../item-spec/README.md), depending on the endpoint. Catalogs and Collections are JSON, while Items are GeoJSON Features (single Item) or a Feature Collections (multiple Items returned from a search).

The API is a [Web Feature Service 3 (WFS3) API](https://github.com/opengeospatial/WFS_FES), in that WFS3 defines many of the endpoints that STAC uses. A STAC API should be compatible and usable with WFS3 clients. However, WFS3 is still under development and while STAC tries to stay in sync with WFS3 developments, there may be discrepencies prior to final versions of both specifications.

## In this directory

**The Specification:** The main definition of the STAC API specification is in the *[api-spec.md](api-spec.md)* file. It includes an overview and in depth explanation of the REST endpoints and parameters.

**Extensions:** API Extensions are given in the *[extensions](extensions/)* folder. YAML fragments are provided for each extension with details provided in the *[README](extensions/README.md)*.

**Examples:** For samples of how the STAC API can be queried, see the *[examples.md](examples.md)* file.

**Schemas:** The API is described by the OpenAPI specification documents in the *[openapi](openapi/)* folder.

## Schemas (OpenAPI definitions)

The definitive specification for STAC is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is contained within several YAML files in the *[openapi-schema](openapi-schema/)* and *[extensions](extensions/)* directories.

In the openapi-schema directory there are three files

- WFS3.yaml - The WFS3.yaml file is the WFS3 OpenAPI definition **as currently used by STAC**
- STAC.yaml - Contains additional endpoints and components that STAC uses, which is treated as a WFS3 extension
- STAC.merge.yaml - A file referencing the above two used to create the final *[STAC.yaml](../STAC.yamnl)* schema

A basic STAC implementation implements both the WFS3 and STAC schemas.

The YAML files in the *[extensions](extensions/)* folder are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document, and must be merged with a complete OpenAPI document to be usable. This way extensions can be kept separate, and implementors can combine just the extensions they want to use in order to create a custom OpenAPI document they can use.

Editing should be done on the files in the openapi-schema/ and extensions/ directories, *not* the `STAC.yaml` and `STAC+extensions.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs to overwrite the files:

```
$ npm install
$ npm run generate-all
```

Create your own OpenAPI document by combinining the STAC schema with the extensions you want by creating a `myapi.merge.yaml` file. This file should contain a line indicating the files that need to be merged:

```
!!files_merge_append ["STAC.yaml", "extensions/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```
$ npm install
$ yaml-files myapi.merge.yaml myapi.yaml
```

## API Evolution

The STAC API is still a work in progress. It currently tries to adhere to the WFS3 API specification, with some STAC specific extensions, but WFS3 is also evolving and not finalized. The WFS3 portion of the API is provided in the *[WFS3.yaml](openapi-schema/WFS3.yaml)* and represents the version of WFS3 that is currently being used by STAC. It may be out of date with the *[WFS3](https://github.com/opengeospatial/WFS_FES)* spec at any given time.

The evolution of the STAC Item spec will take place in this repository, primarily informed by the real world implementations that people create. The goal is for the core API spec to remain quite small and stable, with most all the evolution taking place in extensions. Once there is a critical mass of implementations utilizing different extensions the core API spec will lock down to a 1.0.