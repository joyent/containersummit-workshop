## Solution to Challenge 5

1. InfluxDB can be started with the run script `./influx/run.sh`
2. The frontend can be built with `docker build . -t frontend` in the `/frontend` folder
3. The serializer can be built with `docker build . -t serializer` in the `/serializer` folder
4. Get the IPAddress of the influx container `docker inspect [ContainerID] | grep IPAddress`
5. Start the serializer

```sh
docker run -d -p 10000:10000 -e PORT=10000 -e INFLUXDB_HOST=172.17.0.2 -e INFLUXDB_USER=root -e INFLUXDB_PWD=root serializer
```

6. Get the IPAddress of the serializer container `docker inspect [ContainerID] | grep IPAddress`
7. Start the frontend

```sh
docker run -d -p 10001:10001 -e SERIALIZER_HOST=172.17.0.3 -e SERIALIZER_PORT=10000 -e PORT=10001 frontend
```

8. Point your browser to [http://localhost:10001/]() to see the chart.
9. Write data to the serializer using the `serializer/testWrite.sh` script.

Stop the containers by using the `docker kill` or `docker stop` commands.


## Challenge 6

![image](../images/challenge6.png)

Docker-compose makes managing and linking the various containers easier. For this challenge, use `docker-compose` to build and run the containers. There is a `docker-compose.yml` for your convenience


__hint__ read about the [`docker-compose run`](https://docs.docker.com/compose/reference/run/) command


## Next Up: [Challenge 7](../challenge7/README.md)