/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';
const fs = require('os');
const spawn = require('child_process').spawn;

var ps;

function run(deviceConnectionString) {
    // check run file exist
    var osVersion = os.platform();
    var option = {
        stdio: ['pipe', 'ignore', procee.stderr]
    };
    if (osVersion === 'darwin' || osVersion === 'win32') {
        ps = spawn('cmd.exe', ['/c', '..\\.run.cmd', '"' + deviceConnectionString + '"'], option);
    } else {
        ps = spawn('../.run.sh', ['\'' + deviceConnectionString + '\''], option);
    }
    isTerminate = false;
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
    ps.kill('SIGTERM');
}

module.exports.run = run;
module.exports.stop = stop;