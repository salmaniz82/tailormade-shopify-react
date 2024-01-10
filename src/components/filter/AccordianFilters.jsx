import { useState } from "react";

function AccordianFilters({ filters, setFilters, setSelectedFilters, selectedFilters }) {
  const [activeFilterHeaders, setActiveFilterHeaders] = useState([]);

  const toggleAccordion = function (filterName) {
    setActiveFilterHeaders((prevActiveFilterHeaders) => {
      return prevActiveFilterHeaders.includes(filterName) ? prevActiveFilterHeaders.filter((name) => name !== filterName) : [...prevActiveFilterHeaders, filterName];
    });

    setFilters((prevFilters) => {
      return prevFilters.map((filter) => {
        if (filter.name === filterName) {
          return { ...filter, active: !filter.active };
        }
        return filter;
      });
    });
  };

  const chosenListFilters = (filterHeader, item) => {
    setSelectedFilters((prevSelectedFilters) => {
      const existingFilterIndex = prevSelectedFilters.findIndex((filter) => filter.filterHeader === filterHeader);

      if (existingFilterIndex !== -1) {
        const existingValues = prevSelectedFilters[existingFilterIndex].values;
        const updatedValues = existingValues.includes(item) ? existingValues.filter((value) => value !== item) : [...existingValues, item];

        const updatedFilters = [...prevSelectedFilters];
        updatedFilters[existingFilterIndex] = {
          filterHeader,
          values: updatedValues,
        };

        return updatedFilters;
      } else {
        return [...prevSelectedFilters, { filterHeader, values: [item] }];
      }
    });
  };

  return (
    <>
      {filters.length > 0 && (
        <div className="filter-labels">
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex}>
              <h5 className={`filter-accordion-header ${activeFilterHeaders.includes(filter.name) ? "active" : ""}`} onClick={() => toggleAccordion(filter.name)}>
                {filter.name.toLowerCase()}
              </h5>

              <ul className="filter-list-items">
                {filter.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    onClick={() => chosenListFilters(filter.name, item)}
                    className={`${selectedFilters.some((sf) => sf.filterHeader === filter.name && sf.values.includes(item)) ? "checkedFilterItem" : ""}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* Log the selected filters state for debugging */}
      {/*selectedFilters.length > 0 && (
        <div>
          <h5>Selected Filters:</h5>
          <pre>{JSON.stringify(selectedFilters, null, 2)}</pre>
        </div>
      )*/}
    </>
  );
}

export default AccordianFilters;
