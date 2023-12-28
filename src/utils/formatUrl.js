import { isNull } from './isNull';

export const formatUrl = (str) => {
  if (!isNull(str)) {
    let formattedUrl = '';
    if (!str.includes('http')) {
      formattedUrl += 'https://'.concat(str);
    }
    if (str.includes('http')) {
      formattedUrl += str;
    }
    return formattedUrl;
  }

  return '';
};
