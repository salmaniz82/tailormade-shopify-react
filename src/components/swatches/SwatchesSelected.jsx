import { API_BASE_URL } from "../../utils/helpers.js";

function SwatchesSelected({ selectedSwatches, removeSelectedSwatch }) {
  return (
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
  );
}

export default SwatchesSelected;
