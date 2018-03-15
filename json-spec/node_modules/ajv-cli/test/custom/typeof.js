'use strict';

var ajvKeywords = require('ajv-keywords');

module.exports = function (ajv) {
  ajvKeywords(ajv, 'typeof');
};
