/**
 * Created by Mitch on 11/20/2016.
 */

/*
    Load Module chat.js
 */
require('./chat.js')();

var PORT = 5000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
    Express Routes
 */
//Serve index.html
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
//Serve static files in public
app.use(express.static(__dirname + '/public'));

/*
    Listeners
 */
http.listen(PORT,function(){
    console.log('listening on*:'+PORT);
});

/*
    Socket.IO Functions
    These handle most communication between client and server
 */


io.sockets.on('connection',function(socket){

    socket.on('joinroom',function(alias,roomname){
            //Check if alias taken
            if(isNameAvailable(roomname, alias) == true){
                //Set socket variables and join socket to room
                socket.alias = alias;
                socket.roomName = roomname;
                socket.join(roomname);
                var newUser = new User(socket,socket.alias,socket.roomName);
                socket.user = newUser;

                //Check if room is already created in rooms array
                if(roomExists(roomname) == true){
                    io.sockets.in(socket.roomName).emit('serverMessage',socket.alias + " has joined the channel");
                    socket.emit('updateRoomName',socket.roomName);

                }else{
                    var newRoom = new Room(roomname,"",socket,socket);
                    updateChatRooms(newRoom);
                    io.sockets.in(socket.roomName).emit('serverMessage',socket.alias + " has joined the channel");
                    socket.emit('updateRoomName',socket.roomName);
                }

                //Add User to Room
                addUserToRoom(newUser,socket.roomName);


            }else{
                //Emit to client that name is not available and do not join room
                console.log("Name Exists");
            }

            /*
            socket.alias = alias;
            socket.room = roomname;
            socket.join(roomname);
            io.sockets.in(socket.room).emit('serverMessage',socket.alias + " has joined the channel");
            socket.emit('updateRoomName',socket.room);
            */
    });

    socket.on('sendmsg',function(data){
        io.sockets.in(socket.roomName).emit('updateChat',socket.alias,data);
    });

    socket.on('newuser',function(data,callback){

    });

    socket.on('disconnect',function(){

        if(socket.alias == null){
            //Do nothing;
        }else{
            var chatRoom = getRoom(socket.roomName);
            var numUsers = chatRoom.numberOfUsers;
            var roomname = chatRoom.roomname;
            if(numUsers == 1){
                //Remove user from room and delete room
                removeUserFromRoom(socket.alias,socket.roomName);
                deleteRoom(socket.roomName);
                socket.leave(socket.roomName);
            }else{
                //only remove user from room
                removeUserFromRoom(socket.alias,socket.roomName);
                io.sockets.in(socket.roomName).emit('serverMessage',socket.alias + " has left the channel");
                socket.leave(socket.roomName);
            }
        }
    });

});