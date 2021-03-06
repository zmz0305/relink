import React from 'react';
import store from '../main.js'
import { Nav, Navbar } from 'react-bootstrap';
import NavButton from '../components/NavButton.jsx'
import { persistStore } from 'redux-persist'
import LandingPage from '../components/LandingPage.jsx'
var ajax = require('../components/AjaxCall.jsx');
import {Button} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Row} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {Form} from 'react-bootstrap'
import {Jumbotron} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {InputGroup} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {Radio} from 'react-bootstrap'
import {ControlLabel} from 'react-bootstrap'

export default class Home extends React.Component{
    constructor(props) {
      super(props);
      this.state = {userState: 'out'}
      this.navigate = this.navigate.bind(this);
      this.logout = this.logout.bind(this);
      this.leaveRoom = this.leaveRoom.bind(this);

      this.unsubscribe = store.subscribe(function() {
        var state = store.getState()
        if (state.username != null) {
          var currState = state.isInstructor ? 'instructor' : 'student';
          currState = state.roomId != null ? 'inRoom' : currState;
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

    leaveRoom() {
      store.dispatch({type: 'LEAVEROOM', router: this.props.router})
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
              {this.state.userState === 'instructor' ? <NavButton dst='/instructor' label='Instructor' /> : null}
              {this.state.userState === 'student' ? <NavButton dst='/student' label='Student' /> : null}
              {this.state.userState === 'inRoom' ? <NavButton nodst="true" label='Leave Room' onClick={this.leaveRoom} /> : null}
              {this.state.userState != 'out' ? <NavButton dst='/' label='Logout' onClick={this.logout} /> : null }
            </Nav>
          </Navbar>
          <Grid>
            <Row className="show-grid">
              <Col md={8}>
                {location.pathname === '/' ? <LandingPage /> : null}
                {this.props.children}
              </Col>
              <Col md={4}/>
          </Row>
          </Grid>
        </div>
      );
   }
};
