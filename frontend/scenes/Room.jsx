 import React from 'react';
import io from 'socket.io-client';
import store from '../main.js'
import LabelInput from '../components/LabelInput.jsx';
import { Button } from 'react-bootstrap'
var ajax = require('../components/AjaxCall.jsx');
let socket = io('http://localhost:3000');

export default class Room extends React.Component {
  constructor(props){
    super(props);

    const initState = store.getState();
    this.state = { roomId: initState.roomId, username: initState.username, messages: [], message: '', counter : 0 };

    const router = this.props.router;
    socket.emit('join', {
      room_id : initState.roomId,
      user : this.state.username
    });
    socket.on('ok', function(data) {
      console.log("joined " + data);
    });
    socket.on('error', function(data){
      router.push('/');
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);
    
    socket.on('message', function(message) {
      console.log(message);
      console.log(this.state.messages);
      this.setState((prevState, props) => ({
        messages: prevState.messages.concat([message])
        console.log(prevState);
      }));
    }.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    
    const roomId = this.state.roomId;
    const message = this.state.message;
    ajax("GET", "/accounts/message", {"room_id": roomId, "message": message},
      function(success) {
        console.log(success);
      },
      function(error) {
        console.log(error)
      }
    );
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    // var messages = [];
    // for (var i = 0; i < this.state.messages.count; i++) {
    //   answers.push(<p>{this.state.messages[i].name} {this.state.messages[i].username}</p>);
    // }

    return(
      <div>
        <form onSubmit={this.onSubmit}>
          <LabelInput name="message" label="Message" type="text" onChange={this.setValue} />
          <Button bsStyle="primary" type="submit">Send Message</Button>
        </form>

      </div>
    );
  }
};