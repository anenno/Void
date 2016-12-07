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
    decryptKey - privateKey used to decrypt messages. This is set by the room

     */
    this.User = function(socket,alias,roomname,key){
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
    this.Room = function(name,password,admin,roomCreator,publicKey,key){
        this.connectedUsers = {};
        this.numberOfUsers = 0;
        this.name = name;
        this.password = password;
        this.admin = admin;
        this.roomCreator = roomCreator;
        this.maxUsers = -1;
        this.publicKey = publicKey;
        this.rsaKey = key;
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
            delete this.getRoom(roomname).connectedUsers[undefined];
            delete this.getRoom(roomname).connectedUsers[null];
            this.getRoom(roomname).connectedUsers.numberOfUsers = this.getRoom(roomname).connectedUsers.numberOfUsers - 1;

            /*
            Clean up undefined / null object
             */

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

    There is a check being done within the for loop to make sure that
    the alias is not undefined. If isn't then update the string, otherwise skip an undefined alias.
    The undefined alias is being left over after a user object is deleted from the map. If we start running into
    performance issue we will want to find a way to remove undefined/null map objects after deletion in removeUserFromRoom.
     */
    this.getUserList = function(roomname){
        var connectedUsers = this.getRoom(roomname).connectedUsers;
        var userListString = "";
        for(var i in connectedUsers) {
            var user = connectedUsers[i];
            if(connectedUsers[i].alias == undefined){
            }else{
                userListString = userListString + user.alias + "<br>";
            }
        }
        return userListString;
    }
    this.generateKey = function(){

    }
};





