import React from 'react';
// import {ReactBootstrap} from 'react-bootstrap';

import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>React Router Tutorial</h1>
        <ul role="nav">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/repos">Repos</Link></li>
        </ul>

        {this.props.children}
      </div>
    )
  }
})

// class App extends React.Component {
//    render() {
//       return (
//          <div>
//             Hello World!!!
//          </div>
//       );
//    }
// }

// function Cube(x) {
// 	return (x * x * x);	
// }

// /*
// Managing internal state
// Sets the intial state of the component and then,
// when a link is clicked, updates the state.
// When the state updates, the component intelligently 
// and efficiently re-renders.
// Note that the `onClick` is the same as the JavaScript
// `onClick` event handler. There are many common browser
// events that are supported by React. See them all at:
// http://facebook.github.io/react/docs/events.html
// */

// var ToggleText = React.createClass({
//   getInitialState: function () {
//     return {
//       showDefault: true
//     }
//   },
  
//   toggle: function (e) {
//     // Prevent following the link.
//     e.preventDefault();
    
//     // Invert the chosen default.
//     // This will trigger an intelligent re-render of the component.
//     this.setState({ showDefault: !this.state.showDefault })
//   },
  
//   render: function () {
//     // Default to the default message.
//     var message = this.props.default;
    
//     // If toggled, show the alternate message.
//     if (!this.state.showDefault) {
//       message = this.props.alt;
//     }
    
//     return (
//       <div>
//         <h1>Hello {message}!</h1>
//         <a href="" onClick={this.toggle}>Toggle</a>
//       </div>
//     );
//   }
// });

// export { App, Cube, ToggleText }