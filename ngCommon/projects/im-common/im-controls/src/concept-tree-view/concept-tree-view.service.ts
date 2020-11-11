import {Observable} from 'rxjs';
import {Concept} from '../models/objectmodel/Concept';
import {Related} from '../models/old/Related';
import {PagedResultSet} from '../models/old/PagedResultSet';

export abstract class ConceptTreeViewService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract loadTree(root: string, iri: string, relationships: string[]): Observable<Related[]>;
    abstract getSources(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
}
