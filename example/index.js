const Hermes = require('hermesjs');
const MqttAdapter = require('..');

const hermes = new Hermes();

hermes.addAdapter(MqttAdapter, {
  url: 'mqtt://test.mosquitto.org',
  topics: ['hola/+', 'adios/+'],
});

hermes.use('hola/:name', (message, next) => {
  console.log(`Saying hola to ${message.params.name}: ${message.payload}`);
  message.reply(undefined, undefined, `adios/${message.params.name}`);
});

hermes.use('adios/:name', (message, next) => {
  console.log(`Saying adios to ${message.params.name}: ${message.payload}`);
  next();
});

hermes.use((err, message, next) => {
  console.log('ERROR', err);
  next();
});

hermes
  .listen()
  .then((adapter) => {
    console.log('Connected');
  })
  .catch(console.error);
