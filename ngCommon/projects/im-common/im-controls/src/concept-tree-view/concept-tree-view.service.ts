import {Observable} from 'rxjs';
import {Clazz} from '../models/objectmodel/Clazz';
import {Related} from '../models/old/Related';
import {PagedResultSet} from '../models/old/PagedResultSet';

export abstract class ConceptTreeViewService {
    abstract getConcept(iri: string): Observable<Clazz>;
    abstract loadTree(root: string, iri: string, relationships: string[]): Observable<Related[]>;
    abstract getSources(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
}
