import React from 'react';
import io from 'socket.io-client';
let socket = io('http://localhost:3000');

export default class Chat extends React.Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    socket.emit('join', {
      room_id : '22',
      user : "student@gmail.com"
    });
    socket.on('error', function(data){
      console.log(data);
    });
    socket.on('ok', function(data){
      console.log(data);
    });
  }


  onSubmit(event) {
    event.preventDefault();
/*socket.emit('client:sendMessage', {
      "msg" : "".
      "user" : "student@gmail.com",
      "room_id" : 9
    }); */
  }

  render() {
    return(
      <div>
      <form onSubmit = {this.onSubmit}>
        <button type="submit">SEND MESSAGE</button>
      </form>
      </div>
    );
  }
};
