/**
 * Created by zmz0305 on 3/12/17.
 */
var assert = require('assert');
var room_apis = require('../database/room_apis');
var mongoose = require('mongoose');
var config = require('../config');
var db_init = require('../utility/data_generator');
var async = require('async');
//
var fs = require("fs")
var querystring = require('querystring')
var http = require('http')

var request = require('supertest');
var app = require('../app');


describe('RESTful API Tests', function () {
    before(function (done) {
        db_init(done);
    });

    describe('#POST /sock/send', function () {
        it('It should have status 500 when missing request values (room_id, user, message)',
            function (done) {
                request(app)
                    .post('/sock/send')
                    .send({'room_id': 'room1', 'user': 'mgao16'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should have status 500 when missing request values (room_id, user, message)',
            function (done) {
                request(app)
                    .post('/sock/send')
                    .send({'room_id': 'room1', 'message': 'asdf'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should have status 500 when missing request values (room_id, user, message)',
            function (done) {
                request(app)
                    .post('/sock/send')
                    .send({'user': 'mgao16'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should send valid room_id', function (done) {
            request(app)
                .post('/sock/send')
                .send({room_id: 'fakeid', user:'mgao16', message: 'sample message'})
                .expect(404, {status: '404 not found', data: 'room_id or user not found'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it('The sender must be in the room', function(done) {
            request(app)
                .post('/sock/send')
                .send({room_id: 'room1', user:'fakeuser', message: 'sample message'})
                .expect(404, {status: '404 not found', data: 'room_id or user not found'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                });
        });

        it('Valid send action should return status 200', function(done) {
            request(app)
                .post('/sock/send')
                .send({room_id: 'room1', user:'mgao16', message: 'sample message'})
                .expect(200, {status: '200 OK', data: 'Message sent'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('#POST /sock/sendQuiz', function () {
        it('It should have status 500 when missing request values (room_id, quiz_name, user)',
            function (done) {
                request(app)
                    .post('/sock/sendQuiz')
                    .send({'room_id': 'room1', 'user': 'mgao16'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should have status 500 when missing request values (room_id, user, message)',
            function (done) {
                request(app)
                    .post('/sock/sendQuiz')
                    .send({'room_id': 'room1', 'quiz_name': 'asdf'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should have status 500 when missing request values (room_id, user, message)',
            function (done) {
                request(app)
                    .post('/sock/sendQuiz')
                    .send({'user': 'mgao16'})
                    .expect(500)
                    .end(function (err, res) {
                        if(err) return done(err);
                        done();
                    })
            }
        );

        it('It should send valid room_id', function (done) {
            request(app)
                .post('/sock/sendQuiz')
                .send({room_id: 'lll', user:'mgao16', quiz_name: 'quiz1'})
                .expect(404, {status: '404 not found', data: 'room_id or user not found'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it('The sender must be in the room', function(done) {
            request(app)
                .post('/sock/sendQuiz')
                .send({room_id: 'room1', user:'fakeuser', quiz_name: 'q1'})
                .expect(404, {status: '404 not found', data: 'room_id or user not found'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                });
        });

        it('Valid send action should return status 200', function(done) {
            request(app)
                .post('/sock/sendQuiz')
                .send({room_id: 'room1', user:'mgao16', quiz_name: 'quiz1'})
                .expect(200, {status: '200 OK', data: 'Message sent'})
                .end(function (err, res) {
                    if(err) return done(err);
                    done();
                });
        });
    })
});

describe('Mongodb Tests', function () {
    before(function (done) {
        // mongoose.connect(config.MONGO_URI);
        db_init(done);
    });

    after(function () {
        mongoose.disconnect();
    });

    describe('#getRooms()', function () {
        it('It should return all rooms in Mongodb, ' +
            'run data_generator before testing this', function (done) {
            room_apis.getRooms(function (err, res) {
                assert.equal(res[0].room_name, 'first room');
                assert.equal(res[0].room_id, 'room1');
                assert.deepEqual(JSON.stringify(res[0].room_user),
                    JSON.stringify(JSON.parse('[ { "user_id" : "zmz0305" }' +
                        ', { "user_id" : "mgao16" } ]')));
                done();
            });
        })
    });

    describe('#createRoom()', function () {
        it('It should create an room in Mongdb with id wocao', function (done) {
            room_apis.createRoom({'room_id': 'wocao', 'room_name': 'wocao'},
                function (err, res) {
                    assert.equal(err, undefined);
                    assert.equal(res.room_id, 'wocao');
                    assert.equal(res.room_name, 'wocao');
                    done();
                });
        })
    });

    describe('#existRoom()', function () {
        it('Should check if specified room exist in mongodb', function (done) {
            room_apis.existRoom('wocao', function (err, res) {
                assert.equal(err, undefined);
                assert.equal(res.status, 'existRoom ok');
                done();
            })
        })
    })

    describe('#existsUserInRoom()', function () {
        it('Check if user is inside of one specified room', function (done) {
            room_apis.existUserInRoom({room_id: 'room1', user_id: 'mgao16'},
                function (err, res) {
                    assert.equal(err, undefined);
                    assert.equal(res.data.room_id, 'room1');
                    assert.equal(res.status, 'existRoom ok');
                    assert.equal(res.user_index, 1);
                    done();
                })
        })
    })

    describe('#leaveRoom()', function () {
        it('Should delete user in specified room', function (done) {
            room_apis.leaveRoom({user: 'mgao16', room_id: 'room1'},
                function (err, res) {
                    assert.equal(err, undefined);
                    assert.equal(res.room_user.length, 1);
                    done();
                })
        })
    })

    describe('#joinRoom()', function () {
        it('Should add user in specified room', function (done) {
            room_apis.joinRoom({user: 'haha', room_id: 'room1'},
                function (err, res) {
                    assert.equal(err, undefined);
                    assert.equal(res.room_user.length, 2);
                    assert(res.room_user.length != -1);
                    done();
                })
        })
    })

});
