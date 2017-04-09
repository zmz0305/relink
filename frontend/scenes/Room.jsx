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
      console.log("joined " + JSON.stringify(data));
    });
    socket.on('error', function(data){
      router.push('/');
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentDidMount() {    
    socket.on('message', message => {
      this.setState((prevState, props) => ({
        messages: prevState.messages.concat([message])
      }));
    })
  }

  onSubmit(event) {
    event.preventDefault();

    const roomId = this.state.roomId;
    const message = this.state.message;
    ajax("POST", "/accounts/message", {"room_id": roomId, "message": message},
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
    var messages = [];
    for (var i = 0; i < this.state.messages.length; i++) {
      messages.push(<h4 key={i}>{this.state.messages[i].user}: {this.state.messages[i].message}</h4>);
    }

    return(
      <div>
        <form onSubmit={this.onSubmit}>
          <LabelInput name="message" label="Message" type="text" onChange={this.setValue} />
          <Button bsStyle="primary" type="submit">Send Message</Button>
        </form>
        <br/>
        {messages}
      </div>
    );
  }
};
