/**
 * Created by zmz0305 on 2/11/17.
 */
var express = require('express');
var router = express.Router();
var rooms = require('../internal/room_data');

router.post("/send", function (req, res) {
    console.log(req.body.room_id);
    console.log(req.body.message);
    room_id = req.body.room_id;
    message = req.body.message;
    module.parent.exports.get('io').to(room_id).emit('message', {'message': message});
    res.send({status: '200 OK'});
});

router.post("/createRoom", function (req, res) {
    console.log('/createRoom: room_id' + req.body.room_id);
    room_id = req.body.room_id;

    // if room_id is valid and rooms does not have this room_id yet,
    // add room_id and return ok
    if(room_id && !rooms.room_id){
        rooms.room_id = 1;
        res.send({status: '200 OK', data: room_id + 'room created'});
    } else {
        res.send({status: '500 INTERNAL ERROR', data: room_id + 'room creation failed'});
    }
});

module.exports = router;