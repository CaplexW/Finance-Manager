import React, { useEffect, useState } from 'react';
import SVGIcon from '../common/svgIcon';
import { caretDownFilledIcon, caretUpFilledIcon } from '../../../assets/icons';
import { Category, Icon } from '../../../types/types';

interface CategoryInfo {
  category: Category;
  icon: Icon;
  amount: number;
  isFiltered: boolean;
}

interface CategoriesListProps {
  onClick?: (list: string[]) => void;
  categories?: CategoryInfo[];
  filteredCategories?: string[];
  numberOfDisplayedCategories?: number;
}

export default function CategoriesList({ 
  onClick, 
  categories = [], 
  filteredCategories = [], 
  numberOfDisplayedCategories = 5 
}: CategoriesListProps) {
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [isDisplayLimited, setDisplayLimited] = useState(true);

  useEffect(() => { 
    if (onClick) {
      onClick(filteredList);
    }
  }, [filteredList, onClick]);

  if (!categories?.length) return null;

  const restIcon = caretDownFilledIcon;
  const lessIcon = caretUpFilledIcon;

  const displayedIcons = isDisplayLimited ? [...categories].slice(0, numberOfDisplayedCategories) : [...categories];

  const restIconStyles = {
    borderRadius: '8px',
    boxShadow: `1px 1px .2em rgba(0, 0, 0, 0.5)`,
    padding: '.5em .5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  function handleCategoryClick(item: CategoryInfo) {
    setFilteredList((prevState) => {
      if (prevState.includes(item.category._id)) {
        const newState = prevState.filter((i) => i !== item.category._id);
        return newState;
      }
      else {
        const newState = [...prevState];
        newState.push(item.category._id);
        return newState;
      }
    });
  }
  function handleClickRest() { setDisplayLimited((prev) => !prev); }

  return (
    <div className='categories-list-container'>
      <div className="categories-list">
        {displayedIcons.map((i) => (
          <span
            className={`category-button ${i.isFiltered ? 'filtered' : ''}`}
            key={`${i.category.name}+${i.icon._id}`}
            onClick={() => handleCategoryClick(i)}
          >
            <SVGIcon
              color={i.category.color}
              size={1.5}
              source={i.icon}
            />
          </span>
        ))}
        {numberOfDisplayedCategories + 1 < categories.length && <span
          className='category-button'
          key={`restOfOperations`}
          style={restIconStyles}
          onClick={handleClickRest}
        >{isDisplayLimited ? restIcon : lessIcon}</span>}
      </div>
    </div>
  );
}




