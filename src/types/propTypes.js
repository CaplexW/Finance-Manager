import PropTypes from 'prop-types';

export const userPropType = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  currentBalance: PropTypes.number.isRequired,
  image: PropTypes.string,
  goals: PropTypes.arrayOf(PropTypes.string.isRequired),
  accounts: PropTypes.arrayOf(PropTypes.string.isRequired),
  operations: PropTypes.arrayOf(PropTypes.string.isRequired),
  categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
export const categoryPropType = {
  _id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isIncome: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
};
export const operationPropType = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
};
export const accountPropType = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  currentBalance: PropTypes.number.isRequired,
  goal: PropTypes.string,
};
export const goalPropType = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  goalPoint: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  account: PropTypes.string,
};
export const iconPropTye = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  src: PropTypes.object.isRequired,
};
export const nodesPropType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);
