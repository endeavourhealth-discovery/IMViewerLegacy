import { Concept } from '../models/objectmodel/Concept';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ObjectPropertyValue } from '../models/objectmodel/ObjectPropertyValue';
import { ConceptService } from './concept.service';
import { LoggerService } from './logger.service';
import { Subject, Observable } from 'rxjs';
import {ObjectModelVisitor} from '../models/ObjectModelVisitor';
import {ValueSetConcept} from '../models/objectmodel/ValueSetConcept';

export class ValueSet {
    concept: ConceptReference;
    included: ConceptReference[];
    excluded: ConceptReference[];

    get iri():string {
      return this.concept.iri;
    }
}

export class ValueSetService {

    constructor(private conceptService: ConceptService, public readonly valueSetIri: string,  private log: LoggerService) {}

    public isValueSet(concept: Concept): Observable<boolean> {
      let isValueSetObservable: Subject<boolean> = new Subject();

      this.conceptService.isA(concept.iri, this.valueSetIri).subscribe(
        isValueSet => {
            isValueSetObservable.next(isValueSet);
        }
      );

      return isValueSetObservable;
    }

    public toValueSet(concept: Concept): ValueSet {
      const result = {
        iri: concept.iri,
        concept: {iri: concept.iri, name: concept.name},
        included: [],
        excluded: []
      } as ValueSet;

      let members: Set<ClassExpression> = (concept as ValueSetConcept).Member;
      if (members) {
        members.forEach(m => {
          if (m.Exclude)
            result.excluded.push(m.Class)
          else
            result.included.push(m.Class);
        });
      }

      return result;
    }
}
