/**
 * Created by mitch on 11/21/16.
 */
/**
 * Created by Mitch on 11/21/2016.
 */

var PORT_HTTPS = 5001;
var fs = require('fs');
var https = require('https');
var app = require('express')();

var options = {
    key: fs.readFileSync('./certs/file.pem'),
    cert: fs.readFileSync('./certs/file.crt')
};

var io = require('socket.io')(https);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

https.createServer(options,app).listen(PORT_HTTPS);
console.log('listening on*:'+ PORT_HTTPS);


//All active users in the room

io.sockets.on('connection',function(socket){

    socket.on('joinroom',function(alias){
        socket.alias = alias;
        io.sockets.emit('serverMessage',socket.alias + " has joined the channel");
    });

    socket.on('sendmsg',function(data){
        io.sockets.emit('updateChat',socket.alias,data);
    });

    socket.on('newuser',function(data,callback){

    });

    socket.on('disconnect',function(){
        if(socket.alias == null){
            //Do nothing;
        }else{
            io.sockets.emit('serverMessage',socket.alias + " has left the channel");
        }
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
function nameExists(users){
    for( i = 1; i < users.length; i++){
        if(users == users[i]){
            return true;
        }
    }
    return false;
}
function updateClientSockets(socket){

}