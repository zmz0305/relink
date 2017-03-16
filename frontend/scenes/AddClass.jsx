import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'

export default class AddClass extends React.Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    const userObj = store.getState();
    if (userObj.username == "" || userObj.isInstructor == false) {
      this.props.router.push('/');
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const username = store.getState().username;
    const router = this.props.router;

    $.support.cors = true;
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
      options.crossDomain ={
        crossDomain: true
      };
      options.xhrFields = {
        withCredentials: true
      };
    });

    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8000/accounts/newroom/",
      async: true,
      // cache: false,
      xhrFields: {
        withCredentials: true,
        crossDomain: true
      },
      // data: {'username': username},
      success: function(data){
        console.log(data);
        router.push('/room');
      },
      error: function(data){
        console.log(data);
      }
    });
  }

  render() {
    return(
      <div>
      <form onSubmit = {this.onSubmit}>
        <button type="submit">CREATE NEW CLASS</button>
      </form>
      </div>
    );
  }
};
