import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <i className="fas fa-search"></i>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;