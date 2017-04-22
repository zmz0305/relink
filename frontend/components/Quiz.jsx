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
    var state = store.getState()
    if(state.quizName != null) {
      console.log({quizname: state.quizName ,instructor_id: state.username})
      ajax("POST", "/accounts/postquiz", {quizname: state.quizName ,instructor_id: state.username},
      function(success) {
        console.log(success);
      },
      function(error) {
        console.log(error);
      })
    }

    var state = quizStore.getState()
    this.state = {questionCount: state.questions.length, quizName: state.quizName};
    this.unsubscribe = quizStore.subscribe(() => {
      var state = quizStore.getState()
      this.setState({
        quizName: state.quizName,
        questionCount: state.questions.length
      })
    });

    this.setQuizName = this.setQuizName.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
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
    console.log(data)
    ajax("POST", "/accounts/createquiz",data,
    function(success) {
      console.log(success)
      router.push('/instructor')
    }, function(error) {
      console.log(error.responseText)
    })
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
          <FormControl bsSize="lg" type="text" value={this.quizName} name="quizName" placeholder="Quiz Name" onChange={this.setQuizName} readOnly={readOnly} />
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
       </div>
    ); 
  }
}

Quiz = withRouter(Quiz)
export { Quiz, quizStore }