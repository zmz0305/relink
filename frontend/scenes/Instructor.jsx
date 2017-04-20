import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
import {Button} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Col, ListGroup, ListGroupItem, FormControl, FormGroup, Checkbox, Jumbotron, Row} from 'react-bootstrap'

var ajax = require('../components/AjaxCall.jsx');

export default class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomId:'', quizNames: []};

        this.createClass = this.createClass.bind(this);
        this.createQuiz = this.createQuiz.bind(this);
        this.postQuiz = this.postQuiz.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setValue = this.setValue.bind(this);

        ajax("POST", "/accounts/listquiz", {},
            function (success) {
                this.setState({'quizNames': JSON.parse(success)});
            }.bind(this),
            function (error) {
                console.log(error);
            }
        );
    }

    createClass(event) {
        const username = store.getState().username;

        ajax("GET", "/accounts/newroom", {},
            function (success) {
                store.dispatch({type: 'JOINROOM', roomId: success});
                this.props.router.push('/room');
            }.bind(this),
            function (error) {
                console.log(error);
            }
        );
    }


    createQuiz(event) {
        store.dispatch({type: 'EDITQUIZ', quizName: ''});
        this.props.router.push('/createQuiz');
    }

    postQuiz(event) {
        this.setState({'quiz': event.target.name}, function after() {
            console.log(this.state.quiz);
            store.dispatch({type: 'EDITQUIZ', quizName: this.state.quiz});
            this.props.router.push('/createQuiz');
        });
    }

    onSubmit(event){
        event.preventDefault();
        const roomId = this.state.roomId;
        const router = this.props.router;

        ajax("GET", "/accounts/classroom/" + roomId, null,
            function(success) {
                console.log(success);
                store.dispatch({type: 'JOINROOM', roomId: roomId});
                router.push('/room');
            },
            function(error) {
                this.setState({error: 'Error join room, make sure this room exists.'});
                console.log(JSON.stringify(error) + " error");
            }
        ).bind(this)
    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {

    const buttonStyle={
        width:'100%',
        marginBottom: '10px'
    }
    const headerStyle={
        padding:'0px',
        margin:'0 auto 10px'
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
        <div>
                    <Button style={buttonStyle} bsStyle="primary" onClick={this.createClass}>Create New Class</Button>
                    <form onSubmit = {this.onSubmit}>
                        <FormGroup>
                          <Row>
                          <Col xs={12} md={8}>
                          <FormControl type="text" name="roomId" type="text" placeholder='Class Code' onChange={this.setValue}/>
                          </Col>
                          <Col xs={6} md={4} >
                          <Button bsStyle="primary" type="submit" style={buttonStyle}>Join Class</Button>
                          </Col>
                          </Row>
                        </FormGroup>
                    </form>
                    <br />
                    <div>{this.state.error}</div>
        </div>
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
