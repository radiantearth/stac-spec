'use strict';

var cli = require('./cli');
var assert = require('assert');


describe('help', function() {
  this.timeout(10000);

  it('should print help', function (done) {
    cli('help', function (error, stdout, stderr) {
      assert.strictEqual(error, null);
      assert(/Validate/.test(stdout));
      assert(/Compile/.test(stdout));
      assert.equal(stderr, '');
      done();
    });
  });

  it('should print help for validate', function (done) {
    cli('help validate', function (error, stdout, stderr) {
      assert.strictEqual(error, null);
      assert(/Validate/.test(stdout));
      assert(/options/.test(stdout));
      assert.equal(stderr, '');
      done();
    });
  });

  it('should print help for compile', function (done) {
    cli('help compile', function (error, stdout, stderr) {
      assert.strictEqual(error, null);
      assert(/Compile/.test(stdout));
      assert(/options/.test(stdout));
      assert.equal(stderr, '');
      done();
    });
  });

  it('should print help for migrate', function (done) {
    cli('help migrate', function (error, stdout, stderr) {
      assert.strictEqual(error, null);
      assert(/Migrate/.test(stdout));
      assert(/options/.test(stdout));
      assert.equal(stderr, '');
      done();
    });
  });

  it('should print help for test', function (done) {
    cli('help test', function (error, stdout, stderr) {
      assert.strictEqual(error, null);
      assert(/Test/.test(stdout));
      assert(/options/.test(stdout));
      assert.equal(stderr, '');
      done();
    });
  });

  it('should print usage if unknown command is used', function (done) {
    cli('unknown', function (error, stdout, stderr) {
      assert(error instanceof Error);
      assert.equal(stdout, '');
      assert(/command/.test(stderr));
      assert(/unknown/.test(stderr));
      assert(/usage/.test(stderr));
      done();
    });
  });

  it('should print usage if help command is unknown', function (done) {
    cli('help unknown', function (error, stdout, stderr) {
      assert(error instanceof Error);
      assert.equal(stdout, '');
      assert(/command/.test(stderr));
      assert(/unknown/.test(stderr));
      assert(/usage/.test(stderr));
      done();
    });
  });

  it('should print usage if syntax is invalid', function (done) {
    cli('help -s test/schema.json', function (error, stdout, stderr) {
      assert(error instanceof Error);
      assert.equal(stdout, '');
      assert(/usage/.test(stderr));
      assert(/parameter/.test(stderr));
      assert(/unknown/.test(stderr));
      done();
    });
  });
});
