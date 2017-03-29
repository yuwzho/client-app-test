/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';
const os = require('os');
const spawn = require('child_process').spawn;
const fork = require('child_process').fork;
const execSync = require('child_process').execSync;

var ps;

function run(deviceConnectionString, config) {
    // check run file exist
    process.chdir('..');
    var option = {
        stdio: ['pipe', 'ignore', process.stderr]
    };

    if (config.language === 'node') {
        execSync('npm install');
        option.stdio.push('ipc');
        ps = fork('index.js', [deviceConnectionString], option);
    } else if (config.language === 'c') {
        var sudo = '';
        var osVersion = os.platform();
        if (config.sudo && osVersion !== 'win32' && osVersion !== 'darwin') {
            sudo = 'sudo ';
        }
        execSync(sudo + 'cmake . && make');
        ps = spawn(sudo + './app', [deviceConnectionString], option);
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