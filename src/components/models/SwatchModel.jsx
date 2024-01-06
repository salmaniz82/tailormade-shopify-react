import { API_BASE_URL } from "../../utils/helpers.js";

function SwatchModel({ swatchModelItem, closeSwatchModel, onSwatchAdd }) {
  return (
    <div className="swatchModelWrapper modal-enter">
      <div className="swatchImageWrapper">
        <img src={`${API_BASE_URL}${swatchModelItem.imageUrl}`} />
      </div>

      <div className="swatchContentDetails">
        <div className="close-button" onClick={closeSwatchModel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16px" aria-hidden="true" focusable="false" role="presentation" className="icon icon-close" fill="none" viewBox="0 0 18 17">
            <path
              d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
              fill="currentColor"></path>
          </svg>
        </div>

        <div className="titleActiveSwatch">{swatchModelItem.title}</div>

        <div className="swatchActiveMetaInfo">
          <table className="swatchModelMetaDetails">
            <tbody>
              {Object.entries(JSON.parse(swatchModelItem.productMeta)).map(([key, value]) => (
                <tr key={key}>
                  <td className="swatchMetaHeading">{key.trim()} </td> <td className="swatchMetaValue">{value.trim()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flashButtonWrapper">
          <div className="btAddToSwatcjed" onClick={(event) => onSwatchAdd(swatchModelItem)}>
            ADD TO SWATCH
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwatchModel;
