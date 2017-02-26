/**
 * Created by zmz0305 on 2/26/17.
 */
var mongoose = require('mongoose');
var Room = require('../models/room');

mongoose.connect("mongodb://127.0.0.1:27017");

module.exports.createRoom = function(room, cb) {
    console.log(room);
    var newroom = new Room();
    var room_name = room.room_name | "";
    var room_id = room.room_id;
    if(!room_id) {
        var err = {status: 'error', data: 'room_id is required.'};
        cb(err, undefined);
    } else {
        room.room_id = room_id;
        room.room_name = room_name;
        room.save(function (err, data) {
           if(err) {
               cb(err, data);
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
                    cb(err, {status: 'ok', data: "room_id does not exist"});
                } else {
                    cb(err, {status: 'ok', data: data});
                }
            }
        });
    }
}
