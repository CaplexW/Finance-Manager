export default function paginate(items, pageNumber, pageSize) {
  const firstUser = pageSize * (pageNumber - 1);
  return [...items].splice(firstUser, pageSize);
}
