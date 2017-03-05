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
      store.dispatch({type: 'LOGOUT'});
      this.props.router.push('/');
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