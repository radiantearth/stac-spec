'use strict';

var packValidate = require('./pack_validate');
var requireFromString = require('require-from-string');

module.exports = AjvPack;
AjvPack.prototype.validate = validate;
AjvPack.prototype.compile = compile;
AjvPack.prototype.addSchema = addSchema;
AjvPack.prototype.addKeyword = addKeyword;


function AjvPack(ajv) {
  this.ajv = ajv;
}


/**
 * validate data against the schema
 * @this Ajv
 * @param {Object} schema JSON-schema
 * @param {Any} data data to validate
 * @return {Boolean} validation result
 */
function validate(schema, data) {
  var v = this.compile(schema);
  var valid = v(data);
  this.errors = valid ? null : v.errors;
  return valid;
}


/**
 * compile the schema and require the module
 * @this Ajv
 * @param {Object} schema JSON-schema
 * @return {Function} validation function
 */
function compile(schema) {
  var v = this.ajv.compile(schema);
  var validateModule = packValidate(this.ajv, v);
  return requireFromString(validateModule);
}


/**
 * add schema to the instance
 * @this Ajv
 * @return {Any} result from ajv instance
 */
function addSchema() {
  return this.ajv.addSchema.apply(this.ajv, arguments);
}


/**
 * add custom keyword to the instance
 * @this Ajv
 * @return {Any} result from ajv instance
 */
function addKeyword() {
  return this.ajv.addKeyword.apply(this.ajv, arguments);
}
