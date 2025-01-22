import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import { operationPropType } from '../../../../types/propTypes';
import { getIconsList } from '../../store/icons';
import SVGIcon from '../common/svgIcon';
import { clrTransWhite600 } from '../../../../constants/colors';

export default function CategoriesList({ onClick, operations }) {
  const [filteredList, setFilteredList] = useState([]);

  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  if (!operations || !categories || !icons) return;

  const includedCategoriesIds = operations.map((s) => s.category);
  const includedCategories = categories.filter((cat) => includedCategoriesIds.includes(cat._id));

  const includedIconsIds = includedCategories.map((cat) => cat.icon);
  const includedIcons = icons.filter((icon) => includedIconsIds.includes(icon._id));

  const coloredIcons = includedCategories.map((category) => {
    const icon = includedIcons.find((i) => category.icon === i._id);
    if (!icon?._id) {
      const report = {
        operations,
        icons,
        includedIconsIds,
        includedIcons,
        icon,
        categories,
        includedCategoriesIds,
        includedCategories,
        category,
      };
      showElement(report, 'report');
    }
    return {
      icon,
      category,
      filtered: filteredList.includes(category._id),
    };
  });

  const defaultLimit = 15;

  const containerSyles = {
    background: clrTransWhite600,
    borderRadius: '8px',
    maxWidth: '90%',
    padding: '1rem .5rem 1rem .8rem'
  };

  function setSpanStyles({ category, filtered }) {
    return {
      color: category.color,
      opacity: filtered ? '.3' : '1',
      borderRadius: '8px',
      boxShadow: `${filtered ? 'inset' : ''} 1px 1px .2em rgba(0, 0, 0, 0.5)`,
      margin: '.3rem',
      display: 'flex',
      padding: '0 .1rem',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      width: '2rem',
      height: '2.2rem',
    };
  }

  function handleClick(item) {
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

  return (
    <div className='container mt-2 d-flex justify-contetn-center' style={containerSyles}>
      <div className="d-flex flex-wrap">
        {coloredIcons.map((i) => (
          <span
            key={`${i.category.name}+${i.icon._id}`}
            onClick={handleClick.bind(null, i)}
            style={setSpanStyles(i)}
          >
            <SVGIcon
              source={i.icon}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

CategoriesList.propTypes = {
  onClick: PropTypes.func,
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};