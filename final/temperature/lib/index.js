'use strict';

// Load modules

const Brule = require('brule');
const Hapi = require('hapi');
const Piloted = require('piloted');
const Seneca = require('seneca');


Piloted.config({ backends: [ { name: 'serializer' } ] }, (err) => {
  readData();

  const hapi = new Hapi.Server();
  hapi.connection({ port: process.env.PORT });
  hapi.register(Brule, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    hapi.start((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Hapi server started at http://127.0.0.1:${hapi.info.port}`);
    });
  });
});

const readData = function () {
    const serializer = Piloted('serializer');
    if (!serializer) {
      console.error('Serializer not found');
      return setTimeout(() => { readData(); }, 1000);
    }

    const seneca = Seneca();
    seneca.client({
      host: serializer.address,
      port: serializer.port
    });

    setInterval(() => {
      seneca.act({ role: 'serialize', cmd: 'write', sensorId: '1', temperature: Math.floor(Math.random() * 100) }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }, 2000);
};
