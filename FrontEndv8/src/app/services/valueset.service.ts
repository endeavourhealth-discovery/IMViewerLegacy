import { Concept } from '../models/objectmodel/Concept';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
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
      let valueSetMemberParser: ValueSetMemberParser = new ValueSetMemberParser();

      objectModelVistor.MembersVisitor = ()  => { valueSetMemberParser.onEnterMembers(); }
      objectModelVistor.MembersExitVisitor = ()  => { valueSetMemberParser.onExitMembers(); }

      objectModelVistor.ComplementOfVisitor = () => { valueSetMemberParser.onEnterComplementOf(); }
      objectModelVistor.ComplementOfExitVisitor = () => { valueSetMemberParser.onExitComplementOf(); }

      objectModelVistor.ClassVisitor = (conceptReference: ConceptReference) => { valueSetMemberParser.onClass(conceptReference); }

      objectModelVistor.visit(concept);

      return {
        iri: concept.iri,
        concept: {iri: concept.iri, name: concept.name},
        included: valueSetMemberParser.included.sort((a, b) => a.name ? a.name.localeCompare(b.name) : 1),
        excluded: valueSetMemberParser.excluded.sort((a, b) => a.name ? a.name.localeCompare(b.name) : 1)
      }
    }
}


class ValueSetMemberParser {

  public included: ConceptReference[] = [];
  public excluded: ConceptReference[] = [];

  private members: boolean = false;
  private complementOfHistory: boolean[] = [];
  private complementOf: boolean = false;

  public onEnterMembers(): void {
    this.members = true;
  }

  public onExitMembers(): void {
    this.members = false;
  }

  public onEnterComplementOf(): void {
    if (this.members) {
      // add the current complementOf state to the history incase
      // we need to process further Class definitions at that level
      this.complementOfHistory.push(this.complementOf);

      // we have now entered a new level with it's own complementOf
      // which is set to the opposite of the previous level
      this.complementOf = !this.complementOf
    }
  }

  public onExitComplementOf(): void {
    if (this.members) {
      // we've now moved back up a level in the hasMembers defintion
      // therefore the previous complementOf setting applies
      this.complementOf = this.complementOfHistory.pop();
    }
  }

  public onClass(conceptReference: ConceptReference): void {
    if(this.members) {
      (this.complementOf) ? (this.excluded.push(conceptReference)) : (this.included.push(conceptReference));
    }
  }

}
