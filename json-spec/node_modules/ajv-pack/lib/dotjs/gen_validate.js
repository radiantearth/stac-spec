'use strict';
module.exports = function generate_gen_validate(it) {
  var out = 'var ' + (it.funcName) + ' = (function() { ';
  var arr1 = it.validate.source.patterns;
  if (arr1) {
    var p, i = -1,
      l1 = arr1.length - 1;
    while (i < l1) {
      p = arr1[i += 1];
      out += ' var pattern' + (i) + ' = new RegExp(\'' + (it.util.escapeQuotes(p)) + '\'); ';
    }
  }
  out += ' ';
  var arr2 = it.validate.source.defaults;
  if (arr2) {
    var d, i = -1,
      l2 = arr2.length - 1;
    while (i < l2) {
      d = arr2[i += 1];
      out += ' var default' + (i) + ' = ' + (JSON.stringify(d)) + '; ';
    }
  }
  out += ' ';
  if (it.refVals[it.refVals.length - 1] != it.validate.refVal) {
    out += ' ';
    it.refVals.push(it.validate.refVal);
    out += ' var refVal = []; ';
    var arr3 = it.validate.refVal;
    if (arr3) {
      var r, i = -1,
        l3 = arr3.length - 1;
      while (i < l3) {
        r = arr3[i += 1];
        out += ' ';
        if (i > 0) {
          out += ' ';
          if (typeof r == 'function') {
            out += ' ';
            var $it = it.util.copy(it);
            $it.validate = r;
            $it.funcName = 'refVal' + i;
            out += ' ' + (it.gen_validate($it)) + ' ';
          } else if (typeof r == 'object') {
            out += ' var refVal' + (i) + ' = ' + (JSON.stringify(r)) + '; ';
          }
          out += ' refVal[' + (i) + '] = refVal' + (i) + '; ';
        }
        out += ' ';
      }
    }
    out += ' ';
  }
  out += ' ';
  var code = it.validate.toString();
  code = code.replace(/^function\s*\(/, 'function validate(');
  out += ' return ' + (code) + ';})();' + (it.funcName) + '.schema = ' + (JSON.stringify(it.validate.schema)) + ';' + (it.funcName) + '.errors = null;';
  return out;
}
