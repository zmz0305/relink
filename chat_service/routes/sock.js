/**
 * Created by zmz0305 on 2/11/17.
 */
var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var mongo_api = require('../utility/mongo_apis');
var resMsg = require('../utility/utils').resMsg;

router.post("/send", function (req, res) {
    console.log(req.body.room_id);
    console.log(req.body.message);
    console.log(req.body.user);
    var room_id = req.body.room_id;
    var message = req.body.message;
    var user = req.body.message;

    // if any of the three values is missing, throw error
    if(!room_id || !message || !user){
        res.status(500);
        res.send({status: '500 Internal Error',
            data: 'missing values, must have room_id, message, user'});
    }

    // send using io from parent module (which is app in app.js)
    mongo_api.existRoom(room_id, function (err, data) {
        if(err) {
            res.statusCode(500);
            res.send({status: '500 internal error', data: 'Error in confirming room_id'});
        } else {
            if(!data) {
                res.statusCode(404);
                res.send({status: '404 not found', data: 'room_id not found'});
            } else {
                module.parent.exports.get('io').to(room_id)
                    .emit('message', {'message': message, "user": user});
                res.status(200);
                res.send({status: '200 OK', data: 'Message sent'});
            }
        }
    })

});

router.post("/createRoom", function (req, res) {
    logger.debug('/createRoom: room_id: ' + req.body.room_id);
    var room_id = req.body.room_id;
    var room_name = req.body.room_name;
    // if room_id is valid and rooms does not have this room_id in database yet,
    // add room_id and return ok
    if(!room_id){
        res.statusCode(500);
        res.send({status: '500 internal error', data: 'Missing room_id in request body'});
    } else {
        mongo_api.createRoom({room_id: room_id, room_name: room_name}, function (err, data) {
            if(err) {
                res.statusCode(500);
                res.send(resMsg('500 internal error',
                    'Error when creating room in database: \n' + err));
            } else {
                res.statusCode(200);
                res.send(resMsg('200 ok', 'room created: \n' + data));
            }
        });
    }

});

module.exports = router;