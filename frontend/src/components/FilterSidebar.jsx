import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [selectedCategories, setSelectedCategories] = useState(
    currentFilters.categories || []
  );
  const [priceRange, setPriceRange] = useState(
    currentFilters.priceRange || { min: 0, max: 5000 }
  );
  const [minRating, setMinRating] = useState(currentFilters.minRating || 0);

  const categories = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'home', label: 'Home & Garden' }
  ];

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    onFilterChange({ ...currentFilters, categories: newCategories });
  };

  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    const newRange = { ...priceRange, max: newMax };
    setPriceRange(newRange);
    onFilterChange({ ...currentFilters, priceRange: newRange });
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
    onFilterChange({ ...currentFilters, minRating: rating });
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      <div className="filter-section">
        <h4>Category</h4>
        {categories.map(category => (
          <label key={category.id} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              data-testid={`filter-${category.id}`}
            />
            <span>{category.label}</span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange.max}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-labels">
            <span>$0</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        <div className="rating-filters">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`rating-filter-btn ${minRating === rating ? 'active' : ''}`}
            >
              {rating}★ & up
            </button>
          ))}
          <button
            onClick={() => handleRatingChange(0)}
            className={`rating-filter-btn ${minRating === 0 ? 'active' : ''}`}
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
