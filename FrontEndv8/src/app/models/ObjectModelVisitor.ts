import {Concept} from './objectmodel/Concept';
import {ClassExpression} from './objectmodel/ClassExpression';
import {ConceptReference} from './objectmodel/ConceptReference';
import {ObjectPropertyValue} from './objectmodel/ObjectPropertyValue';
import {DataPropertyValue} from './objectmodel/DataPropertyValue';
import {Annotation} from './objectmodel/Annotation';

export class ObjectModelVisitor {
  public SubClassVisitor: (expressions: Set<ClassExpression>) => void = () => {};
  public EquivalentToVisitor: (expressions: Set<ClassExpression>) => void = () => {};
  public DisjointWithVisitor: (conceptReferences: ConceptReference[]) => void = () => {};

  public ExpressionVisitor: (expression: ClassExpression) => void = () => {};
  public ClassVisitor: (conceptReference: ConceptReference) => void = () => {};
  public IntersectionVisitor: (expressions: ClassExpression[]) => void = () => {};
  public UnionVisitor: (expressions: ClassExpression[]) => void = () => {};
  public ComplementOfVisitor: (expression: ClassExpression) => void = () => {};
  public ObjectPropertyValueVisitor: (objectPropertyValue: ObjectPropertyValue) => void = () => {};
  public DataPropertyValueVisitor: (dataPropertyValue: DataPropertyValue) => void = () => {};
  public ObjectOneOfVisitor: (conceptReferences: ConceptReference[]) => void = () => {};
  public AnnotationsVisitor: (annotations: Set<Annotation>) => void = () => {};

  public visit(concept: Concept) {
    if (concept.annotations)
      this.visitAnnotations(concept.annotations);

    if (concept.SubClassOf) {
      this.SubClassVisitor(concept.SubClassOf);
      concept.SubClassOf.forEach(e => this.visitExpression(e));
    }

    if (concept.EquivalentTo) {
      this.EquivalentToVisitor(concept.EquivalentTo);
      concept.EquivalentTo.forEach(e => this.visitExpression(e));
    }

    if (concept.Expression)
      this.visitExpression(concept.Expression);

    if (concept.DisjointWith)
      this.DisjointWithVisitor(concept.DisjointWith);
  }

  private visitExpression(expression: ClassExpression) {
    this.ExpressionVisitor(expression);

    if (expression.Class)
      this.ClassVisitor(expression.Class);

    if (expression.Intersection) {
      this.IntersectionVisitor(expression.Intersection);
      expression.Intersection.forEach(e => this.visitExpression(e));
    }

    if (expression.Union) {
      this.UnionVisitor(expression.Union);
      expression.Union.forEach(e => this.visitExpression(e));
    }

    if (expression.ComplementOf) {
      this.ComplementOfVisitor(expression.ComplementOf);
      this.visitExpression(expression.ComplementOf);
    }

    if (expression.ObjectPropertyValue)
      this.visitObjectPropertyValue(expression.ObjectPropertyValue);

    if (expression.DataPropertyValue)
      this.visitDataPropertyValue(expression.DataPropertyValue);

    if (expression.objectOneOf)
      this.visitObjectOneOf(expression.objectOneOf);

    if (expression.annotations)
      this.visitAnnotations(expression.annotations);
  }

  private visitObjectPropertyValue(objectPropertyValue: ObjectPropertyValue) {
    this.ObjectPropertyValueVisitor(objectPropertyValue);

    if (objectPropertyValue.Expression)
      this.visitExpression(objectPropertyValue.Expression);
  }

  private visitDataPropertyValue(dataPropertyValue: DataPropertyValue) {
    this.DataPropertyValueVisitor(dataPropertyValue);
  }

  private visitObjectOneOf(objectOneOf: Array<ConceptReference>) {
    this.ObjectOneOfVisitor(objectOneOf);
  }

  private visitAnnotations(annotations: Set<Annotation>) {
    this.AnnotationsVisitor(annotations);
  }
}
