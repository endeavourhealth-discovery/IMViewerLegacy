// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";

export function isValueSet(conceptTypeElements: any) {
  return conceptTypeElements?.some(
    (e: any) =>
      e["@id"] === IM.SET ||
      e["@id"] === IM.QUERY_SET ||
      e["@id"] === IM.VALUE_SET
  );
}

export function isRecordModel(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return (
      e["@id"] === OWL.OBJECT_PROPERTY ||
      e["@id"] === IM.DATA_PROPERTY ||
      e["@id"] === IM.RECORD_TYPE
    );
  });
}

export function isFolder(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e["@id"] === IM.FOLDER;
  });
}

export function getIconFromType(conceptTypes: any) {
  if (isRecordModel(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-sitemap";
  }

  if (isValueSet(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-tasks";
  }

  if (isFolder(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-folder";
  }

  return "fas fa-fw fa-lightbulb";
}
