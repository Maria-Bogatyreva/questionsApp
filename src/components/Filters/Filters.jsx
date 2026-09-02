import Search from "../Search/Search.jsx";
import Filter from "../Filter/Filter.jsx";

import './filters.scss'
import {useContext} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";

export default function Filters() {
  const {
    specializations,
    selectedSpecialization,
    setSelectedSpecialization,

    skills,
    selectedSkills,
    setSelectedSkills,

    statusData,

    rateData,
    selectedRate,
    setSelectedRate,

    complexityData,
    selectedComplexity,
    setSelectedComplexity,
    handleFilterChange
  } = useContext(QuestionContext);

  return (
    <div className="filters">
      <div className="filters__item">
        <Search />
      </div>
      <div className="filters__item">
        <Filter filterName={'Специализация'} filterItems={specializations} selectedItem={selectedSpecialization} setFilterValue={setSelectedSpecialization} multiple={false}/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Навыки'} filterItems={skills} selectedItem={selectedSkills} setFilterValue={setSelectedSkills} hasIcon multiple  />
      </div>

      <div className="filters__item">
        <Filter filterName={'Уровень сложности'} filterItems={complexityData} selectedItem={selectedComplexity} setFilterValue={setSelectedComplexity}  multiple/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Рейтинг'} filterItems={rateData} selectedItem={selectedRate}  setFilterValue={setSelectedRate} multiple/>
      </div>

      <div className="filters__item">
        <Filter filterName={'Статус'} filterItems={statusData} multiple/>
      </div>

    </div>
  )
}
