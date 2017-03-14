var fs = require("fs")
var querystring = require('querystring')
var http = require('http')
var assert = require('assert');
var sock = require('socket.io-client')

/*
var url = 'localhost'
var port_num = 3000
var path_str = '/'
var body = {user : 23}
test_post(url, port_num, path_str, body, function(str){console.log('received :', str)})
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
/*
var test_socket = function(url){
	var socket = socket_client(url)
	socket.on('connect', function(){
		socket.on('msg', function (from, msg) {
    	console.log('message [', from, ']:', msg);
  	});
	});
}
*/
var contents = fs.readFileSync("test_config.json")
var test_config = JSON.parse(contents)

var test_num = test_config["test_num"]

for(i=1; i<=test_num; i++){
	var test_name = 'test'+(i)
	unit_test(test_config[test_name])

}

