import {Observable} from 'rxjs';
import {Concept} from '../../models/objectmodel/Concept';
import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';

export abstract class ConceptTreeViewService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract getConceptChildren(iri: string): Observable<Array<ConceptReferenceNode>>;
    abstract getConceptParents(iri: string): Observable<Array<ConceptReferenceNode>>;
}
