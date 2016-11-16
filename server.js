/*##################################################
                 NEW SERVER CODE                   #
 ##################################################*/
var PORT = 5000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var path  = require('path');

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});

io.on('connection',function(socket){
    socket.on('updateChat',function(from,msg){
        io.emit('updateChat',from,msg);
    });
    socket.on('joinRoom',function(user){
        io.emit('joinRoom',user);
    });
});
//Listener
http.listen(PORT,function(){
    console.log('listening on*:'+PORT);
});
//###################################################



/*#################################################
                OLD SERVER CODE                   #
##################################################
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 5000;

//Send Initial page when client connects to homepage
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
http.listen(PORT,function(){
    console.log('listening on*:'+PORT);
});
app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});
//###################################################






//All active chat room names saved here
var chatrooms = [];

//All active users in the current room
io.sockets.on('connection',function(socket){
    //Client emits 'createalias'
    socket.on('createalias',function(alias){
        socket.alias = alias;
        //Log that a new alias has been created
        console.log('server: New Alias Created - ' + socket.alias);

    });

    //Client emits 'joinroom'
    socket.on('joinroom',function(roomname){
        //save roomname in socket
        socket.room = roomname;
        //join room - Assign socket to roomname
        socket.join(roomname);
        socket.emit('updateRoomName',roomname);
        //emit updateChat only for this socket - No other users in room should see this. It should
        //only update this sockets chatroom.html
        socket.emit('updateChat','server:','You have joined room ' + socket.room);
        //Show all other users a new user has connected
        socket.broadcast.to(socket.room).emit('updateChat',socket.alias,' has joined chat');
        //Log that a room has been created or that a user has a joined a specific room.
        var flag = roomexists(chatrooms,roomname);
        if(flag == true){
            console.log('server: User:  ' + socket.alias + "joined " + socket.room);
            listrooms(chatrooms);
        }else{
            console.log('server: New Room Created - ' + socket.room);
            chatrooms[roomname] = roomname;
            listrooms(chatrooms);
        }
    });

    //Client emits 'sendmsg'
    //This will emit 'updateChat' to client to update chatroom.html
    socket.on('sendmsg',function(data){
        io.sockets.in(socket.room).emit('updateChat',socket.alias,data);
        //Logs message on console
        //Alias and Room ID are undefined , I'm not sure why but they are most likely undefined above
        //Maybe they need to be passed from client
        console.log("Room ID: " + socket.room + "Alias: " + socket.alias + " " + data);

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
 */

