export const sortByCreatedAt = (objects: any[]) => {
  return objects.slice().sort((a, b) => {
    return a.createdAt - b.createdAt;
  });
}
