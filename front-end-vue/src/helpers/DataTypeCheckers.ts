export function isArrayHasLength(array: unknown): boolean {
  if (Array.isArray(array) && array.length) {
    return true;
  } else {
    return false;
  }
}

export function isObjectHasKeys(object: any, keys: string[]): boolean {
  let result = true;
  if (!(Object.prototype.toString.call(object) === "[object Object]")) result = false;
  const objectKeys = Object.keys(object);
  keys.forEach(key => {
    if (!objectKeys.includes(key)) result = false;
  });
  return result;
}

export function isObject(object: any): boolean {
  let result = true;
  if (!(Object.prototype.toString.call(object) === "[object Object]")) result = false;
  if (!Object.keys(object).length) result = false;
  return result;
}
