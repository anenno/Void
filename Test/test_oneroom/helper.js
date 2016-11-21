/**
 * Created by Mitch on 11/20/2016.
 */

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