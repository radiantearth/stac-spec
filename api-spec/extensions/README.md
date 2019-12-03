# API Extensions

This folder contains extensions to the SpatioTemporal Asset Catalog API specification by providing  new OpenAPI fragments.


Anyone is welcome to create an extension (see section 'Extending STAC'), and is encouraged to at least link to the extension from here. The third-party / vendor extension section is for the sharing of extensions. As third parties create useful extensions for their implementation it is expected that others will make use of it, and then evolve to make it a 'community extension', that several providers maintain together. For now anyone from the community is welcome to use this extensions/ folder of the stac-spec repository to collaborate.

API Extensions given follow the same guidelines for Extension Maturity as given in the *[Content Extensions README](../../extensions/README.md)*.

## List of community extensions

| Extension Name                                         | Scope*         | Description | Maturity |
| ------------------------------------------------------ | -------------- | ----------- | -------- |
| [Fields](fields/README.md)                             | *None*         | Adds parameter to control which fields are returned in the response. | *Pilot* |
| [Query](query/README.md)                               | *None*         | Adds parameter to search Item and Collection properties. | *Pilot* |
| [Context](context/README.md)                           | ItemCollection | Adds search related metadata (context) to [ItemCollection](../../item-spec/itemcollection-spec.md). | *Proposal* |
| [Sort](sort/README.md)                                 | *None*         | Adds Parameter to control sorting of returns results. | *Pilot* |
| [Transaction](transaction/README.md)                   | *None*         | Adds PUT and DELETE endpoints for the creation, editing, and deleting of items and Collections. | *Pilot* |
| [Items and Collections API Version](version/README.md) | *None*         | Adds GET versions resource to collections and items endpoints and provides semantics for a versioning scheme for collections and items. | *Proposal* |

\* The scope refers to the STAC specifications an extension extends. As all extensions here are API extensions, the API is not mentioned explicitly as scope and only the core STAC specifications (Catalog, Collection, Item and ItemCollection) are listed.

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name     | Scope | Description | Vendor |
| -------- | ----- | ----------- | ------ |
| None yet |       |             |        |

## Proposed extensions

The following extensions are proposed through the
[STAC issue tracker](https://github.com/radiantearth/stac-spec/issues) and are considered to be
implemented. If you would find any of these helpful or are considering to implement a similar
extension, please get in touch through the referenced issues:

- None yet

## Creating new extensions

Creating new extensions requires creating an OpenAPI fragment to define it.

Example fragment:

```yaml
IntersectsFilter:
  type: object
  description: >-
    Only returns items that intersect with the provided polygon.
  properties:
    intersects:
      $ref: "#/definitions/Polygon"
Polygon:
  type: object
  properties:
    type:
      type: string
      enum:
        - polygon
    coordinates:
      $ref: "#/definitions/Polygon2D"
  required:
    - type
    - coordinates
Polygon2D:
  type: array
  minItems: 1
  items:
    $ref: "#/definitions/LinearRing2D"
LinearRing2D:
  type: array
  minItems: 4
  items:
    $ref: "#/definitions/Point2D"
  example: [[-104, 35], [-103, 35], [-103, 34], [-104, 34], [-104, 35]]
Point2D:
  description: A 2d geojson point
  type: array
  minimum: 2
  maximum: 2
  items:
    type: number
    format: double
  example:
    - -104
    - 35
```

It is likely that there are schemas that should be used in common for types of filters that target different fields. We should define a common set of filter types that can be used in defining filters for different fields.

- `NumberRange`
- `TimeRange`
- `Text`
- `ArrayIncludes`
- Etc.

When defining a new filter fragment, you would reference these common filter types:

```yaml
CloudCover:
  type: object
  description: >-
    Filter items by desired cloud coverage.
  properties:
    cloudcover:
      $ref: "#/definitions/NumberRange"
```

Some additional extensions that have been discussed:

CQL support for generic queries:

```json
{
  "CQL": "CQL Select String"
}
```

### Adding filters to search

Filters should be documented as properties in the `searchBody`:

```yaml
searchBody:
  description: The search criteria
  type: object
  allOf:
    - $ref: "#/components/schema/bboxFilter"
    - $ref: "#/components/schema/datetimeFilter"
    - $ref: "#/components/schema/intersectsFilter"
```
