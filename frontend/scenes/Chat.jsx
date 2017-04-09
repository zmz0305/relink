// import React from 'react';
// import io from 'socket.io-client';
// let socket = io('http://localhost:3000');
//
// export default class Chat extends React.Component {
//   constructor(props){
//     super(props);
//     this.onSubmit = this.onSubmit.bind(this);
//
//     socket.emit('join', {
//       room_id : '3',
//       user : "instructor@gmail.com"
//     });
//     socket.on('error', function(data){
//       console.log(data);
//     });
//     socket.on('ok', function(data){
//       console.log(data);
//     });
//
//     this.state  = {
//       "room_id" : '3',
//       "messages" : []
//     }
//
//     socket.on("message", {
//       room_id: '3'
//     }, function(data) {
//       console.log(data)
//     })
//   }
//
//
//   onSubmit(event) {
//     event.preventDefault();
//     $.ajax({
//         type: "POST",
//         url: "http://127.0.0.1:8000/accounts/message",
//         data: {
//           "message" : "Hello",
//           "room_id" : 11
//         },
//         cache: false,
//         success: function(data) {
//           alert("success");
//           console.log(data);
//         },
//         error: function(data) {
//           alert("error")
//           console.log(data);
//         }
//     });
//   }
//
//   render() {
//     return(
//       <div>
//       <form onSubmit = {this.onSubmit}>
//         <button type="submit">SEND MESSAGE</button>
//       </form>
//       </div>
//     );
//   }
// };
