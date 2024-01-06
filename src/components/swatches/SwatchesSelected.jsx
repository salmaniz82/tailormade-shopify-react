import { useRef, useState } from "react";
import { API_BASE_URL, validateEmail } from "../../utils/helpers.js";
import { ToastContainer, toast } from "react-toastify";
import RemoveSVG from "../RemoveSVG.jsx";

import "react-toastify/dist/ReactToastify.css";

function SwatchesSelected({ selectedSwatches, removeSelectedSwatch, removeAllSwatches }) {
  const emailRef = useRef(null);

  const [swatchesSent, setSentSwathes] = useState(false);

  const [toggleSwatches, settoggleMSwatches] = useState(false);

  const handleRequestSwatches = () => {
    let request_swatch_url = `${API_BASE_URL}request-swatch`;
    let emailValidation = false;
    let customerEmail = emailRef.current.value;

    if (customerEmail.trim() === "") {
      toast.error("Please enter email");
    } else if (validateEmail(customerEmail)) {
      emailValidation = true;
    } else {
      toast.error("Provided email is invalid");
    }

    if (!emailValidation) return;

    let requestBodyPaylod = JSON.stringify({
      customerEmail,
      swachtes: selectedSwatches,
    });

    fetch(request_swatch_url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBodyPaylod,
    })
      .then((res) => {
        if (res.status == 200) {
          console.log("res is ok");
          return res.json();
        }

        return res.json().then((err) => Promise.reject(err));
      })
      .then((dataJson) => {
        toast.success(dataJson.message);
        setSentSwathes(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="selectedSwatches box-border">
      <div className="stickySelectionSection">
        <div className="swatchCounter">
          {selectedSwatches.length > 0 ? (
            <>
              <span className="counterLabel">
                Added Swatches: : <small className="counnter_label"></small>
                <div className="swatch-toggle" onClick={() => settoggleMSwatches(!toggleSwatches)}>
                  {!toggleSwatches ? "\u25BC" : "\u25B2"}
                </div>
              </span>

              <div className="clearAll-wrap" onClick={removeAllSwatches}>
                Clear All ( {selectedSwatches.length} )
              </div>
            </>
          ) : (
            <p style={{ textTransform: "uppercase" }}> Add Your Favorites Swatches </p>
          )}
        </div>

        <div className={`swathItemMobileToggleGroup ${toggleSwatches ? "show-swatches" : "hide-swatches"}`}>
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
                    <RemoveSVG />
                  </div>
                </div>
              ))}
          </div>

          {selectedSwatches.length > 0 && !swatchesSent && (
            <>
              <div className="makeRequestBlock">
                <div className="flashButtonWrapper">
                  {false && (
                    <>
                      <label htmlFor="requestSwatchEmailInput text__color_lightGrey text__size_sm">Enter Your Email:</label>
                      <input type="email" placeholder="Email" className="requestSwatchEmailInput" id="requestSwatchEmailInput" ref={emailRef} />

                      <div className="requestSwatch text_btn_lg" onClick={handleRequestSwatches} style={{ marginTop: "5px" }}>
                        REQUEST SWATCH
                      </div>
                    </>
                  )}

                  <div className="requestSwatch text_btn_lg" style={{ marginTop: "5px" }}>
                    REQUEST SWATCH
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedSwatches.length > 0 && swatchesSent && (
            <>
              <p className="postSwatchSentBlock"> Your request for ( {selectedSwatches.length} ) swatches has been sent!. 👌 </p>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SwatchesSelected;
