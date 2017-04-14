import io from 'socket.io-client';


const initialState = {
    username: "",
    isInstructor: null,
    roomId: null,
    socket: null,
}

const inc = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            state.username = action.username;
            state.isInstructor = action.isInstructor;
            state.socket = io('http://localhost:3000');
            return state;
        case 'LOGOUT':
            state = initialState;
            state.socket.emit('leaveroom', {user: state.username, room_id: state.roomId});
            return state;
        case 'JOINROOM':
            state.roomId = action.roomId;
            state.socket.emit('join', {
                room_id: state.roomId,
                user: state.username
            });
            return state;
        case 'EDITQUIZ':
            state.quizName = action.quizName;
            return state;
        default:
            console.log(action);
            return state;
    }
}

export default inc;