
var test_create = function((socket) {
    socket.on('createRoom',  {
        var room = 'blabla';
        socket.create(room);
       
    });
    return(socket.rooms.indexOf(room) >= 0)
});
/*
var test_create = function((socket,user_id) {
    socket.on('joinRoom',  {
        var room = 'blabla';
        socket.join(room,user_id);
       
    });
    return(socket.rooms.indexOf(room) >= 0)
});
*/

var user_num = 0;
io.sockets.on('connection', function(user) {
    user_num++;
    user.emit('send login');
    user.on('login user',function (data) {
        if(data.name in users) {

        } else {
            user.user_name = data.name;
            user.user_id = data.id;
            users[user.user_id] = {'name':user.user_name,'socket':user};
            io.sockets.emit('online users', { 'user number': user_num });
        }
        
    });

