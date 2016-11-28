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
var striptags = require('striptags');
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

    Striptags is being used in data the user sends to the server that could update display
    At this point there is no need for SQL injection security because we are not using a data base.

 */
io.sockets.on('connection',function(socket){

    socket.on('checkName',function(alias,roomname){
        var _alias = striptags(alias);
        var _roomname = striptags(roomname);

        if(isNameAvailable(_roomname,_alias) == true){
            socket.emit('nameAvailable');
        }else{
            socket.emit('nameTaken',alias);
        }
    });

    socket.on('joinroom',function(alias,roomname){

            //STRIP HTML TAGS
            var _alias = striptags(alias);
            var _roomname = striptags(roomname);

            //Check if alias taken
            if(isNameAvailable(_roomname, _alias) == true){
                //Set socket variables and join socket to room
                socket.alias = _alias;
                socket.roomName = _roomname;
                socket.join(_roomname);
                var newUser = new User(socket,socket.alias,socket.roomName);
                socket.user = newUser;

                //Check if room is already created in rooms array
                if(roomExists(_roomname) == true){
                    io.sockets.in(socket.roomName).emit('serverMessage',socket.alias + " has joined the channel");
                    socket.emit('updateRoomName',socket.roomName);

                }else{
                    var newRoom = new Room(_roomname,"",newUser,newUser);
                    updateChatRooms(newRoom);
                    io.sockets.in(socket.roomName).emit('serverMessage',socket.alias + " has joined the channel");
                    socket.emit('updateRoomName',socket.roomName);
                }

                //Add User to Room
                addUserToRoom(newUser,newUser.roomname);


            }else{
                //Emit to client that name is not available and do not join room
                socket.emit('nameTaken',alias);
            }
    });

    socket.on('sendmsg',function(data){
        //STRIP HTML TAGS
        var strippedMsg = striptags(data);

        io.sockets.in(socket.roomName).emit('updateChat',socket.alias,strippedMsg);
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