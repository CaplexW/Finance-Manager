import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

export default function SearchBar({ onSearch, placeholder = 'Поиск...' }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(searchQuery);
  }, [onSearch, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </form>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
