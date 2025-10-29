# STAC specification site

This is a simple [mkdocs](https://www.mkdocs.org/) site for the STAC
specification. The content is built from the specification markdown files, which
are the canonical specification reference (along with the **json-schema**).

## Development

Get [uv](https://docs.astral.sh/uv/getting-started/installation/), then:

```sh
uv sync
uv run mkdocs serve
```

## Updating

When the spec version is updated, the value for `spec_version` in the `plugins`
section of [mkdocs.yml](./mkdocs.yml) needs to be updated to match. This value
is used to re-write the **json-schema** urls to use the canonical locations,
rather than serving a copy of the **json-schema** documents through **mkdocs**.
