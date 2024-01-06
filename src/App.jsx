import { useEffect, useState } from "react";
import SwatchesColumn from "./components/swatches/SwatchesSelected.jsx";
import { generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL, buildFiltersUrlQueryParams, getUrlParamValueByKey, urlHaskey } from "./utils/helpers.js";
import SwatchModel from "./components/models/SwatchModel.jsx";

import RemoveSVG from "./components/RemoveSVG.jsx";

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
  const [haveFilters, setHaveFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Add or remove the class based on the modalActive state

    if (swatchModelActive) {
      document.body.classList.add("menu-mobile--open");
    } else {
      document.body.classList.remove("menu-mobile--open");
    }

    // Cleanup the class when the component is unmounted
    return () => {
      document.body.classList.remove("menu-mobile--open");
    };
  }, [swatchModelActive]);

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

  const clearAllFilters = () => {
    setsSatches_request_url((existingUrl) => {
      let source = listMeta.source;

      let clearedUrl = clearAllQueryParams(existingUrl);

      const appliedUrl = updateQueryStringParameter(clearedUrl, "source", source);

      return appliedUrl;
    });
  };

  const handleSource = (e, source) => {
    setSelectedFilters([]);

    e.preventDefault();
    var matchedSource = swatchSources.findIndex((item) => item.url == source);
    console.log(matchedSource);

    setsSatches_request_url((existingUrl) => {
      let clearedUrl = clearAllQueryParams(existingUrl);
      console.log("cleared url from handlesouce change", clearedUrl);
      const appliedUrl = updateQueryStringParameter(clearedUrl, "source", source);
      console.log("applied url", appliedUrl);
      return appliedUrl;
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

    setSelectedFilters(updatedFilters);

    console.log(selectedFilters);
  };

  const applyFilters = () => {
    console.log("apply filter is called");

    let filterCopy = [...selectedFilters];

    setsSatches_request_url((existingUrl) => {
      let appendurlSourceAsFilterValue = { filterHeader: "source", values: [listMeta.source] };
      let filteringActivate = { filterHeader: "filteringActivate", values: ["on"] };

      filterCopy.push(appendurlSourceAsFilterValue, filteringActivate);

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

    let isFilterACtive = !!urlHaskey(swatches_request_url, "filteringActivate");

    setHaveFilters(isFilterACtive);
  }, [swatches_request_url]);

  return (
    <>
      <div className="clotAppWrap">
        {swatchModelActive && <SwatchModel swatchModelItem={swatchModelItem} closeSwatchModel={closeSwatchModel} onSwatchAdd={handleSwatchAdd} />}

        <div className="clothSwatchColWrap">
          <div className="swatchFilter box-border">
            <div>Matched Items : ( {listMeta.total} )</div>
            <h4 className="filter-heading-control">
              Filter By
              <div className="show-mobile" style={{ fontSize: "14px" }} onClick={() => setShowFilters(!showFilters)}>
                {!showFilters ? "\u25BC" : "\u25B2"}{" "}
              </div>
            </h4>

            <div className={`filter-mobile-toggle ${!showFilters ? "mobile-hide" : ""}`}>
              <div>
                <h4>Collections</h4>
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

                {haveFilters && (
                  <div className="clearFilterBT_wrap" onClick={clearAllFilters}>
                    <div className="clearOutlineBtFilter">
                      <div className="filerBTtext">clear</div>
                      <RemoveSVG />
                    </div>
                  </div>
                )}
              </div>

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
          </div>

          <SwatchesColumn selectedSwatches={selectedSwatches} removeSelectedSwatch={removeSelectedSwatch} removeAllSwatches={removeAllSwatches} />

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
        </div>
        <div className="swatchPagination">
          <ul>
            {pages.length > 1 &&
              pages.map((pageNO, pageIndex) => (
                <li key={pageIndex} className={listMeta.page == pageNO ? "active-page" : ""}>
                  <a href="#" onClick={(e) => handlePaginate(e, pageNO)}>
                    {pageNO}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
