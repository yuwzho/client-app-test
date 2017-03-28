/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';

var EventHubClient = require('azure-event-hubs').Client;

// Close connection to IoT Hub.
IoTHubClientCreator.prototype.stopReadMessage = function () {
  if (this.readerOpen) {
    this.iotHubClient.close();
  }
}

// Read device-to-cloud messages from IoT Hub.
IoTHubClientCreator.prototype.startReadMessage = function (consumerGroupName, deviceId, cb) {
  var printError = function (err) {
    console.error(err.message || err);
  };

  this.readerOpen = true;

  this.iotHubClient.open()
    .then(this.iotHubClient.getPartitionIds.bind(this.iotHubClient))
    .then(function (partitionIds) {
      return partitionIds.map(function (partitionId) {
        return this.iotHubClient.createReceiver(consumerGroupName, partitionId, {
          'startAfterTime': Date.now() - 10000
        })
          .then(function (receiver) {
            receiver.on('errorReceived', printError);
            receiver.on('message', (message) => {
              var fromDevice = message.annotations['iothub-connection-device-id'];
              if (!deviceId || (deviceId === fromDevice)) {
                cb(message.body, Date.parse(message['enqueuedTimeUtc']));
              }
            });
          }.bind(this));
      }.bind(this));
    }.bind(this))
    .catch(printError);
}



function IoTHubClientCreator(connectionString) {
  this.iotHubClient = EventHubClient.fromConnectionString(connectionString);
}

module.exports = IoTHubClientCreator;