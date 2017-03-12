import React from 'react';
import store from '../main.js'
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Route, RouteHandler, Link } from 'react-router';
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

      $.ajax({
         type: "POST",
         url: "http://127.0.0.1:8000/accounts/logout",
         cache: false,
         xhrFields: {
            withCredentials: true
         },
         success: function(data) {
            store.dispatch({type: 'LOGOUT'});
            router.push('/');
         },
         error: function(data) {
           console.log(data);
         }
      });  
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
