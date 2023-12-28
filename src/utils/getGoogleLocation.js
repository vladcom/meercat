const IOptions = {
  considerIp: true
};

export const getGoogleLocation = (
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
