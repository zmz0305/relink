/**
 * Created by zmz0305 on 2/26/17.
 */
var Room = require('../models/room');

/**
 * create a room in mongodb
 * @param room {room_id: 'something cannot be empty, should be unique', room_name: 'name'}
 * @param cb
 */
module.exports.createRoom = function(room, cb) {
    console.log('Creating room: ' + JSON.stringify(room));
    var newroom = new Room();
    var room_name = room.room_name || "";
    var room_id = room.room_id;
    if(!room_id) {
        var err = {status: 'createRoom error', data: 'room_id is required.'};
        cb(err, undefined);
    } else {
        newroom.room_id = room_id;
        newroom.room_name = room_name;
        newroom.save(function (err, data) {
           if(err) {
               cb(err, {status: 'createRoom error',
                        data: 'room ' + newroom.room_id + ' is not created'});
           } else {
               cb(err, data);
           }
        });
    }
}

/**
 * Check if there is a room with room_id, if there is, return the room data
 * @param room_id The room_id, in string
 * @param cb
 */
module.exports.existRoom = function (room_id, cb) {
    if(!room_id) {
        var err = {status: 'error', data: 'room_id is required.'};
        cb(err, undefined);
    } else {
        Room.findOne({room_id: room_id}, function (err, data) {
            if (err) {
                cb(err, undefined);
            } else {
                if (!data || data.length == 0) {
                    cb(err, {status: 'existRoom ok', data: undefined});
                } else {
                    cb(err, {status: 'existRoom ok', data: data});
                }
            }
        });
    }
}

/**
 * Get all rooms
 * @param cb
 */
module.exports.getRooms = function (cb) {
    Room.find(function(err, data) {
        if(err) {
            cb(err, undefined);
        } else {
            cb(err, data);
        }
    })
}

/**
 * add user into some room
 * @param data {user: 'name', room_id: 'unique id'}
 * @param cb
 */
module.exports.joinRoom = function (data, cb) {
    // TODO: implement this
    var room_id = data.room_id;
    var userid = data.user;
    console.log(room_id, userid);
    if(!room_id || !userid) {
        cb({status: 'error', data: 'room_id and user name is required'}, undefined);
    } else {
        Room.findOneAndUpdate({room_id: room_id},
            {$addToSet: {'room_user': {'user_id': userid}}},
            {new: true},
            function (err, res) {
            cb(err, res);
        });
    }
}

/**
 * remove user from room
 * @param data {user: 'name', room_id: 'unique id'}
 * @param cb
 */
module.exports.leaveRoom = function (data, cb) {
    var room_id = data.room_id;
    var userid = data.user;
    console.log(room_id, userid);
    if(!room_id || !userid) {
        cb({status: 'error', data: 'room_id and user name is required'}, undefined);
    } else {
        Room.findOneAndUpdate({room_id: room_id},
            {$pull: {'room_user': {'user_id': userid}}},
            {new: true},
            function (err, res) {
                cb(err, res);
            });
    }
}

