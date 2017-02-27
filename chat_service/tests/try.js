/**
 * Created by zmz0305 on 2/26/17.
 */
var room_apis = require('../database/room_apis');
var logger = require('../utility/logger');
var configs = require('../config');
var mongoose = require('mongoose');
mongoose.connect(configs.MONGO_URI);

// room_apis.createRoom({'room_id' : 'someroom'}, function (err, data) {
//     console.log('err', err);
//     console.log('data: ', data);
// })
//
// room_apis.existRoom('someroom', function (err, data) {
//     console.log('err', err);
//     console.log('data: ', data);
// })

room_apis.getRooms(function(err, data) {
    console.log('err', err);
    console.log('data: ', data);
})