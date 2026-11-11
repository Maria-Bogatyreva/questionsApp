import './questions.scss'
import QuestionCard from "../QuestionCard/QuestionCard.jsx";
import {useGetSpecializationsQuery} from "../../services/questionsApi.js";
import useQuestionParams from "../../hooks/useQuestionParams.js";
import useQuestions from "../../hooks/useQuestions.js";
export default function Questions() {
  const {data: specializations = []} = useGetSpecializationsQuery();
  const {selectedSpecialization} = useQuestionParams();
  const {questions, error} = useQuestions();

  const currentSpecialization = specializations.find(item => item.id === Number(selectedSpecialization));

  if (error) {
    return (
      <div className="questions">
        <h1 className="questions__title">Вопросы {currentSpecialization?.title}</h1>
        <p>Не удалось загрузить вопросы</p>
      </div>
    )
  }

  return (
    <div className="questions">
      <h1 className="questions__title">Вопросы {currentSpecialization?.title}</h1>
      {
        questions.length > 0 ?
          <ul className="questions__list">
            {
              questions.map(question => <li key={question.id}><QuestionCard question={question}/></li>)
            }
          </ul>
          :
          <p>Ничего не найдено</p>
      }
    </div>
  )
}
