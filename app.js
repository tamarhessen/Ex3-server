const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const customEnv = require('custom-env');

// Load environment variables from a custom file
customEnv.env(process.env.NODE_ENV, './config');

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(bodyParser.json({ limit: '5mb' })); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Routes
const postRoutes = require('./routes/post'); // Import the chat routes
app.use('/', postRoutes); // Mount the chat routes on the root path

// Start the server
const PORT_MONGO = process.env.PORT_MONGO || 5000; // Default port is 5000
app.listen(PORT_MONGO, () => {
    console.log(`Server started on port: ${PORT_MONGO}`);
});

// Start WebSocket server for communication
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT_COMMUNICATION = process.env.PORT_COMMUNICATION || 9000; // Default port is 9000
httpServer.listen(PORT_COMMUNICATION, () => {
    console.log(`WebSocket server started on port: ${PORT_COMMUNICATION}`);
});
