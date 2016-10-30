var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//h
//Send Initial page when client connects to homepage
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
http.listen(5000,function(){
    console.log('listening on*:5000');
});
app.get('/newchatroom.html',function(req,res){
    res.sendFile(__dirname + '/newchatroom.html');
});

//All active chat room names saved here
var chatrooms = [];

//All active users in the current room
io.sockets.on('connection',function(socket){

    //Client emits 'enterRoom'
    /*
     socket.on('enterRoom',function(app){
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
        //##########
        //This is not working properly yet
        //Show that the user has connected and the room they connected to
        socket.emit('updateChat','server:','You have joined room ' + socket.room);
        //Show all other users a new user has connected
        socket.broadcast.to(socket.room).emit('updateChat',socket.alias,' has joined chat');
        //##########

        //Log that a room has been created
        var flag = roomexists(chatrooms,roomname);
        if(flag == true){
            console.log('server: User:  ' + socket.alias + "joined " + socket.room);
            listrooms(chatrooms);
        }else{
            console.log('server: New Room Created - ' + socket.room);
            listrooms(chatrooms);
        }
        //Update Chatroom Names array
        chatrooms[roomname] = roomname;

    });

    //Client emits 'sendmsg'
    socket.on('sendmsg',function(data){
        //##########
        //This is no working properly yet
        io.sockets.in(socket.room).emit('updateChat',socket.alias,data);
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
function roomexists(chatrooms,roomname){
    for( i = 1; i < chatrooms.length; i++){
        if(roomname == chatrooms[i]){
            return true;
        }
    }
    return false;
}

