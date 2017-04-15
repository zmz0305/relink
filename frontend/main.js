import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import index from './reducers/index.js';
import Home from './scenes/Home.jsx';
import Login from './scenes/Login.jsx';
import Register from './scenes/Register.jsx';
import Student from './scenes/Student.jsx';
import Instructor from './scenes/Instructor.jsx';
import Room from './scenes/Room.jsx';
import {CreateQuiz} from './scenes/CreateQuiz.jsx'

const store = createStore(index);
export default store;

ReactDOM.render(
	<Provider store={store}>
	  <Router history={hashHistory}>
	    <Route path="/" component={Home}>
	        <Route path="/login" component={Login} />
	        <Route path="/register" component={Register} />
	        <Route path="/instructor" component={Instructor} />
	        <Route path="/student" component={Student} />
	        <Route path="/room" component={Room} />
	        <Route path="/createquiz" component={CreateQuiz} />
	    </Route>
	  </Router>
  </Provider>
, document.getElementById('root'));