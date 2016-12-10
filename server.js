/**
 * Created by Mitch on 11/20/2016.
 */

/*
    Load Module chat.js
 */
require('./chat.js')();

/*
Command Line Variables
 */
var PORT = 5000;
var DEBUG = false;

/*
Variable initializations
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var striptags = require('striptags');
var cryptico = require('cryptico');

/*
Command Line Arg Setup
 */
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
    {name: 'PORT', alias: 'p', type: Number},
    {name: 'DEBUG',alias: 'd', type: Boolean}
];

/*
Set Command Line Variables based on commands
 */
const cmdoptions = commandLineArgs(optionDefinitions);
if(cmdoptions.PORT == undefined){
    PORT = 5000;
    /*
    START SERVER
     */
    http.listen(PORT,function(){
        debuglog("Server Started: listening on port " + PORT);
    });
}else if(isNaN(cmdoptions.PORT) == true){
    console.log("usage: \n" +
                "-p: Enter port number, If no port number entered default is 5000 \n" +
                "-d: Turns on debug, prints output to console. Default is OFF");
    console.log("Examples:")
    console.log("node server.js");
    console.log("node server.js -d");
    console.log("node server.js -p PORTNUMBER -d");


}else {
    try {
        PORT = cmdoptions.PORT;
        http.listen(PORT, function () {
            debuglog("Server Started: listening on port " + PORT);
        });
    }catch(err){
        console.log("Port in use, server not started");
    }
}
DEBUG = cmdoptions.DEBUG;
if(cmdoptions.DEBUG == true){
    debuglog("DEBUG ON");
}


/*
    Express Routes
 */
//Serve static files in public
app.use(express.static(__dirname + '/public'));
//Route to server bower (client side) libraries
app.use('/bower_components',express.static(__dirname + '/bower_components'));
//Route to serve client js files
app.use('/clientjs',express.static(__dirname + '/clientjs'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
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

                //Create user object
                var newUser = new User(socket,socket.alias,socket.roomName);
                socket.user = newUser;

                /*
                Room has already been created
                Simply add user to room
                Update key value in user object with RSA public key from room
                 */
                if(roomExists(_roomname) == true){



                    addUserToRoom(newUser,newUser.roomname);
                    var users = getUserList(_roomname);
                    /*
                    Socket.io client emits
                    Update all clients a user has joined
                    Update clients room name
                    Update clients RSA key to decrypt messages
                     */
                    io.sockets.in(socket.roomName).emit('userJoined',socket.alias + " has joined the channel",users);
                    socket.emit('updateRoomName',socket.roomName);
                    debuglog(socket.alias + " has joined room " + socket.roomName);
                }else{
                    //Room has not been created

                    /*
                     Create Room RSA key from the roomname
                     Create Room public key from the RSA key
                     */
                    var pass = roomname;
                    var bits = 1024;
                    var rsaKey = cryptico.generateRSAKey(pass,bits);
                    var publicKey = cryptico.publicKeyString(rsaKey);
                    /*
                        Create Room Object
                     */
                    var newRoom = new Room(_roomname,"",newUser,newUser,publicKey,rsaKey);
                    updateChatRooms(newRoom);
                    /*
                    Add User to room
                     */
                    addUserToRoom(newUser,newUser.roomname);
                    var users = getUserList(_roomname);
                    /*
                     Socket.io client emits
                     Update all clients a user has joined
                     Update client's room name
                     Update client's RSA key to decrypt messages
                     */
                    io.sockets.in(socket.roomName).emit('userJoined',socket.alias + " has joined the channel",users);
                    socket.emit('updateRoomName',socket.roomName);
                    debuglog("Room " + socket.roomName + " has been created");
                    debuglog(socket.alias + " has joined room " + socket.roomName);
                }
            }else{
                //Emit to client that name is not available and do not join room
                socket.emit('nameTaken',alias);
            }
    });

    socket.on('sendmsg',function(data){
        /*
                Client encrypted message will be passed through.
                The server only sees the encrypted message
         */
        debuglog("Message Received");
        debuglog("Room: " + socket.roomName);
        debuglog("Sender: " + socket.alias);
        debuglog("Message: " + data);
        console.log(socket.alias + ":" + data);
        io.sockets.in(socket.roomName).emit('updateChat',socket.alias,data);

    });

    socket.on('disconnect',function(){
        //Check to make sure alias exists and is not null
        if(socket.alias == null){
            //Do nothing;
        }else{
            var chatRoom = getRoom(socket.roomName);
            var numUsers = chatRoom.numberOfUsers;
            var roomname = chatRoom.name;

            /*
            If last user in room delete room object
             */
            if(numUsers == 1){
                //Remove user from room and delete room
                debuglog(socket.alias + " has left room " + socket.roomName);

                removeUserFromRoom(socket.alias,socket.roomName);
                deleteRoom(socket.roomName);
                socket.leave(socket.roomName);

            }else{
                /*
                Only remove user from room and update user list
                Emit to all connected users that a user has left
                Update user list in room as well
                 */
                debuglog(socket.alias + " has left room " + socket.roomName);

                removeUserFromRoom(socket.alias,socket.roomName);
                var users = getUserList(roomname);
                io.sockets.in(socket.roomName).emit('userLeft',socket.alias + " has left the channel",users);
                socket.leave(socket.roomName);

            }
        }
    });
});
function debuglog(string){
    //Will only print to console if debug is set
    if(DEBUG == true){
        console.log("DEBUG: " + string);
    }
}