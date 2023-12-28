function stripDiacritics(string) {
  return typeof string.normalize !== 'undefined' ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : string;
}

export const createFilterOptionsV2 = (config) => {
  const {
    limit,
    stringify,
    ignoreCase: configIgnoreCase,
    ignoreAccents: configIgnoreAccents
  } = config;

  const ignoreCase = configIgnoreCase === void 0 ? true : configIgnoreCase;
  const ignoreAccents = configIgnoreAccents === void 0 ? true : configIgnoreAccents;

  return (options, ref) => {
    const { getOptionLabel } = ref;

    const filteredOptions = options.filter((option) => {
      let candidate = (stringify || getOptionLabel)(option);

      if (ignoreCase) {
        candidate = candidate.toLowerCase();
      }

      if (ignoreAccents) {
        candidate = stripDiacritics(candidate);
      }

      return candidate;
    });
    return typeof limit === 'number' ? filteredOptions.slice(0, limit) : filteredOptions;
  };
};
