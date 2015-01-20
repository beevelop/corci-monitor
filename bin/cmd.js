#!/usr/bin/env node
require('corci-libs').utils;

var Common = require('corci-libs').Common;
var extend = Common.extend;
var yargs = Common.yargs;

var UIServer = require('../lib/UIServer');
var patch = require('corci-libs').patch;
// patch on to support binding with multiple events at once
patch(process.EventEmitter.prototype, ["on", "addListener"]);


var conf = yargs
    .help('help')
    .version('0.0.1', 'v')
    .alias('v', 'version')
    .showHelpOnFail(true)
    .usage('Starts the corCI-Monitor.\nUsage: $0')
    .options('p', {
        alias: 'port',
        default: 8080,
        describe: 'Port the server should use'
    })
    .options('q', {
        alias: 'protocol',
        default: 'http',
        describe: 'Protocol the server should use (https requires key and cert argument)'
    })
    .options('h', {
        alias: 'host',
        default: 'localhost',
        describe: 'Hostname the server should use'
    })
    .options('mp', {
        alias: 'masterport',
        default: 8000,
        describe: 'Port the master is reachable at'
    })
    .options('mq', {
        alias: 'masterprotocol',
        default: 'http',
        describe: 'Protocol the master is reachable at'
    })
    .options('mh', {
        alias: 'masterhost',
        default: 'localhost',
        describe: 'Hostname the master is reachable at'
    })
    .options('key', {
        describe: 'Path to the SSL key'
    })
    .options('cert', {
        alias: 'certificate',
        describe: 'Path to the SSL certificate'
    })
    .argv;

var server = new UIServer(conf);
server.init();