import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'

export default class JoinClass extends React.Component {
  constructor(props){
    super(props);
    this.state = {id:''};
    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);

    if (store.getState().username == "") {
      this.props.router.push('/');
    }
  }

  onSubmit(event){
    event.preventDefault();
    const router = this.props.router;
    
    $.ajax({
      type:"GET",
      url:"http://127.0.0.1:8000/accounts/classroom/"+this.state.id,
      xhrFields: {
        withCredentials: true
      },
      success: function(data){
        console.log(data);
        router.push('/room');
      },
      error: function(data){
        console.log(data);
      }
    });
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render(){
    return(
      <div>
      ENTER CLASS CODE<br/>
      <form onSubmit = {this.onSubmit}>
        <LabelInput name="id" label="Class Code" type="text" onChange={this.setValue} />
        <button type="submit">Submit Code</button>
      </form>
      </div>
    );
  }
};
