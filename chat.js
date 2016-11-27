/**
 * Created by mitch on 11/22/16.
 */
/*
    Module Exports
 */
var chatrooms = [];

module.exports = function() {

    this.User = function(socket,alias,roomname){
        this.socket = socket;
        this.alias = alias;
        this.roomname = roomname;
        this.room = chatrooms[roomname];

    };
    this.Room = function(name,password,admin,roomCreator){
        this.connectedUsers = {};
        this.numberOfUsers = 0;
        this.name = name;
        this.password = password;
        this.admin = admin;
        this.roomCreator = roomCreator;
        this.maxUsers = -1;
    };

    this.getRoom = function(roomname){
        return chatrooms[roomname];
    };
    this.setRoom = function(roomname,room){
        chatrooms[roomname] = room;
    }
    this.getUser = function(room,username){
        return room.connectedUsers[username];
    };
    this.addUserToRoom = function(user,roomname){
        var key = user.alias;
        this.getRoom(roomname).connectedUsers[key] = user;
        this.getRoom(roomname).numberOfUsers = this.getRoom(roomname).numberOfUsers + 1;
    };
    this.removeUserFromRoom = function(username,roomname){
        if(username in this.getRoom(roomname).connectedUsers){
            delete this.getRoom(roomname).connectedUsers[username];
            this.getRoom(roomname).connectedUsers.numberOfUsers = this.getRoom(roomname).connectedUsers.numberOfUsers - 1;
        }else {
            //Do Nothing - Username not found
        }
    };
    this.deleteRoom = function(roomname){
        var index = chatrooms.indexOf(roomname);
        if(index > -1){
            chatrooms.splice(index,1);
        }
    };
    this.isNameAvailable = function(roomname,username){
        //Check if room exists
        //If it does then check if name exists
        if(this.roomExists(roomname) == true){
            var connectedUsers = this.getRoom(roomname).connectedUsers;
            var result = connectedUsers[username];
            if(result === undefined){
                //Username does not exist return true that username is available
                return true;
            }else {
                //Username exists return false it is not available
                return false;
            }
        //If room does not exist yet just return true
        }else{
            return true;
        }
    };

    this.roomExists = function(roomname) {
        if(roomname in chatrooms == true){
            return true;
        }else{
            return false;
        }
    };
    this.updateChatRooms = function(room) {
        var key = room.name;
        chatrooms[key] = room;
    };
};





