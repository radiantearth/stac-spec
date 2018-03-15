'use strict';

var cli = require('./cli');
var assert = require('assert');


describe('validate', function() {
  this.timeout(10000);

  describe('single file validation', function() {
    it('should validate valid data', function (done) {
      cli('-s test/schema -d test/valid_data', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        assertValid(stdout, 1);
        assert.equal(stderr, '');
        done();
      });
    });

    it('should validate invalid data', function (done) {
      cli('-s test/schema.json -d test/invalid_data.json --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        assertRequiredErrors(stderr);
        done();
      });
    });

    it('should print usage if syntax is invalid', function (done) {
      cli('-d test/valid_data', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        assert(/usage/.test(stderr));
        assert(/parameter/.test(stderr));
        assert(/required/.test(stderr));
        done();
      });
    });
  });


  describe('multiple file validation', function() {
    describe('with glob', function() {
      it('should exit without error if all files are valid', function (done) {
        cli('-s test/schema -d "test/valid*.json"', function (error, stdout, stderr) {
          assert.strictEqual(error, null);
          assertValid(stdout, 2);
          assert.equal(stderr, '');
          done();
        });
      });

      it('should exit with error if some files are invalid', function (done) {
        cli('-s test/schema -d "test/{valid,invalid}*.json" --errors=line', function (error, stdout, stderr) {
          assert(error instanceof Error);
          assertValid(stdout, 2);
          assertRequiredErrors(stderr, '#', 2);
          done();
        });
      });
    });

    describe('with multiple files or patterns', function() {
      it('should exit without error if all files are valid', function (done) {
        cli('-s test/schema -d test/valid_data.json -d test/valid_data2.json', function (error, stdout, stderr) {
          assert.strictEqual(error, null);
          assertValid(stdout, 2);
          assert.equal(stderr, '');
          done();
        });
      });

      it('should exit with error if some files are invalid', function (done) {
        cli('-s test/schema -d test/valid_data.json -d test/valid_data2.json -d test/invalid_data.json --errors=line', function (error, stdout, stderr) {
          assert(error instanceof Error);
          assertValid(stdout, 2);
          assertRequiredErrors(stderr);
          done();
        });
      });

      it('should exit with error if some files are invalid (multiple patterns)', function (done) {
        cli('-s test/schema -d "test/valid*.json" -d "test/invalid*.json" --errors=line', function (error, stdout, stderr) {
          assert(error instanceof Error);
          assertValid(stdout, 2);
          assertRequiredErrors(stderr, '#', 2);
          done();
        });
      });
    });
  });


  describe('validate schema with $ref', function() {
    it('should resolve reference and validate', function (done) {
      cli('-s test/schema_with_ref -r test/schema -d test/valid_data', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        assertValid(stdout, 1);
        assert.equal(stderr, '');
        done();
      });
    });

    it('should resolve reference and validate invalide data', function (done) {
      cli('-s test/schema_with_ref -r test/schema -d test/invalid_data --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        assertRequiredErrors(stderr, 'schema.json');
        done();
      });
    });
  });


  describe('validate with schema using added meta-schema', function() {
    it('should validate valid data', function (done) {
      cli('-s test/meta/schema -d test/meta/valid_data -m test/meta/meta_schema', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        assertValid(stdout, 1);
        assert.equal(stderr, '');
        done();
      });
    });

    it('should validate invalid data', function (done) {
      cli('-s test/meta/schema -d test/meta/invalid_data -m test/meta/meta_schema --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        var results = assertErrors(stderr);
        var errors = results[0];
        var err = errors[0];
        assert.equal(err.keyword, 'type');
        assert.equal(err.dataPath, '.foo');
        assert.equal(err.schemaPath, '#/properties/foo/type');
        done();
      });
    });

    it('should fail on invalid schema', function (done) {
      cli('-s test/meta/invalid_schema -d test/meta/valid_data -m test/meta/meta_schema --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        var lines = stderr.split('\n');
        assert.equal(lines.length, 3);
        assert(/schema/.test(lines[0]));
        assert(/invalid/.test(lines[0]));
        assert(/error/.test(lines[1]));
        assert(/my_keyword\sshould\sbe\sboolean/.test(lines[1]));
        done();
      });
    });
  });


  describe('option "changes"', function() {
    it('should log changes in the object after validation', function (done) {
      cli('-s test/schema -d test/data_with_additional --remove-additional  --changes=line', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        var lines = assertValid(stdout, 1, 2);
        assert(/changes/.test(lines[1]));
        var changes = JSON.parse(lines[2]);
        assert.deepEqual(changes, [
          { op: 'remove', path: '/1/additionalInfo' },
          { op: 'remove', path: '/0/additionalInfo' }
        ]);
        assert.equal(stderr, '');
        done();
      });
    });
  });


  describe('custom keywords', function() {
    it('should validate valid data; custom keyword definition in file', function (done) {
      cli('validate -s test/custom/schema -c ./test/custom/typeof.js -d test/custom/valid_data', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        assertValid(stdout, 1);
        assert.equal(stderr, '');
        done();
      });
    });

    it('should validate valid data; custom keyword definition in package', function (done) {
      cli('validate -s test/custom/schema -c ajv-keywords/keywords/typeof -d test/custom/valid_data', function (error, stdout, stderr) {
        assert.strictEqual(error, null);
        assertValid(stdout, 1);
        assert.equal(stderr, '');
        done();
      });
    });

    it('should validate invalid data; custom keyword definition in file', function (done) {
      cli('validate -s test/custom/schema -c ./test/custom/typeof.js -d test/custom/invalid_data --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        var results = assertErrors(stderr);
        var errors = results[0];
        var err = errors[0];
        assert.equal(err.keyword, 'typeof');
        assert.equal(err.dataPath, '');
        assert.equal(err.schemaPath, '#/typeof');
        done();
      });
    });

    it('should validate invalid data; custom keyword definition in package', function (done) {
      cli('validate -s test/custom/schema -c ajv-keywords/keywords/typeof -d test/custom/invalid_data --errors=line', function (error, stdout, stderr) {
        assert(error instanceof Error);
        assert.equal(stdout, '');
        var results = assertErrors(stderr);
        var errors = results[0];
        var err = errors[0];
        assert.equal(err.keyword, 'typeof');
        assert.equal(err.dataPath, '');
        assert.equal(err.schemaPath, '#/typeof');
        done();
      });
    });
  });
});


function assertValid(stdout, count, extraLines) {
  var lines = stdout.split('\n');
  extraLines = extraLines || 0;
  assert.equal(lines.length, count + extraLines + 1);
  for (var i=0; i<count; i++)
    assert(/\svalid/.test(lines[i]));
  return lines;
}


function assertRequiredErrors(stderr, schemaRef, count) {
  count = count || 1;
  var results = assertErrors(stderr, count);
  results.forEach(function (errors) {
    var err = errors[0];
    schemaRef = schemaRef || '#';
    assert.equal(err.keyword, 'required');
    assert.equal(err.dataPath, '[0].dimensions');
    assert.equal(err.schemaPath, schemaRef + '/items/properties/dimensions/required');
    assert.deepEqual(err.params, { missingProperty: 'height' });
  });
}


function assertErrors(stderr, count) {
  count = count || 1;
  var lines = stderr.split('\n');
  assert.equal(lines.length, count*2 + 1);
  var results = [];
  for (var i=0; i<count; i+=2) {
    assert(/\sinvalid/.test(lines[i]));
    var errors = JSON.parse(lines[i+1]);
    assert.equal(errors.length, 1);
    results.push(errors);
  }
  return results;
}
