import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
var ajax = require('../components/AjaxCall.jsx');
import {Button} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Row} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {Form} from 'react-bootstrap'
import {Jumbotron} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {InputGroup} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'

function login(name, isInstructor) {
    return {
        type: 'LOGIN',
        username: name,
        isInstructor: isInstructor
    }
}

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        this.onSubmit = this.onSubmit.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const username = this.state.username;
        const router = this.props.router;

        ajax("POST", "/accounts/login", this.state,
            function (sucess) {
                if (sucess == "Authentication Failed") {
                    alert("Authentication Failed")
                } else {
                    var isInstructor = sucess == "Teacher login";
                    store.dispatch({
                        type: 'LOGIN',
                        username: username,
                        isInstructor: isInstructor,
                        router: router
                    })
                }
            },
            function (error) {
                console.log(error);
            }
        );
    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const soleRow = {
          top : "25px"
        }
        return (
          <Grid>
            <Row className="show-grid">
              <Col md={3}/>
              <Col md={6}>
              <Jumbotron>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <InputGroup>
                      <Row className="show-grid" style = {soleRow}>
                      <Col sm={4}>
                        <FormControl name="username" label="Email/Username" type="text" onChange={this.setValue}/>
                      </Col>
                      <Col sm={4}>
                        <FormControl name="password" label="Password" type="password" onChange={this.setValue}/>
                      </Col>
                      <Col sm={4}>
                        <Button type="submit">Login</Button>
                      </Col>
                      </Row>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </Jumbotron>
              </Col>
              <Col md={3}/>
            </Row>
          </Grid>
        );
    }
};
