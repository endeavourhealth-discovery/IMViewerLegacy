import {Observable} from 'rxjs';
import {Concept} from '../models/Concept';
import {Related} from '../models/Related';
import {PagedResultSet} from '../models/PagedResultSet';

export abstract class ConceptTreeViewService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract loadTree(root: string, iri: string, relationships: string[]): Observable<Related[]>;
    abstract getSources(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
}
