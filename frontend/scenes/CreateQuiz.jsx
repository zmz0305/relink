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
        <PageHeader>Create a quiz!</PageHeader>
        <Quiz readOnly={false} />
       </div>
    ); 
  }
};