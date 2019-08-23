# Checksum Extension Specification (`checksum`)

**Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Provides a way to specify MD5, SHA1, SHA2 and SHA3 file checksums for assets and links in STAC Items, STAC Catalogs and STAC Collections.

- [Example](examples/example-sentinel1.json)
- [JSON Schema](json-scehma/schema.json)

## [`Link Object`](../../item-spec/item-spec.md#link-object) and [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields

| Field Name    | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| checksum:md5  | string | [MD5 message-digest algorithm](https://en.wikipedia.org/wiki/MD5) 128-bit checksum for the corresponding file, encoded as hexadecimal string. |
| checksum:sha1 | string | [SHA-1 (Secure Hash Algorithm 1)](https://en.wikipedia.org/wiki/SHA-1) 160-bit checksum for the corresponding file, encoded as hexadecimal string. |
| checksum:sha2 | string | [SHA-2 (Secure Hash Algorithm 2)](https://en.wikipedia.org/wiki/SHA-2) checksum for the corresponding file with varying sizes of 224, 256, 384 or 512 bits, encoded as hexadecimal string. |
| checksum:sha3 | string | [SHA-3 (Secure Hash Algorithm 3)](https://en.wikipedia.org/wiki/SHA-3) checksum for the corresponding file with varying bit sizes, encoded as hexadecimal string. |

### Examples

Checksum for a text file with file content `test`.

| Field Name               | Example                                                      |
| ------------------------ | ------------------------------------------------------------ |
| checksum:md5             | `098f6bcd4621d373cade4e832627b4f6`                           |
| checksum:sha1            | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`                   |
| checksum:sha2 (256 bits) | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| checksum:sha3 (256 bits) | `36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80` |

## Implementations

None yet, still in proposal stage.
