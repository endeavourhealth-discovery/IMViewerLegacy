// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";

export function isValueSet(conceptTypeElements: any) {
  return conceptTypeElements?.some(
    (e: any) =>
      e[IM.IRI] === IM.SET ||
      e[IM.IRI] === IM.QUERY_SET ||
      e[IM.IRI] === IM.VALUE_SET
  );
}

export function isRecordModel(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return (
      e[IM.IRI] === OWL.OBJECT_PROPERTY ||
      e[IM.IRI] === IM.DATA_PROPERTY ||
      e[IM.IRI] === IM.RECORD_TYPE
    );
  });
}

export function isFolder(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === IM.FOLDER;
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
