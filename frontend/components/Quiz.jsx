import React from 'react';
import store from '../main.js'
import quiz from '../reducers/quiz.js'
import { createStore } from 'redux';
import { Button, PageHeader, Grid, Row, Col, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import QuizQuestionTemplate from './QuizQuestionTemplate.jsx'
import { withRouter } from 'react-router'
var ajax = require('../components/AjaxCall.jsx');

var quizStore = createStore(quiz);

class Quiz extends React.Component {
  constructor(props) {
    super(props); 

    var state = quizStore.getState()
    this.state = {questionCount: state.questions.length, quizName: state.quizName, answers: []};
    this.unsubscribe = quizStore.subscribe(() => {
      var state = quizStore.getState()
      this.setState({
        quizName: state.quizName,
        questionCount: state.questions.length
      })
    });

    var state = store.getState()
    if(state.quizName != null) {
      const instructorId = state.isInstructor ? state.username : state.instructorName
      console.log(state.quizName, instructorId)
      ajax("POST", "/accounts/postquiz", {quizname: state.quizName, instructor_id: instructorId},
      function(success) {
        var obj = JSON.parse(success);
        var answers = JSON.parse(obj[1])
        this.setState({
          answers: answers
        })
        if (this.props.readOnly) {
          answers = Array.apply(null, Array(answers.length)).map(Number.prototype.valueOf,-1)
        }
        quizStore.dispatch({
          type: 'SETQUIZ',
          questions: JSON.parse(obj[0]),
          answers: answers,
          quizName: state.quizName
        })
        console.log()
      }.bind(this),
      function(error) {
        console.log(error);
      })
    }
    this.setQuizName = this.setQuizName.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.submitQuiz = this.submitQuiz.bind(this);
  }

  setQuizName(event) {
    quizStore.dispatch({
      type: 'SETQUIZNAME',
      quizName: event.target.value
    })
  }

  addQuestion() {
    quizStore.dispatch({
      type: 'ADDQUESTION'
    })
	}

	removeQuestion() {
		quizStore.dispatch({
      type: 'DELETEQUESTION'
    })
	}

	saveQuiz() {
    const router = this.props.router;
    var state = quizStore.getState()

    var data = {
      questions: JSON.stringify(state.questions),
      quizname: state.quizName,
      answers: JSON.stringify(state.answers)
    }
    ajax("POST", "/accounts/createquiz",data,
    function(success) {
      router.push('/instructor')
    }, function(error) {
      console.log(error.responseText)
    })
  }

  submitQuiz() {
    var userAnswers = quizStore.getState().answers
    var correct = 0;
    for (var i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === this.state.answers[i]) {
        correct++
      }
    }
    alert('You answered ' + correct + ' out of ' + userAnswers.length + ' questions correctly.')
    this.props.router.push('/room')
  }

  componentWillUnmount() {
  	this.unsubscribe();
  }

  render() {
  	const { readOnly } = this.props; 
    var questions = [];
    for (var i = 0; i < this.state.questionCount; i++) {
      questions.push(<QuizQuestionTemplate readOnly={readOnly} questionCount={i} name={"question" + i} key={i} />);
    }
    
    return (
       <div>
          <FormControl bsSize="lg" type="text" value={this.state.quizName} name="quizName" placeholder="Quiz Name" onChange={this.setQuizName} readOnly={readOnly} />
  		    {questions}
  		    <div hidden={readOnly}>
	  		    <Col smOffset={5} sm={5} >
	  	        <Button bsStyle="primary" onClick={this.removeQuestion} >
	  	          - Question
	  	        </Button>
	  	        <Button bsStyle="primary" onClick={this.addQuestion} >
	  	          + Question
	  	        </Button>
	  	      </Col>
          	<Button bsStyle="primary" onClick={this.saveQuiz} hidden>Save Quiz</Button>
          </div>
          <Button bsStyle="primary" onClick={this.submitQuiz} hidden={!readOnly}>Submit</Button>
       </div>
    ); 
  }
}

Quiz = withRouter(Quiz)
export { Quiz, quizStore }
