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
import { caretDownFilledIcon } from '../../../assets/icons';

export default function CategoriesList({ onClick, operations, numberOfDisplayedCategories = 5 }) {
  const [filteredList, setFilteredList] = useState([]);
  const [isDisplayLimited, setDisplayLimited] = useState(true);

  useEffect(() => { onClick(filteredList); }, [filteredList]);

  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  const restIcon = caretDownFilledIcon;

  if (!operations?.length || !categories?.length || !icons?.length) return;

  const groupedOperations = groupOperationsByCategory(operations);
  showElement(groupedOperations, 'groupedOperations');
  const includedCategoriesIds = groupedOperations.map((s) => s[0].category);

  const includedCategories = categories.filter((cat) => includedCategoriesIds.includes(cat._id));
  const includedIconsIds = includedCategories.map((cat) => cat.icon);
  const includedIcons = icons.filter((icon) => includedIconsIds.includes(icon._id));

  const coloredIcons = isDisplayLimited
    ? includedCategories.slice(0, numberOfDisplayedCategories).map((category) => {
      const icon = includedIcons.find((i) => category.icon === i._id);
      if (!icon?._id) return

      return {
        icon,
        category,
        filtered: filteredList.includes(category._id),
      };
    })
    : includedCategories.map((category) => {
      const icon = includedIcons.find((i) => category.icon === i._id);
      if (!icon?._id) return

      return {
        icon,
        category,
        filtered: filteredList.includes(category._id),
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

  function setSpanStyles({ category, filtered }) {
    return {
      color: category.color,
      opacity: filtered ? '.3' : '1',
      borderRadius: '8px',
      boxShadow: `${filtered ? 'inset' : ''} 1px 1px .2em rgba(0, 0, 0, 0.5)`,
      padding: '.5em .5em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    };
  }

  function groupOperationsByCategory(operations) {
    const groupedOperations = [];
    let numberOfGroups = groupedOperations.length;

    operations.forEach((op) => {
      let groupsLeftToCheck = numberOfGroups;

      if (groupsLeftToCheck != 0) {
        if (op.category === groupedOperations[groupsLeftToCheck - 1][0]?.category) {
          groupedOperations[groupsLeftToCheck - 1].push(op);
        } else {
          groupsLeftToCheck -= 1;
        }
      } else {
        const newGroup = [op];
        groupedOperations.push(newGroup);
        numberOfGroups += 1;
      }
    });

    return groupedOperations;
  }

  function handleClick(item) {
    setFilteredList((prevState) => {
      if (prevState.includes(item.category._id)) {
        const newState = prevState.filter((i) => i !== item.category._id);
        // onClick(newState);

        return newState;
      }
      else {
        const newState = prevState.map(i => i);
        newState.push(item.category._id);
        // onClick(newState);

        return newState;
      }
    });
  }

  return (
    <div className='' style={containerSyles}>
      <div className="categories-list">
        {coloredIcons.map((i) => (
          <span
            key={`${i.category.name}+${i.icon._id}`}
            onClick={handleClick.bind(null, i)}
            style={setSpanStyles(i)}
          >
            <SVGIcon
              size={1.5}
              source={i.icon}
            />
          </span>
        ))}
        {isDisplayLimited && <span
          key={`restOfOperations`}
          style={restIconStyles}
        >{restIcon}</span>}
      </div>
    </div>
  );
};

CategoriesList.propTypes = {
  onClick: PropTypes.func,
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};