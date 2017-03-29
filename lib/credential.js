/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';

const DEVICE_CONNECTION_STRING = 'AzureIoTHubDeviceConnectionString';
const HUB_CONNECTION_STRING = 'AzureIoTHubConnectionString';
const CONSUMER_GROUP = 'AzureIoTHubConsumerGroup';
const DEVICE_ID = 'AzureIoTHubDeviceId';

const readlineSync = require('readline-sync');
const unquote = require('unquote');

var option;
var rl;

function getDeviceConnectionString() {
    return getCredential(DEVICE_CONNECTION_STRING);
}

function getHubConnectionString() {
    return getCredential(HUB_CONNECTION_STRING);
}

function getConsumerGroup() {
    return getCredential(CONSUMER_GROUP, '$Default');
}

function getDeviceId() {
    return getCredential(DEVICE_ID);
}

function setOption(config) {
    option = Object.assign({ autotest: true }, config);
}

function getCredential(variable, defaultValue) {
    process.env[variable] = process.env[variable] || readIn(variable, defaultValue);
    if (!process.env[variable]) {
        throw ('no ' + variable + ' found, please set environment variable');
    }
    return unquote(process.env[variable]);
}

function readIn(variable, defaultValue) {
    if (option.autotest) { return; }
    var value = defaultValue ? '(' + defaultValue + ')' : '';
    var answer = readlineSync.question('Input your ' + variable + ':' + value);
    if (answer.trim() === '') {
        answer = defaultValue;
    }
    return answer
}

module.exports.getDeviceConnectionString = getDeviceConnectionString;
module.exports.getHubConnectionString = getHubConnectionString;
module.exports.getConsumerGroup = getConsumerGroup;
module.exports.getDeviceId = getDeviceId;
module.exports.setOption = setOption;