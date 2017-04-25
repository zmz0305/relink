import io from 'socket.io-client';

const initialState = {
    username: null,
    isInstructor: null,
    isStudent: null,
    roomId: null,
    socket: null
}

const index = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            state.username = action.username;
            state.isInstructor = action.isInstructor;
            state.isStudent = !action.isInstructor;
            state.socket = io('http://localhost:3000');
            action.router.push(state.isInstructor ? '/instructor' : '/student')
            return state;
        case 'LOGOUT':
            if (state.socket != null) {
                state.socket.emit('leaveroom', {user: state.username, room_id: state.roomId});
            }
            state = {
                username: null,
                isInstructor: null,
                isStudent: null,
                roomId: null,
                socket: null,
            };
            action.router.push('/')
            return state;
        case 'JOINROOM':
            state.roomId = action.roomId;
            console.log(action.roomId)
            state.socket.emit('join', {
                room_id: state.roomId,
                user: state.username
            });
            return state;
        case 'LEAVEROOM':
            state.roomId = null;
            action.router.push(state.isInstructor ? '/instructor' : '/student')
            return state
        case 'EDITQUIZ':
            state.quizName = action.quizName;
            action.router.push('/createQuiz')
            return state;
        case 'SETQUIZ':
            state.quizName = action.quizName;
            state.instructorName = action.instructorName;
            action.router.push('/quiz')
        default:
            return state;
    }
}

export default index;