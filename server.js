var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Send Initial page when client connects to homepage
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

//Send chatroom.html when client emits enterRoom


http.listen(5000,function(){
    console.log('listening on*:5000');
});

var users = {};
var chatrooms = [];

io.sockets.on('connection',function(socket){

    socket.on('enterRoom',function(socket){
        app.get('/chatroom.html',function(req,res){
            res.sendFile(__dirname + '/chatroom.html');
        });
    });

    //When client sends 'createalias'
    //Add alias to clients socket
    socket.on('createalias',function(alias){
        socket.alias = alias;
        //users[alias] = alias;
        //Log that a new alias has been created
        console.log('SERVER: New Alias Created - ' + socket.alias);

    });

    //Client sends 'joinroom'
    socket.on('joinroom',function(roomname){
        socket.join(roomname);
        chatrooms[roomname] = roomname;

        //Log that a room has been created
        console.log('SERVER: New Room Created - ' + roomname);
        listrooms(chatrooms);
    });

    /*
    // When client sends 'sendmsg'
    // Update the chat with username and the msg
    socket.on('sendmsg',function(data){
        io.sockets.emit('updatechat',socket.username,data);
    });

    socket.on('joinroom',function(data){
        socket.join(data)
    })
    */



});
//Shows the chat messages.
io.on('connection',function(socket){
  socket.on('chat message',function(msg){
    console.log('message: ' + msg);
  });
});

//Helper Functions
function listrooms(chatrooms){
    console.log('SERVER: Current Active Rooms');
    for( i = 1; i < chatrooms.length; i++){
        console.log(chatrooms[i]);
    }
}
