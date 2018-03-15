# json-schema-migrate
Migrate JSON-Schema to draft-06


[![Build Status](https://travis-ci.org/epoberezkin/json-schema-migrate.svg?branch=master)](https://travis-ci.org/epoberezkin/json-schema-migrate)
[![npm version](https://badge.fury.io/js/json-schema-migrate.svg)](http://badge.fury.io/js/json-schema-migrate)
[![Coverage Status](https://coveralls.io/repos/github/epoberezkin/json-schema-migrate/badge.svg?branch=master)](https://coveralls.io/github/epoberezkin/json-schema-migrate?branch=master)


## Purpose

This package allows to migrate JSON-schemas to draft-06 specification.

It supports:
- draft-04 schemas
- draft-04 hyper-schemas
- [Ajv](https://github.com/epoberezkin/ajv) v5 schemas (special extended mode in Ajv 4.x.x, deprecated from version 5.0.0).


## Install

```
npm install json-schema-migrate
```


## Usage

```javascript
var migrate = require('json-schema-migrate');
var schema = {
  id: 'my-schema',
  minimum: 1,
  exclusiveMinimum: true
};
migrate.draft6(schema /*, options */);

console.log(schema);
// {
//  $id: 'my-schema',
//  exclusiveMinimum: 1
// }
```


## Changes in schemas after migration

- `id` is replaced with `$id`
- `$schema` value becomes draft-06 meta-schema (or draft-06 hyper-schema)
- boolean form of `exclusiveMaximum/Minimum` is replaced with numeric form
- `enum` with a single allowed value is replaced with `const`
- Ajv v5 `constant` is replaced with `const`
- empty schema is replaced with `true`
- schema `{"not":{}}` is replaced with `false`


## Options

- _v5_ - use v5 by default (if `$schema` keyword is absent)
- _validateSchema_ - pass `false` to skip schema validation


## License

[MIT](https://github.com/epoberezkin/json-schema-migrate/blob/master/LICENSE)
