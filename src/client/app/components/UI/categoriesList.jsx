import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '../common/svgIcon';
import { caretDownFilledIcon, caretUpFilledIcon } from '../../../assets/icons';

export default function CategoriesList({ onClick, categories, filteredCategories = [], numberOfDisplayedCategories = 5 }) {
  const [filteredList, setFilteredList] = useState([]);
  const [isDisplayLimited, setDisplayLimited] = useState(true);

  useEffect(() => { onClick(filteredList) }, [filteredList]);

  if (!categories?.length) return;

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

  function handleCategoryRightClick(item, e) {
    e.preventDefault();
    setFilteredList((prevState) => {
      if (prevState.includes(item.category._id)) {
        return prevState.filter((i) => i !== item.category._id);
      }
      return [...prevState, item.category._id];
    });
  }
  function handleCategoryLeftClick(item) {
    const allCategoryIds = categories.map((c) => c.category._id);
    setFilteredList((prevState) => {
      const isCurrentlyOnlyThisCategory =
        prevState.length === allCategoryIds.length - 1 &&
        !prevState.includes(item.category._id);
      return isCurrentlyOnlyThisCategory ? [] : allCategoryIds.filter((id) => id !== item.category._id);
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
            onClick={() => handleCategoryLeftClick(i)}
            onContextMenu={(e) => handleCategoryRightClick(i, e)}
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
};

CategoriesList.propTypes = {
  onClick: PropTypes.func,
  // operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};