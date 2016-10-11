'use strict';

// Load modules

const Brule = require('brule');
const Hapi = require('hapi');
const Piloted = require('piloted');
const Seneca = require('seneca');


Piloted.config({ backends: [ { name: 'serializer' } ] }, (err) => {
  const serializer = Piloted('serializer');

  const seneca = Seneca();

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
