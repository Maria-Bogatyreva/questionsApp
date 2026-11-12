import './filter.scss'
import {useState} from "react";
import {handleImgFailed} from "../../utils.ts";
import useQuestionParams from "../../hooks/useQuestionParams.ts";
import type {AllowedParamName} from "../../hooks/useQuestionParams.ts";

interface FilterItem {
  id: number;
  title: string;
  imageSrc?: string | null;
}
interface FilterProps {
  filterName: string;
  className?: string;
  filterItems?: FilterItem[];
  hasIcon?: boolean;
  multiple?: boolean;
  selectedItem: string | number | number[];
  filterParam?: AllowedParamName;

}

export default function Filter({filterName, filterItems=[], selectedItem, hasIcon = false, multiple = false, filterParam, className=''
}: FilterProps) {
  const {handleFilterChange} = useQuestionParams()
  const [isCollapsed, setIsExpanded] = useState(true);

  const VISIBLE_COUNT = 5

  const visibleItems = isCollapsed ? filterItems.slice(0, VISIBLE_COUNT) : filterItems;

  const hasMoreItems = filterItems.length > VISIBLE_COUNT;

  function handleClick(newValue: number) {
    handleFilterChange(newValue, filterParam, multiple)
  }

  function isItemActive(itemId: number) {
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
              {hasIcon && <img alt="" src={item.imageSrc ?? '/images/skillImg.png'} onError={(e) => handleImgFailed(e, '/images/skillImg.png')}/>}
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


