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

                /*
                Room has already been created
                Simply add user to room
                 */
                if(roomExists(_roomname) == true){
                    addUserToRoom(newUser,newUser.roomname);
                    var users = getUserList(_roomname);
                    io.sockets.in(socket.roomName).emit('userJoined',socket.alias + " has joined the channel",users);
                    socket.emit('updateRoomName',socket.roomName);

                }else{
                    /*
                    Room has not been created yet
                    Create Room Object and add user to room
                     */
                    var newRoom = new Room(_roomname,"",newUser,newUser);
                    updateChatRooms(newRoom);
                    addUserToRoom(newUser,newUser.roomname);
                    var users = getUserList(_roomname);
                    io.sockets.in(socket.roomName).emit('userJoined',socket.alias + " has joined the channel",users);
                    socket.emit('updateRoomName',socket.roomName);
                }
            }else{
                //Emit to client that name is not available and do not join room
                socket.emit('nameTaken',alias);
            }
    });

    socket.on('sendmsg',function(data){
        //STRIP HTML TAGS
        var strippedMsg = striptags(data);
        //Emit to all connected sockets the message
        io.sockets.in(socket.roomName).emit('updateChat',socket.alias,strippedMsg);
    });

    socket.on('disconnect',function(){
        //Check to make sure alias exists and is not null
        if(socket.alias == null){
            //Do nothing;
        }else{
            var chatRoom = getRoom(socket.roomName);
            var numUsers = chatRoom.numberOfUsers;
            var roomname = chatRoom.roomname;

            /*
            If last user in room delete room object
             */
            if(numUsers == 1){
                //Remove user from room and delete room
                removeUserFromRoom(socket.alias,socket.roomName);
                deleteRoom(socket.roomName);
                socket.leave(socket.roomName);
            }else{
                /*
                Only remove user from room and update user list
                Emit to all connected users that a user has left
                Update user list in room as well
                 */
                var users = getUserList(roomname);
                removeUserFromRoom(socket.alias,socket.roomName);
                io.sockets.in(socket.roomName).emit('userLeft',socket.alias + " has left the channel",users);
                socket.leave(socket.roomName);
            }
        }
    });
});