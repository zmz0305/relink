/**
 * Created by zmz0305 on 2/11/17.
 */
// example
// {'roomcode': [socketid1, socketid2, socketid3...]}
/**
 * Created by zmz0305 on 2/11/17.
 */
// example
// {'roomcode': [socketid1, socketid2, socketid3...]}
var room_plp = {}
var room_arr = {}
exports.add_room = function(room_name, socketid){
  room_plp[room_name] = 1
  room_arr[room_name] = new Array()
  room_arr[room_name].push(socketid)
}

exports.join_room = function(room_name, socketid){
  //if()
  room_arr[room_name].push(socketid)
  room_plp[room_name] += 1
}

exports.check_room = function(room_name){
  if(room_arr[room_name] != null){
    return true
  }
  return false
}

