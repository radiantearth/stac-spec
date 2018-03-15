'use strict';

var exec = require('child_process').exec;
var path = require('path');
var CWD = path.join(__dirname, '..');


module.exports = function cli(params, callback) {
  exec('node index ' + params, { cwd: CWD }, callback);
};
