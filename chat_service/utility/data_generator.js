/**
 * Created by zmz0305 on 2/26/17.
 */
var room_apis = require("../database/room_apis");
var mongoose = require('mongoose');
var config = require('../config');
var async = require('async');

function init(done) {
    var callback = function (err, res) {
        if(err) console.error(err);
        else console.log(res);
    };

    async.series([
        function (callback) {
            // if(mongoose.connection.readyState == 0){
            //     mongoose.connect(config.MONGO_URI);
            // }
            console.log('Clean up test database.....');
            callback();
        },
        // delete all rooms
        function (callback) {
            room_apis.cleanupRoom(function (err, res) {
                callback(err, res);
            })
        },
        // create room with room_id / room_name
        function (callback) {
            room_apis.createRoom({room_id: 'room1', room_name: 'first room'}, function (err, res) {
                callback(err, res);
            })
        },
        // add one user into room
        function (callback) {
            room_apis.joinRoom({room_id: 'room1', user: 'zmz0305'}, function (err, res) {
                callback(err, res);
            })
        },
        // add another user into room
        function (callback) {
            room_apis.joinRoom({room_id: 'room1', user: 'mgao16'}, function (err, res) {
                callback(err, res);
            })
            console.log('generator finished!');
            done();
        },
        // close connections
        // function (callback) {
        //     mongoose.disconnect(callback);
        //     done();
        // }
    ]);
}

// init();

module.exports = init;

