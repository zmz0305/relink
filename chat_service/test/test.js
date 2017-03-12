/**
 * Created by zmz0305 on 3/12/17.
 */
var assert = require('assert');
var room_apis = require('../database/room_apis');
var mongoose = require('mongoose');
var config = require('../config');
var db_init = require('../utility/data_generator');
var async = require('async');

describe('Mongodb Tests', function() {
    before(function (done) {
        mongoose.connect(config.MONGO_URI);
        db_init(done);
    });

    after(function () {
        mongoose.disconnect();
    });

    describe('#getRooms()', function () {
        it('it should return all rooms in Mongodb, ' +
            'run data_generator before testing this', function (done) {
            room_apis.getRooms(function (err, res) {
                console.log(res);
                assert.equal(res[0].room_name, 'first room');
                assert.equal(res[0].room_id, 'room1');
                assert.deepEqual(JSON.stringify(res[0].room_user),
                    JSON.stringify(JSON.parse('[ { "user_id" : "zmz0305" }, { "user_id" : "mgao16" } ]')));
            });
            done();
        })
    });

    describe('#createrRoom()', function () {
        it('it should create an room in Mongdb with id wocao', function (done) {
            room_apis.createRoom({'room_id': 'wocao', 'room_name': 'wocao'}, function (err, res) {
                assert.equal(err, undefined);
                assert.equal(res.room_id, 'wocao');
                assert.equal(res.room_name, 'wocao');
                done();
            });
        })
    });




});