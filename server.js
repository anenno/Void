/**
 * Created by Mitch on 11/20/2016.
 */

/*
    Load Module chat.js
 Crypto JS - Need to look into this
 https://github.com/brix/crypto-js/blob/develop/README.md

 */
require('./chat.js')();

var PORT = 5000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var striptags = require('striptags');
var cryptico = require('cryptico');


/*
Encryption Test
 */

//This is working. The problem is that if someone has access to the key then
// it can easily be decrypted - should randomly generate a key for the room

/*
var CryptoJS = require('crypto-js');
var string = "This is a test";
var ciphertext = CryptoJS.AES.encrypt(string,'key');
console.log('Text to encrypt: ' + string);
console.log('Encrypted text: ' + ciphertext);
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(),'key');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log('Decrypted text: ' + plaintext);
*/
//##############################################



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
                    newUser.key = getRoom(_roomname).rsakey;



                    /*
                    Socket.io client emits
                    Update all clients a user has joined
                    Update clients room name
                    Update clients RSA key to decrypt messages
                     */
                    io.sockets.in(socket.roomName).emit('userJoined',socket.alias + " has joined the channel",users);
                    socket.emit('updateRoomName',socket.roomName);
                    socket.emit('updateKey',newUser.key);

                }else{
                    //Room has not been created


                    /*

                     Create RSA key and store in room object
                     This key will be passed to the user objects connected to room
                     in order to encrpyt/decrypt messages

                     */
                    var keypass = roomname;
                    var bits = roomname.bitlength;
                    console.log("bit length of keypass = " + bits);
                    var rsakey = cryptico.generateRSAKey(keypass,bits);
                    console.log("room rsa key:");
                    console.log(rsakey);

                    /*
                        Create Room Object
                     */
                    var newRoom = new Room(_roomname,"",newUser,newUser,rsakey);
                    updateChatRooms(newRoom);

                    /*
                    Update key in user object to rooms key
                     */
                    newUser.key = rsakey;

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
                    socket.emit('updateKey',newUser.key);
                }
            }else{
                //Emit to client that name is not available and do not join room
                socket.emit('nameTaken',alias);
            }
    });

    socket.on('sendmsg',function(data){
        console.log('sendmsg called');
        //STRIP HTML TAGS
        //var strippedMsg = striptags(data);
        //var strippedMsg = data;
        console.log(data);
        //Emit to all connected sockets the message
        io.sockets.in(socket.roomName).emit('updateChat',socket.alias,data);
        console.log('emmitting message to clients');

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
                removeUserFromRoom(socket.alias,socket.roomName);
                deleteRoom(socket.roomName);
                socket.leave(socket.roomName);
            }else{
                /*
                Only remove user from room and update user list
                Emit to all connected users that a user has left
                Update user list in room as well
                 */

                removeUserFromRoom(socket.alias,socket.roomName);
                var users = getUserList(roomname);
                io.sockets.in(socket.roomName).emit('userLeft',socket.alias + " has left the channel",users);
                socket.leave(socket.roomName);
            }
        }
    });
});