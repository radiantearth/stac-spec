# About

This document represents a number of ideas for options and requirements that are under discussion.
Some will likely evolve in to requirements, or at least documented specification extensions. But there
is not yet enough consensus on how to represent them.


## Asset definition

An `Asset` must have a "product" field that specifies a uri to a JSON file that represents the `Product`.

Assets contain the metadata that is specific to the format of the asset. The
asset must state its format. The Static Catalog does not have specific
requirements for participation in the network; the spec of the formats is a
downstream concern of the definition of the Static Catalog. e.g. the formats (e.g. "jpg2000", "cog", "laz")
is the key into knowing what metadata to expect inside the `Asset`.

While assets in Catalog APIs can easily represent files that are generated on demand, a static
catalog should only list assets that already exist online. This increases the reliability and speed
of the catalog and makes it easier to fully duplicate or back-up a static catalog.

### Product

**TODO: Update this to latest thinking**


A `Product` describes general metadata about the `Asset`, which can apply to a broad set of `Asset`s.

For the NAIP example, at a minimal level we could have:

```json
{
    "bands": [
        "Red",
        "Green",
        "Blue"
    ]
}
```

### Prefixes

**TODO:** 
Explain idea to have prefixes like eo: and dg: to differentiate the non-core items.


### Rel Links

The `Catalog`s link to `Item`s and other `Catalog`s, and `Item`s link to `Asset`s and other `Item`s,
via a rel-link style json object. These objects specify a `rel`, which represents
[link relations](https://spdx.org/licenses/), as well as an `href` to the linked element.

### Forwarding of properties

The properties of an element that can apply to the child links *will* apply,
unless overridden by the child element.


### Embedding of linked elements

Any link inside of an element to a JSON file of another element may
have the JSON directly embedded, either partially or fully, into the link object's body.
Embedding is optional and there  may be no embedded data,
a partial set of data for an asset or linked node, or fully
embed all information contained in the element that is linked to.

__TODO__: Enumerate potential "rel" values.

### URI's

URIs may be HTTP, but can also be URIs from other providers (e.g. S3). There will be metadata from
the `Catalog`, `Item` or `Asset` that will describe the provider,
to allow for details on how to connect to that URI.

