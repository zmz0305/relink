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
        const buttonStyle = {
          width:'100%'
        }
        return (
              <Jumbotron>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <InputGroup>
                        <FormControl name="username" label="Email/Username" type="text" onChange={this.setValue}/>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                        <FormControl name="password" label="Password" type="password" onChange={this.setValue}/>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                        <Button type="submit" style={buttonStyle}>Login</Button>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </Jumbotron>
        );
    }
};
