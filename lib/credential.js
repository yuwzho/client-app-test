/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';

const DEVICE_CONNECTION_STRING = 'AzureIoTHubDeviceConnectionString';
const HUB_CONNECTION_STRING = 'AzureIoTHubConnectionString';
const CONSUMER_GROUP = 'AzureIoTHubConsumerGroup';
const DEVICEID = 'AzureIoTHubDeviceId';

function getDeviceConnectionString() {
    if (!process.env[DEVICE_CONNECTION_STRING]) {
        console.error('No environment variable ' + DEVICE_CONNECTION_STRING + ' found');
    }
    return process.env[DEVICE_CONNECTION_STRING];
}

function getHubConnectionString() {
    if (!process.env[HUB_CONNECTION_STRING]) {
        console.error('No environment variable ' + HUB_CONNECTION_STRING + ' found');
    }
    return process.env[HUB_CONNECTION_STRING];
}

function getConsumerGroup() {
    if (!process.env[CONSUMER_GROUP]) {
        console.error('No environment variable ' + CONSUMER_GROUP + ' found');
    }
    return process.env[CONSUMER_GROUP];
}

function getDeviceId() {
    if (!process.env[DEVICEID]) {
        console.error('No environment variable ' + DEVICEID + ' found');
    }
    return process.env[DEVICEID];
}

module.exports.getDeviceConnectionString = getDeviceConnectionString;
module.exports.getHubConnectionString = getHubConnectionString;
module.exports.getConsumerGroup = getConsumerGroup;
module.exports.getDeviceId = getDeviceId;