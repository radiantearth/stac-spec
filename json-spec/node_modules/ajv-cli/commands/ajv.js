'use strict';

var Ajv = require('ajv');
var options = require('./options');
var util = require('./util');
var path = require('path');


module.exports = function (argv) {
    var opts = options.get(argv);
    if (argv.o) opts.sourceCode = true;
    var ajv = new Ajv(opts);
    var invalid;
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    addSchemas(argv.m, 'addMetaSchema', 'meta-schema');
    addSchemas(argv.r, 'addSchema', 'schema');
    customFormatsKeywords(argv.c);
    if (invalid) process.exit(1);
    return ajv;

    function addSchemas(args, method, fileType) {
        if (!args) return;
        var files = util.getFiles(args);
        files.forEach(function (file) {
            var schema = util.openFile(file, fileType);
            try { ajv[method](schema); }
            catch (err) {
                console.error(fileType, file, 'is invalid');
                console.error('error:', err.message);
                invalid = true;
            }
        });
    }

    function customFormatsKeywords(args) {
        if (!args) return;
        var files = util.getFiles(args);
        files.forEach(function (file) {
            if (file[0] == '.') file = path.resolve(process.cwd(), file);
            try {
                require(file)(ajv);
            } catch (err) {
                console.error('module', file, 'is invalid; it should export function');
                console.error('error:', err.message);
                invalid = true;
            }
        });
    }
};
