// Modules                                  
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users}= require('./utils/users');
require('express-group-routes');

// Public Path
const publicPath = path.join(__dirname, '..', '/public');

// Init Express App                         
const app = express();

// Init Http Server For Socket.io
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

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
    socket.on('disconnect', () => {

        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('update_users_list', users.getUsersList(user.room));
            io.to(user.room).emit('new_message', generateMessage('Admin', `${user.name} has left.`));
        }
        
    });


    // Broadcast To All Sockets
    // io.emit('new_message', generateMessage('Admin','Welcome To Chat App'));
    
    // Broadcast To current socket
    // socket.emit('new_message', generateMessage('Admin','Welcome To Chat App'));

    // Broadcast To All Sockets Except The Current / Fired Event Socket
    // socket.broadcast.emit('new_message', generateMessage('Admin', 'New User Joined'));

    socket.on('join', (params, callback) => {
        if (! isRealString(params.name) || ! isRealString(params.room_name)) {
            return callback('name and room name are required');
        }

        // Join a room by default on connection "socket" join a "room" it's name be "socket" id
        socket.join(params.room_name);
        users.removeUser(socket.id);
        users.createUser(socket.id, params.name, params.room_name);

        // Leave a room
        // socket.leave(params.room_name);
        
        io.to(params.room_name).emit('update_users_list', users.getUsersList(params.room_name));

        // Broadcast To current socket in room
        socket.emit('new_message', generateMessage('Admin','Welcome To Chat App'));

        // Broadcast To All Sockets Except The Current / Fired Event Socket in room
        socket.broadcast.to(params.room_name).emit('new_message', generateMessage('Admin', `${params.name} Joined`));

        callback();
    });

    // listen Create Message
    socket.on('create_message', (message, callback) => {
        console.log('Create Message', message);
        
        const user = users.getUser(socket.id);

        if (! user) {
            return;
        }

        // Broadcast To All Sockets
        io.to(user.room).emit('new_message', generateMessage(message.from, message.text));

        // Event Acknowledgements for current socket only
        callback('This Is From Server.');

        // Broadcast To All Sockets Except The Current / Fired Event Socket
        // socket.broadcast.emit('new_message', message);
    });

    socket.on('create_location_message', coords => {

        const user = users.getUser(socket.id);

        if (! user) {
            return;
        }

        io.to(user.room).emit('new_location_message', generateLocationMessage(message.from, coords.latitude, coords.longitude))
    });


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