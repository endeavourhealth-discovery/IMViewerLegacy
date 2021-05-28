// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";

export function isValueSet(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some(
    (e: any) =>
      e.iri === IM.SET ||
      e.iri === IM.QUERY_SET ||
      e.iri === IM.VALUE_SET ||
      e[IM.IRI] === IM.SET ||
      e[IM.IRI] === IM.QUERY_SET ||
      e[IM.IRI] === IM.VALUE_SET
  );
}

export function isRecordModel(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e.iri === IM.RECORD_TYPE || e[IM.IRI] === IM.RECORD_TYPE;
  });
}

export function isProperty(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === OWL.OBJECT_PROPERTY || e[IM.IRI] === IM.DATA_PROPERTY;
  });
}

export function isFolder(conceptTypeElements: any): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === IM.FOLDER || e.iri === IM.FOLDER;
  });
}

export function getIconFromType(conceptTypes: any): string {
  if (isRecordModel(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-project-diagram";
  }

  if (isProperty(conceptTypes?.elements || conceptTypes)) {
    return "far fa-fw fa-edit";
  }

  if (isValueSet(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-tasks";
  }

  if (isFolder(conceptTypes?.elements || conceptTypes)) {
    return "fas fa-fw fa-folder";
  }

  return "far fa-fw fa-lightbulb";
}

const palette = require("../../node_modules/google-palette");
export function getColourFromType(conceptTypes: any): string {
  const bgs = palette("tol-rainbow", 5);
  const bgsFixed = bgs.map((color: string) => "#" + color + "88");

  if (isRecordModel(conceptTypes?.elements || conceptTypes)) {
    return bgsFixed[0];
  }

  if (isProperty(conceptTypes?.elements || conceptTypes)) {
    return bgsFixed[4];
  }

  if (isValueSet(conceptTypes?.elements || conceptTypes)) {
    return bgsFixed[2];
  }

  if (isFolder(conceptTypes?.elements || conceptTypes)) {
    return bgsFixed[1];
  }

  return bgsFixed[3];
}
