import React from 'react';
import LabelInput from '../components/LabelInput.jsx';
import store from '../main.js'
import LoadingStore from '../components/LoadingStore.jsx'
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router' 
var ajax = require('../components/AjaxCall.jsx');

export default class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomId: '', visible: false};
        this.joinRoom = this.joinRoom.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    joinRoom(event) {
        event.preventDefault();

        const roomId = this.state.roomId;
        ajax("GET", "/accounts/classroom/" + roomId, null,
            function (success) {
                store.dispatch({type: 'JOINROOM', roomId: roomId});
                this.props.router.push('/room');
            }.bind(this),
            function (error) {
                console.log(error);
                this.setState({visible: true})
            }.bind(this)
        )
    }

    setValue(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.joinRoom}>
                    <LabelInput name="roomId" label="Class Code" type="text" onChange={this.setValue}/>
                    <Button bsStyle="primary" type="submit">Join Class</Button>
                </form>
                { this.state.visible ? <h3>Not a valid code</h3> : null }
            </div>
        );
    }
};