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
  urlObject.search = "";
  return urlObject.toString();
}

function buildFiltersUrlQueryParams(url, filters) {
  const urlObject = new URL(url);
  const queryParams = new URLSearchParams(urlObject.search); // Extract existing params

  filters.forEach((filter) => {
    const { filterHeader, values } = filter;

    if (values && values.length > 0) {
      /*
      const paramValue = encodeURIComponent(values.join(",")); // Encode entire value string
      */

      const paramValue = values.join(","); // Encode entire value string

      queryParams.set(filterHeader, paramValue); // Set (overwrite) instead of append
    }
  });

  urlObject.search = queryParams.toString();

  return urlObject.toString();
}

export { generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL, buildFiltersUrlQueryParams };
