'use strict';

const Brule = require('brule');
const Hapi = require('hapi');
const Influx = require('influx');
const Seneca = require('seneca');
const InfluxUtil = require('./influxUtil');


const seneca = Seneca();

const createDatabase = function (cb) {
  setTimeout(() => {
    const initDb = Influx({host: 'influx', username: 'root', password: 'root'});
    initDb.createDatabase('temperature', (err) => {
      if (err) {
        console.error(`ERROR: ${err}`);
      }

      cb();
    });
  }, 3000);
};


createDatabase(() => {
  const db = Influx({host: 'influx', username: 'root', password: 'root', database: 'temperature'});
  const ifx = InfluxUtil(db);

  seneca.add({role: 'serialize', cmd: 'read'}, (args, cb) => {
    ifx.readPoints(args.sensorId, args.start, args.end, cb);
  });

  seneca.add({role: 'serialize', cmd: 'write'}, (args, cb) => {
    ifx.writePoint(args.sensorId, args.temperature, cb);
  });

  seneca.listen({ port: process.env.PORT });

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
