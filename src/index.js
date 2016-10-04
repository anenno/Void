var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/chatroom.html',function(req,res){
    res.sendFile(__dirname + '/chatroom.html');
});
http.listen(5000,function(){
    console.log('listening on*:3000');
});
//Shows when a user connects to index.html
io.on('connection',function(socket){
    console.log('User Connected');
    socket.on('chat message',function(msg){
        console.log('message: ' + msg);
    });
});
