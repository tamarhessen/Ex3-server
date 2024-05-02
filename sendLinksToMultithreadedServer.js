const net = require('net');

const multithreadedServerPort = 5555;
const multithreadedServerHost = 'localhost';

function sendLinksToMultithreadedServer(links) {
  const tcpClient = new net.Socket();

  tcpClient.connect(multithreadedServerPort, multithreadedServerHost, () => {
    console.log('Connected to multithreaded server');

    // Send links to the multithreaded server
    tcpClient.write(links.join('\n'));
  });

  tcpClient.on('data', (data) => {
    console.log('Received from multithreaded server:', data.toString());
  });

  tcpClient.on('error', (error) => {
    console.error('Error connecting to multithreaded server:', error);
  });

  tcpClient.on('close', () => {
    console.log('Connection to multithreaded server closed');
  });
}

module.exports = {
  sendLinksToMultithreadedServer,
};
