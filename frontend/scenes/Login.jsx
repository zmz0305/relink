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

        // store.subscribe(() => {
        //   // When state will be updated(in our case, when items will be fetched), we will update local component state and force component to rerender with new data.
        //   this.setState({
        //     username: store.getState().username
        //   });
        // });
    }

    onSubmit(event) {
        event.preventDefault();
        const username = this.state.username;
        const router = this.props.router;

        ajax("POST", "/accounts/login", this.state,
            function (sucess) {
                console.log(sucess)
                if (sucess == "Student login") {
                    store.dispatch(login(username, false));
                    router.push('/student');
                } else if (sucess == "Teacher login") {
                    store.dispatch(login(username, true));
                    router.push('/instructor');
                } else if (sucess == "Authentication Failed") {
                    alert("Authentication Failed");
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
