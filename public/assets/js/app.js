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

// listen on new location Message
socket.on('new_location_message', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>');
    
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

// New Message Form
$('#message-form').on('submit', function (e) {
    e.preventDefault();
    
    var input = $('input[name=message]');
    $('.send').addClass('is-loading');

    // Emit New Message To Server
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


