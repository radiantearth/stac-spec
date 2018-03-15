#! /usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var commands = require('./commands');
var options = require('./commands/options');

var command = argv._[0] || 'validate';
var cmd = commands[command];

if (cmd) {
    var errors = options.check(cmd.schema, argv);
    if (errors) {
        console.error(errors);
        commands.help.usage();
        process.exit(2);
    } else {
        var ok = cmd.execute(argv);
        process.exit(ok ? 0 : 1);
    }
} else {
    console.error('Unknown command', command);
    commands.help.usage();
    process.exit(2);
}
