var assert = require('assert');
var deviceToCloudClient = require('./lib/iothubClient.js');
var credential = require('./lib/credential.js');
var sample = require('./lib/sample.js');
var IoTHubClient = require('./lib/iothubClient.js');

var client;
var consumerGroup;
var deviceId;

describe('Test client application', function () {
  before(function () {
    this.timeout(60000);

    // start to run the client
    var deviceConnectionString = credential.getDeviceConnectionString();
    sample.run(deviceConnectionString);
    var iothubConnectionString = credential.getHubConnectionString();
    client = new IoTHubClient(iothubConnectionString);
    consumerGroup = credential.getConsumerGroup();
    deviceId = credential.getDeviceId();
  });

  after(function () {
    sample.stop();
    client.stopReadMessage();
  });

  it('get iot hub device-to-cloud message', function (done) {
    this.timeout(30000);
    this.slow(15000);
    var start;
    var count = 0;
    client.startReadMessage(consumerGroup, deviceId, function (message, time) {
      start = start || message.messageId;
      assert.equal(start + count, message.messageId);
      count++;
      // read 10 message and stop
      if (count === 5) {
        client.stopReadMessage();
        done();
      }
    });
  });

  it('send iot hub device-method to stop', function (done) {
    var timeoutInSeconds = 10;
    this.timeout(timeoutInSeconds * 2 * 1000);
    this.slow(1000);
    client.deviceMethod(deviceId, 'stop', null, timeoutInSeconds, function (err, result) {
      if (err) {
        done(err);
      } else {
        assert.equal(200, result.status);
        assert.equal('Successfully invoke device method', result.payload);
        done();
      }
    });
  });

  it('send iot hub device-method to start', function (done) {
    var timeoutInSeconds = 10;
    this.timeout(timeoutInSeconds * 2 * 1000);
    this.slow(5000);
    client.deviceMethod(deviceId, 'start', null, timeoutInSeconds, function (err, result) {
      if (err) {
        done(err);
      } else {
        assert.equal(200, result.status);
        assert.equal('Successfully invoke device method', result.payload);
        client.stopReadMessage();
        setTimeout(function () {
          client.startReadMessage(consumerGroup, deviceId, function (message, time) {
            client.stopReadMessage();
            done();
          });
        }, 500);
      }
    });
  });


});