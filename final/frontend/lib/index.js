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
      start: Moment().subtract(10, 'minutes').utc().format(),
      end: Moment().utc().format()
    }, (err, points) => {
      if (err) {
        console.error(err);
      }

      if (!points || !points.length) {
        console.error('No points found');
        return;
      }

      let toEmit = [];
      points = [].concat.apply([], points);
      console.log('POINTS:');
      console.log(points);
      points.forEach((point) => {
        if (Moment(point.time).unix() > lastEmitted) {
          lastEmitted = Moment(point.time).unix();
          point.time = (new Date(point.time)).getTime();
          toEmit.push(point);
        }
      });

      if (toEmit.length) {
        webStream.emit([].concat.apply([], toEmit));
      }
    });
  }, 1000);
};
