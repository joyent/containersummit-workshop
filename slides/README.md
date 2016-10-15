## Setup
Clone the workshop repository to your local machine:

```bash
git clone https://github.com/joyent/containersummit-workshop
cd containersummit-workshop
yarn/npm install
```



## Building and scaling microservices with ContainerPilot and Node.js

* adapted from [_microservices-iot_](https://github.com/nearform/micro-services-tutorial-iot)
* adapted from [_microservices-workshop_](https://github.com/lloydbenson/microservices-workshop)

Presented by Wyatt Preul



### Challenges

* each challenge has its own folder
* read the README.md in each challenge for the instructions
* each subsequent challenge has the solution to the previous challenge



### Tools required

* docker
* Node.js (tested on version 6)



### Challenge 1

* Start the frontend so that it's listening on port 10001.
* Verify the results by pointing your browser to [http://localhost:10001]().
* You should see a chart. Simple!



### Modules used for frontend

* WebSockets - realtime data updates from server
* hapi - server framework (ask me if you have ?)
* rickshaw charts - charting for UI



### Challenge 2

* Use docker to pull the tutum/influxdb image
* Create and run an influxdb container and create a `sensors` database
* Verify results in dashboard (port 8083)



### Why InfluxDB?

* Good Node.js support
* Time-series database, perfect for sensor data stream



### Challenge 3 - microservices?

* not a new concept; see unix
* small, focused, decoupled components
* independently deployable
* well suited for Node.js



### Accelerated Development
* small components (easily grokked)
* independently deployable
* easily replaceable



### Some Benefits
* accelerated development
* [optimized for delete](http://vimeo.com/108441214)
* resilient, easy to scale



### Microservices tools used in the workshop

* Seneca
* Consul
* ContainerPilot
* Docker-compose



### Seneca?

* Node.js toolkit for microservices
* Uses actor model
* Doesn't care about transport, only JSON messages



### Challenge 3

* Start serializer with env variables to talk to influx
* Send serializer data and verify in influx dashboard
* ... stopping slides until challenge 11 ....



### Challenge 11

once ready to learn about Consul and ContainerPilot, open the next slide