/**
 * @name UIServer
 * @version 0.0.1
 * @fileoverview starts and handles the UIServer
 */

var corciLibs = require('corci-libs');
var Common = corciLibs.Common;
var fs = require('fs');

var path = require('path');
var http = require('http');
var express = require('express');

/**
 * Constructor of UIServer
 * @class
 * @param {Object} conf - configuration (console options)
 */
function UIServer(conf) {
    this.conf = conf;
    this.www = path.resolve(__dirname, '../www');
}

UIServer.prototype.init = function () {
    var uiApp = express();
    var httpServer = http.createServer(uiApp);

    uiApp.get('/', this.rootRequest.bind(this))
        .use(express.static(this.www));

    var conf = this.conf;
    httpServer.listen(conf.port, conf.host, function () {
        console.log('Monitor is hosted at {0}://{1}{2}/\n'.format(
                conf.protocol, conf.host,
                conf.port === 80 ? '' : ':' + conf.port)
        );
    });
};

UIServer.prototype.rootRequest = function (req, res) {
    var conf = this.conf;
    var indexPath = path.resolve(this.www, 'index.html');
    fs.readFile(indexPath, 'utf-8', function (err, contents) {
        var html = contents.replace('<script id="start"></script>', '<script id="start">var serverBrowser = new ServerBrowser({0});</script>'.format(JSON.stringify({
            protocol: conf.masterprotocol+'://',
            host: conf.masterhost,
            port: conf.masterport,
            promote: conf.promote //@todo: examine effects
        })));
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    });
};

module.exports = UIServer;