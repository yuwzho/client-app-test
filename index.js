var assert = require('assert');
var deviceToCloudClient = require('./lib/device-to-cloud.js');
var credential = require('./lib/credential.js');
var sample = require('./lib/sample.js');
var IoTHubClient = require('./lib/iothubClient.js');

var client;
var consumerGroup;
var deviceId;

describe('Test client application', function() {
  before(function() {
    // start to run the client
    var deviceConnectionString = credential.getDeviceConnectionString();
    sample.run(deviceConnectionString);
    var iothubConnectionString = credential.getHubConnectionString();    
    client = new IoTHubClient(iothubConnectionString);
    consumerGroup = credential.getConsumerGroup();
    deviceId = credential.getDeviceId();
  });

  after(function() {
    sample.stop();
    client.startReadMessage();
  });
  
  it('get iot hub device-to-cloud message', function () {
    var start;
    var count = 0;
    client.startReadMessage(consumerGroup, deviceId, function(message, time) {
      var obj = JSON.parse(message);
      start = start || message.messageId;
      assert.equal(start + count, message.messageId);
      count++;
      // read 10 message and stop
      if(count === 10) {
        client.stopReadMessage();
      }
    });
  });
});