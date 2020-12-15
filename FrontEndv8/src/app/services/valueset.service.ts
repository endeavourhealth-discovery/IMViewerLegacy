import { Concept } from '../models/objectmodel/Concept';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ConceptType } from '../models/objectmodel/ConceptType';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ConceptService } from './concept.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class ValueSet {
    members: ConceptReference[];
    nonMembers: ConceptReference[];

    constructor() {
        this.members = [];
        this.nonMembers = [];
    }

    public isEmpty() {
      return this.members.length == 0 && this.nonMembers.length == 0;
    }
}

@Injectable()
export class ValueSetService {

    private valueSetConceptReference: ConceptReference;

    constructor(private conceptService: ConceptService, public readonly valueSetIri: string,  private log: LoggerService) {
      this.valueSetConceptReference = new ConceptReference();
      this.valueSetConceptReference.iri = this.valueSetIri;
    }

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
        let valueSet: ValueSet;
        
        if (ConceptType.Class === concept.conceptType) {
            valueSet = this.processSubClass(concept);
        }
        else {
            this.log.error(`Concept's (iri: ${concept.iri}) type invalid. Expecting ${ConceptType.Class.valueOf}. Actual ${concept.conceptType}`);
        }

        return valueSet;
    }

    private processSubClass(concept: Concept): ValueSet {
        let valueSet: ValueSet = new ValueSet();
        
        if(concept.SubClassOf != null && Array.isArray(concept.SubClassOf)) {
          concept.SubClassOf.forEach(subClassOf => {
            subClassOf.Intersection.forEach(intersection => {
              this.processIntersection(intersection, valueSet);
            });
          });
        }
        else {
          this.log.debug(`warn - unable to process concept (iri: ${concept.iri}) as it has not SubClassOf data.`)
        }

        return valueSet;
      }    
  
    private processIntersection(intersection: ClassExpression, valueSet: ValueSet): void {
      if(intersection != null) {
        let objectPropertyValue = intersection.ObjectPropertyValue;
  
        if(objectPropertyValue != null && this.hasMembers(objectPropertyValue.Property)) {
          let isMember = true;
          let expression = objectPropertyValue.Expression;
  
          if(expression != null) {
            this.processHasMembersExpression(expression, isMember, valueSet);
          }
          else {
            this.classifyMember(objectPropertyValue.ValueType, isMember, valueSet);
          }
        }
        else {
          this.log.info(`info - intersection (iri: ${intersection.Class.iri}) has no members.`);
        }
      }
    }
  
    // TODO - remove hardcoding - can the IRI be config?
    private hasMembers(property: ConceptReference): boolean {
      return ":hasMembers" == property.iri;
    }
  
    private processHasMembersExpression(membersExpression: ClassExpression, definesMembers: boolean, valueSet: ValueSet): void {
      if(membersExpression != null) {
        // check if it's a union, intersection or a complement
        if(membersExpression.Union != null && membersExpression.Union.length > 0) {
          membersExpression.Union.forEach(classExpression => {
            this.processHasMembersExpression(classExpression, definesMembers, valueSet);
          });
        }
        else if(membersExpression.Intersection != null && membersExpression.Intersection.length > 0) {
          membersExpression.Intersection.forEach(classExpression => {
            this.processHasMembersExpression(classExpression, definesMembers, valueSet);
          });
        }
        else if(membersExpression.ComplementOf != null) {
          // will prob be a Union inside
          // assume everything under here is to be excluded
          this.processHasMembersExpression(membersExpression.ComplementOf, !definesMembers, valueSet)
        }
        else {
          this.classifyMember(membersExpression.Class, definesMembers, valueSet);
        }
      }
    }
  
    private classifyMember(conceptReference: ConceptReference, isMember: boolean, valueSet: ValueSet): void {
      if(isMember) {
        valueSet.members.push(conceptReference);
      }
      else {
        valueSet.nonMembers.push(conceptReference);
      }
    }
}