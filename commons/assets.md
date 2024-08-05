# Assets  <!-- omit in toc -->

- [Asset Object](#asset-object)
- [Media Types](#media-types)
- [Roles](#roles)
- [Additional Fields](#additional-fields)

The property `assets` is a dictionary of [Asset Objects](#asset-object), each with a unique key.
Each asset refers to data associated with the Item or Collection that can be downloaded or streamed.
In general, the keys don't have any meaning and are considered to be non-descriptive unique identifiers.
Providers may assign any meaning to the keys for their respective use cases, but must not expect that clients understand them.
To communicate the purpose of an asset better use the [`roles` field](#roles)
in the [Asset Object](#asset-object).

## Asset Object

An Asset is an object that contains a URI to data associated with the Item that can be downloaded
or streamed. It is allowed to add additional fields.

| Field Name  | Type      | Description                                                                                                                                                                                  |
| ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| href        | string    | **REQUIRED.** URI to the asset object. Relative and absolute URI are both allowed. [Trailing slashes are significant.](../best-practices.md#consistent-uris)                                 |
| title       | string    | The displayed title for clients and users.                                                                                                                                                   |
| description | string    | A description of the Asset providing additional details, such as how it was processed or created. [CommonMark 0.29](http://commonmark.org/) syntax MAY be used for rich text representation. |
| type        | string    | [Media type](#media-types) of the asset. See the [common media types](../best-practices.md#common-media-types-in-stac) in the best practice doc for commonly used asset types.               |
| roles       | \[string] | The [semantic roles](#roles) of the asset, similar to the use of `rel` in links.                                                                                                             |

[Additional fields](#additional-fields) *may* be added to the assets, though this
is recommended only in special cases.

## Media Types

Any media type can be used in an Item's asset `type` field, and [registered](https://www.iana.org/assignments/media-types/media-types.xhtml)
Media Types are preferred. STAC Items that have sidecar metadata files associated with a data asset (e.g, `.tfw`, Landsat 8 MTL files)
should use media types appropriate for the metadata file.  For example, if it is a plain text file, then `text/plain`
would be appropriate; if it is an XML, then `text/xml` is appropriate. For more information on media types as well as a
list of [common media types](../best-practices.md#common-media-types-in-stac) used in STAC see the [best practice on
working with media types](../best-practices.md#working-with-media-types).

## Roles

The `roles` field is used to describe the purpose of each asset. It is recommended to include one for every asset, to give users
a sense of why they might want to make use of the asset. There are some emerging standards that enable clients to take particular
action when they encounter particular roles, listed below. But implementors are encouraged to come up with their own terms to
describe the role.

Like the `rel` field in Link Objects, the `roles` field can be given any value.
However, there are a few standardized role names that can be found in the [best practices](../best-practices.md#list-of-asset-roles).
Commonly used are `thumbnail`, `overview`, `data` and `metadata`.

Note that multiple roles per asset are encouraged: pick all the ones that apply.
So many should have the `data` role, and then another role to describe how the data is used.
For more information on how to use roles see the [Asset Roles](../best-practices.md#asset-roles) section of the Best Practices document.

## Additional Fields

As detailed above, Items contain properties, which are the main source of metadata for searching across Items. Many content
extensions can add further property fields as well. Any property that can be specified for an Item can also be specified for
a specific asset. This can be used to override a property defined in the Item, or to specify fields for which there is no
single value for all assets.
If a property is defined in the Item Properties, it is the default value for all assets in the Item.
If a property is defined in a Collection on the top-level, it is the default value for all assets in the Collection.
Assets may override the properties inherited for specific assets (see example below).
Inheritance does not apply across multiple files, i.e. is restricted to a single Item or Collection.
Note that in some cases the inheritance may not lead to the expected results if other semantics have been defined for the property.
See the examples for `gsd` and `eo:bands` below.
It also applies to some other fields such as `created` or `updated`.
Inheritance may be undesirable in these cases, e.g. the `created` attribute of an item would describe when the metadata
was generated, whereas on an asset the `created` attribute would describe when the data file itself was created.

**It is important to note that the STAC API does not facilitate searching across Asset properties in this way, and this
should be used sparingly.** It is primarily used to define properties at the Asset level that may be used during use of
the data instead of for searching.

For example, `gsd` defined for an Item represents the best Ground Sample Distance (resolution) for the data within the Item.
However, some assets may be lower resolution and thus have a higher `gsd`. The `bands` field in combination with the EO extension defines
an array of spectral bands. However, it may be useful instead to specify the bands that are used in a particular asset.

For an example see the [sentinel2-sample](https://github.com/stac-utils/stac-examples/blob/main/sentinel2/sentinel2-sample.json).
The Sentinel-2 overall `gsd` is 10m, because this is
the best spatial resolution among all the bands and is defined in Item properties so it can be searched on. In the example
Band 5 and others have a `gsd` of 20m, so that asset specifies the `gsd` as well, which overrides the Item `gsd` for this
one asset. The example also includes reduced resolution versions of files included as assets, using `gsd` to represent
the proper resolution.

For `bands`, it could be put in Item properties as an array of all the bands, but in this case it's not. Instead,
the assets each define an array containing the spectral band information for that asset (in the order the bands appear
in the file).

For examples of fields that this construct is recommended for,
see the [section of STAC Best Practices](../best-practices.md#common-use-cases-of-additional-fields-for-assets)
that talks about common use cases of additional fields for assets.
