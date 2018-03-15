'use strict';

var Ajv = require('ajv');
var glob = require('glob');
var ajv = new Ajv({
    allErrors: true,
    coerceTypes: 'array',
    jsonPointers: true,
    formats: {
        notGlob: function(s) { return !glob.hasMagic(s); }
    }
});

var AJV_OPTIONS = {
    'data':             { type: 'boolean' },
    'all-errors':       { type: 'boolean' },
    'verbose':          { type: 'boolean' },
    'json-pointers':    { type: 'boolean' },
    'unique-items':     { type: 'boolean' },
    'unicode':          { type: 'boolean' },
    'format':           { anyOf: [
                            { type: 'boolean' },
                            { enum: ['fast', 'full'] }
    ] },
    'unknown-formats':  { anyOf: [
                            { type: 'boolean' },
                            { const: 'ignore' },
                            { type: 'array', items: { type: 'string' } }
    ] },
    'schema-id':        { enum: ['$id', 'id'] },
    'extend-refs':      { anyOf: [
                            { type: 'boolean' },
                            { enum: ['ignore', 'fail'] }
    ] },
    'missing-refs':     { anyOf: [
                            { type: 'boolean' },
                            { enum: ['ignore', 'fail'] }
    ] },
    'inline-refs':      { type: ['boolean', 'integer'], minimum: 0 },
    'multiple-of-precision': { type: 'integer' },
    'error-data-path':  { enum: ['object', 'property'] },
    'messages':         { type: 'boolean' },
    // modifying options
    'remove-additional': { anyOf: [
                            { type: 'boolean' },
                            { enum: ['all', 'failing'] }
    ] },
    'use-defaults':     { type: 'boolean' },
    'coerce-types':     { anyOf: [
                            { type: 'boolean' },
                            { enum: ['array'] }
    ] }
};


module.exports = {
    check: checkOptions,
    get: getOptions
};


var DEFINITIONS = {
    stringOrArray: {
        anyOf: [
            { type: 'string' },
            {
                type: 'array',
                items: { type: 'string' }
            }
        ]
    }
};

function checkOptions(schema, argv) {
    schema.definitions = DEFINITIONS;
    if (schema._ajvOptions !== false) {
        for (var opt in AJV_OPTIONS) {
            var optSchema = AJV_OPTIONS[opt];
            schema.properties[opt] = optSchema;
            schema.properties[toCamelCase(opt)] = optSchema;
        }
    }
    schema.properties._ = schema.properties._ || { maxItems: 1 };
    schema.additionalProperties = false;

    var valid = ajv.validate(schema, argv);
    if (valid) return null;
    var errors = '';
    ajv.errors.forEach(function (err) {
        errors += 'error: ';
        switch (err.keyword) {
            case 'required':
                errors += 'parameter ' + parameter(err.params.missingProperty) + ' is required';
                break;
            case 'additionalProperties':
                errors += 'parameter ' + parameter(err.params.additionalProperty) + ' is unknown';
                break;
            case 'maxItems':
                errors += 'invalid syntax (too many arguments)';
                break;
            case 'format':
                if (err.params.format == 'notGlob') {
                    errors += 'only one file is allowed in parameter ' + parameter(err.dataPath.slice(1));
                    break;
                }
                // falls through
            default:
                errors += 'parameter ' + parameter(err.dataPath.slice(1)) + ' ' + err.message;
        }
        errors += '\n';
    });

    return errors;
}


function parameter(str) {
    return (str.length == 1 ? '-' : '--') + str;
}


function getOptions(argv) {
    var options = {};
    for (var opt in AJV_OPTIONS) {
        var optCC = toCamelCase(opt);
        var value = argv[opt] === undefined ? argv[optCC] : argv[opt];
        if (value !== undefined) options[optCC] = value;
    }
    return options;
}


function toCamelCase(str) {
    return str.replace(/-[a-z]/g, function (s) {
        return s[1].toUpperCase();
    });
}
