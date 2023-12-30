import React, { useState } from 'react';
import Select from 'react-select';

const MySelectComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    // Add more options as needed
  ];

  const handleChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Pick your choice"
      isSearchable
    />
  );
};

export default MySelectComponent;