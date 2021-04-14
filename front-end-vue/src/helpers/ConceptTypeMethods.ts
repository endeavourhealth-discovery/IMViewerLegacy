// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

export function isValueSet(conceptTypeElements: any) {
  return conceptTypeElements?.some(
    (e: any) =>
      e.name === "Set" || e.name === "Query set" || e.name === "Value set"
  );
}

export function isClass(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e.name === "Class" || e.name === "Record type";
  });
}

export function isFolder(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e.name === "Folder";
  });
}

export function getIconFromType(conceptTypes: any) {
  if (isClass(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-sitemap";
  }

  if (isValueSet(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-tasks";
  }

  if (isFolder(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-folder";
  }

  return "fas fa-lightbulb";
}
