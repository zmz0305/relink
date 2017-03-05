import React from 'react';
import LabelInput from '../components/LabelInput.jsx';

export default class AddClass extends React.Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(event){
    event.preventDefault();
    const BaseURL ="http://127.0.0.1:8000/accounts";
    $.ajax({
      type:"POST",
      url:BaseURL + "/newroom/",
      success: function(data){
        console.log(data);
      },
      error: function(data){
        console.log(data);
      }
    });
  }
  render(){
    return(
      <div>
      <form onSubmit = {this.onSubmit}>
        <button type="submit">CREATE NEW CLASS</button>
      </form>
      </div>
    );
  }
};
