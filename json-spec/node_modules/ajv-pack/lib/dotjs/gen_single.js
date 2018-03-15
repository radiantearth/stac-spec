'use strict';
module.exports = function generate_gen_single(it) {
  var out = '';
  it.funcName = 'validate';
  it.refVals = [];
  out += '' + (it.gen_validate(it)) + 'module.exports = validate;';
  var code = out;
  out = '';
  out += '\'use strict\';';
  if (/RULES/.test(code)) {
    out += ' var RULES = require(\'ajv/lib/compile/rules\')();';
  }
  if (/formats(\.|\[)/.test(code)) {
    out += ' ';
    var fmt = it.ajv._opts.format;
    out += ' var formats = require(\'ajv/lib/compile/formats\')( ';
    if (fmt) {
      out += '\'' + (fmt) + '\'';
    }
    out += ' );';
  }
  if (/ucs2length\s*\(/.test(code)) {
    out += ' var ucs2length = require(\'ajv/lib/compile/ucs2length\');';
  }
  if (/equal\s*\(/.test(code)) {
    out += ' var equal = require(\'ajv/lib/compile/equal\');';
  }
  if (it.validate.$async) {
    out += ' var ValidationError = require(\'ajv/lib/compile/error_classes\').Validation; ';
    if (/co\s*\(/.test(code)) {
      out += ' var co = require(\'co\'); ';
    }
  }
  out = out + code;
  return out;
}
