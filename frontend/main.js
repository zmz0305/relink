import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
/*import App from './App.jsx';*/;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.header = {
            'text-align':'center',
            'font-size' :'250%'
        }
        this.styleButton = {
        'background-color':'#FF6347',
        'border': 'none',
        'color': 'white',
        'padding': '15px 32px',
            'text-align': 'center',
            'text-decoration': 'none',
        'display':'inline block',
            'font-size': '16px',
        'margin': '0 auto',
        'cursor': 'pointer',
        'border-radius': '40px',
        'opacity': '0.7',
        'width': '30%',
        'height': '10%',
        'text-align':'center'
        }
        this.body = {
            'align':'center'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    
    render() {
        return (<div style={this.body}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div style={this.header} class="title">RELINK</div>
                <input style = {this.styleButton} type="submit" value="Login" /> <br></br><br></br>
                <input style= {this.styleButton} type="submit" value="Register"/>
                </div>
                );
    }
}
ReactDOM.render(
                <App />,
                document.getElementById('app')
                );
ReactDOM.render(
                <App />,
                document.getElementById('login')
                );