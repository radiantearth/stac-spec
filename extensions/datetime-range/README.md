# Datetime Range Extension Specification (`dtr`)

**Extension [Maturity Classification](../README.md#extension-maturity): Stable**

An extension to provide datetime ranges with a start and an end datetime stamp in a consistent way. 

This is a core extension and does not require a prefix when used.

- [Example](examples/example-video.json)
- [JSON Schema](json-schema/schema.json)

## Item fields

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| start_datetime | string | **REQUIRED.** The first or start date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |
| end_datetime   | string | **REQUIRED.** The last or end date and time for the item, in UTC. It is formatted as `date-time` according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). |

**Note:** All STAC Items that use this extension MUST include both fields, which enables a user to
search STAC records by the provided times.

## Implementations

3 proprietary implementations
