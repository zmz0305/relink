/**
 * Created by zmz0305 on 2/11/17.
 */
var express = require('express');
var router = express.Router();
var rooms = require('../internal/room_data');

router.post("/send", function (req, res) {
    console.log(req.body.room_id);
    console.log(req.body.message);
    console.log(req.body.user);
    room_id = req.body.room_id;
    message = req.body.message;
    user = req.body.message;
    if(!room_id || !message || !user){
        res.status(500);
        res.send({status: '500 Internal Error', data: 'missing values, must have room_id, message, user'});
    }
    module.parent.exports.get('io').to(room_id).emit('message', {'message': message, "user": user});
    res.status(200);
    res.send({status: '200 OK'});
});

router.post("/createRoom", function (req, res) {
    console.log('/createRoom: room_id' + req.body.room_id);
    room_id = req.body.room_id;

    // if room_id is valid and rooms does not have this room_id yet,
    // add room_id and return ok
    if(room_id && !rooms.room_id){
        rooms.room_id = 1;
        res.status(201);
        res.send({status: '201 Created', data: room_id + 'room created'});
    } else if(room_id && rooms.room_id){
        res.status(201);
        res.send({status: '201 Created', data: room_id + 'room already exist'});
    } else {
        res.status(500);
        res.send({status: '500 Internal error', data: room_id + 'creation failed'});
    }
});

module.exports = router;