# STAC Start End Datetime Extension Spec (`set`)

**Extension [Maturity Classification](./README.md#extension-maturity): Proposal**

An extension to provide start and end datetime stamps in a consistent way.

- Example (missing, PRs welcome)
- JSON Schema (missing, PRs welcome)

## Item fields

| Field Name         | Type   | Description                                                                                                                                                        |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| set:start_datetime | string | **REQUIRED.** The first or start time for the item, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| set:end_datetime   | string | **REQUIRED.** The last or end time for the item, in UTC. It is formatted according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).    |

**Note:** All STAC Items that use this extension MUST include both fields, which enables a user to
search STAC records by the provided times.

## Implementations

None yet, still in proposal stage.
