import React from 'react';
import PropTypes from 'prop-types';
import { defaultAvatar } from '../../../assets/icons';

export default function UserAvatar({ source, size }) {
  if (!source) {
    return defaultAvatar;
  }
  return (
    <img
      alt="avatar"
      className="rounded-circle"
      height={size}
      src={source}
      width={size}
    />
  );
}

UserAvatar.propTypes = {
  size: PropTypes.number,
  source: PropTypes.string.isRequired,
};
UserAvatar.defaultProps = {
  size: 40,
};
