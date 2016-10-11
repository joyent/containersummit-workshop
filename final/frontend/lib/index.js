'use strict';

// Load modules

const Path = require('path');
const Brule = require('brule');
const Hapi = require('hapi');
const Inert = require('inert');
const Moment = require('moment');
const Piloted = require('piloted');
const Seneca = require('seneca');
const WebStream = require('./webStream');


Piloted.config({ backends: [ { name: 'serializer' } ] }, (err) => {
  if (err) {
    console.error(err);
  }

  const serverConfig = {
    connections: {
      routes: {
        files: {
          relativeTo: Path.join(__dirname, 'public')
        }
      }
    }
  };

  const server = new Hapi.Server(serverConfig);
  server.connection({ port: process.env.PORT });
  server.register([Inert, Brule], () => {
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
    });

    startReading(server.listener);

    server.start(() => {
      console.log(`listening at http://localhost:${server.info.port}`);
    });
  });
});

const startReading = function (listener) {
  const serializer = Piloted('serializer');
  if (!serializer) {
    console.error('Serializer not found');
    return setTimeout(() => { startReading(listener); }, 1000);
  }

  const webStream = WebStream(listener);
  const seneca = Seneca();

  seneca.client({
    host: serializer.address,
    port: serializer.port
  });

  let lastEmitted = 0;
  let i = 0;
  setInterval(() => {
    seneca.act({
      role: 'serialize',
      cmd: 'read',
      sensorId: '1',
      start: Moment().subtract(1000, 'minutes').utc().format(),
      end: Moment().utc().format()
    }, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      if (!data) {
        console.error('No data found');
        return;
      }

      let toEmit = [];
      console.log(data);

      data[0].forEach((point) => {
        if (Moment(point.time).unix() > lastEmitted) {
          lastEmitted = Moment(point.time).unix();
          point.time = (new Date(point.time)).getTime();
          toEmit.push(point);
        }
      });
      if (toEmit.length) {
        console.log('will emit');
        console.log(toEmit);
        webStream.emit(toEmit);
      }
    });
  }, 1000);
};
