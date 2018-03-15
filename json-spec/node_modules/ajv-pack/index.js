'use strict';

var packValidate = require('./lib/pack_validate');
var AjvPack = require('./lib/instance');

module.exports = packValidate;

packValidate.instance = function (ajv) {
  return new AjvPack(ajv);
};
