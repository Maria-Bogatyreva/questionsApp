import './questionCard.scss'
import {useState} from "react";
export default function QuestionCard({question}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`question-card ${isOpen && 'open'}`}>
      <div className="question-card__header" onClick={()=>setIsOpen(prev=>!prev)}>
        <h2 className="question-card__title">{question.title}</h2>
        <button className="question-card__show-btn trs">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#6A0BFF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {
       isOpen && <div className="question-card__content">
          <div className="question-card__content-top">
            <dl className="question-card__info">
              <div>
                <dt>Рейтинг</dt>
                <dd>4</dd>
              </div>
              <div>
                <dt>Сложность</dt>
                <dd>10</dd>
              </div>
            </dl>
            <button  className="question-card__action-btn">
              <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.8">
                  <circle opacity="0.8" cx="1.5" cy="1.5" r="1.5" fill="#5E5E5E"/>
                  <circle opacity="0.8" cx="1.5" cy="7.5" r="1.5" fill="#5E5E5E"/>
                  <circle opacity="0.8" cx="1.5" cy="13.5" r="1.5" fill="#5E5E5E"/>
                </g>
              </svg>
            </button>
          </div>
          <div className="question-card__content-bottom">
            {question.longAnswer}
          </div>
        </div>
      }
    </div>
  )
}
