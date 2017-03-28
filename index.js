var assert = require('assert');
var deviceToCloudClient = require('./lib/iothubClient.js');
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
    client.stopReadMessage();
  });
  
  it('get iot hub device-to-cloud message', function (done) {
    this.timeout(60000);
    var start;
    var count = 0;
    client.startReadMessage(consumerGroup, deviceId, function(message, time) {
      console.log(JSON.stringify(message));
      start = start || message.messageId;
      assert.equal(start + count, message.messageId);
      count++;
      // read 10 message and stop
      if(count === 10) {
        done();
      }
    });
  });
});