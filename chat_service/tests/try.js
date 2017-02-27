/**
 * Created by zmz0305 on 2/26/17.
 */
var mongo_apis = require('../utility/mongo_apis');
var logger = require('../utility/logger');
var configs = require('../config');
var mongoose = require('mongoose');
mongoose.connect(configs.MONGO_URI);

mongo_apis.createRoom({'room_id' : 'someroom'}, function (err, data) {
    console.log('err', err);
    console.log('data: ', data);
})

mongo_apis.existRoom('someroom', function (err, data) {
    console.log('err', err);
    console.log('data: ', data);
})