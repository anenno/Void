/**
 * Created by mitch on 11/22/16.
 */
/*
    Module Exports
 */
var chatrooms = [];

module.exports = function() {

    /*
    User Object
    This will be created each time a new client connects to  a room

    socket - This is the actual client connected socket
    alias - username entered
    roomname - roomname the user is connected to
    room - actual room object user is connected to

     */
    this.User = function(socket,alias,roomname){
        this.socket = socket;
        this.alias = alias;
        this.roomname = roomname;
        this.room = chatrooms[roomname];

    };

    /*
    Room Object
    This will be created only once and will be destroyed once the last user
    has left the room

    connectedUsers - Map of connected user objects with the room. Key: Username, Value: UserObject
                     This is set when a user actually joins the room in server.js
    numberOfUsers -  Count of total number of users in room
    name          -  Room name
    Currently Password,roomcreator, admin and maxUsers do nothing.
     */
    this.Room = function(name,password,admin,roomCreator){
        this.connectedUsers = {};
        this.numberOfUsers = 0;
        this.name = name;
        this.password = password;
        this.admin = admin;
        this.roomCreator = roomCreator;
        this.maxUsers = -1;
    };

    /*
    Return room object based on roomname
    Searches the global list of rooms in chatrooms array
     */
    this.getRoom = function(roomname){
        return chatrooms[roomname];
    };

    /*
    Function to update global list of chatrooms active in chatrooms array
     */
    this.setRoom = function(roomname,room) {
        chatrooms[roomname] = room;
    };

    /*
    Returns user object in specified room based on name provided
     */
    this.getUser = function(room,username){
        return room.connectedUsers[username];
    };

    /*
    Update connectedUsers map in specified room
     */
    this.addUserToRoom = function(user,roomname){
        var key = user.alias;
        this.getRoom(roomname).connectedUsers[key] = user;
        this.getRoom(roomname).numberOfUsers = this.getRoom(roomname).numberOfUsers + 1;
    };

    /*
    Remove user from connectedUsers map in specified room
     */
    this.removeUserFromRoom = function(username,roomname){
        if(username in this.getRoom(roomname).connectedUsers){
            delete this.getRoom(roomname).connectedUsers[username];
            this.getRoom(roomname).connectedUsers.numberOfUsers = this.getRoom(roomname).connectedUsers.numberOfUsers - 1;
        }else {
            //Do Nothing - Username not found
        }
    };

    /*
    Remove specified room from global array of active rooms
     */
    this.deleteRoom = function(roomname){
        var index = chatrooms.indexOf(roomname);
        if(index > -1){
            chatrooms.splice(index,1);
        }
    };

    /*
    Checks if a name is available in specified room

    There is also a check being done at the beginning to make sure
    the alias and room passed in are not blank. This is here because if a user types
    an invalid name or room and the stripTags function ends up passing in empty strings
    this will catch that and return that the name is taken and not allow the user to enter. There
    is probably a better way to do this but this works for now, not necessarily a priority.


     */
    this.isNameAvailable = function(roomname,username){
        if(roomname == "" || username == ""){

            /*
                If a user enters any HTML tags in their alias/room and the result is an empty string
                This will return false as if the alias entered has been taken.
            */
            return false;
        }else{
            /*
            Check if room exists
                If it does exist then check if name is available
             */
            if(this.roomExists(roomname) == true){
                var connectedUsers = this.getRoom(roomname).connectedUsers;
                var result = connectedUsers[username];
                if(result === undefined){
                    //Username does not exist return true that username is available
                    return true;
                }else {
                    //Username already exists return false it is not available
                    return false;
                }

                /*
                Room does not exist yet, just return true
                 */
            }else{
                return true;
            }
        }
    };

    /*
    Checks if roomexists in global list of active rooms chatrooms
     */
    this.roomExists = function(roomname) {
        if(roomname in chatrooms == true){
            return true;
        }else{
            return false;
        }
    };

    /*
    Add room object to chatrooms global list
     */
    this.updateChatRooms = function(room) {
        var key = room.name;
        chatrooms[key] = room;
    };

    /*
    Returns an array of usernames currently connected to a specified room
     */
    this.getUserList = function(roomname){
        var connectedUsers = this.getRoom(roomname).connectedUsers;
        var userListString = "";
        for(var i in connectedUsers) {
            var user = connectedUsers[i];
            userListString = userListString + user.alias + "<br>";
        }
        return userListString;
    }
};





