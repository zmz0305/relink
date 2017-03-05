import React from 'react';
import store from '../main.js'

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
            RELINK {value}
            <br/>
            <button onClick={() => {this.navigate('/')}}>Home</button>
            <br/>
            <button onClick={() => {this.navigate('/login')}}>Login</button>
            <br/>
            <button onClick={() => {this.navigate('/register')}}>Register</button>
            <br/>
            <button onClick={this.logout} >Logout</button>
            {this.props.children}
         </div>
      ); 
   }
};