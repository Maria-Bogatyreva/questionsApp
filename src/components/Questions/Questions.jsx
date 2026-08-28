import './questions.scss'
import {useContext} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";
import QuestionCard from "../QuestionCard/QuestionCard.jsx";
export default function Questions() {
  const {questions} = useContext(QuestionContext);
  return (
    <div className="questions">
      <h1 className="questions__title">Вопросы React, Javascript</h1>
      <ul className="questions__list">
        {
          questions.map(question => <li key={question.id}><QuestionCard question={question}/></li>)
        }
      </ul>
    </div>
  )
}
