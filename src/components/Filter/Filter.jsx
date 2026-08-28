import './filter.scss'
import {useState} from "react";

export default function Filter({filterName, filterItems=[], hasIcon=false}) {
  const [isCollapsed, setIsExpanded] = useState(true);

  const VISIBLE_COUNT = 5
  function handleImgFailed(e) {
    e.currentTarget.src = '/images/skillImg.svg'
  }

  const visibleItems = isCollapsed ? filterItems.slice(0, VISIBLE_COUNT) : filterItems;

  const hasMoreItems = filterItems.length > VISIBLE_COUNT;
  return (
    <div className="filter">
      <div className="filter__title">{filterName}</div>
      <ul className="filter__list">
        {
          visibleItems.map(item =>
            (<li key={item.id}>
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


