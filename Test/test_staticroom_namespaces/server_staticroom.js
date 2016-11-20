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