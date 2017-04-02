const initialState = {
	username: "",
	isInstructor: null,
  roomId: null
}

const inc = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
    	state.username = action.username;
    	state.isInstructor = action.isInstructor;
      return state
    case 'LOGOUT':
    	state = initialState;
      return state
    case 'JOINROOM':
      state.roomId = action.roomId;
      return state;
    case 'EDITQUIZ':
      state.quizName = action.quizName;
      return state;
    default:
    	console.log(action);
      return state
  }
}

export default inc;