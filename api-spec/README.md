# STAC API

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns a STAC [Catalog](../catalog-spec/catalog-spec.md), [Collection](../collection-spec/collection-spec.md), [Item](../item-spec/item-spec.md), or [ItemCollection](../item-spec/itemcollection-spec.md), depending on the endpoint. Catalogs and Collections are JSON, while Items and ItemCollections are GeoJSON-compliant entities with foreign members.  Typically, a Feature is used when returning a
single Item, and FeatureCollection when multiple Items (rather than a JSON array of Item entities).

The API is a *[OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html)* (formerly known as *OGC Web Feature Service 3*), in that it defines many of the endpoints that STAC uses. A STAC API should be compatible and usable with OGC API - Features clients.

## In this directory

**The Specification:** The main description of the STAC API specification is in the *[api-spec.md](api-spec.md)* file. It includes an overview and in depth explanation of the REST endpoints and parameters.

**Extensions:** API Extensions are given in the *[extensions](extensions/)* folder. YAML fragments are provided for each extension with details provided in the *[README](extensions/README.md)*.

**Examples:** For samples of how the STAC API can be queried, see the *[examples.md](examples.md)* file.

**API Definitions:** The API is described by the OpenAPI documents in the *[openapi](openapi/)* folder. Human-readable versions of the OpenAPI definitions can be viewed online for the last release:
* [Only the core STAC API](https://stacspec.org/STAC-api.html) 
* [STAC API including all extensions](https://stacspec.org/STAC-ext-api.html)

## OpenAPI definitions

The definitive specification for STAC API is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is contained within several YAML files in the [openapi](openapi/) and [extensions](extensions/) directories.

These are built into the definitive core API specification at [STAC.yaml](STAC.yaml), which can be viewed online at 
[https://stacspec.org/STAC-api.html](https://stacspec.org/STAC-api.html). An additional OpenAPI definition is provided at 
[STAC-extensions.yaml](STAC-extensions.yaml) that includes all the optional extensions, and can be browsed online at
[https://stacspec.org/STAC-ext-api.html](https://stacspec.org/STAC-ext-api.html).

In the [openapi](openapi/) directory there are three files

- OAFeat.yaml - The OAFeat.yaml file is the OGC API - Features OpenAPI definition as currently used by STAC API.
- STAC.yaml - Contains (1) additional STAC-specific endpoints that STAC APIs expose and (2) extensions and concretization to OGC API - Features that STAC APIs require.
- STAC.merge.yaml - A file referencing the above two used to create the final [STAC.yaml](STAC.yaml) definition.

A basic STAC implementation implements both the OGC API - Features and STAC definitions.

The YAML files in the [extensions](extensions/) folder are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document, and must be merged with a complete OpenAPI document to be usable. This way extensions can be kept separate, and implementors can combine just the extensions they want to use in order to create a custom OpenAPI document they can use.

Editing should be done on the files in the [openapi](openapi/) and [extensions](extensions/) directories, *not* the `STAC.yaml` and `STAC-extensions.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs to overwrite the files:

```
npm install
npm run generate-all
```

You can also dynamically serve a human-readable version of your edited files at `http://127.0.0.1:8080` using the following commands:
* Only the core STAC API:
  ```
  npm install
  npm run serve
  ```
* The STAC API including all extensions:
  ```
  npm install
  npm run serve-ext
  ```

Create your own OpenAPI document by combining the STAC definition with the extensions you want by creating a `myapi.merge.yaml` file. This file should contain a line indicating the files that need to be merged:

```
!!files_merge_append ["STAC.yaml", "extensions/query/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```
npm -g install
yaml-files myapi.merge.yaml myapi.yaml
```

The commands above require root/administrator level access to install the npm packages globally. If you do not have the required permissions or do not want to install the packages globally for any other reason check the npm documentation for your platform for instructions to install and run local packages. Unix bash users for instance may use:

```
npm install
$(npm bin)/yaml-files myapi.merge.yaml myapi.yaml
```

## API Evolution

The STAC API is still a work in progress. It currently tries to adhere to the OGC API - Features (OAFeat) specification, with some STAC specific extensions.
The OAFeat portion of the API is provided in the *[OAFeat.yaml](openapi/OAFeat.yaml)* and represents the version of OAFeat that is currently being used by STAC.
It may diverge some with the *[OAFeat](https://github.com/opengeospatial/ogcapi-features)* spec at any given time, either out of date or 'ahead', with proposals to align OAFeat.
The long term goal is for STAC's API and OAFeat to completely align, ideally all of STAC API is made from OAFeat plus its extension ecosystem, and STAC just focuses on the content.
But until then STAC will work to bring practical implementation experience to OAFeat. 

The evolution of the STAC Item spec will take place in this repository, primarily informed by the real world implementations that people create. The goal is for the core API spec to remain quite small and stable, with most all the evolution taking place in extensions. Once there is a critical mass of implementations utilizing different extensions the core API spec will lock down to a 1.0.
