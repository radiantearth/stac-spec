# File Info Extension Specification

- **Title: File Info** 
- **Identifier: file**
- **Field Name Prefix: file**
- **Scope: Item, Catalog, Collection**
- **Extension [Maturity Classification](../README.md#extension-maturity): Proposal**
- **Owner**: @m-mohr

Provides a way to specify file related details such as checksum, data type and size for assets and links in [STAC Items](../../item-spec/item-spec.md), [STAC Catalogs](../../catalog-spec/catalog-spec.md) and [STAC Collections](../../collection-spec/collection-spec.md).

- [Example](examples/sentinel1.json)
- [JSON Schema](json-schema/schema.json)

## *Link Object* and *Asset Object* fields

The following fields can be used for Links (in the [`Link Object`](../../item-spec/item-spec.md#link-object)) and assets (in the [`Asset Object`](../../item-spec/item-spec.md#asset-object)).

| Field Name         | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| file:byte_order | string | The byte order of integer values in the file. One of `big-endian` or `little-endian`. |
| file:checksum | string | Provides a way to specify file [checksums](#checksums) (e.g. BLAKE2, MD5, SHA1, SHA2, SHA3). The hashes are self-identifying hashes as described in the [Multihash specification](https://github.com/multiformats/multihash) and must be encoded as hexadecimal (base 16) string with lowercase letters. |
| file:data_type | string | The data type of the file. One of the [data types](#data-types) below. |
| file:header_size | integer | The header [size](#sizes) of the file, specified in bytes. |
| file:size | integer | The file [size](#sizes), specified in bytes. |

This extension can OPTIONALLY be used with the [Collection Assets Extension](../collection-assets/README.md).
File specific details should not be part of the [Item Assets Definition](../item-assets/README.md) in Collections.

### Sizes

Please be aware that the integer values (always unsigned) given for the sizes (especially `file:size`)  may exceed the maximum value for the default integer data type in your environment / programming language. In this specification `integer` specifies a integer number without an upper limit. You might need to use other data types to store the values in. For example, files with a size larger than around 2,14 GB would exceed the maximum value for int32 and in JavaScript `BigInt` could be used then.

### Data Types

The data type gives information about the values in the file.
This can be used to indicate the (maximum) range of numerical values expected.
For example `uint8` indicates that the numbers are in a range between 0 and 255, 
they can never be smaller or larger. This can help to pick the optimal numerical
data type when reading the files to keep memory consumption low.
Nevertheless, it doesn't necessarily mean that the expected values fill the whole range.
For example, there can be use cases for `uint8` that just use the numbers 0 to 10 for example.
Through other extensions it might be possible to specify an exact value range so 
that visualizations can be optimized.
The allowed values for `file:data_type` are:

- `int8`: 8-bit integer
- `int16`: 16-bit integer
- `int32`: 32-bit integer
- `int64`: 64-bit integer
- `uint8`: unsigned 8-bit integer (common for 8-bit RGB PNG's)
- `uint16`: unsigned 16-bit integer
- `uint32`: unsigned 32-bit integer
- `uint64`: unsigned 64-bit integer
- `float16`: 16-bit float
- `float32`: 32-bit float
- `float64`: 64-big float
- `cint16`: 16-bit complex integer
- `cint32`: 32-bit complex integer
- `cfloat32`: 32-bit complex float
- `cfloat64`: 64-bit complex float
- `other`: Other data type than the ones listed above (e.g. boolean, string, higher precision numbers)

### Checksums

`file:checksum` was previously defined in the [`checksum` extension](https://github.com/radiantearth/stac-spec/tree/v1.0.0-beta.2/extensions/checksum/README.md) and the field name was `checksum:multihash` before STAC v1.0.0-beta.3. The specification of the field has not changed.

Checksum examples for some algorithms supported by [Multihash](https://github.com/multiformats/multihash) in `file:checksum`. The examples are given for a text file with file content `test`.

- Algorithm `sha1` (160 bits): `1114a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`
- Algorithm `sha2` (256 bits): `12209f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`
- Algorithm `sha2` (256 bits truncated to 160 bits): `12149f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b`
- Algorithm `blake2b-128`: `90e4021044a8995dd50b6657a037a7839304535b`

## Implementations

None yet, still in proposal stage.
