import React from 'react';
import { Quiz } from '../components/Quiz.jsx'
import {PageHeader} from 'react-bootstrap'

export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props); 
  }

  render() {
    return (
       <div>
        <PageHeader>Complete the Quiz!</PageHeader>
        <Quiz readOnly={true} />
       </div>
    ); 
  }
};