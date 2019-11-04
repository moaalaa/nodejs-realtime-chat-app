const socket = io();

function scrollToBottom() {
    // Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    // if message "scrollTop" and "clientHeight" and "innerHeight" and "prev message innerHeight" is greater than "scrollHeight"
    // make message "scrollTop" equal "scrollHeight" 
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected To Server');
});

socket.on('disconnect', function () {
    console.log('Disconnected From Server');
});

// listen on new Message
socket.on('new_message', function (message) {
    html = Mustache.render($('#message-template').html(), {
        from: message.from,
        text: message.text,
        createdAt: moment(message.createdAt).fromNow(),
    });

    $('#messages').append(html);
    
    scrollToBottom();
});

// listen on new location Message
socket.on('new_location_message', function (message) {
    
    html = Mustache.render($('#location-message-template').html(), {
        from: message.from,
        url: message.url,
        createdAt: moment(message.createdAt).fromNow(),
    });

    $('#messages').append(html);
    scrollToBottom();
});

// New Message Form
$('#message-form').on('submit', function (e) {
    e.preventDefault();
    
    var input = $('input[name=message]');

    // Emit New Message To Server
    socket.emit('create_message', {
        from: "User",
        text: input.val(),
        createdAt: new Date().getTime()
    }, function (data) {
        input.val('');
        console.log(data);
    });
});

$('#send-location').on('click', function () {
    if (! navigator.geolocation) {
        return alert("Geo Location Not Supported In Your Browser");
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('create_location_message', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        })
        
    }, function (error) {
        console.log(error);
        alert('Unable to fetch location.')
    })
})


