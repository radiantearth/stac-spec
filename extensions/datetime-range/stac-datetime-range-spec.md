# STAC Datetime Range Extension Spec (`dtr`)

**Extension [Maturity Classification](./README.md#extension-maturity): Proposal**

An extension to provide datetime ranges with a start and an end datetime stamp in a consistent way.

- [Example](example-video.json)
- [JSON Schema](schema.json)

## Item fields

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| dtr:start_datetime | string | **REQUIRED.** The first or start date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| dtr:end_datetime   | string | **REQUIRED.** The last or end date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

**Note:** All STAC Items that use this extension MUST include both fields, which enables a user to
search STAC records by the provided times.

## Implementations

None yet, still in proposal stage.
