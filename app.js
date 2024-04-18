const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const customEnv = require('custom-env');
const { sendLinksToMultithreadedServer } = require('./sendLinksToMultithreadedServer');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

customEnv.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const postRoutes = require('./routes/post');
app.use('/', postRoutes);

const expressServer = app.listen(process.env.PORT_MONGO, () => {
  console.log('Express server started on port: ' + process.env.PORT_MONGO);

  // Assuming you have an array of links to send
  const links = ['link1', 'link2', 'link3'];

  // Call the function to send links to the multithreaded server
  sendLinksToMultithreadedServer(links);
});

module.exports = expressServer;
