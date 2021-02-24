import { ConceptReference } from './ConceptReference';
import { ConceptStatus } from './ConceptStatus';
import { ConceptType } from './ConceptType';

export class ConceptDto {
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: ConceptReference;
  status: ConceptStatus;
  version: number;
  conceptType: ConceptType;
  definitionText: string;

  static getConceptForm() {
    return {
      iri: '',
      name: '',
      description: '',
      code: '',
      scheme: '',
      status: '',
      version: 0,
      conceptType: '',
      definitionText: '',
    } as unknown as ConceptDto;
  }
}
