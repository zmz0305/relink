/**
 * Created by zmz0305 on 2/11/17.
 */
var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var room_apis = require('../database/room_apis');
var resMsg = require('../utility/utils').resMsg;

router.post("/send", function (req, res) {
    var room_id = req.body.room_id;
    var message = req.body.message;
    var user = req.body.user;

    // if any of the three values is missing, throw error
    if(!room_id || !message || !user){
        res.status(500);
        res.send({status: '500 Internal Error',
            data: 'missing values, must have room_id, message, user'});
    }

    // send using io from parent module (which is app in app.js)
    room_apis.existUserInRoom({room_id: room_id, user_id: user}, function (err, data) {
        if(err) {
            res.status(500);
            res.send({status: '500 internal error', data: 'Error in confirming room_id'});
        } else {
            if(!data.data || data.code == 404) { // if there is no data returned
                console.log("error in sock/send: ", data.status);
                res.status(404);
                res.send({status: '404 not found', data: 'room_id or user not found'});
            } else {
                // the room_id is valid, send to message to this room
                module.parent.exports.get('io').to(room_id)
                    .emit('message', {'message': message, "user": user});
                res.status(200);
                res.send({status: '200 OK', data: 'Message sent'});
            }
        }
    })

});

router.post("/sendQuiz", function (req, res) {
    var room_id = req.body.room_id;
    var quiz_name = req.body.quiz_name;
    var user = req.body.user;

    // if any of the three values is missing, throw error
    if(!room_id || !quiz_name || !user){
        res.status(500);
        res.send({status: '500 Internal Error',
            data: 'missing values, must have room_id, quiz_name, user'});
    }

    // send using io from parent module (which is app in app.js)
    room_apis.existUserInRoom({room_id: room_id, user_id: user}, function (err, data) {
        if(err) {
            res.status(500);
            res.send({status: '500 internal error', data: 'Error in confirming room_id'});
        } else {
            if(!data.data || data.code == 404) { // if there is no data returned
                console.log(data.status)
                res.status(404);
                res.send({status: '404 not found', data: 'room_id or user not found'});
            } else {
                // the room_id is valid, send to message to this room
                module.parent.exports.get('io').to(room_id)
                    .emit('commands', {'type': 'quiz', 'quiz_name': quiz_name, "user": user});
                res.status(200);
                res.send({status: '200 OK', data: 'Message sent'});
            }
        }
    })
})

router.post("/createRoom", function (req, res) {
    logger.debug('/createRoom: room_id: ' + req.body.room_id);
    var room_id = req.body.room_id;
    var room_name = req.body.room_name;

    // if room_id is valid and rooms does not have this room_id in database yet,
    // add room_id and return ok
    if(!room_id){
        res.status(500);
        res.send({status: '500 internal error', data: 'Missing room_id in request body'});
    } else {
        room_apis.createRoom({room_id: room_id, room_name: room_name}, function (err, data) {
            if(err) {
                res.status(500);
                res.send(resMsg('500 internal error',
                    'Error when creating room in database: \n' + err));
            } else {
                res.status(200);
                res.send(resMsg('200 ok', 'room created: \n' + data));
            }
        });
    }
});


router.get("/getRoomById", function(req, res) {
    var room_id = req.body.room_id;
    if(!room_id) {
        res.status(500);
        res.send(resMsg('500 internal error', 'Missing room_id in request body'));
    } else {
        room_apis.existRoom(room_id, function(err, data) {
            if(err) {
                res.status(500);
                res.send(resMsg('500 internal error',
                    'Error when searching database for ' + room_id));
            } else {
                if(!data) {
                    res.status(404);
                    res.send(resMsg('404 not found',
                        'Cannot find room that is associated with this id'))
                } else {
                    res.status(200);
                    res.send(resMsg('200 ok', data));
                }
            }
        })
    }
});

module.exports = router;