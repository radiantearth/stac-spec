'use strict';

var util = require('./util');
var getAjv = require('./ajv');
var ajvPack = require('ajv-pack');
var fs = require('fs');

module.exports = {
    execute: execute,
    schema: {
        type: 'object',
        required: ['s'],
        properties: {
            s: { $ref: '#/definitions/stringOrArray' },
            r: { $ref: '#/definitions/stringOrArray' },
            m: { $ref: '#/definitions/stringOrArray' },
            c: { $ref: '#/definitions/stringOrArray' },
            o: { type: 'string' }
        }
    }
};


function execute(argv) {
    var ajv = getAjv(argv);
    var allValid = true;

    var schemaFiles = util.getFiles(argv.s);
    if (argv.o && schemaFiles.length > 1) {
        console.error('multiple schemas cannot be compiled to a file');
        return false;
    }
    schemaFiles.forEach(compileSchema);

    return allValid;


    function compileSchema(file) {
        var schema = util.openFile(file, 'schema ' + file);
        var validate;
        try {
            validate = ajv.compile(schema);
            /* istanbul ignore else */
            if (typeof validate == 'function') {
                console.log('schema', file, 'is valid');
                if (argv.o) {
                    try {
                        var moduleCode = ajvPack(ajv, validate);
                        try {
                            fs.writeFileSync(argv.o, moduleCode);
                        } catch(e) {
                            console.error('error saving file:', e);
                            allValid = false;
                        }
                    } catch(e) {
                        console.error('error preparing module:', e);
                        allValid = false;
                    }
                }
            } else {
                allValid = false;
                console.error('schema', file, 'failed to compile to a function');
                console.error(validate);
            }
        } catch (err) {
            allValid = false;
            console.error('schema', file, 'is invalid');
            console.error('error:', err.message);
        }
    }
}
