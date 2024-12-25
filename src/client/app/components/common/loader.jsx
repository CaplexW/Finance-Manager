import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/config';
import showElement from '../../../../utils/console/showElement';

export default function Loader({ min, max, reason }) {
  if (reason && !config.IN_PRODUCTION) showElement(reason, 'reason of loader');

  if (max) return <h1><span className="badge bg-warning m-3 w-100">Загрузка...</span></h1>;
  if (min) return <h4><span className="badge bg-warning m-3">Загрузка...</span></h4>;
  return <h2><span className="badge bg-warning m-3">Загрузка...</span></h2>;
}
Loader.propTypes = {
  max: PropTypes.bool,
  min: PropTypes.bool,
  reason: PropTypes.string,
};
Loader.defaultProps = {
  max: false,
  min: false,
  reason: null,
};
