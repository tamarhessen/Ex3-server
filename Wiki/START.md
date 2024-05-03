# Starting the program

So... you want to run the facebook program, well no worries this wiki will help you do it

Firstly download the server from: https://github.com/tamarhessen/Ex3-server.git

You should go to the branch called: EX4 for the latest version as we can't merge it to main until EX3 is checked.

But wait! you can't run it yet, you need to download the bloom filter server.

Download the server from: https://github.com/tamarhessen/Ex4.git

Great you are all set now only to compile and run.

To run the bloom filter: in terminal:
```
make server
./server
```

And that's it the bloom filter server is ready! horray!

Now we only need to run the facebook server: 

Luckily for you, we added to modes linux mode and windows mode

If you have linux:
```
npm run linux
```

If you have windows:
```
npm run windows
```

And that's it, the server is up and running.

Go to localhost:5000 to see it.