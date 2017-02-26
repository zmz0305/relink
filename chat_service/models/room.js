/**
 * Created by zmz0305 on 2/26/17.
 */
var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
    "room_name": String,
    "room_id": {type: String, unique:true, dropDup: true},
    "room_user": [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Room', roomSchema);