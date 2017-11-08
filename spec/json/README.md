# JSON Spec

## Purpose

This folder defines the JSON specifications for return values of a STAC, and the flat JSON files
that will be found in a Static STAC.

Static STACs define a network of linked assets for the purpose of automated
crawling. It is defined by a network of linked metadata in a standardized
format.

## Description

A Static STAC defines a tree graph structure, with a single global entry
point from which the entire network can be crawled. The nodes in this network
are defined by Node metadata, which can point downstream to other Nodes as well
as directly describe Assets.

### Catalog

A Node in the network contains top level metadata to describe the node, a list of assets,
and a list of links to other nodes. The node metadata may only have assets, or only have links,
or both. There are both required and optional fields for metadata.

Nodes may embed asset or link data to any degree.
There may be no embedded data, a partial set of data for an asset or linked node, or fully
embed all information of the network. If the full asset or linked node is embedded into the
upstream node, the upstream node may or may not contain the URI to the downstream node or asset.

Properties that are defined for an upstream node get inhereted to downstream nodes and assets.
Downstream nodes or assets can override upstream node metadata if it is defined downstream.

Nodes can contain optional data that has semantic meaning according to the context of the node.
Examples:
- Specification of semantic meaning of URI pattern (e.g. z/x/y) that the crawler can recognize and take advantage of.
- SEO tags
- Generic "user data"

### Items

TODO

### Assets

Assets contain the metadata that is specific to the format of the asset. The
asset must state it's format. The Static Catalog does not have specific
requirements for participation in the network; the spec of the formats is a
downstream concern of the definition of the Static Catalog.

_The formats (e.g. "scenes", "cogs") can be written against the ideal information to be determined by the core metadata team_

### Note about URI's

URIs may be HTTP, but can also be URIs from other providers (e.g. S3). There will be metadata from the node
that will describe the provider, to allow for details on how to connect to that URI.

### What this is not

- A network that focuses on being up to date - no guarantees around when new data will be made available.

## Resources

- Workstream description: https://github.com/radiantearth/boulder-sprint/blob/master/workstreams/flat-file-catalog.md
- Notes: https://board.net/p/flat-catalog

## TODO:

- figure out time - we have to argue with other groups. 8601-and-done

# Schema Validation

## Initialization

```bash
npm install
```

## Validation

```bash
node_modules/.bin/ajv test -s asset.json -r geojson.json -d landsat-scene.json --valid --verbose
node_modules/.bin/ajv test -s catalog.json -r asset.json -r geojson.json -d node.json --valid --verbose
```
