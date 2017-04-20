import React from 'react';
import store from '../main.js'
import { Nav, Navbar } from 'react-bootstrap';
import NavButton from '../components/NavButton.jsx'
import { persistStore } from 'redux-persist'
import LandingPage from '../components/LandingPage.jsx'
var ajax = require('../components/AjaxCall.jsx');

export default class Home extends React.Component{
    constructor(props) {
      super(props);
      this.state = {userState: 'out'}
      this.navigate = this.navigate.bind(this);
      this.logout = this.logout.bind(this);

      this.unsubscribe = store.subscribe(function() {
        var state = store.getState()
        console.log(state)
        if (state.username != null) {
          var currState = state.isInstructor ? 'instructor' : 'student';
          this.setState({userState: currState})
        } else {
          this.setState({userState: 'out'})
        }
      }.bind(this))
    }

   componentWillUnmount() {
    this.unsubscribe()
   }

   navigate(dst) {
      this.props.router.push(dst);
   }

   logout() {
      const router = this.props.router;

      ajax("POST", "/accounts/logout", {},
        function(success) {
          store.dispatch({type: 'LOGOUT', router: router});
          persistStore(store).purge();
        },
        function(error) {
          console.log(error);
        }
      );
   }

   render() {
      const { value, location } = this.props
      return (
        <div>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand><a href="#">Relink</a></Navbar.Brand>
            </Navbar.Header>
            <Nav bsStyle="pills">
              {this.state.userState === 'out' ? <NavButton dst='/login' label='Login' /> : null}
              {this.state.userState === 'out' ? <NavButton dst='/register' label='Register' /> : null }
              {this.state.userState === 'instructor' ? <NavButton dst='createQuiz' label='Create Quiz' /> : null }
              {this.state.userState != 'out' ? <NavButton dst='/' label='Logout' onClick={this.logout} /> : null }
            </Nav>
          </Navbar>
          <div style={{marginLeft: '1in', marginRight: '1in'}}>
            {location.pathname === '/' ? <LandingPage /> : null}
            {this.props.children}
          </div>
        </div>
      ); 
   }
};
