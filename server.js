/*##################################################
                 NEW SERVER CODE                   #
 ##################################################*/
var PORT = 5000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});
app.get('/room1.html',function(req,res){
    res.sendFile(__dirname + '/room1.html');
});
app.get('/room2.html',function(req,res){
    res.sendFile(__dirname + '/room2.html');
});
app.get('/room3.html',function(req,res){
    res.sendFile(__dirname + '/room3.html');
});
//Listener
http.listen(PORT,function(){
    console.log('listening on*:'+PORT);
});


io
.of('/room1')
.on('connection', function(socket){
    console.log("User connected to Room1");
    socket.on('sendmsg', function(msg){
        console.log(socket.alias + ":" + msg);
        io.of('/room1').emit('updateChat',msg,socket.alias);
    });
    socket.on('joinRoom',function(alias,roomname){
        app.get('/room1.html',function(req,res){
            res.sendFile(__dirname + '/room1.html');
        });
        socket.room = roomname;
        socket.alias = alias;
        console.log(socket.alias + " joined " + socket.room);
    });
    socket.on('disconnect',function(){
    });
});
io
    .of('/room2')
    .on('connection', function(socket){
        console.log("User connected to Room2");

        socket.on('sendmsg', function(msg){
            console.log(socket.alias + ":" + msg);
            io.of('/room2').emit('updateChat',msg,socket.alias);
        });
        socket.on('joinRoom',function(alias,roomname){
            socket.room = roomname;
            socket.alias = alias;
            console.log(socket.alias + " joined " + socket.room);
        });
        socket.on('disconnect',function(){
        });
    });
io
    .of('/room3')
    .on('connection', function(socket){
        console.log("User connected to Room3");

        socket.on('sendmsg', function(msg){
            console.log(socket.alias + ":" + msg);
            io.of('/room3').emit('updateChat',msg,socket.alias);
        });
        socket.on('joinRoom',function(alias,roomname){
            socket.room = roomname;
            socket.alias = alias;
            console.log(socket.alias + " joined " + socket.room);
        });
        socket.on('disconnect',function(){
        });
    });

/*
###################OLD CODE####################
###############################################
MultiRoom Chat - NOT WORKING COOL


//All active users in the current room
var chatrooms = [];
io.sockets.on('connection',function(socket){



    //Client emits 'createalias'
    socket.on('createalias',function(alias) {
        socket.alias = alias;
        //Log that a new alias has been created
        console.log('server: New Alias Created - ' + socket.alias);
        socket.emit('consoleLog');
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
            console.log('server: User:  ' + socket.alias + " joined " + socket.room);
            listrooms(chatrooms);
        }else{
            console.log('server: New Room Created - ' + socket.room);
            chatrooms[roomname] = roomname;
            listrooms(chatrooms);
        }
    });

    //Client emits 'sendmsg'
    socket.on('sendmsg',function(data){
        io.sockets.in(socket.room).emit('updateChat',socket.alias,data);
        console.log("Message Received: " + data);
        });
});
 ###############################################
*/

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


