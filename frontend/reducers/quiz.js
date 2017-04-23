var assign = require('lodash.assign');

const initialQuestion = {
  question: '',
  answers: ['', '']
}

const initialState = {
  quizName: '',
	questions: [initialQuestion],
  answers: [0]
}

function questionHandler(state, action) {
  switch(action.type) {
    case 'ADDQUESTION':
      return state
    case 'ADDANSWER':
      return assign({}, state, {
        answers: [...state.answers, '']
      })
    case 'REMOVEANSWER':
      return assign({}, state, {
        answers: [...state.answers.slice(0, -1)]
      })
    case 'UPDATEQUESTION':
      return assign({}, state, {
        question: action.question
      })
    case 'UPDATEANSWER':
      return assign({}, state, {
        answers: state.answers.map((answer, index) => {
          if (index === action.answerCount) {
            return action.answer
          }
          return answer
        })
      })
    default:
      return state
  }
}

const quiz = (state = initialState, action) => {
  switch (action.type) {
    case 'SETQUIZ':
      console.log(action.quizName)
      return {
        quizName: action.quizName,
        questions: action.questions,
        answers: action.answers
      }
    case 'SETQUIZNAME':
      return assign({}, state, {quizName: action.quizName})
    case 'ADDQUESTION':
      return assign({}, state, {
        questions: [...state.questions, questionHandler(initialQuestion, action)],
        answers: [...state.answers, 0]
      })
    case 'DELETEQUESTION':
      if (state.questions.length > 1) {
        return assign({}, state, {
          questions: [...state.questions.slice(0, -1)],
          answers: [...state.answers.slice(0, -1)]
        })
      }
      return state;
    case 'ADDANSWER':
      return assign({}, state, {
        questions: state.questions.map((question, index) => {
          if (index === action.questionCount) {
            return questionHandler(question, action)
          }
          return assign({}, question)
        })
      })
    case 'REMOVEANSWER':
      if (state.questions[action.questionCount].answers.length > 2) {
        return assign({}, state, {
          questions: state.questions.map((question, index) => {
            if (index === action.questionCount) {
              return questionHandler(question, action)
            }
            return assign({}, question)
          })
        })
      }
      return state
    case 'UPDATEQUESTION':
      return assign({}, state, {
        questions: state.questions.map((question, index) => {
          if (index === action.questionCount) {
            return questionHandler(question, action)
          }
          return assign({}, question)
        })
      })
    case 'UPDATEANSWER':
      return assign({}, state, {
        questions: state.questions.map((question, index) => {
          if (index === action.questionCount) {
            return questionHandler(question, action)
          }
          return assign({}, question)
        })
      })
    case 'SETCORRECTANSWER':
      return assign({}, state, {
        answers: state.answers.map((answer, index) => {
          if (index === action.questionCount) {
            return action.answerCount
          }
          return answer
        })
      })
    default:
      return state
  }
}

export default quiz;