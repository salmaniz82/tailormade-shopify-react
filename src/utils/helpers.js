const API_BASE_URL = "http://tailormade.local/";

function generateNumberArray(size) {
    return Array.from({ length: size }, (_, index) => index + 1);
  }



  function updateQueryStringParameter(url, key, value) {
    const urlObject = new URL(url);
    const queryParams = new URLSearchParams(urlObject.search);
  
    
    if (queryParams.has(key)) {
    
      queryParams.set(key, value);
    } else {
    
      queryParams.append(key, value);
    }
  
    
    urlObject.search = queryParams.toString();
  
    return urlObject.toString();
  }

  function clearAllQueryParams(url) {
    const urlObject = new URL(url);
    urlObject.search = '';
    return urlObject.toString();
  }



  export {generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL};