# MONGO DB

## So, you want to change the connection ip to the mongo db?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable CONNECTION_STRING

The ip is the 4 numbers divided by dots in the CONNECTION_STRING, change it to fit your needs.
For example the line should look like:
```
CONNECTION_STRING="mongodb://127.0.0.1:27017/facebook_server"
CONNECTION_STRING="mongodb://192.13.57.8:27017/facebook_server"
```

## So, you want to change the connection port to the mongo db?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable CONNECTION_STRING

The port is the number after the : in the CONNECTION_STRING, change it to fit your needs.
For example the line should look like:
```
CONNECTION_STRING="mongodb://127.0.0.1:27017/facebook_server"
CONNECTION_STRING="mongodb://127.0.0.1:12345/facebook_server"
```

## So, you want to change the db name in the mongo db?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable CONNECTION_STRING

The db name is the string after the / in the CONNECTION_STRING, change it to fit your needs.
For example the line should look like:
```
CONNECTION_STRING="mongodb://127.0.0.1:27017/facebook_server"
CONNECTION_STRING="mongodb://127.0.0.1:27017/my_server"
```