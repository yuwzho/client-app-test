/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';
const fs = require('fs');
const os = require('os');
const spawn = require('child_process').spawn;

var ps;

function run(deviceConnectionString) {
    // check run file exist
    var osVersion = os.platform();
    var option = {
        stdio: ['pipe', process.stdout, process.stderr]
    };

    process.chdir('..');
    deviceConnectionString = '"' + deviceConnectionString + '"';
    console.log(deviceConnectionString);
    if (osVersion === 'darwin' || osVersion === 'win32') {
        ps = spawn('.run.cmd', [], option);
    } else {
        ps = spawn('./.run.sh', [deviceConnectionString], option);
    }
    var isTerminate = false;
    function terminate(code) {
        if (!isTerminate) {
            ps.kill(code);
            isTerminate = true;
        }
    }
    process.on('SIGINT', terminate);
    process.on('SIGTERM', terminate);
    process.on('exit', terminate);
}

function stop() {
    if (ps) {
        ps.kill('SIGINT');
    }
}

module.exports.run = run;
module.exports.stop = stop;