import React from 'react';
import io from 'socket.io-client';
import store from '../main.js'
import LabelInput from '../components/LabelInput.jsx';
import {Button} from 'react-bootstrap'
var ajax = require('../components/AjaxCall.jsx');
// let socket = io('http://localhost:3000');

export default class Room extends React.Component {
    constructor(props) {
        super(props);

        const storeState = store.getState();
        this.state = {anonymous: false, roomId: storeState.roomId, username: storeState.username, messages: [], message: ''};
        this.socket = storeState.socket;
        
        this.onSubmit = this.onSubmit.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setAnonymous = this.setAnonymous.bind(this);
    }

    componentDidMount() {
        const router = this.props.router;
        if(!this.state.username) {
            router.push('/');
            return;
        }
        // this.socket.emit('join', {
        //     room_id: this.state.roomId,
        //     user: this.state.username
        // });
        this.socket.on('ok', function (data) {
            console.log("joined " + JSON.stringify(data));
        });
        this.socket.on('error', function (data) {
            router.push('/');
        });
        this.socket.on('message', message => {
            this.setState(() => ({
                messages: this.state.messages.concat([message])
            }));
        })
    }

    onSubmit(event) {
        event.preventDefault();

        const roomId = this.state.roomId;
        const message = this.state.message;
        const anon = this.state.anonymous;
        ajax("POST", "/accounts/message",
            {room_id: roomId, message: message, anonymous: anon},
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error)
            }
        );

    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    setAnonymous(even) {
       this.setState({anonymous: !this.state.anonymous});
    }

    render() {
        var messages = [];
        for (var i = 0; i < this.state.messages.length; i++) {
            console.log('anonymous: ', this.state.messages[i])
            if(this.state.messages[i].anonymous == 'true') {
                messages.push(<h4 key={i}>{'Anonymous'}:
                    {this.state.messages[i].message}</h4>);
            } else {
                messages.push(<h4 key={i}>{this.state.messages[i].user}:
                    {this.state.messages[i].message}</h4>);
            }
        }

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <LabelInput name="message" label="Message" type="text" onChange={this.setValue}/>
                    <input type="checkbox" checked={this.state.anonymous} onClick={this.setAnonymous}/> Anonymous<br/>
                    <Button bsStyle="primary" type="submit">Send Message</Button>
                </form>
                <br/>
                {messages}
            </div>
        );
    }
};
