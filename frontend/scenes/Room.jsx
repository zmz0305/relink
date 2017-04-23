import React from 'react';
import io from 'socket.io-client';
import store from '../main.js'
import LabelInput from '../components/LabelInput.jsx';
import {Button} from 'react-bootstrap'
import {Col, ListGroup, ListGroupItem, FormControl, FormGroup, Checkbox, Jumbotron, Row, Grid} from 'react-bootstrap'
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
            messages: [], message: '', counter: 0,
            quizNames: []
        };
        this.socket = storeState.socket;
        const router = this.props.router;

        ajax("POST", "/accounts/listquiz", {},
            function (success) {
                this.setState({'quizNames': JSON.parse(success)});
            }.bind(this),
            function (error) {
                console.log(error);
            }
        );
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
        this.socket.on('commands', (data) => {
            // data looks loke {type: 'quiz', quiz_name: 'quiz_name', user: 'user_id'}
            ajax('POST', 'accounts/postquiz',
                {quizname: data.quiz_name, instructor_id: data.user},
                function (success) {
                    console.log(success);
                }, 
                function (error) {
                    console.log(error);
                }
            );
            console.log('received quiz command');
        })
    }

    onSubmit(event) {
        event.preventDefault();
        const roomId = this.state.roomId;
        const message = this.state.message;
        const anon = this.state.anonymous;

        if(message.indexOf('/cmd') == 0) { // when instructor put in /cmd sendquiz quizname
            const args = message.split(' ')
            if(args[1] == 'sendquiz' && args[2]) {
                ajax('POST', '/accounts/sendquiz',
                    {room_id: roomId, quizname: args[2]},
                    function (success) {
                        console.log(success);
                    },
                    function(error) {
                        console.log(error);
                    }
                )
            }
        }
        else if(message!=''){
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
            width: '100%',
            backgroundColor:'#ffffff',
            overflow:'scroll',
            margin: 'auto',
            top: '0px'
        }
        const styleDiv = {
            width: '100%',
            margin: 'auto'
        }
        const buttonStyle={
            width:'100%',
            marginBottom: '10px'
        }
        const pStyle={
            textAlign:'center'
        }
        var quizList = [];
        for(var i = 0; i < this.state.quizNames.length; i++) {
            quizList.push(<Button style = {buttonStyle} bsStyle="primary" key={i} name={this.state.quizNames[i]} onClick={this.postQuiz}>{this.state.quizNames[i]}</Button>);
        }
        return (
            <div>
                <Grid>
                <Row className="show-grid">
                <Col md={9}>
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
                      <Col xs={12} md={9}>
                      <FormControl type="text" name="message" onChange={this.setValue}/>
                      </Col>
                      <Col xs={6} md={3} >
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
                </Col>
                <Col md={3}>
                <Jumbotron>
                <div>
                            <p style={pStyle}>Saved <b>Quizzes</b></p>
                            {quizList}
                </div>
                </Jumbotron>
                </Col>
                </Row>
                </Grid>
            </div>
        );
    }
};
