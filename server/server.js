// Modules                                  
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
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
    console.log('New Client Connected', socket.client.id);
    
    socket.on('disconnect', () => {
        console.log("Client Disconnected", socket.client.id);
    });


    // Broadcast To All Sockets
    io.emit('new_message', {
        from: 'Admin',
        text: 'Welcome To Chat App',
        createdAt: new Date().getTime()
    });

    // Broadcast To All Sockets Except The Current / Fired Event Socket
    socket.broadcast.emit('new_message', {
        from: 'Admin',
        text: 'New User Joined',
        createdAt: new Date().getTime()
    });


    // listen Create Message
    socket.on('create_message', (message) => {
        console.log('Create Message', message);
        
        // Broadcast To All Sockets
        io.emit('new_message', message);

        // Broadcast To All Sockets Except The Current / Fired Event Socket
        // socket.broadcast.emit('new_message', message);
    });

    socket.emit('new_message', {
        from: 'Alaa',
        text: "Hay",
        createdAt: new Date().getTime()
    })


})