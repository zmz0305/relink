import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import inc from './reducers/index.js';
import Home from './scenes/Home.jsx';
import Login from './scenes/Login.jsx';
import Register from './scenes/Register.jsx';
import JoinClass from './scenes/JoinClass.jsx';
import Chat from './scenes/Chat.jsx';
import AddClass from './scenes/AddClass.jsx';

const store = createStore(inc);
export default store;

ReactDOM.render(
	<Provider store={store}>
	  <Router history={hashHistory}>
	    <Route path="/" component={Home}>
	        <Route path="/login" component={Login} />
	        <Route path="/register" component={Register} />
	        <Route path="/instructor" component={AddClass} />
	        <Route path="/student" component={JoinClass} />
	        <Route path="/room" component={Chat} />
	    </Route>
	  </Router>
  </Provider>
, document.getElementById('root'));
