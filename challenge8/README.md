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




## Next Up: [Challenge 9](../challenge9/README.md)