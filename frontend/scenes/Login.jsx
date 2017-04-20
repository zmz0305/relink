import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
var ajax = require('../components/AjaxCall.jsx');

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
        return (
            <div>
                LOGIN<br/>
                <form onSubmit={this.onSubmit}>
                    <LabelInput name="username" label="Email/Username" type="text" onChange={this.setValue}/>
                    <LabelInput name="password" label="Password" type="password" onChange={this.setValue}/>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
};
