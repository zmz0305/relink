import React from 'react';
import io from 'socket.io-client';
import store from '../main.js'
import LabelInput from '../components/LabelInput.jsx';
import {Button} from 'react-bootstrap'
import {Col, ListGroup, ListGroupItem, FormControl, FormGroup, Checkbox, Jumbotron, Row} from 'react-bootstrap'
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
        if(message!=''){
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
            if(this.state.messages[i].anonymous == 'true'){
                messages.push(<ListGroupItem style={style} key={i}>{'Anonymous'}:{this.state.messages[i].message}</ListGroupItem>);
            }
            else{
                 messages.push(<ListGroupItem style={style} key={i}>{this.state.messages[i].user}:{this.state.messages[i].message}</ListGroupItem>);
            }
        }
        const styleChat = {
            height: '500px',
            width: '95%',
            backgroundColor:'#ffffff',
            overflow:'scroll',
            margin: 'auto',
            top: '0px'
        }
        const styleDiv = {
            width: '95%',
            margin: 'auto'
        }
        const buttonStyle={
            width:'100%',
            marginBottom: '10px'
        }
        return (
            <div>
                <Jumbotron>
                <div style={styleChat}>
                <ListGroup>
                {messages}
                </ListGroup>
                </div>
                <br/>
                <form onSubmit={this.onSubmit} style={styleDiv}>
                    <FormGroup>
                      <Row>
                      <Col xs={15} md={10}>
                      <FormControl type="text" name="message" type="text" onChange={this.setValue}/>
                      </Col>
                      <Col xs={3} md={2} >
                      <Button style={buttonStyle} bsStyle="primary" type="submit">Send Message</Button>
                      </Col>
                      </Row>
                      <Row>
                      <Col xs={6} md={4}>
                        <Checkbox checked={this.state.anonymous} onClick={this.setAnonymous}>Anonymous</Checkbox>
                      </Col>
                      </Row>
                    </FormGroup>
                </form>
                </Jumbotron>
            </div>
        );
    }
};
