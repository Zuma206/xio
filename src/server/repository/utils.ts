export async function first<T>(arrayPromise: Promise<T[]>) {
  const array = await arrayPromise;
  return array.length > 0 ? array[0] : null;
}
