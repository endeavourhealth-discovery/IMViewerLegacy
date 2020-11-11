import {Observable} from 'rxjs';
import {Concept} from '../models/objectmodel/Concept';
import {Related} from '../models/old/Related';
import {Property} from '../models/old/Property';
import {PagedResultSet} from '../models/old/PagedResultSet';

export abstract class DataModelNavigatorService {
    abstract getConcept(iri: string): Observable<Concept>;
    abstract getDefinition(iri: string): Observable<Related[]>;
    abstract getProperties(iri: string, inherited: boolean): Observable<Property[]>;
    abstract getSources(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
    abstract getTargets(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
}
