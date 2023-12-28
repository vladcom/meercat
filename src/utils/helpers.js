export const addParamsToUrl = (urlPath, params = {}) => {
  let paramCurrentCount = 1;
  let url = urlPath;

  const keys = Object.keys(params).filter(
    (key) => (typeof params[key] === 'object' && params[key].length > 0)
      || (typeof params[key] === 'string' && params[key] !== '')
      || (typeof params[key] === 'number' && params[key] > 0)
  );

  keys.forEach((key) => {
    if (paramCurrentCount === 1) {
      url += '?';
    }

    url += `${key}=${encodeURIComponent(params[key])}`;

    if (paramCurrentCount !== Object.keys(keys).length) {
      url += '&';
    }

    paramCurrentCount += 1;
  });

  return url;
};
