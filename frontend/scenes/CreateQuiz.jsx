import React from 'react';
import store from '../main.js'
import { Button, PageHeader, Grid, Row, Col, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import QuizQuestionTemplate from '../components/QuizQuestionTemplate.jsx'

export default class CreateQuiz extends React.Component{
   constructor(props) {
      super(props);
      this.state = {count: 1};

      this.setValue = this.setValue.bind(this);
      this.removeQuestion = this.removeQuestion.bind(this);
      this.addQuestion = this.addQuestion.bind(this);
   }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  addQuestion() {
		this.setState({count: this.state.count + 1});
	}

	removeQuestion() {
		if (this.state.count != 1)
			this.setState({count: this.state.count - 1});
	}

   render() {
   		var questions = [];
   		for (var i = 0; i < this.state.count; i++) {
  			questions.push(<QuizQuestionTemplate label={"Question " + (i+1)} count={2} name={"question" + i} key={i} onChange={this.setValue} />);
			}

      return (
         <div>
            <PageHeader>Create a quiz!</PageHeader>
				    {questions}
				    <Col smOffset={5} sm={5}>
			        <Button bsStyle="primary" onClick={this.removeQuestion} >
			          - Question
			        </Button>
			        <Button bsStyle="primary" onClick={this.addQuestion} >
			          + Question
			        </Button>
			      </Col>
         </div>
      ); 
   }
};
