export type PickRename<T, K extends keyof T, R extends PropertyKey> = {
  [P in keyof T as P extends K ? R : P]: T[P];
}; // type instantiation same as previous example
