const initialState = {
	username: "ii@i.com",
	isInstructor: true
}

const inc = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
    	console.log(action);
    	state.username = action.username;
    	state.isInstructor = action.isInstructor;
      return state
    case 'LOGOUT':
    	state = initialState;
      return state
    default:
    	console.log(action);
      return state
  }
}

export default inc;