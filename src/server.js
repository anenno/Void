var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});
http.listen(5000,function(){
    console.log('listening on*:5000');
});




/*
//Shows when a user connects and disconnects to index.html
io.on('connection',function(socket){
    console.log('User Connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});
*/

var users = {};
var chatrooms = {};

io.sockets.on('connection',function(socket){

    //When client sends 'createalias'
    //Add alias to clients socket
    socket.on('createalias',function(alias){
        socket.alias = alias;
    }

    //Client sends 'joinroom'
    socket.on('joinroom',function(roomname){
        socket.join(roomname);
        socket.room.users[username] = socket.alias;


    }

    // When client sends 'sendmsg'
    // Update the chat with username and the msg
    socket.on('sendmsg',function(data){
        io.sockets.emit('updatechat',socket.username,data);
    });

    socket.on('joinroom',function(data){
        socket.join(data)
    })


}

//Shows the chat messages.
io.on('connection',function(socket){
  socket.on('chat message',function(msg){
    console.log('message: ' + msg);
  });
});
