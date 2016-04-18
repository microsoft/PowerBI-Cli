/// <reference path="../typings/main.d.ts" />

'use strict'
import {Cli} from './cli';
import {CliConfig} from './cli-config';
import {CreateWorkspace} from './cli-create-workspace';
import {GetWorkspaces} from './cli-Get-workspaces';
import {Import} from './cli-import';
import {GetDatasets} from './cli-get-datasets';
import {UpdateConnection} from './cli-update-connection';

export module Main {
    let program = require('commander');
    let colors = require('colors');
    let err;
    let pkg = require('../package.json');

    program.version(pkg.version)
        .command('config', 'Set default configuration values')
        .command('create-workspace', 'Create a new workspace within an existing workspace collection')
        .command('get-workspaces', 'Gets a list of workspaces within an existing workspace collection')
        .command('update-connection', 'Update the connection string for a datasource')
        .command('import', 'Import a PBIX file to a workspace')
        .command('get-datasets', 'Gets a list of datasets within a workspace');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ powerbi --message hello');
    });

    program.parse(process.argv);

    if (process.argv.length === 2) {
        program.help();
    }
}