'use strict';

// Load modules

const Path = require('path');
const Brule = require('brule');
const Hapi = require('hapi');
const Inert = require('inert');
const Moment = require('moment');
const Piloted = require('piloted');
const Seneca = require('seneca');
const ContainerPilot = require(process.env.CONTAINERPILOT);
const WebStream = require('./webStream');


Piloted.config(ContainerPilot, (err) => {
  const serializer = Piloted('serializer');

  const seneca = Seneca();
  seneca.client({
    host: serializer.address,
    port: serializer.port,
    pin: { role: 'serialize', cmd: 'read' }
  });

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

    const webStream = WebStream(server.listener);

    let lastEmitted = 0;
    let i = 0;
    setInterval(() => {
      seneca.act({
        role: 'serialize',
        cmd: 'read',
        sensorId: '1',
        start: Moment().subtract(10, 'minutes').utc().format(),
        end: Moment().utc().format()
      }, (err, data) => {
        let toEmit = [];

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

    server.start(() => {
      console.log(`listening at http://localhost:${server.info.port}`);
    });
  });
});
