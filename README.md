# hermesjs-mqtt

MQTT adapter for [HermesJS](https://github.com/fmvilas/hermes).

## Installing

```
npm install hermesjs-mqtt
```

## Example

```js
const Hermes = require('hermesjs');
const MqttAdapter = require('hermesjs-mqtt');

const app = new Hermes();

app.addAdapter(MqttAdapter, {
  url: 'mqtt://test.mosquitto.org',
  topics: ['hola/+', 'adios/+'],
  config: {
    username: "username",
    password: "password",
    other_mqtt_config: "other_mqtt_config"
  }
});
```

See a working example [here](./example/index.js).

## Author

Fran Méndez ([fmvilas.com](https://fmvilas.com))
