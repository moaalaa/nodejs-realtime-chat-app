const socket = io();

socket.on('connect', function () {
    console.log('Connected To Server');
});

socket.on('disconnect', function () {
    console.log('Disconnected From Server');
});

// listen on new Message
socket.on('new_message', function (message) {
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});

// Emit Create Message
socket.emit('create_message', {
    from: "Alaa",
    text: "Hello, World",
    createdAt: new Date().getTime()
}, function (data) {
    console.log(data);
});

// New Message Form
$('#message-form').on('submit', function (e) {
    e.preventDefault();
    
    var input = $('input[name=message]');
    $('.send').addClass('is-loading');

    socket.emit('create_message', {
        from: "User",
        text: input.val(),
        createdAt: new Date().getTime()
    }, function (data) {
        input.val('')
        $('.send').removeClass('is-loading');
        console.log(data);
    });
});