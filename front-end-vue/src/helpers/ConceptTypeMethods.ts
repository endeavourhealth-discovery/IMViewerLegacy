// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

export function isValueSet(conceptTypeElements: any) {
  return conceptTypeElements.some(
    (e: any) =>
      e.name === "Set" || e.name === "Query set" || e.name === "Value set"
  );
}

function isClass(conceptTypeElements: any) {
  return conceptTypeElements.some((e: any) => {
    return e.name === "Class" || e.name === "Record type";
  });
}

function isFolder(conceptTypeElements: any) {
  return conceptTypeElements.some((e: any) => {
    return e.name === "Folder";
  });
}

export function getConceptIcon(conceptTypeElements: any) {
  if (isValueSet(conceptTypeElements)) {
    return { name: "Valueset", icon: "tasks" };
  }

  if (isClass(conceptTypeElements)) {
    return { name: "Datamodel", icon: "sitemap" };
  }

  if (isFolder(conceptTypeElements)) {
    return { name: "Folder", icon: "sitemap" };
  }

  return { name: "Ontology", icon: "lightbulb" };
}
