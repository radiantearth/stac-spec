# Checksum Extension Specification

- **Title: Checksum**
- **Identifier: checksum**
- **Field Name Prefix: checksum**
- **Scope: Item, Catalog, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**

Provides a way to specify file checksums (e.g. BLAKE2, MD5, SHA1, SHA2, SHA3) for assets and links in STAC Items, STAC Catalogs and STAC Collections. The hashes are self-identifying hashes as described in the [Multihash specification](https://github.com/multiformats/multihash).

- [Example](examples/sentinel1.json)
- [JSON Schema](json-schema/schema.json)

## [`Link Object`](../../item-spec/item-spec.md#link-object) and [`Asset Object`](../../item-spec/item-spec.md#asset-object) fields

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| checksum:multihash | string | Multihash for the corresponding file, encoded as hexadecimal (base 16) string with lowercase letters. |


### Examples

Checksum for a text file with file content `test`.

| Field Name         | Algorithm                             | Example                                                                |
| ------------------ | ------------------------------------- | ---------------------------------------------------------------------- |
| checksum:multihash | sha1 (160 bits)                       | `1114a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`                         |
| checksum:multihash | sha2 (256 bits)                       | `12209f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| checksum:multihash | sha2 (256 bits truncated to 160 bits) | `12149f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b`                     |
| checksum:multihash | blake2b-128                           | `90e4021044a8995dd50b6657a037a7839304535b`                             |


## Implementations

None yet, still in proposal stage.
