## Solution to Challenge 67

1. Add the following to the `docker-compose.yml` file

```
  temperature:
    build: ./temperature
    links:
      - serializer:serializer
    environment:
      - SERIALIZER_HOST=serializer
      - SERIALIZER_PORT=10000
      - SMARTTHINGS_HOST=64.30.129.48
      - SMARTTHINGS_PORT=8000
    restart: always
```

2. Build and run the containers `docker-compose up -d`
3. Point your browser to [http://localhost:10001/]() to see the chart.
4. Write data to the serializer using the `serializer/testWrite.sh` script.

Stop the containers by using the `docker-compose down`.


## Challenge 8

![image](../images/challenge8.png)

Instead of relying on random temperature data, we will connect a microservice to a data feed coming from a [Samsung SmartThings](http://smartthings.com/) hub. The hub is networked using the z-wave protocol to a MultiSensor. A custom app runs on the hub that handles temperature events and forwards them to a server running in a docker container on [Triton](https://www.joyent.com/triton).

For this challenge, add an entry to the `docker-compose.yml` for the temperature microservice and configure it to connect to the SmartThings service running on Triton.

__hint__ If you look at the temperature service code you will see that it uses the following environment variables:

* `SERIALIZER_HOST`
* `SERIALIZER_PORT`
* `SMARTTHINGS_HOST=64.30.129.48`
* `SMARTTHINGS_PORT=8000`

__hint__ use `docker-compose logs -f` to see the logs

__hint__ use `docker-compose up -d --build` to rebuild and run


## Next Up: [Challenge 8](../challenge8/README.md)