'use strict';

var util = require('./util');
var getAjv = require('./ajv');


module.exports = {
    execute: execute,
    schema: {
        type: 'object',
        required: ['s', 'd'],
        oneOf: [
            { required: [ 'valid' ] },
            { required: [ 'invalid' ] }
        ],
        properties: {
            s: {
                type: 'string',
                format: 'notGlob'
            },
            d: { $ref: '#/definitions/stringOrArray' },
            r: { $ref: '#/definitions/stringOrArray' },
            m: { $ref: '#/definitions/stringOrArray' },
            c: { $ref: '#/definitions/stringOrArray' },
            valid:   { type: 'boolean' },
            invalid: { type: 'boolean', enum: [true] },
            errors:  { enum: ['json', 'line', 'text', 'js', 'no'] }
        }
    }
};


function execute(argv) {
    var ajv = getAjv(argv);
    var validate = util.compile(ajv, argv.s);
    var shouldBeValid = !!argv.valid && argv.valid != 'false';
    var allPassed = true;

    var dataFiles = util.getFiles(argv.d);
    dataFiles.forEach(testDataFile);

    return allPassed;


    function testDataFile(file) {
        var data = util.openFile(file, 'data file ' + file);
        var validData = validate(data);
        var errors;
        if (!validData) errors = util.logJSON(argv.errors, validate.errors, ajv);

        if (validData === shouldBeValid) {
            console.log(file, 'passed test');
            if (errors) console.log(errors);
        } else {
            allPassed = false;
            console.error(file, 'failed test');
            if (errors) console.error(errors);
        }
    }
}
