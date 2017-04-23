/**
 * Created by zmz0305 on 2/26/17.
 */
var Room = require('../models/room');

/**
 * delete everything from room table
 * @param cb
 */
module.exports.cleanupRoom = function (cb) {
    console.log('Cleaning room...');
    Room.remove({}, function(err, res) {
        cb(err, res)
    });
}

/**
 * create a room in mongodb
 * @param room {room_id: 'something cannot be empty, should be unique', room_name: 'name'}
 * @param cb
 */
module.exports.createRoom = function (room, cb) {
    var newroom = new Room();
    var room_name = room.room_name || "";
    var room_id = room.room_id;
    if (!room_id) {
        var err = {status: 'createRoom error', data: 'room_id is required.'};
        cb(err, undefined);
    } else {
        newroom.room_id = room_id;
        newroom.room_name = room_name;
        newroom.save(function (err, data) {
            if (err) {
                cb(err, {
                    status: 'createRoom error',
                    data: 'room ' + newroom.room_id + ' is not created'
                });
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
    if (!room_id) {
        var err = {status: 'error', data: 'room_id is required.'};
        cb(err, undefined);
    } else {
        Room.findOne({room_id: room_id}, function (err, data) {
            if (err) {
                cb(err, undefined);
            } else {
                if (!data || data.length == 0) {
                    cb(err, {status: 'existRoom ok, but not found', data: undefined});
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
    Room.find(function (err, data) {
        if (err) {
            cb(err, undefined);
        } else {
            cb(err, data);
        }
    })
}

module.exports.existUserInRoom = function(data, cb) {
    var room_id = data.room_id;
    var user_id = data.user_id;
    if (!room_id || !user_id) {
        var err = {status: 'error', data: 'room_id and user_id is required. At least one of them is missing.'};
        cb(err, undefined);
    } else {
        Room.findOne({room_id: room_id}, function (err, data) {
            if (err) {
                cb(err, undefined);
            } else {
                if (!data || data.length == 0) {
                    cb(err, {code: 404, status: 'Room not found', data: undefined});
                } else {
                    console.log('Searching user: ' + user_id + ' in room ' + room_id);
                    var users = data.room_user;
                    var idx = users.map(function(e){return e.user_id}).indexOf(user_id);
                    if(idx == -1){
                        cb(err, {code: 404, status: 'user not in room', data: data});
                    } else {
                        cb(err, {status: 'existRoom ok', user_index: idx, data: data});
                    }
                }
            }
        });
    }
}

/**
 * add user into some room
 * @param data {user: 'name', room_id: 'unique id'}
 * @param cb
 */
module.exports.joinRoom = function (data, cb) {
    var room_id = data.room_id;
    var userid = data.user;
    if (!room_id || !userid) {
        cb({status: 'error', data: 'room_id and user name is required'}, undefined);
    } else {
        Room.findOneAndUpdate(
            {room_id: room_id},
            {$addToSet: {'room_user': {'user_id': userid}}},
            {new: true},
            function (err, res) {
                cb(err, res);
            }
        );
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
    if (!room_id || !userid) {
        cb({status: 'error', data: 'room_id and user name is required'}, undefined);
    } else {
        Room.findOneAndUpdate(
            {room_id: room_id},
            {$pull: {'room_user': {'user_id': userid}}},
            {new: true},
            function (err, res) {
                cb(err, res);
            }
        );
    }
}

