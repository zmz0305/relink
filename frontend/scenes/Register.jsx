import React from 'react';
import LabelInput from '../components/LabelInput.jsx';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: '', firstname: '', lastname: '', isInstructor: false};
    this.onSubmit = this.onSubmit.bind(this);
    this.updateInstructorState = this.updateInstructorState.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state);

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8000/accounts/register",
      data: this.state,
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  updateInstructorState(bool) {
    this.state.isInstructor = bool;
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
      return (
         <div>
            REGISTER<br/>
            <form onSubmit={this.onSubmit}>
              <LabelInput name="username" label="Email/Username" type="text" onChange={this.setValue} />
              <LabelInput name="password" label="Password" type="password" onChange={this.setValue} />
              <LabelInput name="firstname" label="First Name" type="text" onChange={this.setValue} />
              <LabelInput name="lastname" label="Last Name" type="text" onChange={this.setValue} />

              Instructor/Student:<br/>
              <label>Student
                <input name="isInstructor" value="false" type="radio" defaultChecked="true" onChange={() => {this.updateInstructorState(false)}}/>
              </label>
              <label>Instructor
                <input name="isInstructor" value="true" type="radio" onChange={() => {this.updateInstructorState(true)}} />
              </label><br/>
              <button type="submit" >Register</button>
            </form>
         </div>
      );
   }
};