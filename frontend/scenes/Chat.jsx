import React from 'react';
const divStyle = {
   'list-style-type':'none',
};

var Chat = React.createClass({
   
  getInitialState:function(){
    if (localStorage.relink_username === null || localStorage.relink_username == '') {
      this.props.router.push('/');
    }
    return {
      username: localStorage.relink_username,
      messages:["Hello", "Hi", "What's Up?", "Nothing Much", "Nice"]
    }
  },

  render: function() {
    var listItems = this.state.messages.map((message)=>
      <li>{message}</li>
    ); 
    return(
      <div>
        <ul style={divStyle}>{listItems}</ul>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Send Message" />
        </form>
      </div>
    );
  }
});

export default Chat;