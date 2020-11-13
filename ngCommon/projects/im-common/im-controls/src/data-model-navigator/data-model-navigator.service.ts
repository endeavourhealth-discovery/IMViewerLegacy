import {Observable} from 'rxjs';
import {Clazz} from '../models/objectmodel/Clazz';
import {Related} from '../models/old/Related';
import {Property} from '../models/old/Property';
import {PagedResultSet} from '../models/old/PagedResultSet';

export abstract class DataModelNavigatorService {
    abstract getConcept(iri: string): Observable<Clazz>;
    abstract getDefinition(iri: string): Observable<Related[]>;
    abstract getProperties(iri: string, inherited: boolean): Observable<Property[]>;
    abstract getSources(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
    abstract getTargets(iri: string, relationships: string[], limit: number, page: number): Observable<PagedResultSet<Related>>;
}
