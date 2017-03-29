import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
import { Button } from 'react-bootstrap'
var ajax = require('../components/AjaxCall.jsx');


export default class AddClass extends React.Component {
  constructor(props){
    super(props);
    this.createClass = this.createClass.bind(this);
    this.createQuiz = this.createQuiz.bind(this);

    const userObj = store.getState();
    if (userObj.username == "" || userObj.isInstructor == false) {
      this.props.router.push('/');
    }
  }

  createClass(event) {
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

  createQuiz(event) {
    this.props.router.push('/createQuiz');
  }

  render() {
    return(
      <div>
        <Button bsStyle="primary" onClick={this.createClass}>Create New Class</Button>
        <br />
        <Button bsStyle="primary" onClick={this.createQuiz}>Create New Quiz</Button>
      </div>
    );
  }
};
