import React from 'react';
import store from '../main.js'
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Route, RouteHandler, Link } from 'react-router';
var ajax = require('../components/AjaxCall.jsx');

export default class Home extends React.Component{
   constructor(props) {
      super(props);
      this.navigate = this.navigate.bind(this);
      this.logout = this.logout.bind(this);
   }

   navigate(dst) {
      this.props.router.push(dst);
   }

   logout() {
      const router = this.props.router;

      ajax("POST", "/accounts/logout", {},
        function(success) {
          store.dispatch({type: 'LOGOUT'});
          router.push('/');
        },
        function(error) {
          console.log(error);
        }
      );
   }

   render() {
      const { value } = this.props
      return (
         <div>
         <Nav bsStyle="pills">
          <NavItem eventKey={1} onClick={() => {this.navigate('/')}}>Home</NavItem>
          <NavItem eventKey={2} onClick={() => {this.navigate('/login')}}>Login</NavItem>
          <NavItem eventKey={3} onClick={() => {this.navigate('/register')}}>Register</NavItem>
          <NavItem eventKey={4} onClick={this.logout}>Logout</NavItem>
        </Nav>
        <div style={{marginLeft: '1in', marginRight: '1in'}}>
               {this.props.children}
         </div>
         </div>

      ); 
   }
};
