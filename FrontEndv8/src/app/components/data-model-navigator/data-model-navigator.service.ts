import {Observable} from 'rxjs';
import {Concept} from '../../models/objectmodel/Concept';
import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';

export abstract class DataModelNavigatorService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract getConceptChildren(iri: string): Observable<Array<ConceptReferenceNode>>;
    abstract getConceptParentHierarchy(iri: string): Observable<Array<ConceptReferenceNode>>;
}
