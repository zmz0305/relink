/**
 * Created by zmz0305 on 3/12/17.
 */
var assert = require('assert');
var room_apis = require('../database/room_apis');
var mongoose = require('mongoose');
var config = require('../config');
var db_init = require('../utility/data_generator');
var async = require('async');

var fs = require("fs")
var querystring = require('querystring')
var http = require('http')


/*

REST TEST STARTS HERE

*/

var unit_test = function(obj, done){
	var url = obj.url
	var port_num = obj.post_num
	var get_num = obj.get_num
	var proc = obj.testing_procedure
	proc.forEach(function(subtest){
		if(subtest.type == 'post'){
			var data = subtest.data
			describe('Respnse', function(){
				describe('#test_post()', function(){
					it('should get respnse of what expected', function(done){
						test_post(url, port_num, subtest.request, data, function(ret, msg){
							//console.log('response msg: ', str)
							assert.equal(ret, subtest.expectedCode)
							if(subtest.expectedMsg != 'Any'){
								assert.equal(msg, subtest.expectedMsg)
							}
							done()
						})
					})
				})
			})
		}

		else{
			describe('Respnse', function(){
				describe('#null', function(){
					it('Testing type not supported.', function(done){
						test_post(url, port_num, subtest.request, data, function(str){
							//console.log('response msg: ', str)
							assert.equal(1, null)
							done()
						})
					})
				})
			})
		}
	})
}


var test_post = function(url, port_num, path_str, obj, callbacks) {
  var post_data = querystring.stringify(obj);
	//console.log('data to be transmite: ', post_data)
  var post_options = {
		host: url,
		port: port_num,
		path: path_str,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(post_data)
		}
  };

  var post_req = http.request(post_options, function(res) {
			//console.log(res)
      res.setEncoding('utf8')
			var ret = res.statusCode
			var msg = ""
			res.on('data', function (chunk) {
				msg += chunk
		  })
			res.on('end', function(){
				msg = JSON.parse(msg);
				callbacks(ret, msg.status)
			})
  });

  post_req.write(post_data);
  post_req.end();
}

var contents = fs.readFileSync("test_config.json")
var test_config = JSON.parse(contents)

var test_num = test_config["test_num"]

for(i=1; i<=test_num; i++){
	var test_name = 'test'+(i)
	unit_test(test_config[test_name])

}

/*

REST TEST ENDS HERE

*/

describe('Mongodb Tests', function() {
    before(function (done) {
        mongoose.connect(config.MONGO_URI);
        db_init(done);
    });

    after(function () {
        mongoose.disconnect();
    });

    describe('#getRooms()', function () {
        it('It should return all rooms in Mongodb, ' +
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
        it('It should create an room in Mongdb with id wocao', function (done) {
            room_apis.createRoom({'room_id': 'wocao', 'room_name': 'wocao'}, function (err, res) {
                assert.equal(err, undefined);
                assert.equal(res.room_id, 'wocao');
                assert.equal(res.room_name, 'wocao');
                done();
            });
        })
    });

    describe('#existsUserInRoom()', function () {
        it('Check if user is inside of one specified room', function (done) {
            room_apis.existUserInRoom({room_id: 'room1', user_id: 'mgao16'}, function (err, res) {
                assert.equal(err, undefined);
                assert.equal(res.data.room_id, 'room1');
                assert.equal(res.status, 'existRoom ok');
                assert.equal(res.user_index, 1);
                done();
            })
        })
    })


});
