const IOptions = {
  maximumAge: 0,
  maximumWait: 10000,
  timeout: 1000,
  enableHighAccuracy: true,
  desiredAccuracy: 30,
  fallbackToIP: true,
  addressLookup: true
};

export const getGeolocation = (
  options = IOptions
) => new Promise((resolve, reject) => {
  const geolocationProvider = typeof navigator !== 'undefined' && navigator.geolocation;

  if (!geolocationProvider || !geolocationProvider.getCurrentPosition) {
    reject(new Error('The provided geolocation provider is invalid'));
  }

  geolocationProvider.getCurrentPosition(
    (position) => resolve(position),
    (error) => reject(error),
    options
  );
});
