// Modules                                  
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
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
    
    socket.on('disconnect', () => console.log("Client Disconnected", socket.client.id) );


    // Broadcast To All Sockets
    // io.emit('new_message', generateMessage('Admin','Welcome To Chat App'));
    
    // Broadcast To current socket
    // socket.emit('new_message', generateMessage('Admin','Welcome To Chat App'));

    // Broadcast To All Sockets Except The Current / Fired Event Socket
    // socket.broadcast.emit('new_message', generateMessage('Admin', 'New User Joined'));

    socket.on('join', (params, callback) => {
        if (! isRealString(params.name) || ! isRealString(params.room_name)) {
            callback('name and room name are required');
        }

        // Join a room by default on connection "socket" join a "room" it's name be "socket" id
        socket.join(params.room_name);
        
        // Leave a room
        // socket.leave(params.room_name);


        
        // Broadcast To current socket in room
        socket.emit('new_message', generateMessage('Admin','Welcome To Chat App'));

        // Broadcast To All Sockets Except The Current / Fired Event Socket in room
        socket.broadcast.to(params.room_name).emit('new_message', generateMessage('Admin', `${params.name} Joined`));

        callback();
    });

    // listen Create Message
    socket.on('create_message', (message, callback) => {
        console.log('Create Message', message);
        
        // Broadcast To All Sockets
        io.emit('new_message', generateMessage(message.from, message.text));

        // Event Acknowledgements for current socket only
        callback('This Is From Server.');

        // Broadcast To All Sockets Except The Current / Fired Event Socket
        // socket.broadcast.emit('new_message', message);
    });

    socket.on('create_location_message', coords => {
        io.emit('new_location_message', generateLocationMessage("Alaa", coords.latitude, coords.longitude))
    })


    // Emit / Broadcast Types
    // This Works to send to all users and not to specific room so it's not private chat as we can say

    // Broadcast To All Sockets
    // io.emit('new_message', generateMessage('Admin','Welcome To Chat App'));

    // Broadcast for current socket only
    // socket.emit('new_message', generateMessage('Alaa', 'Hay') )
    
    // Broadcast To All Sockets Except The Current Socket
    // socket.broadcast.emit('new_message', generateMessage('Admin', 'New User Joined'));

    // Emit / Broadcast Types Private
    // just chain "to()" before any emit and it will make the message private for specified "room" only 

    // Broadcast To All Sockets in a specific room
    // io.to("room_name").emit('new_message', generateMessage('Admin','Welcome To Chat App'));

    // Broadcast for current socket only in a specific room but not sense to specify a room because it will broadcast for current "socket"
    // socket.to("room_name").emit('new_message', generateMessage('Alaa', 'Hay') )
    
    // Broadcast To All Sockets Except The Current Socket in a specific room
    // socket.broadcast.to("room_name").emit('new_message', generateMessage('Admin', 'New User Joined'));


})