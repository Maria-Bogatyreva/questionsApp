import InputSearch from "../InputSearch/InputSearch.jsx";
import Filter from "../Filter/Filter.jsx";

import './filters.scss'
import {useContext} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";

export default function Filters() {
  const {specializations, skills, status, rating, complexity} = useContext(QuestionContext);

  return (
    <div className="filters">
      <div className="filters__item">
        <InputSearch />
      </div>
      <div className="filters__item">
        <Filter filterName={'Специализация'} filterItems={specializations}/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Навыки'} filterItems={skills} hasIcon/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Уровень сложности'} filterItems={complexity}/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Рейтинг'} filterItems={rating}/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Статус'} filterItems={status}/>
      </div>

    </div>
  )
}
