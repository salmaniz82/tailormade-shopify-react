const API_BASE_URL = "https://tailormade.webential.live/";

function generateNumberArray(size) {
  return Array.from({ length: size }, (_, index) => index + 1);
}

function urlHaskey(url, key) {
  const urlObject = new URL(url);
  const queryParams = new URLSearchParams(urlObject.search);

  if (queryParams.has(key)) {
    return queryParams.get(key);
  }
  false;
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

function getUrlParamValueByKey(url, key) {
  const urlObject = new urlObject(url);
  const queryParams = new URLSearchParams(urlObject.search);
  return queryParams.get(key);
}

function clearAllQueryParams(url) {
  const urlObject = new URL(url);
  urlObject.search = "";
  return urlObject.toString();
}

function buildFiltersUrlQueryParams(url, filters) {
  const urlObject = new URL(url);
  const queryParams = new URLSearchParams(urlObject.search);

  filters.forEach((filter) => {
    const { filterHeader, values } = filter;

    if (values && values.length > 0) {
      const paramValue = values.join(",");
      queryParams.set(filterHeader, paramValue);
    }
  });

  urlObject.search = queryParams.toString();
  return urlObject.toString();
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export { validateEmail, generateNumberArray, updateQueryStringParameter, clearAllQueryParams, API_BASE_URL, buildFiltersUrlQueryParams, getUrlParamValueByKey, urlHaskey };
