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
function setUser(user,socket,alias,room){
    user.socket = socket;
    user.alias = alias;
    user.room = room;
    addUserToRoom(user,room);
}
function setRoom(room,name){
    room.name = name;

}
function addUserToRoom(user,room){
    room.connectedUsers.push(user);
}
function removeUserFromRoom(username,room){
    var index = room.connectedUsers.indexOf(username);
    if(index > -1){
        room.connectedUsers.splice(index,1);
    }
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
function doesRoomExist(roomname){
    if(rooms.indexOf(roomname) == -1){
        //Room does not exist yet
        return false;
    }else{
        //Room already exists
        return true;
    }
}