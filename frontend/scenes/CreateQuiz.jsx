import React from 'react';
import store from '../main.js'
import { Button, PageHeader, Grid, Row, Col, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import QuizQuestionTemplate from '../components/QuizQuestionTemplate.jsx'
var ajax = require('../components/AjaxCall.jsx');

export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    const quiz = store.getState();
    this.state = {questionCount: 1, questions: [null], questionsHTML: [], quizTitle:quiz.quizName, emptyJSON:[]};
    if(quiz.quizName!=''){
      var self = this;
      ajax("POST", "/accounts/postquiz", {"quizname": quiz.quizName ,"instructor_id": quiz.username},
      function(success) {
        console.log(success);  
        var quiz = JSON.parse(success)['questions'];
        self.setState({'questionCount' : quiz.length+1})
        self.setState({'questionsHTML': quiz});
      },
      function(error) {
        console.log(error);
      }
    );
    } 
    this.setValue = this.setValue.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
  }

  setValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  setQuestion(index, question) {
    var newArray = this.state.questions.slice();
    newArray[index] = question;
    this.setState({questions: newArray});
  }

  addQuestion() {
    var newArray = this.state.questions.concat([null]);
		this.setState({questionCount: this.state.questionCount + 1, questions: newArray});
	}

	removeQuestion() {
		if (this.state.questionCount != 1) {
      var newArray = this.state.questions.slice(0,-1)
			this.setState({questionCount: this.state.questionCount - 1, questions: newArray});
    }
	}

  saveQuiz() {
    console.log(this.state);
  }

  render() {
    var questions = [];
    for (var i = this.state.questionsHTML.length; i < this.state.questionCount; i++) {
      questions.push(<QuizQuestionTemplate questionCount={i} name={"question" + i} key={i} question='' savedAnswers='' onChange={this.setQuestion}/>);
    }


    return (
       <div>
          <PageHeader>Create a quiz!</PageHeader>
          <FormControl bsSize="lg" type="text" placeholder="Quiz Title" value={this.state.quizTitle}/>
          {this.state.questionsHTML.map(function(name, index){
                    return <QuizQuestionTemplate questionCount={index} name={"question" + index} key={index} question={name['question']} savedAnswers={name['answers']} correctAnswer={name['correct']}/>;
          })}
  		    {questions}
  		    <Col smOffset={5} sm={5}>
  	        <Button bsStyle="primary" onClick={this.removeQuestion} >
  	          - Question
  	        </Button>
  	        <Button bsStyle="primary" onClick={this.addQuestion} >
  	          + Question
  	        </Button>
  	      </Col>
          <Button bsStyle="primary" onClick={this.saveQuiz}>Save Quiz</Button>
       </div>
    ); 
  }
};
