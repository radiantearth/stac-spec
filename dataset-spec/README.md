# Dataset Spec for STAC

## Introduction

One topic of interest has been the search of datasets*, instead of within a dataset, i.e. in (sub-)catalogs, items and assets. [STAC](https://github.com/radiantearth/stac-spec) is focused on search within a dataset, but it includes some simple constructs to catalog datasets. This could be an independent spec that STAC uses, and others can also independently use, to describe datasets in a lightweight way.

*\* There is no standardized name for the concept we are describing here. Others called it: dataset series (ISO 19115), collection (CNES, NASA), dataset (JAXA), dataset series (ESA), product (JAXA).*

## Core

| Element         | Type                                  | Name                            | Description                                                  |
| --------------- | ------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| id              | string                                | Dataset ID (required)           | Identifier for the dataset that is unique across the provider. MUST follow the pattern ` ^[A-Za-z0-9_\-\/]+$ `. TODO: Allow slash? |
| title           | string                                | Title                           | A short descriptive one-line title for the dataset.          |
| description     | string                                | Description (required)          | Detailed multi-line description to fully explain the entity. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords        | [string]                              | Keywords                        | List of keywords describing the dataset.                     |
| version         | string                                | Dataset Version                 | Version of the dataset. [Semantic Versioning (SemVer)](https://semver.org/) SHOULD be followed. |
| license         | string                                | Dataset License Name (required) | Dataset's license(s) as a [SPDX License identifier or expression](https://spdx.org/licenses/) or `proprietary` if the license is not on the SPDX license list. See `license_url` for more information. |
| license_url     | string                                | Dataset License URL             | Dataset's license URL SHOULD be specified if `license` is set to `proprietary`. |
| provider        | [Provider Object]                     | Data Provider                   | The organizations that created the content of the dataset.   |
| host            | Host Object                           | Storage Provider                | The organization that hosts the dataset.                     |
| spatial_extent  | [GeoJSON Object](http://geojson.org/) | Spatial extent (required)       | The spatial extent covered by the dataset as [GeoJSON](http://geojson.org/) object. |
| temporal_extent | string                                | Temporal extent (required)      | Temporal extent covered by the dataset. Date/time intervals MUST be formatted according to ISO 8601. ToDo: Support open date ranges |
| links           | [Link Object]                         | Links (required)                | A list of references to other documents, see Link Object for further documentation. TODO: Remove if catalog is revised and links are specified on the catalog level. |

### Provider Object

| Element | Type   | Name                  | Description                                     |
| ------- | ------ | --------------------- | ----------------------------------------------- |
| name    | string | Organization name     | The name of the organization or the individual. |
| url     | string | Organization homepage | Homepage of the provider.                       |

###  Host Object

| Element        | Type    | Name                  | Description                                                  |
| -------------- | ------- | --------------------- | ------------------------------------------------------------ |
| description    | string  | Description           | Detailed description to explain the hosting details. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| scheme         | string  | Scheme (required)     | Values: S3, GCS, URL, OTHER                                  |
| id             | string  | Identifier (required) | Host-specific identifier such as an URL or asset id.         |
| region         | string  | Region                | Provider specific region where the data is stored.           |
| requester_pays | boolean | Requester pays        | `true` if requester pays, `false` if host pays. Defaults to `false`. |

**Note:** The idea of storage profiles is currently [discussed](https://github.com/radiantearth/stac-spec/issues/148). Therefore, scheme, id and region may be removed from the final spec.

### Link Object

| Element | Type   | Name                | Description                                                  |
| ------- | ------ | ------------------- | ------------------------------------------------------------ |
| href    | string | Link (required)     | The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel     | string | Relation (required) | Relationship between the current document and the linked document. |
| type    | string | MIME-type           | MIME-type of the referenced entity.                          |
| title   | string | Title               | Human-readable title for the link.                           |

## Extensions

Related extensions to be used with the dataset spec:

* [EO extension](../extensions/stac-eo-spec.md)
  Please note that some fields such as `eo:sun_elevation ` or `eo:sun_azimuth` are only meaningful on the item level and MUST not be used in datasets.
* [Dimensions extension](../extensions/dimension) (currently in review, see [PR #164](https://github.com/radiantearth/stac-spec/pull/164))
* [Scientific extension](../extensions/scientific) (currently in review, see [PR #186](https://github.com/radiantearth/stac-spec/pull/186))
* Provenance extension  (planned, see [issue #179](https://github.com/radiantearth/stac-spec/issues/179))