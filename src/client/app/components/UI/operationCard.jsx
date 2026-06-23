import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from '../common/modalWindow';
import EditButton from '../common/editButton';
import DeleteButton from '../common/deleteButton';
import { formatDisplayDateFromInput } from '../../utils/formatDate';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
import FieldInput from '../common/form/fieldInput';
import { getIconsList } from '../../store/icons';
import SVGIcon from '../common/svgIcon';

const OperationCard = ({ operation, isOpen, onClose, onEdit, onDelete }) => {
  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  const category = categories.find((c) => c._id === operation.category);
  const categoryIcon = icons.find((i) => i._id === category.icon);
  const categoryName = category.name;

  return (
    <div className="operation-card">
      <div className="operation-card__details">
        <p>Дата: {formatDisplayDateFromInput(operation.date)}</p>
        <p>
          <span className="details-discription">Категория:</span>
          <span className="detail-value">{categoryName} <SVGIcon source={categoryIcon} color={category.color} /></span>
        </p>
        <p>
          <span className="details-discription">Сумма: </span>
          <span style={{ color: operation.amount < 0 ? 'red' : 'green' }}>{operation.amount}</span></p>
      </div>
      <div className="operation-card__actions">
        <button className="operation-card__edit-button" onClick={() => { onEdit(operation); onClose(); }}>Изменить</button>
        <button className="operation-card__delete-button" onClick={() => { onDelete(operation._id); onClose(); }}>Удалить</button>
      </div>
    </div>
  );
};

OperationCard.propTypes = {
  operation: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OperationCard;