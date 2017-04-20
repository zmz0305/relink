import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
import LoadingStore from '../components/LoadingStore.jsx'
import { Col, ListGroup, ListGroupItem, FormControl, FormGroup, Checkbox, Jumbotron, Row, Button, Grid } from 'react-bootstrap';
import { withRouter } from 'react-router' 
var ajax = require('../components/AjaxCall.jsx');

export default class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomId: '', visible: false};
        this.joinRoom = this.joinRoom.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    joinRoom(event) {
        event.preventDefault();

        const roomId = this.state.roomId;
        ajax("GET", "/accounts/classroom/" + roomId, null,
            function (success) {
                store.dispatch({type: 'JOINROOM', roomId: roomId});
                this.router.push('/room');
            }.bind(this),
            function (error) {
                console.log(error);
                this.setState({visible: true})
            }.bind(this)
        )
    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const buttonStyle={
            width:'100%',
            marginBottom: '10px'
        }
        return (
            <div>
                <form onSubmit={this.joinRoom}>
                    <Jumbotron>
                        <div>
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
                </form>
                { this.state.visible ? <h3>Not a valid code</h3> : null }
            </div>
        );
    }
};