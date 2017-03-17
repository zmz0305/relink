import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
var ajax = require('../components/AjaxCall.jsx');


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

    ajax("GET", "/accounts/newroom", {},
      function(success) {
        console.log(success);
        store.dispatch({type: 'JOINROOM', roomId: success});
        router.push('/room');
      },
      function(error) {
        console.log(error);
      }
    );
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
