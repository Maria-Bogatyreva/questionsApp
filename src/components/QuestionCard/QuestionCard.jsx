import './questionCard.scss'
import {useState} from "react";
import DOMPurify from 'dompurify';
import {Link} from "react-router-dom";

export default function QuestionCard({question}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`question-card ${isOpen ? 'open' : ''}`}>
      <div className="question-card__header" onClick={() => setIsOpen(prev => !prev)}>
        <h2 className="question-card__title">{question.title}</h2>
        <button className="question-card__show-btn trs">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#6A0BFF" strokeWidth="1.66667" strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {
        isOpen && <div className="question-card__content">
                    <div className="question-card__content-top">
                      <dl className="question-card__info">
                        <div>
                          <dt>Рейтинг</dt>
                          <dd>{question.rate}</dd>
                        </div>
                        <div>
                          <dt>Сложность</dt>
                          <dd>{question.complexity}</dd>
                        </div>
                      </dl>
                      <button className="question-card__action-btn">
                        <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.8">
                            <circle opacity="0.8" cx="1.5" cy="1.5" r="1.5" fill="#5E5E5E"/>
                            <circle opacity="0.8" cx="1.5" cy="7.5" r="1.5" fill="#5E5E5E"/>
                            <circle opacity="0.8" cx="1.5" cy="13.5" r="1.5" fill="#5E5E5E"/>
                          </g>
                        </svg>
                      </button>
                    </div>
                    <div className="question-card__content-bottom" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.shortAnswer)}}></div>
                    <Link className="question-card__more-details" to={`/questions/${question.id}`}>
                      Подробнее
                      <svg className="trs" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303C13.1768 18.2374 13.1768 17.7626 13.4697 17.4697L18.1893 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H18.1893L13.4697 6.53033C13.1768 6.23744 13.1768 5.76256 13.4697 5.46967Z" fill="currentColor"/>
                      </svg>
                    </Link>
                  </div>
      }
    </div>
  )
}
