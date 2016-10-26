var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Send Initial page when client connects to homepage
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
http.listen(5000,function(){
    console.log('listening on*:5000');
});
app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});

//All active chat room names saved here
var chatrooms = [];

//All active users in the current room


io.sockets.on('connection',function(socket){

    //Client emits 'enterRoom'
    /*
    socket.on('enterRoom',function(socket){
        app.get('/chatroom.html',function(req,res){
            res.sendFile(__dirname + '/chatroom.html');
        });
    });
    */

    //Client emits 'createalias'
    socket.on('createalias',function(alias){
        socket.alias = alias;
        //Log that a new alias has been created
        console.log('server: New Alias Created - ' + socket.alias);

    });

    //Client emits 'joinroom'
    socket.on('joinroom',function(roomname){
        socket.room = roomname;
        socket.join(roomname);
        chatrooms[roomname] = roomname;



        //##########
        //This is no working properly yet
        //Show that the user has connected and the room they connected to
        socket.emit('updateChat','server:','You have joined room ' + socket.room);
        //Show all other users a new user has connected
        socket.broadcast.to(socket.room).emit('updateChat',socket.alias,' has joined chat');
        //##########

        //Log that a room has been created
        console.log('server: New Room Created - ' + socket.room);
        listrooms(chatrooms);
    });

    //Client emits 'sendmsg'
    socket.on('sendmsg',function(data){
        //##########
        //This is no working properly yet
        io.sockets.in(socket.room).emit('updateChat',socket.username,data);
        //##########
    });

    //Client emits 'log_chat'
    socket.on('log_chat',function(msg,socket){
        console.log(msg);
    });


});


//Helper Functions
function listrooms(chatrooms){
    console.log('server: Current Active Rooms');
    for( i = 1; i < chatrooms.length; i++){
        console.log('server: RoomID - ' + chatrooms[i]);
    }
}

