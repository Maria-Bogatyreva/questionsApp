import './questions.scss'
import {useContext} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";
import QuestionCard from "../QuestionCard/QuestionCard.jsx";
export default function Questions() {
  const {questions, specializations, selectedSpecialization} = useContext(QuestionContext);
  const currentSpecialization = specializations.find(item => item.id === selectedSpecialization);

  return (
    <div className="questions">
      <h1 className="questions__title">Вопросы {currentSpecialization?.title}</h1>
      <ul className="questions__list">
        {
          questions.map(question => <li key={question.id}><QuestionCard question={question}/></li>)
        }
      </ul>
    </div>
  )
}
