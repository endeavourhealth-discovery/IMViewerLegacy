import { Namespace } from './Namespace';
import { DocumentInfo } from './DocumentInfo';
import { Concept } from './Concept';
import { Individual } from './Individual';
export class Ontology {
  iri: string;
  module: string;
  imports: Set<string>;
  namespace: Set<Namespace>;
  documentInfo: DocumentInfo;
  concept: Set<Concept>;
  individual: Set<Individual>;
}
