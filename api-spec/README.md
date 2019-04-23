# STAC API

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns STAC [Catalogs](../catalog-spec/README.md), [Collections](../collection-spec/README.md), or [Items](../item-spec/README.md), depending on the endpoint. Catalogs and Collections are JSON, while Items are GeoJSON Features (single Item) or Feature Collections (multiple Items returned from a search).

## In this directory

** The Specification:** The main definition of the STAC API specification is in the *[api-spec.md](api-spec.md)* file. It includes an overview and in depth explanatiosn of the REST endpoints and parameters.

**Examples:** For samples of how the STAC API can be queries, see the *[examples/](examples/)* folder.

**Schemas:** The API is described by the OpenAPI specification documents in the *[openapi](openapi/)* folder.

## Schemas (OpenAPI definitions)

The definitive specification for STAC is the [OpenAPI](http://openapis.org/) 3.0 YAML document, which is available in several forms. The most straightforward for an implementor new to STAC is the [STAC-standalone.yaml](STAC-standalone.yaml).
This gives a complete service with the main STAC endpoint. See the [online documentation](https://app.swaggerhub.com/apis/cholmesgeo/STAC-standalone/) for the API rendered interactively.

The OpenAPI specification is contained within several YAML files in the [definitions](definitions/) and [extensions](extensions/) directories.

The YAML files are either complete OpenAPI documents that can be used as such (e.g., generating documentation with Swagger), or they are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document (such as to define an extension), and must be merged with a complete OpenAPI document to be usable.

This way extensions can be kept separate, and implementors can combine just the extensions they want to use in order to create a custom OpenAPI document that can be used to generate docuemntation.

### Updating the OpenAPI documents

Editing should be done on the files in the definitions/ and extensions/ directories, *not* the `STAC-core.yaml` and `STAC-full.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs with:

```
$ npm install
$ npm run generate-all
```

which will overwrite the files. 

### Creating your own OpenAPI document

Create your own OpenAPI document by combinining the definitions and extensions you want by creating a `myapi.merge.yaml` file. This file should contain a line indicating the files that need to be merged:

```
!!files_merge_append ["STAC-core.yaml", "extensions/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```
$ npm install
$ yaml-files myapi.merge.yaml myapi.yaml
```

The STAC API should be simple to implement and extensible. To support that goal, the extensions are broken out into fragments.
These fragments should allow an implementor to layer on additional functionality as needed.

We have structured our OpenAPI YAML files so that that can be joined together with `import` statements to prevent copying the
extensions into every possibly combination. In the [`api-spec` folder](.) you can expect to find complete OpenAPI definitions that are
useable as-is.

## API Evolution

The STAC API is still a work in progress. It currently tries to adhere to the WFS3 API specification, with some STAC specific extensions, but WFS3 is also evolving and not finalized.

The core API is defined in the OpenAPI document *[STAC-core.yaml](STAC-core.yaml)*, and will only change upon changes to WFS3. The OpenAPI fragments in the *(extensions)[extensions/]* folder are WFS3 extensions specific to STAC, and may change depending on chnages in WFS3 or the STAC specification.

The evolution of the STAC Item spec will take place in this repository, primarily informed by the real world implementations that people create. The goal is for the core API spec to remain quite small and stable, with most all the evolution taking place in extensions. Once there is a critical mass of implementations utilizing different extensions the core Item spec will lock down to a 1.0.