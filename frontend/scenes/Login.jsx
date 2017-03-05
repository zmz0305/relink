import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'

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

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8000/accounts/login",
      data: this.state,
      success: function(data) {
        if (data == "Student login") {
          store.dispatch(login(username, false));
          router.push('/student');
        } else if (data == "Teacher login") {
          store.dispatch(login(username, true));
          router.push('/instructor');
        }
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      <div>
        LOGIN<br/>
        <form onSubmit={this.onSubmit}>
          <LabelInput name="username" label="Email/Username" type="text" onChange={this.setValue} />
          <LabelInput name="password" label="Password" type="password" onChange={this.setValue} />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
};