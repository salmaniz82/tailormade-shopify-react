import { useState } from "react";

function AccordianFilters({ filters, setFilters }) {
  const [chosenFilters, setChosenFilters] = useState([]);

  const toggleAccordion = function (filterName) {
    setFilters((prevFilters) => {
      return prevFilters.map((filter) => {
        if (filter.name === filterName) {
          // Toggle the 'active' property for the clicked filter
          return { ...filter, active: !filter.active };
        }
        return filter;
      });
    });
  };

  const chosenListFilters = (filterHeader, item) => {
    setChosenFilters((prevChosenFilters) => {
      const existingFilterIndex = prevChosenFilters.findIndex((filter) => filter.filterHeader === filterHeader);

      if (existingFilterIndex !== -1) {
        // If filterHeader already exists, check if item exists in values array
        const existingValues = prevChosenFilters[existingFilterIndex].values;
        const updatedValues = existingValues.includes(item)
          ? existingValues.filter((value) => value !== item) // Remove the item if it exists
          : [...existingValues, item]; // Add the item if it doesn't exist

        // Update the existing filter with the new values
        const updatedFilters = [...prevChosenFilters];
        updatedFilters[existingFilterIndex] = {
          filterHeader,
          values: updatedValues,
        };

        return updatedFilters;
      } else {
        // If filterHeader doesn't exist, create a new filter
        return [...prevChosenFilters, { filterHeader, values: [item] }];
      }
    });
  };

  return (
    <>
      {filters.length > 0 && (
        <div className="filter-labels">
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex}>
              <h5 className={`filter-accordion-header ${filter.active ? "active" : ""}`} onClick={() => toggleAccordion(filter.name)}>
                {filter.name.toLowerCase()}
              </h5>

              <ul className="filter-list-items">
                {filter.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    onClick={() => chosenListFilters(filter.name, item)}
                    className={`${chosenFilters.some((cf) => cf.filterHeader === filter.name && cf.values.includes(item)) ? "checkedFilterItem" : ""}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* Log the chosen filters state for debugging */}
      {chosenFilters.length > 0 && (
        <div>
          <h5>Chosen Filters:</h5>
          <pre>{JSON.stringify(chosenFilters, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default AccordianFilters;
