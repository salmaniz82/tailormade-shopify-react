import React from "react";

function AccordianFilters({ filters, prepareFilters, setFilters }) {
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

    console.log(filters);
  };

  function chosenListFilters(header, item) {
    console.log(header, item);
  }

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
                  <li key={itemIndex} onClick={() => chosenListFilters(filter.name, item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AccordianFilters;
