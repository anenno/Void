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
        this.connectedUsers = [];
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
        var room = this.getRoom(roomname);
        room.connectedUsers[key] = user;
        room.numberOfUsers = room.numberOfUsers + 1;

        //Update room in room array
        this.setRoom(room.name,room);
        console.log("Add User To Room, number of users = " + room.numberOfUsers);
    };
    this.removeUserFromRoom = function(username,roomname){
        var room = this.getRoom(roomname);
        var index = room.connectedUsers.indexOf(username);
        console.log("Number of users in room = " + this.getRoom(roomname).numberOfUsers);
        console.log("Removing " + room.connectedUsers[username].alias + " from room - " + room.name);

        room.connectedUsers.splice(index,1);
        room.numberOfUsers = room.numberOfUsers - 1;

        for(var i in room.connectedUsers){
            console.log(room.connectedUsers[i].alias);
        }

        //Update room in chatrooms array
        this.getRoom(roomname).connectedUsers = room.connectedUsers;
        console.log("Number of users in room = " + this.getRoom(roomname).numberOfUsers);
        //this.getRoom(roomname).numberOfUsers =


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
            var room = this.getRoom(roomname);
            var connectedUsers = room.connectedUsers;
            if(username in connectedUsers == false){
                //Username does not exist return true
                return true;
            }else {
                //Username exists return false
                return false;
            }
        //If room does not exist yet just return true
        //Room creation is done in server file
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





