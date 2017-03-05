import React from 'react';
import LabelInput from '../components/LabelInput.jsx';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    $.ajax({
      type: "POST",
      url: baseURL+"accounts/login",
      data: this.state,
      success: function(data) {
        console.log(data);
        // this.props.router.push('/chat');
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