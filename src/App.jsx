import { useEffect, useState } from "react";
import SwatchesColumn from "./components/swatches/SwatchesSelected.jsx";
import { generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL, buildFiltersUrlQueryParams, getUrlParamValueByKey, urlHaskey } from "./utils/helpers.js";
import SwatchModel from "./components/models/SwatchModel.jsx";
import RemoveSVG from "./components/RemoveSVG.jsx";
import SelectFilters from "./components/filter/SelectFilters.jsx";
import AccordianFilters from "./components/filter/AccordianFilters.jsx";

import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

import "./App.css";
import Loader from "./components/loader.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  /*
  const storedSwatchesRequestUrl = localStorage.getItem("swatches_request_url");
  */
  const storedSwatchesRequestUrl = null;
  const initialSwatchesRequestUrl = storedSwatchesRequestUrl || API_BASE_URL + "swatches";

  const [swatchSources, setSwatchSources] = useState([]);

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
  const [stockAccordian, setStockAccordian] = useState(false);

  const [paginationOffset, setPaginationOffset] = useState();

  const paginationOffsetHelper = () => {
    let page = parseInt(listMeta.page);
    let offset = page * 26 - 104;

    console.log("caculated offset", paginationOffset);

    return offset + "px";
  };

  const handlePageNP = (direction) => {
    /*
    setsSatches_request_url((existingUrl) => updateQueryStringParameter(existingUrl, "page", pageNo));
    */

    let currentPage = parseInt(listMeta.page);
    let totalPages = parseInt(listMeta.pages);

    if (currentPage == 1 && direction == "prev") {
      return true;
    }

    if (currentPage == totalPages && direction == "next") {
      return true;
    }

    let targetedPage = direction == "next" ? currentPage + 1 : currentPage - 1;

    setsSatches_request_url((existingUrl) => updateQueryStringParameter(existingUrl, "page", targetedPage));

    /*
    {
    "page": "2",
    "limit": 12,
    "offset": 12,
    "total": "452",
    "pages": 38,
    "source": "all"
}  
    */
  };

  useEffect(() => {
    // Add or remove the class based on the modalActive state
    // Cleanup the class when the component is unmounted
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
    setSelectedFilters([]);

    setsSatches_request_url((existingUrl) => {
      let source = listMeta.source;

      let clearedUrl = clearAllQueryParams(existingUrl);

      const appliedUrl = updateQueryStringParameter(clearedUrl, "source", source);

      return appliedUrl;
    });

    setPaginationOffset((oldvalue) => "0px");
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

    setShowFilters(!showFilters);

    setPaginationOffset((oldvalue) => "0px");
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

  const indicateActiveSource = (source) => {
    console.log("indicate source", source);

    console.log("swatch source", swatchSources);

    setSwatchSources((existingSource) => {
      return existingSource.map((sourceItem) => {
        return sourceItem.url == source ? { ...sourceItem, active: true } : sourceItem;
      });
    });
  };

  useEffect(() => {
    console.log("useEffect called detected change in the selectedFilters", selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    setTimeout(() => {
      let updatedPaginationOffset = paginationOffsetHelper();
      setPaginationOffset((oldValue) => updatedPaginationOffset);
    }, 0);
  }, [listMeta]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const request = await fetch(swatches_request_url);

        if (!request.ok) {
          const errorBody = request.json();
          throw new Error(errorBody.message);
        }

        const response = await request.json();
        if (response.filters != undefined) {
          setFilters(response.filters);
          setLoading(false);
        }

        setListMeta(response.meta);

        if (swatchSources.length == 0) {
          setSwatchSources(response.sources);
        }

        if (response.sources != undefined && swatchSources.length == 0) {
          console.log("setting sources", response.sources);
          setSwatchSources(response.sources);
        }

        indicateActiveSource(response.meta.source);

        setSwatchListings(response.collections);
        if (response.meta.pages != undefined) {
          let generatedPagesArray = generateNumberArray(response.meta.pages);

          setPages((oldpages) => generatedPagesArray);
        }
      } catch (error) {}
    })();

    /*
    localStorage.setItem("swatches_request_url", swatches_request_url);
    */

    let isFilterACtive = !!urlHaskey(swatches_request_url, "filteringActivate");

    setHaveFilters(isFilterACtive);
  }, [swatches_request_url]);

  const ulStyle = {
    transform: `translateX(-${paginationOffset})`,
  };

  return (
    <>
      <div className="clotAppWrap">
        {swatchModelActive && <SwatchModel swatchModelItem={swatchModelItem} closeSwatchModel={closeSwatchModel} onSwatchAdd={handleSwatchAdd} />}

        <div className="clothSwatchColWrap">
          <div className="swatchFilter box-border">
            <div>Matched Items : ( {listMeta.total} )</div>
            <h4 className="filter-heading-control">
              Filters
              <div className="show-mobile tailor-filter-icon" style={{ fontSize: "14px" }} onClick={() => setShowFilters(!showFilters)}></div>
            </h4>

            <div className={`filter-mobile-toggle ${!showFilters ? "mobile-hide" : ""}`}>
              {false && (
                <div className="filter-labels">
                  <div>
                    <h5 className={`stock-list filter-accordion-header ${stockAccordian ? "active" : ""} `} onClick={() => setStockAccordian(!stockAccordian)}>
                      - STOCK COLLECTIONS
                    </h5>
                    <ul className="filter-list-items">
                      {swatchSources.map((source, index) => (
                        <li key={index} className={`${source.active ? "checkedFilterItem" : ""}`} onClick={(e) => handleSource(e, source.url)}>
                          {source.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {filters.length > 0 && <AccordianFilters filters={filters} setFilters={setFilters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />}

              {true && (
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
              )}
            </div>
          </div>

          <SwatchesColumn selectedSwatches={selectedSwatches} removeSelectedSwatch={removeSelectedSwatch} removeAllSwatches={removeAllSwatches} />

          <div className="swatchListings box-border">
            <div className="swatchPagination">
              <div className="pageNP pagePre" onClick={() => handlePageNP("prev")}>
                <SlArrowLeft />
              </div>

              <div className="paginationScrollCanvas">
                <ul style={ulStyle}>
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
              <div className="pageNP pageNext" onClick={() => handlePageNP("next")}>
                <SlArrowRight />
              </div>
            </div>

            <div className={`swatchItemListing ${!loading ? "loaded-grid" : "pending-grid"}`}>
              {!loading ? (
                swatchListings.map((item) => (
                  <div key={item.id} className="swatchItem" onClick={(event) => openSwatchModel(event, item)}>
                    <div className={`itemImage_container ${loadedImages[item.id] ? "loaded-react" : "pending-imgLoad"}`}>
                      <img src={`${API_BASE_URL}${item.thumbnail}`} alt={item.title + "image"} loading="lazy" onLoad={(e) => handleImageLoad(item.id, e)} />
                    </div>

                    <div className="swatchTitle">{item.title}</div>
                  </div>
                ))
              ) : (
                <div className="swatchGridLoadingItem">
                  <div>
                    <Loader />
                  </div>
                </div>
              )}
            </div>

            {!loading && swatchListings.length == 0 && <div className="no-records">No records were found in matching criteria!</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
