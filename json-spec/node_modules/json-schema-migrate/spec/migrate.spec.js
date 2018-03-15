'use strict';

var assert = require('assert');
var migrate = require('../lib');


describe('migrate to draft-06 schema', function() {
  it('should migrate from draft-04 schema', function() {
    testMigration({
      from: './fixtures/schema-draft-04.json',
      expected: './fixtures/expected-schema-from-draft-04-to-06.json'
    });
  });

  it('should migrate from v5 schema', function() {
    testMigration({
      from: './fixtures/schema-v5.json',
      expected: './fixtures/expected-schema-from-v5-to-draft-06.json'
    }, {v5: true});
  });

  it('should migrate from hyper-schema', function() {
    testMigration({
      from: './fixtures/hyper-schema-draft-04.json',
      expected: './fixtures/expected-hyper-schema-from-draft-04-to-06.json'
    });
  });

  function testMigration(schemas, opts) {
    var schema = require(schemas.from);
    var expectedMigratedSchema = require(schemas.expected);

    var migratedSchema = migrate.draft6(schema, opts);
    assert.deepStrictEqual(migratedSchema, expectedMigratedSchema);
  }
});
