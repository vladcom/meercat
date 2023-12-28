export const camelToSnake = (str: string) => {
  return str.replace(/[A-Z]/g, (symbol) => `_${symbol.toLowerCase()}`);
}
