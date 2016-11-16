/**
 * Created by Mitch on 11/16/2016.
 */
var socket = io();

function sendFunction(){
    var message = $('#msg').val();
    socket.emit('sendMessage',user,message);
}
socket.on('updateChat',function(user,msg){
    $('messages').append(user + ':' + msg + '<br>');
    console.log(user + ":" + msg + "\n");
}
socket.on('joinRoom',function(user){
    $('messages').append(user + "joined the room" + "<br>");
    console.log(user + "has joined the chat");
}
