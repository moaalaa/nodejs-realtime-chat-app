// Modules                                  
const path = require('path');
const http = require('http');
const socketIO = require('socket.io')
const express = require('express');
const bodyParser = require('body-parser');
require('express-group-routes');

// Public Path
const publicPath = path.join(__dirname, '..', '/public');

// Init Express App                         
const app = express();

// Init Http Server For Socket.io
const server = http.createServer(app);
const io = socketIO(server);

// Set App Static Directory
app.use(express.static(publicPath))

// Use Body Parser                          
app.use(bodyParser.json());

// Port                                     
let port = process.env.PORT || 3000;

// Start Http Server
server.listen(port, () => console.log(`Server Started on Port ${port}`));


// Socket.io Connections
io.on('connection', socket => {
    console.log('New User Connected', socket.client.id);

    socket.on('disconnect', () => {
        console.log("Client Disconnected", socket.client.id);
    });
})