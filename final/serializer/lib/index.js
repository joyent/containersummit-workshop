'use strict';

const Brule = require('brule');
const Hapi = require('hapi');
const Influx = require('influx');
const Seneca = require('seneca');


const db = Influx({host: 'influx', username: process.env.INFLUXDB_USER, password: process.env.INFLUXDB_PWD, database: 'temperature'});

const seneca = Seneca();
seneca.add({role: 'serialize', cmd: 'read'}, (args, cb) => {
  readPoints(args.sensorId, args.start, args.end, cb);
});

seneca.add({role: 'serialize', cmd: 'write'}, (args, cb) => {
  writePoint(args.sensorId, args.temperature, cb);
});

seneca.listen({ port: process.env.PORT });

const hapi = new Hapi.Server();
hapi.connection({ host: '127.0.0.1', port: 8080 });
hapi.register(Brule, (err) => {
  if (err) {
    console.error(err);
  }

  hapi.start((err) => {
    if (err) {
      console.error(err);
    }

    console.log(`Hapi server started at http://127.0.0.1:${hapi.info.port}`);
  });
});



function writePoint (sensorId, temperature, cb) {
  db.writePoint('temperature', {sensorId: sensorId, temperature: temperature}, {}, cb);
};

function readPoints (sensorId, start, end, cb) {
  const query = `select * from temperature where sensorId='${sensorId}' and time > '${start}'`;
  db.query(query, cb);
};