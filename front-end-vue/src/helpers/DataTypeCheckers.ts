export function isArrayHasLength(array: any[]): boolean {
  if (Array.isArray(array) && array.length) {
    return true
  } else {
    return false
  }
}

export function isObjectHasKeys(object: any, keys?: string[]) {
  let result = true;
  if (!keys) {
    if (!(Object.prototype.toString.call(object) === "[object Object]")) result = false;
    if (!Object.keys(object).length) result = false;
  } else {
    if (!(Object.prototype.toString.call(object) === "[object Object]")) result = false;
    const objectKeys = Object.keys(object);
    keys.forEach(key => {
      if (!objectKeys.includes(key)) result = false;
    });
  }

  return result;
}
