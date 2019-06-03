const socket = io();

socket.on('connect', function () {
    console.log('Connected To Server');

    // Emit Create Message
    socket.emit('create_message', { 
        from: "Alaa", 
        text: "Hello, World",
        createdAt: new Date().getTime()
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected From Server');
});

// listen on new Message
socket.on('new_message', function (message) {
    console.log('New Message', message);
});

