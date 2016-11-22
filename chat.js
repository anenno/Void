/**
 * Created by mitch on 11/22/16.
 */
var user = {
    socket:null,
    alias:"",
    room:""
};
var room = {
    connectedUsers: [],
    name: "",
    password:"",
    admin:null,
    roomCreator:null
};
var rooms = [];

function getRoom(roomname){
    return rooms[roomname];
}
function getUser(roomname,username){
    var room = getRoom(roomname);
    return room.connectedUsers[username];
}

function addUserToRoom(username){
    if(isNameAvailable(username)){
        connectedUsers.push(clientSocket);
        return true;
    }else{
        return false;
    }
}
function removeUserFromRoom(username){

}
function isNameAvailable(roomname,username){
    var room = getRoom(roomname);
    if(room.connectedUsers.indexOf[username] == -1){
        //Username does not exist return true
        return true;
    }else{
        //Username exists return false
        return false;
    }
}