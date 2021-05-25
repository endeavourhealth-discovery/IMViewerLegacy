// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";

export function isValueSet(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some(
    (e: any) =>
      e[IM.IRI] === IM.SET ||
      e[IM.IRI] === IM.QUERY_SET ||
      e[IM.IRI] === IM.VALUE_SET
  );
}

export function isRecordModel(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some((e: any) => {
    return (
      e[IM.IRI] === OWL.OBJECT_PROPERTY ||
      e[IM.IRI] === IM.DATA_PROPERTY ||
      e[IM.IRI] === IM.RECORD_TYPE
    );
  });
}

export function isFolder(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === IM.FOLDER;
  });
}

export function getIconFromType(conceptTypes: any): string {
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

const palette = require("../../node_modules/google-palette");
export function getColourFromType(conceptTypes: any): string {
  const bgs = palette("tol-rainbow", 4);
  const bgsFixed = bgs.map((color: string) => "#" + color);

  if (isRecordModel(conceptTypes?.elements || conceptTypes))
    return bgsFixed[0];

  if (isValueSet(conceptTypes?.elements || conceptTypes))
    return bgsFixed[3];

  if (isFolder(conceptTypes?.elements || conceptTypes))
    return bgsFixed[1];

  return bgsFixed[2];
}
