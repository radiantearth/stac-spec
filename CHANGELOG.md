<!--lint disable maximum-line-length-->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The `keywords` field known from Collections is available in common metadata. ([#1187](https://github.com/radiantearth/stac-spec/issues/1187))
- The `license` field additionally supports SPDX expressions and the value `other`.
- The `roles` field known from Assets and Providers is available in common metadata. ([#1267](https://github.com/radiantearth/stac-spec/issues/1267))
- Best practice: Link titles should exactly reflect the title of the corresponding entity ([#1168](https://github.com/radiantearth/stac-spec/issues/1168))

### Changed

- Common Metadata:
  - Clarify in various field descriptions that the fields do not only apply to Items
  - Validate the fields also in Catalogs, Collections and Links
  - If a description is given, require that it is not empty
- Clarified that trailing slashes in URIs are significant. ([#1212](https://github.com/radiantearth/stac-spec/discussions/1212))
- All JSON Schema `$id` values no longer have `#` at the end.
- Two spatial bounding boxes in a Collection don't make sense and will be reported as invalid by the schema. ([#1243](https://github.com/radiantearth/stac-spec/issues/1243))
- Clarify in descriptions that start_datetime and end_datetime are inclusive bounds ([#1280](https://github.com/radiantearth/stac-spec/issues/1280))

### Deprecated

- `license`: The values `proprietary` and `various` are deprecated in favor of SPDX expressions and `other`.

### Removed

- "Strongly recommended" language around `self` links in the item spec. ([#1173](https://github.com/radiantearth/stac-spec/pull/1173))

### Fixed

- Several typos and minor language changes
- Clarified that collection IDs should be unique across all collections in the corresponding root catalog
- Clarified which media types should be used for the hierarchical relation types
- Restructured asset role types and clarified usage of the roles `thumbnail`, `overview` and `visual` ([#1272](https://github.com/radiantearth/stac-spec/pull/1272))
- Clarified that JSON Schema draft-07 is the default version for Collection summaries and other versions may not be supported

## [v1.0.0] - 2021-05-25

### Added

- Updated best practices to add a recommendation to include title in links where possible. ([#1133](https://github.com/radiantearth/stac-spec/pull/1133))

### Changed

- Updated version numbers for 1.0.0 release.
- Final UML tweaks for latest changes. ([#1134](https://github.com/radiantearth/stac-spec/pull/1134))
- Removed ItemCollection from the STAC detection heuristic in Best Practices. It can't easily be differentiated from GeoJSON FeatureCollections any longer. ([API#141](https://github.com/radiantearth/stac-api-spec/issues/141))

## [v1.0.0-rc.4] - 2021-05-11

### Changed

- An empty Catalog is now allowed, removed the requirement that it must have a child or item link. ([#1115](https://github.com/radiantearth/stac-spec/issues/1115))
- An open date range to both sides is now allowed in the Collection's temporal extents. ([#1125](https://github.com/radiantearth/stac-spec/issues/1125))
- Catalog and Collection JSON Schemas don't have a common JSON Schema any more. ([#1122](https://github.com/radiantearth/stac-spec/pull/1122))

### Removed 

- Catalogs don't support summaries any more. ([#1122](https://github.com/radiantearth/stac-spec/pull/1122))

### Fixed

- Added clarification around when an extension should be included in `stac_extensions`. ([#1123](https://github.com/radiantearth/stac-spec/pull/1123))
- JSON Schemas don't allow "shortcuts" for core extensions any longer. ([#1121](https://github.com/radiantearth/stac-spec/pull/1121))
- Various examples fixes.

## [v1.0.0-rc.3] - 2021-04-29

### Added

- Summaries are allowed to specify JSON Schema in addition to ranges and sets of values. ([#1045](https://github.com/radiantearth/stac-spec/issues/1045))
- Added `preview` relation type for interoperable thumbnails to best practices. ([#1090](https://github.com/radiantearth/stac-spec/issues/1090))
- Recommendation to include both `root` and `parent` relation types when they point at the same file. ([#1098](https://github.com/radiantearth/stac-spec/issues/1098))
- Overview section linking to various foundational standards. ([#1111](https://github.com/radiantearth/stac-spec/pull/1111))

### Changed

- The first extent in a Collection is always the overall extent, followed by more specific extents. ([#1064](https://github.com/radiantearth/stac-spec/issues/1064), [opengeospatial/ogcapi-features#520](https://github.com/opengeospatial/ogcapi-features/pull/520))
- Updated examples for automatic collection creation from code and validation ([#1080](https://github.com/radiantearth/stac-spec/pull/1080))
- Clarified that stac_extensions should also list extensions that are used in Collection summaries. ([#1077](https://github.com/radiantearth/stac-spec/issues/1077))
- The Stats Object for Summaries has been renamed to Range Object (no functional change). ([#1093](https://github.com/radiantearth/stac-spec/pull/1093))
- `changed`, `created` (common metadata) and temporal extents (collections): Timestamps must be always in UTC ([#1095](https://github.com/radiantearth/stac-spec/issues/1095))
- Clarified that collection summaries do not require that all property fields are summarized. ([#1106](https://github.com/radiantearth/stac-spec/issues/1106))
- Clarified that gsd should only be used on an asset to represent the sensor, not just different processing. ([#1105](https://github.com/radiantearth/stac-spec/pull/1105))
- Clarified that leaving a field out is not equivalent to setting it as null. ([#1111](https://github.com/radiantearth/stac-spec/pull/1111))

## [v1.0.0-rc.2] - 2021-03-30

### Changed

- Required properties of type `string` require a minimum length of `1`. ([#1065](https://github.com/radiantearth/stac-spec/pull/1065))
- `gsd` must be greater than 0. ([#1068](https://github.com/radiantearth/stac-spec/pull/1068))

### Removed

- The remaining extensions in the spec (EO, Projection, Scientific Citation and View) have been moved out of the core specification, into their own repos in the [stac-extensions](https://github.com/stac-extensions/) GitHub organization. They must now be referred to by their schemas directly - the name shortcuts for them are no longer valid. The concept of the 'named shortcut' also goes away entirely. ([#1070](https://github.com/radiantearth/stac-spec/pull/1070))

### Fixed

- Examples
- Collection Assets were specified as required (only in written text, not in JSON Schema), but that was incorrectly copied over from the former `collection-assets` extension. Collection Assets are not required.
- Clarified that the values in summaries (both for ranges and sets of values) must follow the data type of the property they summarize. ([#1069](https://github.com/radiantearth/stac-spec/pull/1069))

## [v1.0.0-rc.1] - 2021-03-03

### Added

- Catalog and Collection now require a `type` parameter, to be set to `Catalog` or `Collection` for clients to more easily distinguish them easily. ([#971](https://github.com/radiantearth/stac-spec/pull/971))
- Collection specification adds Assets (previously needed Collections Asset extension to do that). ([#1008](https://github.com/radiantearth/stac-spec/pull/1008))
- 'via' and 'canonical' rel types are now options in Items. ([#884](https://github.com/radiantearth/stac-spec/pull/884))
- In Extensions list there is now reference to three new (non-core) extensions: [processing](https://github.com/stac-extensions/processing), [file info](https://github.com/stac-extensions/file) and [card4l](https://github.com/stac-extensions/card4l). These would have been added to the stac-spec repo, except all non-core extensions were moved to [stac-extensions](https://github.com/stac-extensions/) org. ([#1024](https://github.com/radiantearth/stac-spec/pull/1024))
- 'summaries' are now available in the Catalog spec, so both catalogs and collections can make use of it. ([#903](https://github.com/radiantearth/stac-spec/issues/903))
- There is a new recommendation to enable CORS. ([#940](https://github.com/radiantearth/stac-spec/pull/940))
- A Best Practice section on 'requester pays' cloud buckets was added. ([#1021](https://github.com/radiantearth/stac-spec/pull/1021))
- A new Best Practice section explains Asset Roles, plus some lists of potential roles for people to use (in best practices, sar and eo). ([#989](https://github.com/radiantearth/stac-spec/pull/989))
- There is a new Best Practice recommendation to keep collections at consistent levels. ([#1009](https://github.com/radiantearth/stac-spec/pull/1009))

### Changed

- The [Stats Object](collection-spec/collection-spec.md#range-object) for Collection `summaries` changed `min` to `minimum` and `max` to `maximum` to align with JSON Schema. ([#967](https://github.com/radiantearth/stac-spec/pull/967))
- URIs (usually found int properties like `href`, `url`) are now validated using the `iri-reference` format in JSON Schema (allows international characters in URIs) ([#953](https://github.com/radiantearth/stac-spec/pull/953))
- Enhanced the way the spec talks about ID's to encourage more global uniqueness. ([#883](https://github.com/radiantearth/stac-spec/pull/883))
- Clarified how collection-level asset object properties do not remove the need for item-level asset object properties in the `item-assets` extension ([#880](https://github.com/radiantearth/stac-spec/pull/880))
- Made `summaries` to be *strongly recommended* - everyone should strive to implement them, as they are very useful. ([#985](https://github.com/radiantearth/stac-spec/pull/985))
- Moved examples from individual directories into a single /examples folder at the root, and evolved them to be more representative. ([#955](https://github.com/radiantearth/stac-spec/pull/955))
- Renamed "Scientific Extension" to "Scientific Citation Extension" ([#990](https://github.com/radiantearth/stac-spec/issues/990))
- Relaxed the regular expression for DOIs in the scientific extension ([#910](https://github.com/radiantearth/stac-spec/issues/910))
- `proj:geometry` allows all GeoJSON geometries instead of just a polygon. ([#995](https://github.com/radiantearth/stac-spec/pull/995))

### Removed

- Checksum extension (field `checksum:multihash`). Use File Info extension (field `file:checksum`) instead for assets. There's no replacement for links. ([#934](https://github.com/radiantearth/stac-spec/pull/934))
- Collection Assets extension, as the core construct of Assets in a Collection is now part of the core Collection spec. No change is required except removing `collection-assets` from the list of `stac_extensions`. ([#1008](https://github.com/radiantearth/stac-spec/pull/1008))
- Numerous extensions (Data Cube, Item Assets, Point Cloud, SAR, Single File STAC, Tiled Assets, Timestamps & Versioning) have been moved out of the core specification, into their own repos in the [stac-extensions](https://github.com/stac-extensions/) GitHub organization. They must now be referred to by their schemas directly - the name shortcuts for them are no longer valid. ([#1024](https://github.com/radiantearth/stac-spec/pull/1024))

### Fixed

- Fixed JSON Schema for `providers` (Collections and Items) to be an object and require a `name`. ([#924](https://github.com/radiantearth/stac-spec/pull/924))

## [v1.0.0-beta.2] - 2020-07-08

### Added
- JSON-schema file in the Point Cloud extension.

### Changed
- Clarification on null geometries, making bbox not required if a null geometry is used.
- Multiple extents (bounding boxes / intervals) are allowed per Collection
- In the scientific extension, a link with the rel-type 'cite-as' SHOULD be used for the main publication of the dataset (the same as the one described in `sci:doi`), and not for the DOIs referenced in the `sci:publications` property.

### Removed
- Validation instructions

### Fixed
- Fixed several JSON Schemas
- Fixed examples

## [v1.0.0-beta.1] - 2020-05-29

### Removed
- The API portion of STAC has been split off into a [new repository: stac-api-spec](https://github.com/radiantearth/stac-api-spec) and will start being versioned and released separately than the core STAC spec.
- proj4 string from proj extension
- Various warnings about how the spec is very early and likely will change.
- implementations.md (migrated to <https://stacspec.org>) and how-to-help.md (migrated to <https://github.com/stac-utils/stac-ecosystem>).
- `commons` extension completely removed: Items should contain all properties and not default to a common set at the Collection level
- ItemCollection removed from stac-spec core repo, will migrate to [stac-api-spec](https://github.com/radiantearth/stac-api-spec) as that is the only place it is used.

### Added
- 'alternate' as a listed 'rel' type with recommended 'text/html' to communicate there is an html version.
- Added a code of conduct based on github's template.
- Overview document that gives a more explanatory discussion of the various parts of the spec and how they relate
- Several new sections to 'best practices' document.
- Added the ability to define Item properties under Assets (item-spec/item-spec.md)
- Add `proj:shape` and `proj:transform` to the projections extension.
- Collection-level assets extension
- Instructions on how to run check-markdown locally
- Timestamps extensions (adds fields `published`, `expires` and `unpublished`)
- `created` and `updated` can be used in the assets to specify the creation / update times of the assets.
- [Tiled Assets extension](https://github.com/stac-extensions/tiled-assets/blob/main/README.md), for representing data that has been split into tiles

### Changed
- [Label extension](https://github.com/stac-extensions/label/blob/main/README.md) types were clarified and types in README and JSON schema were brought into alignment
- Moved item recommendations to best practices, and added a bit more in item spec about 'search'
- Moved `eo:gsd` from `eo` extension to core `gsd` field in Item common metadata
- `asset` extension renamed to `item-assets` and renamed `assets` field in Collections to `item_assets`
- `item-assets` extension only requires any two fields to be available, not the two specific fields `title` and `type`
- `datetime` allows `null` as value, but requires `start_datetime` and `end_datetime` then
- Extensions `sat`, `scientific` and `view`: At least one field is required to be specified.
- [Single File STAC extension](https://github.com/stac-extensions/single-file-stac/blob/main/README.md) changed to be a complete STAC catalog + GeoJSON FeatureCollection that contains collections and items.
- Improved several JSON Schemas

### Fixed
- Datacube extension: `cube:dimensions` was not flagged as required.

## [v0.9.0] - 2020-02-26

### Added
- ItemCollection requires `stac_version` field, `stac_extensions` has also been added
- A `description` field has been added to Item assets (also Asset definitions extension)
- Field `mission` to [Common Metadata fields](item-spec/common-metadata.md)
- Extensions:
  - [Version Indicators extension](https://github.com/stac-extensions/version/blob/main/README.md), new `version` and `deprecated` fields in STAC Items and Collections
  - Data Cube extension can be used in Collections, added new field `description`
  - [Asset Extension](https://github.com/stac-extensions/item-assets/blob/main/README.md): new `description` and `roles` fields
  - New [Projection Extension](https://github.com/stac-extensions/projection/blob/main/README.md) to describe Items with Assets that have an associated geospatial projection
  - New [View Geometry Extension](https://github.com/stac-extensions/view/blob/main/README.md)
- STAC API:
  - Added the [Item and Collection API Version extension](https://github.com/radiantearth/stac-api-spec/tree/master/extensions/version/README.md) to support versioning in the API specification
  - Run `npm run serve` or `npm run serve-ext` to quickly render development versions of the OpenAPI spec in the browser
- [Basics](item-spec/common-metadata.md#basics) added to Common Metadata definitions with new `description` field for
Item properties
- New fields to the `link` object to facilitate [pagination support for POST requests](https://github.com/radiantearth/stac-api-spec/tree/master/api-spec.md#paging-extension)
- `data` role, as a suggestion for a common role for data files to be used in case data providers don't come up with their own names and semantics
- Clarification text on HTTP verbs in STAC API

### Changed
- Support for [CommonMark 0.29 instead of CommonMark 0.28](https://spec.commonmark.org/0.29/changes.html)
- Collection field `property` and the merge ability moved to a new extension 'Commons'
- Added field `roles` to Item assets (also Asset definitions extension), to be used similarly to Link `rel`
- Updated API yaml to clarify bbox filter should be implemented without brackets. Example: `bbox=160.6,-55.95,-170,-25.89`
- Collection `summaries` merge array fields now
- Several fields have been moved from extensions or item fields to the [Common Metadata fields](item-spec/common-metadata.md):
  - `eo:platform` / `sar:platform` => `platform`
  - `eo:instrument` / `sar:instrument` => `instruments`, also changed from string to array of strings
  - `eo:constellation` / `sar:constellation` => `constellation`
  - `dtr:start_datetime` => `start_datetime`
  - `dtr:end_datetime` => `end_datetime`
- Moved angle definitions from extensions `eo` and new `view` extension
  - `eo:off_nadir` -> `view:off_nadir`
  - `eo:azimuth` -> `view:azimuth`
  - `eo:incidence_angle` -> `view:incidence_angle`
  - `eo:sun_azimuth` -> `view:sun_azimuth`
  - `eo:sun_elevation` -> `view:sun_elevation`
- Extensions:
  - Data Cube extension: Changed allowed formats (removed PROJ string, added PROJJSON / WKT2) for reference systems
  - [Checksum extension](https://github.com/stac-extensions/checksum/blob/main/README.md) is now using self-identifiable hashes ([Multihash](https://github.com/multiformats/multihash))
  - Changed `sar:type` to `sar:product_type` and `sar:polarization` to `sar:polarizations` in the [SAR extension](https://github.com/stac-extensions/sar/blob/main/README.md)
- STAC API:
  - The endpoint `/stac` has been merged with `/`
  - The endpoint `/stac/search` is now called `/search`
  - Sort Extension - added non-JSON query/form parameter format
  - Fields extension has a simplified format for GET parameters
  - `search` extension renamed to `context` extension. JSON object renamed from `search:metadata` to `context`
  - Removed "next" from the search metadata and query parameter, added POST body and headers to the links for paging support
  - Query Extension - type restrictions on query predicates are more accurate, which may require additional implementation support
- Item `title` definition moved from core Item fields to [Common Metadata Basics](item-spec/common-metadata.md#basics)
fields. No change is required for STAC Items.
- `putFeature` can return a `PreconditionFailed` to provide more explicit information when the resource has changed in the server
- [Sort extension](https://github.com/radiantearth/stac-api-spec/tree/master/extensions/sort) now uses "+" and "-" prefixes for GET requests to denote sort order.
- Clarified how `/search` links must be added to `/` and changed that links to both GET and POST must be provided now that the method can be specified in links

### Removed
- `version` field in STAC Collections. Use [Version Extension](https://github.com/stac-extensions/version/blob/main/README.md) instead
- `summaries` field from Catalogs. Use Collections instead
- Asset Types (pre-defined values for the keys of individual assets, *not* media types) in Items. Use the asset's `roles` instead
- `license` field doesn't allow SPDX expressions any longer. Use `various` and links instead
- Extensions:
  - `eo:platform`, `eo:instrument`, `eo:constellation` from EO extension, and `sar:platform`, `sar:instrument`, `sar:constellation` from the [SAR extension](https://github.com/stac-extensions/sar/blob/main/README.md)
  - Removed from EO extension field `eo:epsg` in favor of `proj:epsg`
  - `gsd` and `accuracy` from `eo:bands` in the [EO extension](https://github.com/stac-extensions/eo/blob/main/README.md)
  - `sar:absolute_orbit` and `sar:center_wavelength` fields from the [SAR extension](https://github.com/stac-extensions/sar/blob/main/README.md)
  - `data_type` and `unit` from the `sar:bands` object in the [SAR extension](https://github.com/stac-extensions/sar/blob/main/README.md)
  - Datetime Range (`dtr`) extension. Use the [Common Metadata fields](item-spec/common-metadata.md) instead
- STAC API:
  - `next` from the search metadata and query parameter
- In API, removed any mention of using media type `multipart/form-data` and `x-www-form-urlencoded`

### Fixed

- The `license` field in Item and Collection spec explicitly mentions that the value `proprietary` without a link means that the data is private
- Clarified how to fill `stac_extensions`
- More clarifications; typos fixed
- Fixed Item JSON Schema now `allOf` optional Common Metadata properties are evaluated
- Clarified usage of optional Common Metadata fields for STAC Items
- Clarified usage of paging options, especially in relation to what OGC API - Features offers
- Allow Commonmark in asset description, as it's allowed everywhere else
- Put asset description in the API
- Fixed API spec regarding license expressions
- Added missing schema in the API Version extension
- Fixed links in the Landsat example in the collection-spec

## [v0.8.1] - 2019-11-01

### Changed
- Updated specification to base on OGC API - Features - Part 1: Core, v1.0.0 instead of OGC API - Features - Part 1: Core, v1.0.0-draft.2 (fka WFS3 draft 2).

### Fixed
- Numerous typos, clarifications and fixes for documentation and examples.
- Fixed STAC API definition to include STAC-related fields and examples in *OGC API - Features*-derived endpoints.
- Fixed JSON schemas for extensions: `$id` field matches file name.

## [v0.8.0] - 2019-10-11

### Changed
- Updated specification to base on WFS3 draft 2 (OGC API - Features - Part 1: Core, v1.0.0-draft.2). This leads to many changes in the API and one change in STAC collections, notably:
  - The structure of the field `extent` in STAC and WFS Collections changed.
  - Query parameter `time` was renamed to `datetime` and accepts slightly different values.
  - WFS links have additional fields `hreflang` and `length`.
  - WFS Collections have additional fields `crs` and `itemType`.
  - `time` API parameter changed to `datetime`
- The API intersects parameter now accepts a GeoJSON Geometry (any type) *instead* of a GeoJSON Feature.
- API: Clarification on `include` and `exclude` parameters in the field extension and notes on default values.
- API: queries should contain either `bbox` or `intersects`.
- API: Core API now has reserved parameters to prevent overlap with extensions
- Updated bbox definitions in API, Item, and Collection specs to include support for optional elevation values.
- Moved Single Item Extension to core (`license` and `providers` properties for Items).
- Allow `various` for the `license` fields.
- Clarified meaning of SAR and EO platform, constellation, and instrument
- Numerous typos, clarification and general word-smithing
- Changed GeoTIFF media type from `image/vnd.stac.geotiff` to `image/tiff; application=geotiff`, changed Cloud-optimized GeoTiff media type from `image/vnd.stac.geotiff; cloud-optimized=true` to `image/tiff; application=geotiff; profile=cloud-optimized`.

### Added
- **stac_version**: Each Item must specify the STAC version.
- **stac_extensions**: Introduced this field for Items, Catalogs and Collections.
- Property `summaries` have been added to catalogs and collections.
- API Transaction extension supports optimistic locking through use of the ETag header.
- Asset Definition Extension added to Collections to allow specifying details about Assets that may appear in member Items.
- [Single File Catalog extension](https://github.com/stac-extensions/single-file-stac/blob/main/README.md) added as a format to have a set of Collections and Items in a single file.
- [Label extension](https://github.com/stac-extensions/label/blob/main/README.md) added with additional fields for describing labeled data, such as used for training data or from the output of a classification
- Timestamp fields added to `Item`: `created` and `updated` to refer to the datetime the metadata file was created or updated.
- Added Search Metadata API extension which adds fields to a response from a STAC API such as the number of items found and how many were returned.
- ItemCollection class added to spec that is a GeoJSON FeatureCollection of Items, such as what would be returned from a search. Located in item directory.
- `in` operator added to the query extension (to check if value is in a list of values)
- New bands added to the [common band names](https://github.com/stac-extensions/eo/blob/main/README.md#common-band-names) for the EO extension: yellow, rededge, and 2 narrow NIR bands
- [Scientific extension](https://github.com/stac-extensions/scientific/blob/main/README.md) can be used in Collections.

### Fixed
- Updated language, fixed typos and examples.
- Renamed `pc:schema` to `pc:schemas` in the Point Cloud extension.

### Changes since 0.8.0rc1
- [Label extension](https://github.com/stac-extensions/label/blob/main/README.md):
  - moved label:classes to be a list of Class Objects from a single Class Object in spec markdown and json schema (matching previous example JSON).
  - moved label:overview to be a list of Overview Objects from a single Overview Object in spec markdown and json schema (matching previous example JSON).
  - Renamed fields to use plural forms (`label:property` -> `label:properties`, `label:task` -> `label:tasks`, `label:method` -> `label:methods` and `label:overview` -> `label:overviews`)

## [v0.7.0] - 2019-05-06

### Fixed
- Updated language / fixed typos
- Moved static vs dynamic discussion text to catalog best practices document
- Moved hosting of interactive api docs from swaggerhub to [stacspec.org](http://stacspec.org)
- JSON Schemas are now all following the latest JSON Schema version, draft 07.

### Changed
- No longer require an absolute self link for Items, Collections and Catalogs.
- Reorganized api-spec, added extensions folder to hold API extensions
- Change the fields parameter in the API to allow filtering on any property.
- Refinements to SAR extension, changed several fields from a single array-based field (`sar:absolute_orbit`, `sar:resolution`, `sar:pixel_spacing`, `sar:looks`) to multiple fields with exactly one value.
- Commons extension ability to 'merge' properties is now in the core specification

### Added
- Catalog best practices document, including recommendations for catalog layouts, html, and self-contained catalogs.
- `page` parameter for STAC API
- Optional `collection` property field in Items (previously part of the Commons extension)
- It is now required to link to `/stac/search/` from `/stac/`
- Added new fields to SAR extension: `sar:incidence_angle`, `sar:relative_orbit`, `sar:observation_direction`
- Added new filter parameters `ids` and `collections` to `/stac/search/`

### Removed
- Removed the field `sar:off_nadir` from the SAR extension
- JavaScript-based validation

## [v0.6.2] - 2019-03-01

### Fixed
- Fixed several examples and typos, improved descriptions
- Strictly checking the STAC version numbers in the JSON schemas
- Added missing required fields in Item JSON schema
- Changed `id` to `$id` in JSON schemas (draft-06 compatibility)

### Changed
- Extensions require examples and a JSON schema to get to the maturity level 'Pilot'
- Updated ISERV implementation

### Added
- Checksum extension
- Data Cube extension
- Point Cloud extension
- SAR extension

## [v0.6.1] - 2019-01-25

### Fixed
- Added `null` as potential data type to `eo:epsg` in the EO extension.
- Fixed several examples and typos.
- Updated JSON Schema versions for uniformity
- Added OpenEO GEE implementation
- Clarified 'intersects' behavior for STAC API

## [v0.6.0] - 2018-11-06

### Fixed
- Reorganized and cleaned up repository.
- Fixed examples throughout.

### Added
- **Changelog**: This changelog added.
- **Collections added**: Collections are a type of Catalog with additional fields, such as provider and license. Items must belong to a single Collection.
- **Extension maturity**: Protocol for providing maturity classification for extensions based on stability and implementations.
- **Commons extension**: The previous 'Collections' extension is now the 'Commons' extension and allows an Item to inherit properties from its Collection.
- **Datetime-range extension**: Extension for providing start and end datetimes.
- **Scientific extension**: Extension for providings links to scientific publications relating to the data.
- **rel types**: A list of supported `rel` types are provided for use when specifying links, `derived_from` and `license` types added.
- **eo:constellation**: A new field in the EO specification to specify a grouping of platforms.
- **stac_version**: The `stac_version` field is required on all Catalogs (and Collections).
- **JSON schemas**: Added JSON schemas where they were missing.
- **Single Item extension**: Extension to supply License and Providers for single Items when no collection is used.
- **UML Diagram**: See STAC-060-uml.pdf.
- **Development Process**: See process.md for information on the STAC development process.

### Changed
- **API**: Main catalog endpoint at `/stac`, search endpoint now at `/stac/search`.
- **eo:bands**: The `eo:bands` field is now an array rather than a dictionary, and has been moved inside of `properties` in a STAC Item.
- **Catalog fields**: Catalogs have a smaller number of basic fields: `id`, `stac_version`, `title` (optional), `description`, and `links`. The new Collections type contains additional fields.
- **links**: The links fields are now an array rather than a dictionary.
- **properties**: Fields with the data type array or objects are allowed inside the `properties` in a STAC Item.
- **description**: Description fields now allow formatting with CommonMark.
- **assets**: Fields changed names: `name` to `title` and `mime_type` to `type`.

### Removed
- **provider**: Provider field in Items got removed. Use Collections or the Single Item extension instead.
- **license**: License field in Items got removed. Use Collections or the Single Item extension instead.

## [v0.5.2] - 2018-07-12

Minor bug fixes on 0.5.1 for the schema files. Thanks @francbartoli

## [v0.5.1] - 2018-07-06

Minor bug fixes from 0.5.1 release

- [Update openapi / swagger specs for new 'links'](https://github.com/radiantearth/stac-spec/commit/480d4fb02b4a7e880c7ca01320fe2773260ba595)
- [minor fixes on collection extension](https://github.com/radiantearth/stac-spec/pull/124) - thanks @m-mohr
- [minor cbers example updates](https://github.com/radiantearth/stac-spec/pull/123) - thanks @fredliporace

## [v0.5.0] - 2018-07-01

The 0.5.0 release of the STAC spec is an iteration forward on the spec, with a number of core improvements. Highlights include:

- **Links is now a dictionary** - This is the most core change done. It aligns the structure with the 'asset' change in 0.5.0, making it easier for clients to look up the link that they want more easily. The schema is updated to this (and actually checks assets better now, thanks @mojodna )

- **Transactions Extension** - There is now a transaction extension for the STAC API, thanks to @hgs-msmith and @hgs-trutherford

- **Collections iterations** @matthewhanson has evolved the collections extension, adding in some namespace type hints on it, and explaining it more clearly.

- **eo:crs to eo:epsg** In the EO profile @matthewhanson brought in a change to use EPSG code, instead of full Well Known Text, to make it easy to reference.

Full list of issues and pull requests at <https://github.com/radiantearth/stac-spec/milestone/5?closed=1>

## [v0.4.1] - 2018-04-24

A few minor improvements on the release. ([issues](https://github.com/radiantearth/stac-spec/issues?utf8=%E2%9C%93&q=milestone%3A0.4.1+))

- @hgs-msmith got a swagger version of the spec, and made some minor improvements to the openapi version #103 and #102
- @francbartoli and @m-mohr pointed out some inconsistencies with landsat, so got the openapi updated #106
- @m-mohr pointed out some issues with landsat example, so updated those #105
- @hgs-trutherford pointed out that the planet example was a bit confusing, so updated it to the EO profile.

## [v0.4.0] - 2018-04-06

The 0.4.0 is the first 'official' release of the SpatioTemporal Asset Catalog (STAC) specification!

It is the result of the [ft. collins sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co), the second in person meeting of the STAC community. But it also includes
a number of improvements from remote contributors.

Highlights include:

- Updates to the core **`Item` JSON specification**, including simplifying to a single datetime, moving thumbnails from 'links' to 'assets', making assets a dictionary for easier lookup and requiring `self` links to be absolute links.

- Alignment of **STAC API** with the new [WFS3](https://github.com/opengeospatial/WFS_FES/) specification

- Cleanup of the **static catalog** specification for greater clarity around the catalog

- A first cut of an **Earth Observation Profile**, as well as a new collections extension to support it.

- Numerous small improvements and bug fixes.

See the [milestone 0.4.0 in the issue tracker](https://github.com/radiantearth/stac-spec/milestone/3) for the complete lists of improvements.

Thanks @hgs-msmith, @matthewhanson, @hgs-trutherford, @rouault, @joshfix, @alkamin, @hemphillda, @jeffnaus  and @fredliporace for contributing to the spec directly, and to [everyone](https://github.com/opengeospatial/wfs3hackathon/blob/master/notes/introductions.md#participants) who participated in the [Ft Collins sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co) and brought great ideas.

[Unreleased]: <https://github.com/radiantearth/stac-spec/compare/master...dev>
[v1.0.0]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-rc.4..v1.0.0>
[v1.0.0-rc.4]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-rc.3..v1.0.0-rc.4>
[v1.0.0-rc.3]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-rc.2..v1.0.0-rc.3>
[v1.0.0-rc.2]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-rc.1..v1.0.0-rc.2>
[v1.0.0-rc.1]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-beta.2..v1.0.0-rc.1>
[v1.0.0-beta.2]: <https://github.com/radiantearth/stac-spec/compare/v1.0.0-beta.1..v1.0.0-beta.2>
[v1.0.0-beta.1]: <https://github.com/radiantearth/stac-spec/compare/v0.9.0...v1.0.0-beta.1>
[v0.9.0]: <https://github.com/radiantearth/stac-spec/compare/v0.8.1...v0.9.0>
[v0.8.1]: <https://github.com/radiantearth/stac-spec/compare/v0.8.0...v0.8.1>
[v0.8.0]: <https://github.com/radiantearth/stac-spec/compare/v0.7.0...v0.8.0>
[v0.7.0]: <https://github.com/radiantearth/stac-spec/compare/v0.6.2...v0.7.0>
[v0.6.2]: <https://github.com/radiantearth/stac-spec/compare/v0.6.1...v0.6.2>
[v0.6.1]: <https://github.com/radiantearth/stac-spec/compare/v0.6.0...v0.6.1>
[v0.6.0]: <https://github.com/radiantearth/stac-spec/compare/v0.5.2...v0.6.0>
[v0.5.2]: <https://github.com/radiantearth/stac-spec/compare/v0.5.1...v0.5.2>
[v0.5.1]: <https://github.com/radiantearth/stac-spec/compare/v0.5.0...v0.5.1>
[v0.5.0]: <https://github.com/radiantearth/stac-spec/compare/v0.4.1...v0.5.0>
[v0.4.1]: <https://github.com/radiantearth/stac-spec/compare/v0.4.0...v0.4.1>
[v0.4.0]: <https://github.com/radiantearth/stac-spec/tree/v0.4.0>
