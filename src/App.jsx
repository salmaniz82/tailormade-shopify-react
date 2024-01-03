import { useEffect, useState } from "react";
import SwatchesColumn from "./components/swatches/SwatchesSelected.jsx";
import { generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL, buildFiltersUrlQueryParams } from "./utils/helpers.js";
import SwatchModel from "./components/models/SwatchModel.jsx";

import Select from "react-select";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  const storedSwatchesRequestUrl = localStorage.getItem("swatches_request_url");
  const initialSwatchesRequestUrl = storedSwatchesRequestUrl || API_BASE_URL + "swatches";

  const [swatchSources, setSwatchSources] = useState([
    { name: "foxflannel", url: "foxflannel.com", active: false },
    { name: "loropiana", url: "loropiana.com", active: false },
    { name: "dugdalebros", url: "shop.dugdalebros.com", active: false },
    { name: "harrisons", url: "harrisons1863.com", active: false },
  ]);

  const [swatches_request_url, setsSatches_request_url] = useState(initialSwatchesRequestUrl);
  const [swatchListings, setSwatchListings] = useState([]);
  const [filters, setFilters] = useState([]);
  const [listMeta, setListMeta] = useState([]);
  const [pages, setPages] = useState([0]);
  const [loadedImages, setLoadedImages] = useState({});
  const [swatchModelActive, setSwatchModelActive] = useState(false);
  const [swatchModelItem, setSwatchModelItem] = useState(null);
  const [selectedSwatches, setSelectedSwatches] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const standaAloneAddSwatchHelperUpdate = (swatchItemToAdd) => {
    setSelectedSwatches((existingSwatches) => {
      const itemAlreadyExists = existingSwatches.some((item) => item.id === swatchItemToAdd.id);
      if (!itemAlreadyExists) {
        return [...existingSwatches, swatchItemToAdd];
      }
      return existingSwatches;
    });
  };

  const removeAllSwatches = () => {
    setSelectedSwatches([]);
  };

  const handleSwatchAdd = (swatchItemToAdd) => {
    /*
    pussing to the array
    setSelectedSwatches((existingSwatches) => [...existingSwatches, swatchItemToAdd]);
    */
    standaAloneAddSwatchHelperUpdate(swatchItemToAdd);

    closeSwatchModel();
  };

  const handleImageLoad = (itemId, e) => {
    setLoadedImages((prevLoadedImages) => ({
      ...prevLoadedImages,
      [itemId]: true,
    }));
    e.stopPropagation();
  };

  const handlePaginate = (e, pageNo) => {
    e.preventDefault();
    setsSatches_request_url((existingUrl) => updateQueryStringParameter(existingUrl, "page", pageNo));
  };

  const handleSource = (e, source) => {
    e.preventDefault();
    var matchedSource = swatchSources.findIndex((item) => item.url == source);
    console.log(matchedSource);
    setsSatches_request_url((existingUrl) => {
      let clearedUrl = clearAllQueryParams(existingUrl);
      return updateQueryStringParameter(clearedUrl, "source", source);
    });

    setSwatchSources((prevSources) => {
      const updatedSources = prevSources.map((item) => {
        return {
          ...item,
          active: item.url === source,
        };
      });
      return updatedSources;
    });
  };

  const prepareFilters = (filterName, filterValue) => {
    if (filterName === "COLOUR") filterName = "colors";

    const filterIndex = selectedFilters.findIndex((filter) => filter.filterHeader === filterName);

    const updatedFilters = (prevFilters) => {
      if (filterIndex !== -1) {
        // Update existing filter
        const existingFilter = [...prevFilters];
        existingFilter[filterIndex].values = filterValue.map((value) => value.value);
        return existingFilter.filter((filter) => filter.values.length > 0); // Filter out empty values
      } else {
        // Add new filter
        return [...prevFilters, { filterHeader: filterName, values: filterValue.map((value) => value.value) }];
      }
    };

    // Set the selected filters
    setSelectedFilters(updatedFilters);

    // Note: The state update is asynchronous, so the log statement may not immediately reflect the updated state
    console.log(selectedFilters);
  };

  const applyFilters = () => {
    let filterCopy = [...selectedFilters];

    console.log("apply and fetch via filter params copy", filterCopy);

    let encodedURL = buildFiltersUrlQueryParams(swatches_request_url, filterCopy);
    let decodedURL = decodeURIComponent(encodedURL);

    console.log("encodedurl", encodedURL);
    console.log("decodedURL", decodedURL);

    setsSatches_request_url((existingUrl) => {
      let clearedUrl = clearAllQueryParams(existingUrl);
      return buildFiltersUrlQueryParams(clearedUrl, filterCopy);
    });
  };

  const removeFilters = () => {
    /*DO WORK HERE WHILE REMOVEING THE FILTERS*/
  };

  const removeSelectedSwatch = (removeItemFromSelection) => {
    setSelectedSwatches((existingSwatches) =>
      existingSwatches.map((item) => {
        if (item.id === removeItemFromSelection.id) {
          item.isRemoving = true;
        }
        return item;
      })
    );

    setTimeout(() => {
      setSelectedSwatches((existingSwatches) => existingSwatches.filter((item) => item.id !== removeItemFromSelection.id));
    }, 300);
  };

  const closeSwatchModel = () => {
    setSwatchModelActive(false);
    setSwatchModelItem(null);
  };

  const openSwatchModel = (e, currentClickedItem) => {
    e.preventDefault();

    currentClickedItem.isRemoving = false;

    setSwatchModelItem((oldItem) => currentClickedItem);
    setSwatchModelActive(true);
  };

  useEffect(() => {
    console.log("useEffect called detected change in the selectedFilters", selectedFilters);
    // Filter empty objects after state update
  }, [selectedFilters]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const request = await fetch(swatches_request_url);
      const response = await request.json();
      if (response.filters != undefined) {
        setFilters(response.filters);
      }

      setListMeta(response.meta);

      const markActiveSwatchSource = (currentState, sourceValue) => {
        return currentState.map((source) => {
          if (source.url === sourceValue) {
            return { ...source, active: true };
          } else {
            return { ...source, active: false };
          }
        });
      };

      const updatedSources = markActiveSwatchSource(swatchSources, response.meta.source);

      setSwatchSources(updatedSources);

      setSwatchListings(response.collections);
      if (response.meta.pages != undefined) {
        let generatedPagesArray = generateNumberArray(response.meta.pages);

        setPages((oldpages) => generatedPagesArray);
      }
      setLoading(false);
    })();

    localStorage.setItem("swatches_request_url", swatches_request_url);
  }, [swatches_request_url]);

  return (
    <>
      <div className="clotAppWrap">
        {swatchModelActive && <SwatchModel swatchModelItem={swatchModelItem} closeSwatchModel={closeSwatchModel} onSwatchAdd={handleSwatchAdd} />}

        <div className="swatchPagination">
          <ul>
            {pages.length > 1 &&
              pages.map((pageNO, pageIndex) => (
                <li key={pageIndex}>
                  <a href="#" onClick={(e) => handlePaginate(e, pageNO)}>
                    {pageNO}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="clothSwatchColWrap">
          <div className="swatchFilter box-border">
            <h2>Matched Items : ( {listMeta.total} )</h2>

            <div>
              <h3>Source</h3>

              <div className="sourceItemList">
                {swatchSources.map((source) => (
                  <div className={`source-item ${source.active ? "active" : ""}`} onClick={(e) => handleSource(e, source.url)}>
                    {source.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="swatch_apply_filters">
              <div className="flashButtonWrapper">
                <div className="applyFilterBtn text_btn_lg" onClick={applyFilters}>
                  APPLY FILTERS
                </div>
              </div>
            </div>

            <h2>Filter By</h2>
            {filters.length > 0 && listMeta.source == "foxflannel.com" && (
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

            {filters.length > 0 && listMeta.source == "loropiana.com" && (
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

            {filters.length > 0 && listMeta.source == "shop.dugdalebros.com" && (
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
            {filters.length > 0 && listMeta.source == "harrisons1863.com" && (
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
          </div>
          <div className="swatchListings box-border">
            <div className={`swatchItemListing ${!loading ? "loaded-grid" : "pending-grid"}`}>
              {!loading ? (
                swatchListings.map((item) => (
                  <div key={item.id} className="swatchItem" onClick={(event) => openSwatchModel(event, item)}>
                    <div className={`itemImage_container ${loadedImages[item.id] ? "loaded-react" : "pending-imgLoad"}`}>
                      <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title + "image"} loading="lazy" onLoad={(e) => handleImageLoad(item.id, e)} />
                    </div>

                    <div className="swatchTitle">{item.title}</div>
                  </div>
                ))
              ) : (
                <div className="swatchGridLoadingItem">
                  <div>loading...</div>
                </div>
              )}
            </div>

            {!loading && swatchListings.length == 0 && <div className="no-records">No records were found in matching criteria!</div>}
          </div>

          <SwatchesColumn selectedSwatches={selectedSwatches} removeSelectedSwatch={removeSelectedSwatch} removeAllSwatches={removeAllSwatches} />
        </div>
      </div>
    </>
  );
}

export default App;
