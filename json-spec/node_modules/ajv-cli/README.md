# ajv-cli

Command line interface for [ajv](https://github.com/epoberezkin/ajv), one of the [fastest json schema validators](https://github.com/ebdrup/json-schema-benchmark).

[![Build Status](https://travis-ci.org/jessedc/ajv-cli.svg?branch=master)](https://travis-ci.org/jessedc/ajv-cli)
[![npm version](https://badge.fury.io/js/ajv-cli.svg)](https://www.npmjs.com/package/ajv-cli)
[![Code Climate](https://codeclimate.com/github/epoberezkin/ajv-cli/badges/gpa.svg)](https://codeclimate.com/github/epoberezkin/ajv-cli)
[![Coverage Status](https://coveralls.io/repos/github/jessedc/ajv-cli/badge.svg?branch=master)](https://coveralls.io/github/jessedc/ajv-cli?branch=master)


## Contents

- [Installation](#installation)
- Commands
  - [Help](#help)
  - [Validate data](#validate-data)
  - [Migrate schema(s) to draft-06](#migrate-schemas-to-draft-06)
  - [Test validation result](#test-validation-result)
- [Ajv options](#ajv-options)
- [Version History, License](#version_history)


## Installation

```sh
npm install -g ajv-cli
```


## Help

```sh
ajv help
ajv help validate
ajv help compile
ajv help migrate
ajv help test
```


## Validate data

This command validates data files against JSON-schema

```sh
ajv validate -s test/schema.json -d test/valid_data.json
ajv -s test/schema.json -d test/valid_data.json
```

You can omit `validate` command name and `.json` from the [input file names](https://nodejs.org/api/modules.html#modules_file_modules). 


#### Parameters

##### `-s` - file name of JSON-schema

Only one schema can be passed in this parameter


##### `-d` - JSON data

Multiple data files can be passed, as in `-r` parameter:

```sh
ajv -s test/schema.json -d "test/valid*.json"
```

If some file is invalid exit code will be 1.


##### `-r` - referenced schemas

The schema in `-s` parameter can reference any of these schemas with `$ref` keyword.

Multiple schemas can be passed both by using this parameter mupltiple times and with [glob patterns](https://github.com/isaacs/node-glob#glob-primer). Glob pattern should be quoted and extensions cannot be omitted.


##### `-m` - meta-schemas

Schemas can use any of these schemas as a meta-schema (that is the schema used in `$schema` keyword - it is used to validate the schema itself).

Multiple meta-schemas can be passed, as in `-r` parameter.


##### `-c` - custom keywords/formats definitions

You can pass module(s) that define custom keywords/formats. The modules should export a function that accepts Ajv instance as a parameter. The file name should start with ".", it will be resolved relative to the current folder. The package name can also be passed - it will be used in require as is.

For example, you can use `-c ajv-keywords` to add all keywords from [ajv-keywords](https://github.com/epoberezkin/ajv-keywords) package or `-c ajv-keywords/keywords/typeof` to add only typeof keyword.


#### Options

- `--errors=`: error reporting format. Possible values:
    - `js` (default): JavaScript object
    - `json`: JSON with indentation and line-breaks
    - `line`: JSON without indentaion/line-breaks (for easy parsing)
    - `text`: human readable error messages with data paths

- `--changes=`: detect changes in data after validation.<br>
    Data can be modifyed with [Ajv options](#ajv-options) `--remove-additional`, `--use-defaults` and `--coerce-types`).<br>
    The changes are reported in JSON-patch format ([RFC6902](https://tools.ietf.org/html/rfc6902)).<br>
    Possible values are `js` (default), `json` and `line` (see `--errors` option).


## Compile schemas

This command validates and compiles schema without validating any data.

It can be used to check that the schema is valid and to create a standalone module exporting validation function (using [ajv-pack](https://github.com/epoberezkin/ajv-pack)).

```sh
ajv compile -s schema

# compile to module (BETA)
ajv compile -s schema -o validate.js
```

#### Parameters

##### `-s` - file name(s) of JSON-schema(s)

Multiple schemas can be passed both by using this parameter mupltiple times and with [glob patterns](https://github.com/isaacs/node-glob#glob-primer).

```sh
ajv compile -s "test/schema*.json"
```


##### `-o` - output file for compiled validation function module (BETA)

Only a single schema can be compiled with this option.

```sh
ajv compile -s "schema.json" -o "validate_schema.js"
```

This command also supports parameters `-r`, `-m` and `-c` as in [validate](#validate-data) command.


## Migrate schema(s) to draft-06

This command validates and migrates schema to draft-06 using [json-schema-migrate](https://github.com/epoberezkin/json-schema-migrate) package.


```sh
ajv migrate -s schema

# compile to specific file name
ajv migrate -s schema -o migrated_schema.json
```

#### Parameters

##### `-s` - file name(s) of JSON-schema(s)

Multiple schemas can be passed both by using this parameter mupltiple times and with [glob patterns](https://github.com/isaacs/node-glob#glob-primer).

```sh
ajv migrate -s "test/schema*.json"
```

If parameter `-o` is not specified the migrated schema is written to the same file and the original file is preserved with `.bak` extension.

If migration doesn't change anything in the schema file no changes in files are made.


##### `-o` - output file for migrated schema

Only a single schema can be migrated with this option.

```sh
ajv compile -s "schema.json" -o migrated_schema.json
```

#### Options

- `v5`: migrate schema as v5 if $schema is not specified
- `--indent=`: indentation in migrated schema JSON file, 4 by default
- `--validate-schema=false`: skip schema validation


## Test validation result

This command asserts that the result of the validation is as expected.

```sh
ajv test -s test/schema.json -d test/valid_data.json --valid
ajv test -s test/schema.json -d test/invalid_data.json --invalid
```

If the option `--valid` (`--invalid`) is used for the `test` to pass (exit code 0) the data file(s) should be valid (invalid).

This command supports the same options and parameters as [validate](#validate-data) with the exception of `--changes`.


## Ajv options

You can pass the following Ajv options (excluding `migrate` command):

|Option|Description|
|---|---|
|`--data`|use [$data references](https://github.com/epoberezkin/ajv#data-reference)|
|`--all-errors`|collect all errors|
|`--unknown-formats=`|handling of unknown formats|
|`--verbose`|include schema and data in errors|
|`--json-pointers`|report data paths in errors using JSON-pointers|
|`--unique-items=false`|do not validate uniqueItems keyword|
|`--unicode=false`|count unicode pairs as 2 characters|
|`--format=full`|format mode|
|`--schema-id=`|keyword(s) to use as schema ID|
|`--extend-refs=`|validation of other keywords when $ref is present in the schema|
|`--missing-refs=`|handle missing referenced schemas (true/ignore/fail)|
|`--inline-refs=`|referenced schemas compilation mode (true/false/\<number\>)|
|`--remove-additional`|remove additional properties (true/all/failing)|
|`--use-defaults`|replace missing properties/items with the values from default keyword|
|`--coerce-types`|change type of data to match type keyword|
|`--multiple-of-precision`|precision of multipleOf, pass integer number|
|`--error-data-path=property`|data path in errors|
|`--messages=false`|do not include text messages in errors|

Options can be passed in either dash-case and camelCase.

See [Ajv Options](https://github.com/epoberezkin/ajv#options) for more information.


## Version History

See https://github.com/jessedc/ajv-cli/releases


## Licence

MIT
