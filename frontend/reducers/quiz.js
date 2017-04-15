const initialQuestion = {
  question: '',
  answers: ['', '']
}

const initialState = {
  quizName: '',
	questions: [initialQuestion],
  answers: [0]
}

const quiz = (state = initialState, action) => {
  switch (action.type) {
    case 'SETQUIZNAME':
    	state.quizName = action.quizName;
      return state
    case 'ADDQUESTION':
    	state.questions = [...state.questions, initialQuestion]
      state.answers = [...state.answers, 0]
      return state
    case 'DELETEQUESTION':
      if (state.questions.length > 1) {
        state.questions.pop()
        state.answers.pop()
      }
      return state;
    case 'ADDANSWER':
      state.questions[action.questionCount].answers = [...state.questions[action.questionCount].answers, '']
      return state;
    case 'REMOVEANSWER':
      if (state.questions[action.questionCount].answers.length > 2) {
        state.questions[action.questionCount].answers.pop()
      }
      return state
    case 'UPDATEQUESTION':
      state.questions[action.questionCount].question = action.question
      return state
    case 'UPDATEANSWER':
      state.questions[action.questionCount].answers[action.answerCount] = action.answer
      return state
    case 'SETCORRECTANSWER':
      state.answers[action.questionCount] = action.answerCount      
      return state
    default:
      return state
  }
}

export default quiz;