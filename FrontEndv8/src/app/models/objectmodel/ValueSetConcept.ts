import {Concept} from './Concept';
import {ClassExpression} from './ClassExpression';

export class ValueSetConcept extends Concept {
  Member: Set<ClassExpression>;
  memberExpansion: Set<Concept>;
}
