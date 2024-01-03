import { useRef, useState } from "react";
import { API_BASE_URL, validateEmail } from "../../utils/helpers.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SwatchesSelected({ selectedSwatches, removeSelectedSwatch, removeAllSwatches }) {
  const emailRef = useRef(null);

  const [swatchesSent, setSentSwathes] = useState(false);

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
                Added Swatches <small className="counnter_label"></small>
              </span>

              <div className="clearAll-wrap" onClick={removeAllSwatches}>
                Clear All ( {selectedSwatches.length} )
              </div>
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

        {selectedSwatches.length > 0 && !swatchesSent && (
          <>
            <div className="makeRequestBlock">
              <label htmlFor="requestSwatchEmailInput text__color_lightGrey text__size_sm">Enter Your Email:</label>
              <input type="email" placeholder="Email" className="requestSwatchEmailInput" id="requestSwatchEmailInput" ref={emailRef} />

              <div className="flashButtonWrapper">
                <div className="requestSwatch text_btn_lg" onClick={handleRequestSwatches} style={{ marginTop: "5px" }}>
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
  );
}

export default SwatchesSelected;
