import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { operationPropType } from '../../../types/propTypes';
import { getIconsList } from '../../store/icons';
import SVGIcon from '../common/svgIcon';
import { clrTransWhite600 } from '../../constants/colors';
import sortOperationsByAmount from '../../utils/sortOperationsByAmount';
import { caretDownFilledIcon, caretUpFilledIcon } from '../../../assets/icons';
import ButtonWithIcon from '../common/buttonWithIcon';

export default function CategoriesList({ onClick, operations, numberOfDisplayedCategories = 5 }) {
  const [filteredList, setFilteredList] = useState([]);
  const [isDisplayLimited, setDisplayLimited] = useState(true);

  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  if (!operations?.length || !categories?.length || !icons?.length) return;

  const restIcon = caretDownFilledIcon;
  const lessIcon = caretUpFilledIcon;

  const groupedOperations = groupOperationsByCategory(operations);
  const sortedOperationGroups = sortOperationGroupsByAmount(groupedOperations);
  const includedCategoriesIds = isDisplayLimited
    ? sortedOperationGroups.slice(0, (numberOfDisplayedCategories + 1 >= sortedOperationGroups.length ? numberOfDisplayedCategories + 1 : numberOfDisplayedCategories)).map((s) => s[0].category)
    : sortedOperationGroups.map((s) => s[0].category);
  const sortedCategories = includedCategoriesIds.map((id) => categories.find((cat) => cat._id === id)); // find вместо filter чтобы категории находились в порядке, который отсортироваан в sortedOperationGroups
  const includedIconsIds = sortedCategories.map((cat) => cat.icon);
  const includedIcons = icons.filter((icon) => includedIconsIds.includes(icon._id));

  const coloredIcons = sortedCategories.map((category) => {
      const icon = includedIcons.find((i) => category.icon === i._id);
      if (!icon?._id) return

      return {
        icon,
        category,
      };
    });

  const containerSyles = {
    background: clrTransWhite600,
    borderRadius: '8px',
    padding: '1rem 1rem',
  };

  const restIconStyles = {
    borderRadius: '8px',
    boxShadow: `1px 1px .2em rgba(0, 0, 0, 0.5)`,
    padding: '.5em .5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  function groupOperationsByCategory(operations) {
    const groups = {};

    for (const op of operations) {
      if (groups[op.category]) {
        groups[op.category].push(op);
      } else {
        groups[op.category] = [op];
      }
    }

    return Object.values(groups);
  }
  function sortOperationGroupsByAmount(operationGroups) {
    const copyArr = [...operationGroups];

    copyArr.sort((a, b) =>
      b.reduce((totalAmount, op) => totalAmount += Math.abs(op.amount), 0)
      - a.reduce((totalAmount, op) => totalAmount += Math.abs(op.amount), 0));

    return copyArr;
  }

  function handleCategoryClick(item) {
    setFilteredList((prevState) => {
      if (prevState.includes(item.category._id)) {
        const newState = prevState.filter((i) => i !== item.category._id);

        onClick(newState);
        return newState;
      }
      else {
        const newState = prevState.map(i => i);
        newState.push(item.category._id);

        onClick(newState);
        return newState;
      }
    });
  }
  function handleClickRest() {
    console.log('clicked Rest');
    setDisplayLimited((prev) => !prev);
  }

  return (
    <div className='' style={containerSyles}>
      <div className="categories-list">
        {coloredIcons.map((i) => (
          <span
            className='category-button'
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
        {numberOfDisplayedCategories + 1 < sortedOperationGroups.length && <span
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
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};