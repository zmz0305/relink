import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
import {Button} from 'react-bootstrap'
var ajax = require('../components/AjaxCall.jsx');


export default class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomId:'', quizzes: [], quizitems: [], quiz: ''};
        const userObj = store.getState();
        if (userObj.username == "" || userObj.isInstructor == false) {
            this.props.router.push('/');
        }
    }

    componentDidMount () {
        this.createClass = this.createClass.bind(this);
        this.createQuiz = this.createQuiz.bind(this);
        this.postQuiz = this.postQuiz.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setValue = this.setValue.bind(this);
        ajax("POST", "/accounts/listquiz", {},
            function (success) {
                console.log(success);
                var success = JSON.parse(success);
                this.setState({'quizzes': success}, function after() {
                    console.log(this.state.quizzes);
                    var quizzes = this.state.quizzes;
                    var quizlist = quizzes.map((quiz, i) =>
                        <Button key={i} bsStyle="primary" name={quiz} onClick={this.postQuiz}>{quiz}</Button>);
                    this.setState({'quizitems': quizlist});
                });
            }.bind(this),
            function (error) {
                console.log(error);
            }
        );
    }

    createClass(event) {
        const username = store.getState().username;
        const router = this.props.router;

        ajax("GET", "/accounts/newroom", {},
            function (success) {
                console.log(success);
                store.dispatch({type: 'JOINROOM', roomId: success});
                router.push('/room');
            },
            function (error) {
                console.log(error);
            }
        );
    }


    createQuiz(event) {
        store.dispatch({type: 'EDITQUIZ', quizName: ''});
        this.props.router.push('/createQuiz');
    }

    postQuiz(event) {
        this.setState({'quiz': event.target.name}, function after() {
            store.dispatch({type: 'EDITQUIZ', quizName: this.state.quiz});
            this.props.router.push('/createQuiz');
        });
    }

    onSubmit(event){
        event.preventDefault();
        const roomId = this.state.roomId;
        const router = this.props.router;

        ajax("GET", "/accounts/classroom/" + roomId, null,
            function(success) {
                console.log(success);
                store.dispatch({type: 'JOINROOM', roomId: roomId});
                router.push('/room');
            },
            function(error) {
                console.log(JSON.stringify(error) + " error");
            }
        )
    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit = {this.onSubmit}>
                    <LabelInput name="roomId" label="Class Code" type="text" onChange={this.setValue} />
                    <button type="submit">Submit Code</button>
                </form>
                <Button bsStyle="primary" onClick={this.createClass}>Create New Class</Button>
                <br />
                <Button bsStyle="primary" onClick={this.createQuiz}>Create New Quiz</Button>
                <h3>Saved Quizzes</h3>
                {this.state.quizitems}
            </div>
        );
    }
};
