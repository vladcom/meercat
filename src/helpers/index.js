export * from './wssApi';
export const getLocalItem = (key) => localStorage.getItem(key);

export const setLocalItem = (key, value) => localStorage.setItem(key, value);

export const getSessionItem = (key) => sessionStorage.getItem(key);

export const setSessionItem = (key, value) => sessionStorage.setItem(key, value);
