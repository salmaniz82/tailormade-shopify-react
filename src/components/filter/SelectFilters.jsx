import Select from "react-select";

function SelectFilters({ filters, prepareFilters }) {
  return (
    <>
      {filters.length > 0 && (
        <div className="filter-labels">
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex}>
              <h5>{filter.name.toLowerCase()}</h5>
              <Select
                isMulti
                options={filter.items.map((item, itemIndex) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(selectedOptions) => {
                  prepareFilters(filter.name, selectedOptions);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SelectFilters;
