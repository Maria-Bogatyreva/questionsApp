import './filter.scss'
import {useContext, useState} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";

export default function Filter({filterName, filterItems=[], selectedItem, hasIcon= false, multiple, setFilterValue
}) {
  const {handleFilterChange} = useContext(QuestionContext)
  const [isCollapsed, setIsExpanded] = useState(true);

  const VISIBLE_COUNT = 5
  function handleImgFailed(e) {
    e.currentTarget.src = '/images/skillImg.svg'
  }

  const visibleItems = isCollapsed ? filterItems.slice(0, VISIBLE_COUNT) : filterItems;

  const hasMoreItems = filterItems.length > VISIBLE_COUNT;

  function handleClick(newValue) {
    handleFilterChange(newValue, setFilterValue, multiple)
  }
  function isItemActive(itemId) {
    // Если selectedItem - массив (для multiple фильтров)
    if (Array.isArray(selectedItem)) {
      return selectedItem.includes(itemId);
    }
    // Если selectedItem - строка или число (для одиночных фильтров)
    return selectedItem === itemId;
  }
  return (
    <div className="filter">
      <div className="filter__title">{filterName}</div>
      <ul className="filter__list">
        {
          visibleItems.map(item =>
            (<li
              key={item.id}
              onClick={()=>handleClick(item.id)}
              className={isItemActive(item.id) ? '_active' : ''}
            >
              {hasIcon && <img alt="" src={item.imageSrc} onError={handleImgFailed}/>}
              {item.title}
            </li>)
          )
        }
      </ul>
      {hasMoreItems && <a href="#!"
                          className="filter__link link trs"
                          onClick={()=>setIsExpanded(prev => !prev)}>
                          {isCollapsed ? 'Посмотреть все' : 'Скрыть'}
                       </a>
      }
    </div>
  )
}


