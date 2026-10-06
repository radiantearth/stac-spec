# Extensions

- [Extensions](#extensions)
  - [Overview](#overview)
  - [Using Extensions](#using-extensions)
    - [Extension identifiers in `stac_extensions`](#extension-identifiers-in-stac_extensions)
  - [Extension Governance](#extension-governance)
  - [Extension Maturity](#extension-maturity)
  - [Extension Ownership](#extension-ownership)
  - [Extending STAC](#extending-stac)
    - [General Conventions](#general-conventions)
    - [Proposing new extensions](#proposing-new-extensions)
    - [Prefixes](#prefixes)
    - [Use of arrays and objects](#use-of-arrays-and-objects)

## Overview

One of the most important aspects of the SpatioTemporal Asset Catalog specification is its extensibility. The core
STAC specification defines only a minimal core, but is designed for extension. It is expected that most real-world
implementations will use several extensions to fully describe their data. This document describes how extensions
work.

> \[!IMPORTANT]
> For a list of available extensions see the **[STAC extensions overview page](https://stac-extensions.github.io/)**.
> Not all extensions created by the STAC community may have been submitted to the overview, so the list is likely incomplete.
> When implementing extensions, please be aware that extensions have different [levels of maturity](#extension-maturity).

Extensions to the core STAC specification provide additional fields that can be used to better describe
the data. Most tend to be about describing a particular domain or type of data, but some imply
functionality.

Extensions include a [JSON Schema](https://json-schema.org/) describing the structure, a natural language description of the fields, and thorough examples.

Anybody can create an extension for their data, and data providers often work together to share
fields between them to create a shared community extension. See the section below on [Extending STAC](#extending-stac)
for information on how to get started. Everyone is encouraged to add their extensions to the
[STAC extensions overview page](https://stac-extensions.github.io/), so others can be aware of it.

Each extension should have at least one *owner*. You can find extension owners in each extension's README.
See the section on [extension ownership](#extension-ownership) for details.

## Using Extensions

When deciding how to model data in STAC it is highly recommended to first look at the
[list of extensions](https://stac-extensions.github.io/) and re-use fields there instead of creating your own version.
This increases interoperability, as users know that the meaning of your fields is the same as in other STAC
implementations. Many clients will also understand more mature extensions for better display and querying.

To incorporate an extension in STAC the 'Identifier' of the extension must be added to the `stac_extensions`
array of the STAC entity implementing the extension (see [below](#extension-identifiers-in-stac_extensions)).
This identifier is a URL to the JSON Schema that allows to validate the fields in the extension.
These JSON Schema URLs also include the version number of the extension. The 'Identifier' can usually be
found in the first lines of the README of any extension made with the
[extension template](https://github.com/stac-extensions/template).

### Extension identifiers in `stac_extensions`

Generally, if an extension is implemented in a STAC entity in a place where the extension scope applies to,
the extension identifier should be added to the `stac_extension` array. The scope of an extension is usually
explained in the README of an extension. Implementing an extension by following the specified requirements usually means including
fields, but occasionally also means implementing alternate behaviors.

There is no direct inheritance between children and parents though, so if for example an Item implements an extension,
but the Collection doesn't reflect the usage of the extension, the extension identifier must only be added to the
`stac_extension` array in the Item, but not to the Collection. If the Collection itself implements the extension though
or 'summarizes' a field in Collection Summaries or Item Asset Definitions, the extension identifier should be added to the
Collection.

Extensions can be added to the following STAC entities and each entity describes how `stac_extensions` has to be used:

- [Catalog](../catalog-spec/catalog-spec.md#stac_extensions)
- [Collection](../collection-spec/collection-spec.md#stac_extensions)
- [Item](../item-spec/item-spec.md#stac_extensions)

Below you can find a few practical examples:

- If the Catalog, Collection or Item object directly implements the extension,
  the `stac_extensions` of that object should contain the extension Identifier.
- If an Asset object implements an extension, the `stac_extensions` of the Item or Collection which holds that
  Asset should contain the extension identifier.
- If a Collection [summary](../collection-spec/collection-spec.md#summaries) contains Item fields that implement an extension, then
  the `stac_extensions` array of that Collection should list the extension identifier. For example, if a Collection `summaries` field
  contains a summary of `eo:cloud_cover`, then that Collection should have the 'Identifier' (i.e. the EO extension JSON Schema URL) in the `stac_extensions` array.
- If an object implements an extension that results in fields from a separate extension to be referenced, then the latter extension
  identifier should be included in the `stac_extensions` array for that object. For example, if a Collection implements the
  [Datacube](https://github.com/stac-extensions/datacube) extension, and in the `cube:variables` field there is a Variable Object
  which includes `cf:standard_name` from the [CF Extension](https://github.com/stac-extensions/cf),
  then the CF Extension identifier should be listed in that Collection's `stac_extensions`.

## Extension Governance

Everyone is welcome to contribute extensions to the STAC ecosystem. The center of activity for these is the
[stac-extensions GitHub organization](https://github.com/stac-extensions), which has a number of extension repositories.
The community can also host STAC extensions in other places.
Any extension can be listed in the [STAC extensions overview page](https://stac-extensions.github.io/),
regardless of where they are hosted, and we encourage the community to do so, so that
everyone can be aware of all extensions at any time and a high level of interoperability is possible.

> \[!IMPORTANT]
> Each extension is assigned one of the following governance classes, which describe who governs the extension:
>
> - **Core**: An extension that the STAC Project Steering Committee (PSC) considers critical for the STAC ecosystem,
>   e.g. because it is recommended in the [STAC Best Practices](https://github.com/radiantearth/stac-best-practices).
>   Core extensions are governed by the STAC PSC and are always hosted in the [stac-extensions GitHub organization](https://github.com/stac-extensions).
> - **Community**: An extension that is maintained by the STAC community. This is the default for all extensions. Community extensions may be hosted in the stac-extensions Github organization, or they can be hosted elsewhere.
> - **Unmaintained**: An extension that has no active owner anymore. It can still be used, but issues and pull requests may not be addressed.

The STAC PSC decides which extensions are classified as Core.
The community can propose extensions to become Core extensions via the [STAC PSC issue tracker](https://github.com/radiantearth/stac-psc/issues).
See the section on [extension ownership](#extension-ownership) for what the governance class means for
contributing to an extension.

## Extension Maturity

There are many extensions being built for STAC, but they have varying degrees of maturity.
All extensions must include a maturity classification, so that STAC users can easily get a sense of how much they can count on the extension.
The maturity is independent of the [governance class](#extension-governance) and is decided by the [owners](#extension-ownership) of the extension.

> \[!IMPORTANT]
> Each extension is assigned one of the following maturity classifications,
> which describe the stability promise of the owners towards the STAC community.
>
> - **Proposal**: The extension can be considered as ***unstable***.
>   It is an early version that is still evolving and breaking changes can be expected.
>   It may not be widely implemented yet and is looking for feedback from implementers.
> - **Stable**: The extension is widely implemented across catalogs and tooling.
>   It has proven to work in practice and users can generally rely on an extension at this maturity level.
>   Breaking changes should be avoided, occur at a low cadence and ideally only come after a deprecation phase.
>   Breaking changes require a new major version.
> - **Deprecated**: An extension that has likely been superseded by a newer one or did not work out for some reason.
>   ***Transition the extension out of usage, do not use it in new projects.***

The owners of an extension should only move an extension from *Proposal* to *Stable* if

- it has multiple *independent* implementations in catalogs and tooling, and
- no breaking changes are expected anytime soon,
  e.g. there are no open issues or pull requests in the issue tracker of the extension that would require breaking changes.

It is recommended to use versions below 1.0.0 (i.e. v0.x) for Proposal extensions,
and versions 1.0.0 or later (i.e. v1.x and above) for Stable extensions.
Moving an extension to Stable is usually a good time to release v1.0.0.

Deprecated extensions are usually also [Unmaintained](#extension-governance),
but unmaintained extensions are not necessarily deprecated:
an unmaintained extension may still be the best option for its use case, while a deprecated extension should not be used anymore.

Previous versions of this document also defined the maturity classifications *Pilot* and *Candidate*.
Extensions that still use these classifications should be considered as Proposal until their owners reclassify them.

## Extension Ownership

Each extension should have at least one owner, who is listed in the README of the extension by their Github handle.
The owners maintain the extension, review and merge pull requests, release new versions, and decide
on the [maturity](#extension-maturity) of the extension.

Who governs an extension depends on its [governance class](#extension-governance) and where it is hosted:

- **Core extensions** are hosted in the [stac-extensions GitHub organization](https://github.com/stac-extensions)
  and are governed by the STAC PSC.
  The owners listed in the README maintain the extension on behalf of the STAC PSC.
- **Other extensions in the stac-extensions GitHub organization** are governed by their owners.
  The STAC PSC can take over the ownership or governance of these extensions,
  e.g. if the extension has no active owners anymore, if there are conflicts that the owners can't resolve,
  or if it becomes a Core extension.
- **Extensions outside of the stac-extensions GitHub organization** are not governed by the STAC PSC.
  All changes need to go through the owners of the extension.

If issues or pull requests of an extension in the stac-extensions GitHub organization are stuck,
the owners don't respond, or help is needed otherwise, please open an issue in the
[stac-psc repository](https://github.com/radiantearth/stac-psc) to involve the STAC PSC.
An issue or pull request can be considered stuck if it has not received a response for about a month.
This is also the place to ask for taking over the ownership of an unmaintained extension.

Please allow enough time for reviews in general, we recommend at least one month.
Extensions are maintained by volunteers, and neither the owners nor the STAC PSC and the wider community
may follow all extension repositories closely.
Likewise, owners should give everyone a fair chance to review proposed changes before merging them,
especially breaking changes and changes to Stable extensions.
This ensures that extensions are based on consensus and work for a broad range of data and use cases.

## Extending STAC

Anyone is welcome to extend STAC and evolve the additions into a full STAC extension with a README, JSON Schema and examples.
There are several types of extensions, some just add additional fields,
some change the behavior of STAC and some introduce completely new functionality. New extensions should try to align
with existing extensions as well as possible and may even re-use fields and their definitions until they may get split
into a new extension that combines commonly used fields across multiple extensions.

### General Conventions

Creating a new extension usually involves defining a set of logically grouped fields, and specifying what the allowed values
for those fields are. This should be done in the extension text (README) and in JSON Schema, to provide validation. While one
can theoretically add fields anywhere in JSON there are some conventions as to where to add them in STAC objects.

1. Additional attributes relating to an [Item](../item-spec/item-spec.md) should be added into the Item Properties object,
   rather than directly in the Item object.
2. In general, additional attributes that apply to an Item Asset should also be allowed in Item Properties and vice-versa.
   For example, the `gsd` attribute may be used in Item Properties to describe the best GSD available in
   the Item Asset objects contained in the Item, but may also be used in an individual Item Asset to describe only the specific GSD of that asset.
3. Additional attributes relating to a [Catalog](../catalog-spec/catalog-spec.md) or
   [Collection](../collection-spec/collection-spec.md) should be added to the top-level of the object.
4. All other objects can generally also be extended, e.g. Link Objects, Provider Objects, Band Objects, etc.
5. Extensions may also extend other extensions, declaring that dependency in the text and JSON Schema.

The JSON Schema of an extension should only validate the fields of the extension.
It should not require fields that the STAC specification already requires, such as `assets` in Items,
so that the schema can also be used with other GeoJSON-based formats that use STAC extensions,
e.g. [OGC API - Records](https://github.com/opengeospatial/ogcapi-records).
If the extension depends on other fields, e.g. from the core specification, common metadata or other extensions,
the schema may check for their presence, as long as this requirement is also documented in the README of the extension.
Where applicable, the schema should also validate the fields in all other places where they can be used,
e.g. in Link Objects and Link Templates.
The [extension template](https://github.com/stac-extensions/template) provides a JSON Schema that follows these rules.

### Proposing new extensions

Extensions can be hosted anywhere, but should use the
[extension template](https://github.com/stac-extensions/stac-extensions.github.io#using-the-stac-extensions-template)
as a starting point. If you'd like to add a repository to the [stac-extensions](https://github.com/stac-extensions)
GitHub organization, just ask via the [STAC PSC GitHub issue tracker](https://github.com/radiantearth/stac-psc/issues)! This is fine for
work-in-progress extensions. You can also host the extension repository in your own GitHub account, and optionally
transfer it to the stac-extensions organization later.
See the [Governance](#extension-governance) and [Ownership](#extension-ownership) sections about what this means for your extension.

For new extensions that require community discussion, we recommend the following workflow:

- Use the stac-extensions template to sketch out your proposed extension
- Open an issue on this repository with the prefix "New Extension: " and describe the extension. Include a link to the extension repository.
  Also post it in the `#stac` channel of the [CNG Slack](https://cloudnativegeo.slack.com) for broader recognition
  and potentially on social media (e.g. LinkedIn or BlueSky).
- Discussion should take place as issues/pull requests on the extension repository directly, but can also occur on the issue created before.
- Once the extension has an initial release, the issue on stac-spec will be closed.

Ideas for new extensions that others have proposed can be found in the STAC
[Issue Tracker](https://github.com/radiantearth/stac-spec/issues) under the
[new extension](https://github.com/radiantearth/stac-spec/issues?q=is%3Aissue+is%3Aopen+label%3A%22new+extension%22) label.
Anyone is free to add new ideas there and to collaborate on existing ones.

### Prefixes

A STAC Item can combine schema information from several different sources - the core STAC Item information,
an earth observation community extension, and a vendor specific provider. It can be difficult to distinguish exactly where each definition
came from, and to pull out the most relevant information, especially when vendors often will dump in all the metadata they have in to the
STAC definition.

So one idea is to have prefixes to differentiate specific vendors (like `dg:` for DigitalGlobe), and for communities of practice
(like `eo:` for Electro-Optical). These wouldn't be full namespacing, though an extension for like JSON-LD could potentially
evolve to make fully resolved namespacing an option.

An example of this can be seen in a Landsat example:

```js
  "properties": {
    "datetime":"2018-01-01T13:21:30Z",

    "start_datetime":"2018-01-01T13:21:30Z",
    "end_datetime":"2018-01-01T13:31:30Z",

    "view:off_nadir": -0.001,
    "eo:cloud_cover": 10.31,
    "view:sun_azimuth": 149.01607154,
    "view:sun_elevation": 59.21424700,
    "gsd": 30,

    "l8:data_type": "L1T",
    "l8:wrs_path": 153,
    "l8:wrs_row": 25,
    "l8:earth_sun_distance": 1.0141560,
    "l8:ground_control_points_verify": 114,
    "l8:geometric_rmse_model": 7.562,
    "l8:image_quality_tirs": 9,
    "l8:ground_control_points_model": 313,
    "l8:geometric_rmse_model_x": 5.96,
    "l8:geometric_rmse_model_y": 4.654,
    "l8:geometric_rmse_verify": 5.364,
    "l8:image_quality_oli": 9
  }
```

### Use of arrays and objects

For extensions, it is recommended to

1. Use arrays only as enumerations/lists (possibly sorted), without implying additional meaning (such as order)
2. To avoid using nested objects, in favor of multiple attributes with a similar naming scheme.

For example, if one would like to define an extension to contain a start and a end date,
there are multiple options (tl;dr: option **3** is recommended):

1. Define an object, for example: `"date_range": {"start": "2018-01-01", "end": "2018-01-31"}`.
   This is **discouraged** as it is more complex to search in objects.
2. Define an two-element array where the first element is the start date and the second element is the end date,
   for example `"date_range": ["2018-01-01", "2018-01-31"]`.
   This is **discouraged** as it would conflict with Collection `summaries`,
   which always considers arrays as true (potentially sorted) enumeration without any additional meaning.
3. Define two separate fields, e.g. `"date_range_start": "2018-01-01", "date_range_end": "2018-01-31"`.
   This is **recommended** as it avoids the conflicts above and is usually better displayed in software that only understands GeoJSON
   but has no clue about STAC.
   This is due to the fact that most legacy software can not display arrays or objects GeoJSON `properties` properly.
