import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
var ajax = require('../components/AjaxCall.jsx');

export default class JoinClass extends React.Component {
  constructor(props){
    super(props);
    this.state = {roomId:''};
    this.onSubmit = this.onSubmit.bind(this);
    this.setValue = this.setValue.bind(this);

    if (store.getState().username == "") {
      this.props.router.push('/');
    }
  }

  onSubmit(event){
    event.preventDefault();
    const roomId = this.state.roomId;
    const router = this.props.router;
    
    ajax("GET", "/accounts/classroom" + roomId,
      function(success) {
        console.log(success);
        store.dispatch({type: 'JOINROOM', roomId: roomId});
        router.push('/room');
      },
      function(error) {
        console.log(error);
      }
    )
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render(){
    return(
      <div>
      ENTER CLASS CODE<br/>
      <form onSubmit = {this.onSubmit}>
        <LabelInput name="roomId" label="Class Code" type="text" onChange={this.setValue} />
        <button type="submit">Submit Code</button>
      </form>
      </div>
    );
  }
};
