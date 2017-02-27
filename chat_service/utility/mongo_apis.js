/**
 * Created by zmz0305 on 2/26/17.
 */
var mongoose = require('mongoose');
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
                    cb(err, {status: 'existRoom ok', data: "room_id does not exist"});
                } else {
                    cb(err, {status: 'existRoom ok', data: data});
                }
            }
        });
    }
}
