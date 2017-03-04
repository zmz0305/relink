import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import inc from './reducers/index.js';
import Home from './scenes/Home.jsx';
import Login from './scenes/Login.jsx';
import Register from './scenes/Register.jsx';

import Chat from './scenes/Chat.jsx';

const store = createStore(inc);

ReactDOM.render(
	<Provider store={store}>
	  <Router history={hashHistory}>
	    <Route path="/" component={Home}>
	        <Route path="/login" component={Login} />
	        <Route path="/register" component={Register} />
	        <Route path="/instructor" component={Chat} />
	        <Route path="/student" component={Chat} />
	    </Route>
	  </Router>
  </Provider>
, document.getElementById('root'));