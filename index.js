const mqtt = require('mqtt');
const HermesAdapter = require('hermesjs/lib/adapter');
const HermesMessage = require('hermesjs/lib/message');

class MqttAdapter extends HermesAdapter {
  async connect () {
    return this._connect();
  }

  async send (message, options) {
    return this._send(message, options);
  }

  _connect () {
    return new Promise((resolve) => {
      this.client = mqtt.connect(this.options.url || 'mqtt://localhost');

      this.client.on('connect', () => {
        this.emit('connect', { name: 'MQTT adapter', adapter: this });

        if (Array.isArray(this.options.topics)) {
          this.options.topics.forEach((topic) => {
            this.client.subscribe(topic || '#', {
              qos: this.options.qos || 0
            });
          });
        } else if (typeof this.options.topics === 'string') {
          this.client.subscribe(this.options.topics || '#', {
            qos: this.options.qos || 0
          });
        }

        this.client.on('message', (topic, message, packet) => {
          this.emit('message', this._createMessage(packet));
        });

        resolve(this.client);
      });

      this.client.on('error', (error) => {
        this.emit('error', error);
      });
    });
  }

  _send (message, options) {
    return new Promise((resolve, reject) => {
      this.client.publish(message.topic, message.payload, options || {
        qos: this.options.qos || 0,
        retain: this.options.retain || false
      }, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  _createMessage (packet) {
    const headers = {
      cmd: packet.cmd,
      retain: packet.retain,
      qos: packet.qos,
      dup: packet.dup,
      length: packet.length
    };

    return new HermesMessage(this.hermes, packet.payload, headers, packet.topic);
  }
}

module.exports = MqttAdapter;
