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
    this.state = { roomId: initState.roomId, username: initState.username, messages: [], message: '' };

    const router = this.props.router;
    socket.emit('join', {
      room_id : initState.roomId,
      user : this.state.username
    });
    socket.on('ok', function(data) {
      console.log("joined " + data);
      socket.on('message', {room_id: initState.roomId}, function(message) {
        this.state.messages.append(message);
      })
    });
    socket.on('error', function(data){
      router.push('/');
    });


    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    
    const roomId = this.state.roomId;
    const message = this.state.message;
    ajax("GET", "/accounts/message", {"room_id": roomId, "message": message},
      function(success) {
        console.log(success);
        this.setState({message: ''});
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
    return(
      <div>
      <form>
        <LabelInput name="message" label="Message" type="text" onChange={this.setValue} />
        <Button bsStyle="primary" onClick={this.onSubmit}>Send Message</Button>
      </form>
      </div>
    );
  }
};
