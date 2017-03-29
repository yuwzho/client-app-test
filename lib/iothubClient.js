/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var HubClient = require('azure-iothub').Client;

ClientInstance.prototype.deviceMethod = function (deviceId, method, payload, timeout, cb) {
  var params = {
    methodName: method,
    payload: payload || '',
    timeoutInSeconds: timeout || 30
  };

  this.iothubClient.invokeDeviceMethod(deviceId, params, cb);
}


// Close connection to IoT Hub.
ClientInstance.prototype.stopReadMessage = function () {
  if (this.readerOpen) {
    this.eventHubClient.close();
  }
}

// Read device-to-cloud messages from IoT Hub.
ClientInstance.prototype.startReadMessage = function (consumerGroupName, deviceId, cb) {
  var printError = function (err) {
    console.error(err.message || err);
  };

  var _eventHubClient = this.eventHubClient;
  _eventHubClient.cb = cb;

  this.readerOpen = true;

  _eventHubClient.open()
    .then(_eventHubClient.getPartitionIds.bind(_eventHubClient))
    .then(function (partitionIds) {
      return partitionIds.map(function (partitionId) {
        return _eventHubClient.createReceiver(consumerGroupName, partitionId, {
          'startAfterTime': Date.now()
        })
        .then(function (receiver) {
          receiver.on('errorReceived', printError);
          receiver.on('message', (message) => {
            var fromDevice = message.annotations['iothub-connection-device-id'];
            if (!deviceId || (deviceId === fromDevice)) {
              _eventHubClient.cb(message.body, Date.parse(message['enqueuedTimeUtc']));
            }
          });
        });
      });
    })
    .catch(printError);
}



function ClientInstance(connectionString) {
  this.eventHubClient = EventHubClient.fromConnectionString(connectionString);
  this.iothubClient = HubClient.fromConnectionString(connectionString);
}

module.exports = ClientInstance;