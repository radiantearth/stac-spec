'use strict';

module.exports = {
  draft6: draft6
};

var ajv, metaSchema4, metaSchemaV5, hyperSchema
  , migrateSchema, migrateSchemaV5, migrateHyperSchema;

function draft6(schema, opts) {
  opts = opts || {};
  ajv = ajv || getAjv(opts);
  if (opts.validateSchema !== false)
    ajv.validateSchema(schema, true);

  var v5 = schema.$schema == metaSchemaV5.id || (!schema.$schema && opts.v5);
  if (v5 && !migrateSchemaV5) {
    migrateSchemaV5 = JSON.parse(JSON.stringify(migrateSchema));
    migrateSchemaV5.$id = 'migrateSchemaV5';
    copy({
      contains: { $ref: '#' },
      patternGroups: {
        additionalProperties: {
          properties: {
            schema: { $ref: '#' }
          }
        }
      },
      'switch': {
        items: {
          properties: {
            'if': { $ref: '#' },
            then: { $ref: '#/definitions/booleanOrSchema' }
          }
        }
      }
    }, migrateSchemaV5.properties);
    ajv.addSchema(migrateSchemaV5);
  }

  if (schema.$schema == hyperSchema.id && !migrateHyperSchema) {
    migrateHyperSchema = JSON.parse(JSON.stringify(migrateSchema));
    migrateHyperSchema.$id = 'migrateHyperSchema';
    copy({
      links: {
        items: {
          properties: {
            targetSchema: { $ref: '#' },
            schema: { $ref: '#' }
          }
        }
      }
    }, migrateHyperSchema.properties);
    ajv.addSchema(migrateHyperSchema);
  }
  var migrateID = v5
                  ? 'migrateSchemaV5'
                  : schema.$schema == hyperSchema.id
                    ? 'migrateHyperSchema'
                    : 'migrateSchema';
  var migrate = ajv.getSchema(migrateID);
  migrate(schema);
  return schema;
}


function getAjv(opts) {
  var Ajv = require('ajv');
  ajv = new Ajv;
  metaSchema4 = require('ajv/lib/refs/json-schema-draft-04.json');
  metaSchemaV5 = require('ajv/lib/refs/json-schema-v5.json');
  hyperSchema =  require('./hyper-schema.json');
  ajv.addMetaSchema(metaSchema4);
  ajv._refs['http://json-schema.org/schema'] = metaSchema4.id;
  ajv.addMetaSchema(metaSchemaV5);
  ajv.addMetaSchema(hyperSchema);
  ajv._opts.defaultMeta = opts.v5
                          ? metaSchemaV5.id
                          : metaSchema4.id;

  ajv.addKeyword('migrateSchemaToDraft6', {
    valid: true,
    schema: false,
    modifying: true,
    metaSchema: { const: true },
    validate: function (dataSchema, dataPath, parentDataSchema, parentDataProperty) {
      if (typeof dataSchema != 'object') return;
      var keys = Object.keys(dataSchema);
      if (parentDataSchema) {
        if (keys.length == 0) {
          parentDataSchema[parentDataProperty] = true;
          return;
        }
        if (keys.length == 1 && keys[0] == 'not' && dataSchema.not === true) {
          parentDataSchema[parentDataProperty] = false;
          return;
        }
      }
      var dsCopy = copy(dataSchema);
      var key;
      for (key in dataSchema) delete dataSchema[key];
      for (var i=0; i<keys.length; i++) {
        key = keys[i];
        switch (key) {
          case 'id':
            dataSchema.$id = dsCopy.id;
            break;
          case '$schema':
            var $s = dsCopy.$schema;
            dataSchema.$schema = $s == metaSchema4.id || $s == metaSchemaV5.id
                                  ? 'http://json-schema.org/draft-06/schema#'
                                  :  $s == hyperSchema.id
                                    ? 'http://json-schema.org/draft-06/hyper-schema#'
                                    : $s;
            break;
          case 'constant':
            dataSchema.const = dsCopy.constant;
            break;
          case 'enum':
            if (Array.isArray(dsCopy.enum)
                && dsCopy.enum.length == 1
                && dsCopy.constant === undefined) {
              dataSchema.const = dsCopy.enum[0];
            } else {
              dataSchema.enum = dsCopy.enum;
            }
            break;
          case 'exclusiveMaximum':
            migrateExclusive('maximum');
            break;
          case 'exclusiveMinimum':
            migrateExclusive('minimum');
            break;
          case 'maximum':
            if (dsCopy.exclusiveMaximum !== true)
              dataSchema.maximum = dsCopy.maximum;
            break;
          case 'minimum':
            if (dsCopy.exclusiveMinimum !== true)
              dataSchema.minimum = dsCopy.minimum;
            break;
          default:
            dataSchema[key] = dsCopy[key];
        }
      }


      function migrateExclusive(limit) {
        if (dsCopy[key] === true)
          dataSchema[key] = dsCopy[limit];
        else if (dsCopy[key] !== false && dsCopy[key] !== undefined)
          console.warn(key + ' is not boolean');
      }
    }
  });

  migrateSchema = require('./migrate_schema.json');
  ajv.addSchema(migrateSchema);
  return ajv;
}


function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}
