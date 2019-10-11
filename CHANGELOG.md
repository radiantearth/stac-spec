# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Changed GeoTIFF type from `image/vnd.stac.geotiff` to `image/tiff; application=geotiff`

### Fixed
- Updated language, fixed typos and examples.
- [Label extension](extensions/label/README.md):
    - moved label:classes to be a list of Class Objects from a single Class Object in spec markdown and json schema (matching previous example JSON).
    - moved label:overview to be a list of Overview Objects from a single Overview Object in spec markdown and json schema (matching previous example JSON).
    - Renamed fields to use plural forms (`label:property` -> `label:properties`, `label:task` -> `label:tasks`, `label:method` -> `label:methods` and `label:overview` -> `label:overviews`)
- Renamed `pc:schema` to `pc:schemas` in the Point Cloud extension.

## [v0.8.0-RC1] - 2019-08-23

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

### Added
- **stac_version**: Each Item must specify the STAC version.
- **stac_extensions**: Introduced this field for Items, Catalogs and Collections.
- Property `summaries` have been added to catalogs and collections.
- API Transaction extension supports optimistic locking through use of the ETag header.
- Asset Definition Extension added to Collections to allow specifying details about Assets that may appear in member Items.
- [Single File Catalog extension](extensions/single-file-stac/README.md) added as a format to have a set of Collections and Items in a single file.
- [Label extension](extensions/label/README.md) added with additional fields for describing labeled data, such as used for training data or from the output of a classification
- Timestamp fields added to `Item`: `created` and `updated` to refer to the datetime the metadata file was created or updated.
- Added Search Metadata API extension which adds fields to a response from a STAC API such as the number of items found and how many were returned.
- ItemCollection class added to spec that is a GeoJSON FeatureCollection of Items, such as what would be returned from a search. Located in item directory.
- `in` operator added to the query extension (to check if value is in a list of values)
- New bands added to the [common band names](extensions/eo/README.md#common-band-names) for the EO extension: yellow, rededge, and 2 narrow NIR bands
- [Scientific extension](extensions/scientific/README.md) can be used in Collections.


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

### Removed:
* **provider**: Provider field in Items got removed. Use Collections or the Single Item extension instead.
* **license**: License field in Items got removed. Use Collections or the Single Item extension instead.


## [v0.5.2] - 2018-07-12

Minor bug fixes on 0.5.1 for the schema files. Thanks @francbartoli


## [v0.5.1] - 2018-07-06

Minor bug fixes from 0.5.1 release

*  [Update openapi / swagger specs for new 'links'](https://github.com/radiantearth/stac-spec/commit/480d4fb02b4a7e880c7ca01320fe2773260ba595)
* [minor fixes on collection extension](https://github.com/radiantearth/stac-spec/pull/124) - thanks @m-mohr
* [minor cbers example updates](https://github.com/radiantearth/stac-spec/pull/123) - thanks @fredliporace


## [v0.5.0] - 2018-07-01

The 0.5.0 release of the STAC spec is an iteration forward on the spec, with a number of core improvements. Highlights include:

* **Links is now a dictionary** - This is the most core change done. It aligns the structure with the 'asset' change in 0.5.0, making it easier for clients to look up the link that they want more easily. The schema is updated to this (and actually checks assets better now, thanks @mojodna )

* **Transactions Extension** - There is now a transaction extension for the STAC API, thanks to @hgs-msmith and @hgs-trutherford

* **Collections iterations** @matthewhanson has evolved the collections extension, adding in some namespace type hints on it, and explaining it more clearly.

* **eo:crs to eo:epsg** In the EO profile @matthewhanson brought in a change to use EPSG code, instead of full Well Known Text, to make it easy to reference.

Full list of issues and pull requests at https://github.com/radiantearth/stac-spec/milestone/5?closed=1


## [v0.4.1] - 2018-04-24

A few minor improvements on the release. ([issues](https://github.com/radiantearth/stac-spec/issues?utf8=%E2%9C%93&q=milestone%3A0.4.1+))

* @hgs-msmith got a swagger version of the spec, and made some minor improvements to the openapi version #103 and #102
* @francbartoli and @m-mohr pointed out some inconsistencies with landsat, so got the openapi updated #106
* @m-mohr pointed out some issues with landsat example, so updated those #105
* @hgs-trutherford pointed out that the planet example was a bit confusing, so updated it to the EO profile.


## [v0.4.0] - 2018-04-06

The 0.4.0 is the first 'official' release of the SpatioTemporal Asset Catalog (STAC) specification!

It is the result of the [ft. collins sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co), the second in person meeting of the STAC community. But it also includes
a number of improvements from remote contributors.

Highlights include:

* Updates to the core **`Item` JSON specification**, including simplifying to a single datetime, moving thumbnails from 'links' to 'assets', making assets a dictionary for easier lookup and requiring `self` links to be absolute links.

* Alignment of **STAC API** with the new [WFS 3](https://github.com/opengeospatial/WFS_FES/) specification

* Cleanup of the **static catalog** specification for greater clarity around the catalog

* A first cut of an **Earth Observation Profile**, as well as a new collections extension to support it.

* Numerous small improvements and bug fixes.

See the [milestone 0.4.0 in the issue tracker](https://github.com/radiantearth/stac-spec/milestone/3) for the complete lists of improvements.

Thanks @hgs-msmith, @matthewhanson, @hgs-trutherford, @rouault, @joshfix, @alkamin, @hemphillda, @jeffnaus  and @fredliporace for contributing to the spec directly, and to [everyone](https://github.com/opengeospatial/wfs3hackathon/blob/master/notes/introductions.md#participants) who participated in the [Ft Collins sprint](https://github.com/radiantearth/community-sprints/tree/master/03072018-ft-collins-co) and brought great ideas.


[Unreleased]: https://github.com/radiantearth/stac-spec/compare/master...dev
[v0.7.0]: https://github.com/radiantearth/stac-spec/compare/v0.6.2...v0.7.0
[v0.6.2]: https://github.com/radiantearth/stac-spec/compare/v0.6.1...v0.6.2
[v0.6.1]: https://github.com/radiantearth/stac-spec/compare/v0.6.0...v0.6.1
[v0.6.0]: https://github.com/radiantearth/stac-spec/compare/v0.5.2...v0.6.0
[v0.5.2]: https://github.com/radiantearth/stac-spec/compare/v0.5.1...v0.5.2
[v0.5.1]: https://github.com/radiantearth/stac-spec/compare/v0.5.0...v0.5.1
[v0.5.0]: https://github.com/radiantearth/stac-spec/compare/v0.4.1...v0.5.0
[v0.4.1]: https://github.com/radiantearth/stac-spec/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/radiantearth/stac-spec/tree/v0.4.0
