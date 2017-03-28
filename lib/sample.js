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
        stdio: ['pipe', 'ignore', process.stderr]
    };

    process.chdir('..');
    deviceConnectionString = '"' + deviceConnectionString + '"';
    console.log(deviceConnectionString);
    if (osVersion === 'darwin' || osVersion === 'win32') {
        ps = spawn('.run.cmd', [], option);
    } else {
        ps = spawn('./.run.sh', [deviceConnectionString], option);
    }
    isTerminate = false;
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    process.on('exit', stop);
}

var isTerminate = true;
function stop(code) {
    if (ps && !isTerminate) {
        ps.kill(code || 'SIGINT');
        isTerminate = true;
    }
}

module.exports.run = run;
module.exports.stop = stop;