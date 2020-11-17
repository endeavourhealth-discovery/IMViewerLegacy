import {Observable} from 'rxjs';
import {Concept} from '../models/objectmodel/Concept';
import { ConceptReferenceNode } from '../models/objectmodel/ConceptReferenceNode';
import { ConceptReference } from '../models/objectmodel/ConceptReference';

export abstract class ConceptTreeViewService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract getConceptChildren(iri: string): Observable<Set<ConceptReferenceNode>>;
    abstract getConceptParents(iri: string): Observable<Set<ConceptReference>>;
}
