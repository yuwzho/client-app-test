/*
 * IoT Hub Client App - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
 */
'use strict';

var EventHubClient = require('azure-event-hubs').Client;

// Close connection to IoT Hub.
IoTHubClient.prototype.stopReadMessage = function () {
  this.iotHubClient.close();
}

// Read device-to-cloud messages from IoT Hub.
IoTHubClient.prototype.startReadMessage = function (consumerGroupName, deviceId, cb) {
  var printError = function (err) {
    console.error(err.message || err);
  };

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
              var fromDevice = eventData.annotations['iothub-connection-device-id'];
              if (!deviceId || (deviceId === fromDevice)) {
                cb(message.body, Date.parse(message.systemProperties['x-opt-enqueued-ime']));
              }
            });
          }.bind(this));
      }.bind(this));
    }.bind(this))
    .catch(printError);
}



function IoTHubClient(connectionString) {
  this.iotHubClient = EventHubClient.fromConnectionString(connectionString);
}

module.exports = IoTHubClient;