# Bloom filter

## So, you want to change the blacklist?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable BLACKLISTED_LINKS

In the following format enter the links you want to blacklist: "link1 link2 link3 ..."
For example the line should look like:
```
BLACKLISTED_LINKS="https://google.com http://google.com http://www.vampires.com"
```

## So, you want to change the bloom filter size?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable BLOOMFILTER_LENGTH

The number you put there will be the length of the bloom filter
For example the line should look like:
```
BLOOMFILTER_LENGTH=100
```

## So, you want to change the bloom filter functions?

Go to the config folder in the server (not the bloom filter server!)

There: open .env.local

you will find the variable BLOOMFILTER_FUNCTIONS

In the following format enter the functions you want to bloom filter to work with: "1 2"
For example the line should look like:
```
BLOOMFILTER_FUNCTIONS="1 2"
BLOOMFILTER_FUNCTIONS="1"
```