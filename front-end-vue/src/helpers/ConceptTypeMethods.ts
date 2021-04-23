// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import {IM} from '@/vocabulary/IM';
import {OWL} from '@/vocabulary/OWL';

export function isValueSet(conceptTypeElements: any) {
  return conceptTypeElements?.some(
    (e: any) =>
      e.iri === IM.SET || e.iri === IM.QUERY_SET || e.iri === IM.VALUE_SET
  );
}

export function isRecordModel(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e.iri === OWL.OBJECT_PROPERTY || e.iri === IM.DATA_PROPERTY || e.iri === IM.RECORD_TYPE;
  });
}

export function isFolder(conceptTypeElements: any) {
  return conceptTypeElements?.some((e: any) => {
    return e.iri === IM.FOLDER;
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
