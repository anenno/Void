/**
 * Created by Mitch on 11/20/2016.
 */

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

//Listener
http.listen(PORT,function(){
    console.log('listening on*:'+PORT);
});
//All active users in the room
var users = {};

io.sockets.on('connection',function(socket){
    //Client emits 'joinroom'
    socket.on('joinroom',function(alias){
        socket.alias = alias;
        console.log('server: New Alias Created - ' + socket.alias);
        socket.emit('updateChat','server:','You have joined the chat');
        io.sockets.broadcast('updateChat','server:',socket.alias + ' has joined the chat');
        users.push(alias);
    });

    //Client emits 'sendmsg'
    socket.on('sendmsg',function(data){
        io.sockets.emit('updateChat',socket.alias,data);
        console.log("Message Received: " + data);
    });

    socket.on('newuser',function(data,callback){

        //Check if username is taken
        //Call back is sent back to client
        //If index we get back is -1 this means that the user name is available.
        /*
        if(users.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.alias = data;
            users.push(socket.alias);
            io.sockets.emit('updateUserList',users);
        }
        */
    });
    socket.on('disconnect',function(data){
       if(!socket.alias) return;
        users.splice(users.indexOf(socket.alias),1);
        io.sockets.emit('usernames',users);
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




