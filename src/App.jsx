import { useEffect, useState } from "react";
import MySelectComponent from "./components/select/test.jsx";
import { generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL } from "./utils/helpers.js";

import SwatchModel from "./components/models/SwatchModel.jsx";

/*
import Banner from './components/banner/Banner.jsx';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
*/

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [swatches_request_url, setsSatches_request_url] = useState(API_BASE_URL + "swatches");
  const [swatchListings, setSwatchListings] = useState([]);
  const [filters, setFilters] = useState([]);

  const [listMeta, setListMeta] = useState([]);
  const [pages, setPages] = useState([0]);

  const [loadedImages, setLoadedImages] = useState({});
  const [swatchModelActive, setSwatchModelActive] = useState(false);
  const [swatchModelItem, setSwatchModelItem] = useState(null);
  const [selectedSwatches, setSelectedSwatches] = useState([]);

  const standaAloneAddSwatchHelperUpdate = (swatchItemToAdd) => {
    setSelectedSwatches((existingSwatches) => {
      const itemAlreadyExists = existingSwatches.some((item) => item.id === swatchItemToAdd.id);
      if (!itemAlreadyExists) {
        return [...existingSwatches, swatchItemToAdd];
      }
      return existingSwatches;
    });
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
    setsSatches_request_url((existingUrl) => {
      let clearedUrl = clearAllQueryParams(existingUrl);
      return updateQueryStringParameter(clearedUrl, "source", source);
    });
  };

  const applySwatchfilter = (parentFilter, filterValue) => {
    if (parentFilter == "COLOUR") parentFilter = "colors";
    setsSatches_request_url((existingUrl) => {
      let clearedUrl = clearAllQueryParams(existingUrl);
      return updateQueryStringParameter(clearedUrl, parentFilter, filterValue);
    });
  };

  const removeSelectedSwatch = (removeItemFromSelection) => {
    setSelectedSwatches((existingSwatches) =>
      existingSwatches.map((item) => {
        if (item.id === removeItemFromSelection.id) {
          // Set isRemoving to true with a delay
          item.isRemoving = true;
        }
        return item;
      })
    );

    // After a delay of 300ms, filter out the item
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
    (async () => {
      setLoading(true);
      const request = await fetch(swatches_request_url);
      const response = await request.json();
      if (response.filters != undefined) {
        setFilters(response.filters);
      }
      setListMeta(response.meta);
      setSwatchListings(response.collections);
      if (response.meta.pages != undefined) {
        let generatedPagesArray = generateNumberArray(response.meta.pages);
        setPages((oldpages) => generatedPagesArray);
      }
      setLoading(false);
    })();
  }, [swatches_request_url]);

  return (
    <>
      <div className="clotAppWrap">
        {swatchModelActive && <SwatchModel swatchModelItem={swatchModelItem} closeSwatchModel={closeSwatchModel} onSwatchAdd={handleSwatchAdd} />}

        <div className="banner">this will be the banner</div>
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
            <h2>Filter By</h2>
            <div>
              <h3>Source</h3>
              <div onClick={(e) => handleSource(e, "foxflannel.com")}>foxflannel</div>
              <div onClick={(e) => handleSource(e, "loropiana.com")}>loropiana</div>
              <div onClick={(e) => handleSource(e, "shop.dugdalebros.com")}>dugdalebros.com</div>
              <div onClick={(e) => handleSource(e, "harrisons1863.com")}>harrisons</div>
            </div>

            <div>
              <h3>Test Select search</h3>
              <MySelectComponent />
            </div>

            {listMeta.source === "foxflannel.com" && (
              <div className="foxFlannel-filter">
                {filters.map((filter, filterIndex) => (
                  <div key={filterIndex}>
                    <h3>{filter.name}</h3>
                    {filter.items.map((item, itemIndex) => (
                      <p key={itemIndex} onClick={() => applySwatchfilter(filter.name, item)}>
                        {item}
                      </p>
                    ))}
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
          </div>
          <div className="selectedSwatches box-border">
            <div className="stickySelectionSection">
              <div className="swatchCounter">
                {selectedSwatches.length > 0 ? (
                  <>
                    <span className="counterLabel">
                      Added <small className="counnter_label"> ( {selectedSwatches.length} ) </small>
                    </span>
                  </>
                ) : (
                  <p style={{ textTransform: "uppercase" }}> Add Your Favorites Swatches </p>
                )}
              </div>

              <div className="selectedSwatchItemWrap">
                {selectedSwatches
                  .slice()
                  .reverse()
                  .map((selectedItem) => (
                    <div key={selectedItem.id} className={`selectedSwatch_item ${selectedItem.isRemoving ? "slide-out" : "slide-in"}`}>
                      <div className="swatch_thumb">
                        <img src={`${API_BASE_URL}${selectedItem.imageUrl}`} alt="" />
                      </div>
                      <div className="swatchTitle_selected">{selectedItem.title}</div>
                      <div className="removeSwatchControl" onClick={() => removeSelectedSwatch(selectedItem)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" aria-hidden="true" focusable="false" role="presentation" className="icon-close" fill="none" viewBox="0 0 18 17">
                          <path
                            d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                            fill="currentColor"></path>
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
