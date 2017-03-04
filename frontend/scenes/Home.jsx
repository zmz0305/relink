import React from 'react';

export default class Home extends React.Component{
   constructor(props) {
      super(props);
      this.navigate = this.navigate.bind(this);
   }

   navigate(dst) {
      this.props.router.push(dst);
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
            {this.props.children}
         </div>
      ); 
   }
};