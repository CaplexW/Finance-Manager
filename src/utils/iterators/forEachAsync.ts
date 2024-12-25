export default async function forEachAsync<T>(
  array: T[],
  callback: (
    item: T,
    index: number,
    array: T[]
  ) => Promise<void>
) {
  await Promise.all(array.map((item, index, array) => callback(item, index, array)));
}
