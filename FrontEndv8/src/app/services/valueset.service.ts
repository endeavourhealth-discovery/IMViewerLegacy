import { Concept } from '../models/objectmodel/Concept';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ObjectPropertyValue } from '../models/objectmodel/ObjectPropertyValue';
import { ConceptService } from './concept.service';
import { LoggerService } from './logger.service';
import { Subject, Observable } from 'rxjs';
import {ObjectModelVisitor} from '../models/ObjectModelVisitor';

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
      let objectModelVistor: ObjectModelVisitor = new ObjectModelVisitor();
      let hasMemberParser: HasMembersParser = new HasMembersParser();

      objectModelVistor.ExpressionVisitor = (expression: ClassExpression) => { hasMemberParser.onEnterExpression(expression); }
      objectModelVistor.ExpressionExitVisitor = (expression: ClassExpression) => { hasMemberParser.onExitExpression(expression); }
      objectModelVistor.ObjectPropertyValueVisitor = (objectPropertyValue: ObjectPropertyValue)  => { hasMemberParser.onEnterObjectPropertyValue(objectPropertyValue); }
      objectModelVistor.ObjectPropertyValueExitVisitor = (objectPropertyValue: ObjectPropertyValue)  => { hasMemberParser.onExitObjectPropertyValue(objectPropertyValue); }
      objectModelVistor.ClassVisitor = (conceptReference: ConceptReference) => { hasMemberParser.onClass(conceptReference); }

      objectModelVistor.visit(concept);

      return {
        iri: concept.iri,
        concept: {iri: concept.iri, name: concept.name},
        included: hasMemberParser.included,
        excluded: hasMemberParser.excluded
      }
    }
}

class HasMembersParser {

  public included: ConceptReference[] = [];
  public excluded: ConceptReference[] = [];

  private hasMembersProperty: ObjectPropertyValue;
  private complementOfHistory: boolean[] = [];
  private completementOf: boolean = false;

  public onEnterObjectPropertyValue(property: ObjectPropertyValue): void {
    if(":hasMembers" == property.Property.iri) {
      if(this.hasMembersProperty == null) {
        this.hasMembersProperty = property;
      }
      else {
        // TODO error time - nested hasMember within outer hasMember - illegal syntax
      }
    }
  }

  public onExitObjectPropertyValue(property: ObjectPropertyValue): void {
    if(this.hasMembersProperty && this.hasMembersProperty == property) {
      this.hasMembersProperty = null;
    }
  }

  public onEnterExpression(expression: ClassExpression): void {
    if (this.hasMembersProperty && expression.ComplementOf) {
      this.onEnterComplementOf(expression.ComplementOf);
    }
  }

  public onExitExpression(expression: ClassExpression): void {
    if (this.hasMembersProperty && expression.ComplementOf) {
      this.onExitComplementOf(expression.ComplementOf)
    }
  }

  public onClass(conceptReference: ConceptReference): void {
    if(this.hasMembersProperty) {
      (this.completementOf) ? (this.excluded.push(conceptReference)) : (this.included.push(conceptReference));
    }
  }

  private onEnterComplementOf(expression: ClassExpression): void {
    // add the current complementOf state to the history incase
    // we need to process further Class definitions at that level
    this.complementOfHistory.push(this.completementOf);

    // we have now entered a new level with it's own complementOf
    // which is set to the opposite of the previous level
    this.completementOf = !this.completementOf

  }

  private onExitComplementOf(expression: ClassExpression): void {
    // we've now moved back up a level in the hasMembers defintion
    // therefore the previous complementOf setting applies
    this.completementOf = this.complementOfHistory.pop();
  }
}
