import './filter.scss'
import {useContext, useState} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";
import {handleImgFailed} from "../../utils.js";

export default function Filter({filterName, filterItems=[], selectedItem, hasIcon= false, multiple, filterParam, className=''
}) {
  const {handleFilterChange} = useContext(QuestionContext)
  const [isCollapsed, setIsExpanded] = useState(true);

  const VISIBLE_COUNT = 5


  const visibleItems = isCollapsed ? filterItems.slice(0, VISIBLE_COUNT) : filterItems;

  const hasMoreItems = filterItems.length > VISIBLE_COUNT;

  function handleClick(newValue) {
    handleFilterChange(newValue, filterParam, multiple)
  }

  function isItemActive(itemId) {
    // Если selectedItem - массив (для multiple фильтров)
    if (Array.isArray(selectedItem)) {
      return selectedItem.includes(itemId);
    }
    // Если selectedItem - строка или число (для одиночных фильтров)
    return Number(selectedItem) === itemId;
  }
  return (
    <div className={`filter ${className}`}>
      <div className="filter__title">{filterName}</div>
      <ul className="filter__list">
        {
          visibleItems.map(item =>
            (<li
              key={item.id}
              onClick={()=>handleClick(item.id)}
              className={isItemActive(item.id) ? '_active' : ''}
            >
              {hasIcon && <img alt="" src={item.imageSrc} onError={(e) => handleImgFailed(e, '/images/skillImg.png')}/>}
              {item.title}
            </li>)
          )
        }
      </ul>
      {hasMoreItems && <a href="#!"
                          className="filter__link link trs"
                          onClick={(e)=> {e.preventDefault(); setIsExpanded(prev => !prev)}}>
                          {isCollapsed ? 'Посмотреть все' : 'Скрыть'}
                       </a>
      }
    </div>
  )
}


