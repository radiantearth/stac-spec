# Dataset Spec for STAC

[STAC Items](https://github.com/radiantearth/stac-spec/json-spec/) are focused on search within a dataset*. Another topic of interest is the search of datasets, instead of within a dataset.  The Dataset Spec is an independent spec that STAC Items are *strongly recommended* to use. Other parties can also independently use this spec to describe datasets in a lightweight way.

The Datasets Spec is a superset of the [Catalog Spec](../static-catalog/). I shares the same fields and therefore every Dataset is also a valid Catalog. Datasets can have both parent Catalogs and Datasets and child Items, Catalogs and Datasets. 

A Dataset can be represented in JSON format. Every field described here is a property in a JSON object.

* [Example (Sentinel 2)](example-s2.json)
* [JSON Schema](json-schema/dataset.json)

*\* There is no standardized name for the concept we are describing here. Others called it: dataset series (ISO 19115), collection (CNES, NASA), dataset (JAXA), dataset series (ESA), product (JAXA).*

## Dataset fields

| Element     | Type              | Name                            | Description                                                  |
| ----------- | ----------------- | ------------------------------- | ------------------------------------------------------------ |
| name        | string            | Identifier (required)           | Identifier for the dataset that is unique across the provider. |
| title       | string            | Title                           | A short descriptive one-line title for the dataset.          |
| description | string            | Description (required)          | Detailed multi-line description to fully explain the entity. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| keywords    | [string]          | Keywords                        | List of keywords describing the dataset.                     |
| version     | string            | Dataset Version                 | Version of the dataset. [Semantic Versioning (SemVer)](https://semver.org/) SHOULD be followed. |
| license     | string            | Dataset License Name (required) | Dataset's license(s) as a [SPDX License identifier or expression](https://spdx.org/licenses/) or `proprietary` if the license is not on the SPDX license list. Proprietary licenses SHOULD add a link to the license text, see the `license` relation type. |
| provider    | [Provider Object] | Data Provider                   | The organizations that influenced the content of the dataset. |
| host        | Host Object       | Storage Provider                | The organization that hosts the dataset.                     |
| extent      | [Extent Object]   | Extents (required)              | Spatial and temporal extents.                                |
| links       | [Link Object]     | Links (required)                | A list of references to other documents, see Link Object for further documentation. |

### Extent Object

The object describes the spatio-temporal extents of the dataset. Both spatial and temporal extents are required to be specified.

**Note:** STAC datasets tries to be compliant to [WFS 3.0](https://github.com/opengeospatial/WFS_FES), but there are still issues to be solved. The WFS specification is in draft state any may change, especially regarding [3D support](https://github.com/opengeospatial/WFS_FES/issues/143) for spatial extents or the handling of [open date ranges](https://github.com/opengeospatial/WFS_FES/issues/155) for temporal extents. Therefore, It is also likely that the following fields change over time.

| Element  | Type     | Name                       | Description                                                  |
| -------- | -------- | -------------------------- | ------------------------------------------------------------ |
| spatial  | [number] | Spatial extent (required)  | Potential spatial extent covered by the dataset. West, north, east, south edges of the spatial extent. Only WGS84 longitude/latitude is supported. The list of four numbers can be extended to six numbers to support a 3D spatial extent. |
| temporal | string   | Temporal extent (required) | Potential temporal extent covered by the dataset. Date/time intervals MUST be formatted according to ISO 8601. Open date ranges are supported by omitting either the start or the end time. Example for data from the beginning of 2019 until now: `2009-01-01T00:00:00Z/`. |

### Provider Object

The object provides information about a provider. A provider is any of the organizations that created or processed the content of the dataset and therefore influenced the data offered by this dataset.

| Element | Type   | Name                         | Description                                     |
| ------- | ------ | ---------------------------- | ----------------------------------------------- |
| name    | string | Organization name (required) | The name of the organization or the individual. |
| url     | string | Organization homepage        | Homepage of the provider.                       |

###  Host Object

The objects provides information about the storage provider hosting the data. 

**Note:** The idea of storage profiles is currently [discussed](https://github.com/radiantearth/stac-spec/issues/148). Therefore, scheme, id and region may be removed from the final spec once this concept id introduced to STAC.

| Element        | Type    | Name                         | Description                                                  |
| -------------- | ------- | ---------------------------- | ------------------------------------------------------------ |
| name           | string  | Organization name (required) | The name of the organization or the individual hosting the data. |
| description    | string  | Description                  | Detailed description to explain the hosting details. [CommonMark 0.28](http://commonmark.org/) syntax MAY be used for rich text representation. |
| scheme         | string  | Scheme (required)            | Values: S3, GCS, URL, OTHER                                  |
| id             | string  | Identifier (required)        | Host-specific identifier such as an URL or asset id.         |
| region         | string  | Region                       | Provider specific region where the data is stored.           |
| requester_pays | boolean | Requester pays               | `true` if requester pays, `false` if host pays. Defaults to `false`. |

### Link Object

This object describes a relationship with other entities. Data providers are advised to be liberal with links.

| Element | Type   | Name                     | Description                                                  |
| ------- | ------ | ------------------------ | ------------------------------------------------------------ |
| href    | string | Link (required)          | The actual link in the format of an URL. Relative and absolute links are both allowed. |
| rel     | string | Relation type (required) | Relationship between the current document and the linked document. See chapter "Relation types" for more information. |
| type    | string | MIME-type                | MIME-type of the referenced entity.                          |

#### Relation types

The following types are commonly used as `rel` types in the Link Object of a Dataset:

| Type            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| self (required) | *Absolute* URL to the dataset file itself. This is required, to represent the location that the file can be found online. This is particularly useful when in a download package that includes metadata, so that the downstream user can know where the data has come from. |
| root            | URL to the root [STAC Catalog](../static-catalog/) or Dataset. |
| parent          | URL to the parent [STAC Catalog](../static-catalog/) or Dataset. |
| child           | URL to a child [STAC Catalog](../static-catalog/) or Dataset. |
| item            | URL to a [STAC Item](../json-spec/).                         |
| license         | The license URL for the dataset SHOULD be specified if the `license` field is set to `proprietary`. If there is no public license URL available, it is RECOMMENDED to supplement the STAC dataset with the license text in separate file and link to this file. |

## Extensions

Related extensions for the dataset spec:

* [EO extension](../extensions/stac-eo-spec.md)
  Please note that some fields such as `eo:sun_elevation ` or `eo:sun_azimuth` are only meaningful on the item level and MUST not be used in datasets.
* Dimensions extension (currently in review)
* [Scientific extension](../extensions/scientific)
* Provenance extension  (planned, see [issue #179](https://github.com/radiantearth/stac-spec/issues/179))