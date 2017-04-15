import React from 'react';
import io from 'socket.io-client';
import store from '../main.js'
import LabelInput from '../components/LabelInput.jsx';
import {Button} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
var ajax = require('../components/AjaxCall.jsx');
// let socket = io('http://localhost:3000');

export default class Room extends React.Component {
    constructor(props) {
        super(props);

        const storeState = store.getState();
        this.state = {
            anonymous: false,
            roomId: storeState.roomId,
            username: storeState.username,
            isInstructor:storeState.isInstructor,
            messages: [], message: '', counter: 0
        };
        this.socket = storeState.socket;
        const router = this.props.router;
    }

    componentDidMount() {
        this.exitRoom = this.exitRoom.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setAnonymous = this.setAnonymous.bind(this);

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

    exitRoom() {
        console.log('exit room');
        if(this.state.isInstructor) {
            this.props.router.push('/instructor');
        } else {
            this.props.router.push('/student');
        }
    }
    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    setAnonymous(even) {
       this.setState({anonymous: !this.state.anonymous});
    }

    render() {
        var messages = [];
        var colors = ['#FBFCFC', '#FFFFFF'];
        for (var i = 0; i < this.state.messages.length; i++) {
            var color = colors[i%2];
            var style = {backgroundColor: color, margin: '0px', padding:'5px'};
            if(this.state.messages[i].anonymous == 'true') {
                messages.push(<h4 style={style} key={i}>{'Anonymous'}:
                    {this.state.messages[i].message}</h4>);
            } else {
                messages.push(<h4 style={style} key={i}>{this.state.messages[i].user}:
                    {this.state.messages[i].message}</h4>);
            }
        }
        const styleDiv = {
            backgroundColor: '#FBFCFC',
            width: '100%',
            height: '50%',
            borderColor: '#4682b4',
            borderWidth: 1,
            marginTop:'10px',
            borderStyle: 'solid'
          }; 

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <LabelInput name="message" label="Message" type="text" onChange={this.setValue}/>
                    <input type="checkbox" checked={this.state.anonymous} onClick={this.setAnonymous}/> Anonymous<br/>
                    <Button bsStyle="primary" type="submit">Send Message</Button>
                </form>
                <button onClick={this.exitRoom}>Exit Room</button>
                <br/>
                <div>
                {messages}
                </div>
            </div>
        );
    }
};
