import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
var ajax = require('../components/AjaxCall.jsx');
import {Button} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Row} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {Form} from 'react-bootstrap'
import {Jumbotron} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {InputGroup} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {Radio} from 'react-bootstrap'
import {ControlLabel} from 'react-bootstrap'

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: '', firstname: '', lastname: '', isInstructor: "False"};
    this.onSubmit = this.onSubmit.bind(this);
    this.updateInstructorState = this.updateInstructorState.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    const router = this.props.router;

    ajax("POST", "/accounts/register", this.state,
      function(success) {
        console.log(success)
        if (success == "Create user successfully") {
          router.push('/');
        }
      },
      function(error) {
        console.log(error);
      }
    );
  }

  updateInstructorState(bool) {
    this.state.isInstructor = bool;
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    const inputgr = {
      margin : "10px"
    }
      return (

         <Grid>
           <Row className="show-grid">
             <Col md={1}/>
             <Col md={9}>
             <Jumbotron>
               <Form onSubmit={this.onSubmit}>
                 <FormGroup>
                   <InputGroup style = {inputgr}>
                     <Row className="show-grid">
                     <Col componentClass={ControlLabel} md={6}>
                      Email
                     </Col>
                     <Col md={6}>
                       <FormControl name="username" label="Email/Username" type="text" placeholder = "Email" onChange={this.setValue} />
                     </Col>
                     </Row>
                     <Row className="show-grid">
                     <Col componentClass={ControlLabel} md={6}>
                      Password
                     </Col>
                     <Col md={6}>
                       <FormControl name="password" label="Password" type="password" placeholder = "Password" onChange={this.setValue} />
                     </Col>
                     </Row>
                   </InputGroup>
                   </FormGroup>
                   <FormGroup>
                   <InputGroup style = {inputgr}>
                     <Row className="show-grid">
                     <Col componentClass={ControlLabel} md={6}>
                      First Name
                     </Col>
                     <Col md={6}>
                       <FormControl name="firstname" label="First Name" type="text" onChange={this.setValue} />
                     </Col>
                     </Row>
                     <Row className="show-grid">
                     <Col componentClass={ControlLabel} md={6}>
                      Last Name
                     </Col>
                     <Col md={6}>
                       <FormControl name="lastname" label="Last Name" type="text" onChange={this.setValue} />
                     </Col>
                     </Row>
                   </InputGroup>
                 </FormGroup>
                 <FormGroup>
                   <Radio name="radioGroup" inline name="isInstructor" value="false" type="radio" defaultChecked="true" onChange={() => {this.updateInstructorState("False")}}>
                   Student
                   </Radio>
                   {' '}
                   <Radio name="radioGroup" inline name="isInstructor" value="true" type="radio" onChange={() => {this.updateInstructorState("True")}}>
                   Instructor
                   </Radio>
                 </FormGroup>
                 <Button type="submit">Sign Up</Button>
               </Form>
             </Jumbotron>
             </Col>
             <Col md={2}/>
           </Row>
         </Grid>
      );
   }
};
