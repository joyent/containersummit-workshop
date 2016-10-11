'use strict';

// Load modules

const Brule = require('brule');
const Hapi = require('hapi');
const Piloted = require('piloted');
const Seneca = require('seneca');
const ContainerPilot = require(process.env.CONTAINERPILOT_PATH);


Piloted.config(ContainerPilot, (err) => {
  const serializer = Piloted('serializer');

  const seneca = Seneca();

  const hapi = new Hapi.Server();
  hapi.connection({ host: 127.0.0.1, port: 8080 });
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

      console.log(`Hapi server started at http://127.0.0.1:${hapi.info.address().port}`);
    });
  });
});
