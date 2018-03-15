'use strict';

var util = require('./util');
var getAjv = require('./ajv');
var jsonPatch = require('fast-json-patch');


module.exports = {
    execute: execute,
    schema: {
        type: 'object',
        required: ['s', 'd'],
        properties: {
            s: {
                type: 'string',
                format: 'notGlob'
            },
            d: { $ref: '#/definitions/stringOrArray' },
            r: { $ref: '#/definitions/stringOrArray' },
            m: { $ref: '#/definitions/stringOrArray' },
            c: { $ref: '#/definitions/stringOrArray' },
            errors: { enum: ['json', 'line', 'text', 'js', 'no'] },
            changes: { enum: [ true, 'json', 'line', 'js' ] }
        }
    }
};


function execute(argv) {
    var ajv = getAjv(argv);
    var validate = util.compile(ajv, argv.s);
    var allValid = true;

    var dataFiles = util.getFiles(argv.d);
    dataFiles.forEach(validateDataFile);

    return allValid;


    function validateDataFile(file) {
        var data = util.openFile(file, 'data file ' + file);
        var original;
        if (argv.changes) original = JSON.parse(JSON.stringify(data));
        var validData = validate(data);

        if (validData) {
            console.log(file, 'valid');
            if (argv.changes) {
                var patch = jsonPatch.compare(original, data);
                if (patch.length == 0) {
                    console.log('no changes');
                } else {
                    console.log('changes:');
                    console.log(util.logJSON(argv.changes, patch));
                }
            }
        } else {
            allValid = false;
            console.error(file, 'invalid');
            console.error(util.logJSON(argv.errors, validate.errors, ajv));
        }
    }
}
