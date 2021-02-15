// Generated from ./src/app/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.6-SNAPSHOT


import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { ConceptContext } from './DiscoverySyntaxParser';
import { ClassAxiomContext } from './DiscoverySyntaxParser';
import { PropertyAxiomContext } from './DiscoverySyntaxParser';
import { TypeContext } from './DiscoverySyntaxParser';
import { ClassTypeContext } from './DiscoverySyntaxParser';
import { DataTypeContext } from './DiscoverySyntaxParser';
import { ShapeContext } from './DiscoverySyntaxParser';
import { RecordTypeContext } from './DiscoverySyntaxParser';
import { ObjectPropertyContext } from './DiscoverySyntaxParser';
import { DataPropertyContext } from './DiscoverySyntaxParser';
import { AnnotationPropertyContext } from './DiscoverySyntaxParser';
import { MembersContext } from './DiscoverySyntaxParser';
import { ExpansionContext } from './DiscoverySyntaxParser';
import { ValueSetContext } from './DiscoverySyntaxParser';
import { ShapeOfContext } from './DiscoverySyntaxParser';
import { PropertyConstraintContext } from './DiscoverySyntaxParser';
import { ConstraintParameterContext } from './DiscoverySyntaxParser';
import { MinCountContext } from './DiscoverySyntaxParser';
import { MaxCountContext } from './DiscoverySyntaxParser';
import { MinInclusiveContext } from './DiscoverySyntaxParser';
import { MaxInclusiveContext } from './DiscoverySyntaxParser';
import { MinExclusiveContext } from './DiscoverySyntaxParser';
import { MaxExclusiveContext } from './DiscoverySyntaxParser';
import { ClassValueContext } from './DiscoverySyntaxParser';
import { LabelContext } from './DiscoverySyntaxParser';
import { StatusContext } from './DiscoverySyntaxParser';
import { VersionContext } from './DiscoverySyntaxParser';
import { IdentifierIriContext } from './DiscoverySyntaxParser';
import { NameContext } from './DiscoverySyntaxParser';
import { DescriptionContext } from './DiscoverySyntaxParser';
import { CodeContext } from './DiscoverySyntaxParser';
import { SchemeContext } from './DiscoverySyntaxParser';
import { SubclassOfContext } from './DiscoverySyntaxParser';
import { EquivalentToContext } from './DiscoverySyntaxParser';
import { DisjointWithContext } from './DiscoverySyntaxParser';
import { SubpropertyOfContext } from './DiscoverySyntaxParser';
import { InverseOfContext } from './DiscoverySyntaxParser';
import { ClassExpressionContext } from './DiscoverySyntaxParser';
import { IriContext } from './DiscoverySyntaxParser';
import { RoleGroupContext } from './DiscoverySyntaxParser';
import { RoleContext } from './DiscoverySyntaxParser';
import { DataRangeContext } from './DiscoverySyntaxParser';
import { RangeValueContext } from './DiscoverySyntaxParser';
import { TypedStringContext } from './DiscoverySyntaxParser';
import { ValueCollectionContext } from './DiscoverySyntaxParser';
import { DataRangeCollectionContext } from './DiscoverySyntaxParser';


/**
 * This interface defines a complete listener for a parse tree produced by
 * `DiscoverySyntaxParser`.
 */
export interface DiscoverySyntaxListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.concept`.
	 * @param ctx the parse tree
	 */
	enterConcept?: (ctx: ConceptContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.concept`.
	 * @param ctx the parse tree
	 */
	exitConcept?: (ctx: ConceptContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classAxiom`.
	 * @param ctx the parse tree
	 */
	enterClassAxiom?: (ctx: ClassAxiomContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classAxiom`.
	 * @param ctx the parse tree
	 */
	exitClassAxiom?: (ctx: ClassAxiomContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.propertyAxiom`.
	 * @param ctx the parse tree
	 */
	enterPropertyAxiom?: (ctx: PropertyAxiomContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.propertyAxiom`.
	 * @param ctx the parse tree
	 */
	exitPropertyAxiom?: (ctx: PropertyAxiomContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.type`.
	 * @param ctx the parse tree
	 */
	enterType?: (ctx: TypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.type`.
	 * @param ctx the parse tree
	 */
	exitType?: (ctx: TypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classType`.
	 * @param ctx the parse tree
	 */
	enterClassType?: (ctx: ClassTypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classType`.
	 * @param ctx the parse tree
	 */
	exitClassType?: (ctx: ClassTypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.dataType`.
	 * @param ctx the parse tree
	 */
	enterDataType?: (ctx: DataTypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.dataType`.
	 * @param ctx the parse tree
	 */
	exitDataType?: (ctx: DataTypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.shape`.
	 * @param ctx the parse tree
	 */
	enterShape?: (ctx: ShapeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.shape`.
	 * @param ctx the parse tree
	 */
	exitShape?: (ctx: ShapeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.recordType`.
	 * @param ctx the parse tree
	 */
	enterRecordType?: (ctx: RecordTypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.recordType`.
	 * @param ctx the parse tree
	 */
	exitRecordType?: (ctx: RecordTypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.objectProperty`.
	 * @param ctx the parse tree
	 */
	enterObjectProperty?: (ctx: ObjectPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.objectProperty`.
	 * @param ctx the parse tree
	 */
	exitObjectProperty?: (ctx: ObjectPropertyContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.dataProperty`.
	 * @param ctx the parse tree
	 */
	enterDataProperty?: (ctx: DataPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.dataProperty`.
	 * @param ctx the parse tree
	 */
	exitDataProperty?: (ctx: DataPropertyContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.annotationProperty`.
	 * @param ctx the parse tree
	 */
	enterAnnotationProperty?: (ctx: AnnotationPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.annotationProperty`.
	 * @param ctx the parse tree
	 */
	exitAnnotationProperty?: (ctx: AnnotationPropertyContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.members`.
	 * @param ctx the parse tree
	 */
	enterMembers?: (ctx: MembersContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.members`.
	 * @param ctx the parse tree
	 */
	exitMembers?: (ctx: MembersContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.expansion`.
	 * @param ctx the parse tree
	 */
	enterExpansion?: (ctx: ExpansionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.expansion`.
	 * @param ctx the parse tree
	 */
	exitExpansion?: (ctx: ExpansionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.valueSet`.
	 * @param ctx the parse tree
	 */
	enterValueSet?: (ctx: ValueSetContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.valueSet`.
	 * @param ctx the parse tree
	 */
	exitValueSet?: (ctx: ValueSetContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.shapeOf`.
	 * @param ctx the parse tree
	 */
	enterShapeOf?: (ctx: ShapeOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.shapeOf`.
	 * @param ctx the parse tree
	 */
	exitShapeOf?: (ctx: ShapeOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.propertyConstraint`.
	 * @param ctx the parse tree
	 */
	enterPropertyConstraint?: (ctx: PropertyConstraintContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.propertyConstraint`.
	 * @param ctx the parse tree
	 */
	exitPropertyConstraint?: (ctx: PropertyConstraintContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.constraintParameter`.
	 * @param ctx the parse tree
	 */
	enterConstraintParameter?: (ctx: ConstraintParameterContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.constraintParameter`.
	 * @param ctx the parse tree
	 */
	exitConstraintParameter?: (ctx: ConstraintParameterContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minCount`.
	 * @param ctx the parse tree
	 */
	enterMinCount?: (ctx: MinCountContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minCount`.
	 * @param ctx the parse tree
	 */
	exitMinCount?: (ctx: MinCountContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxCount`.
	 * @param ctx the parse tree
	 */
	enterMaxCount?: (ctx: MaxCountContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxCount`.
	 * @param ctx the parse tree
	 */
	exitMaxCount?: (ctx: MaxCountContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minInclusive`.
	 * @param ctx the parse tree
	 */
	enterMinInclusive?: (ctx: MinInclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minInclusive`.
	 * @param ctx the parse tree
	 */
	exitMinInclusive?: (ctx: MinInclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxInclusive`.
	 * @param ctx the parse tree
	 */
	enterMaxInclusive?: (ctx: MaxInclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxInclusive`.
	 * @param ctx the parse tree
	 */
	exitMaxInclusive?: (ctx: MaxInclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minExclusive`.
	 * @param ctx the parse tree
	 */
	enterMinExclusive?: (ctx: MinExclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minExclusive`.
	 * @param ctx the parse tree
	 */
	exitMinExclusive?: (ctx: MinExclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxExclusive`.
	 * @param ctx the parse tree
	 */
	enterMaxExclusive?: (ctx: MaxExclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxExclusive`.
	 * @param ctx the parse tree
	 */
	exitMaxExclusive?: (ctx: MaxExclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classValue`.
	 * @param ctx the parse tree
	 */
	enterClassValue?: (ctx: ClassValueContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classValue`.
	 * @param ctx the parse tree
	 */
	exitClassValue?: (ctx: ClassValueContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.label`.
	 * @param ctx the parse tree
	 */
	enterLabel?: (ctx: LabelContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.label`.
	 * @param ctx the parse tree
	 */
	exitLabel?: (ctx: LabelContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.status`.
	 * @param ctx the parse tree
	 */
	enterStatus?: (ctx: StatusContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.status`.
	 * @param ctx the parse tree
	 */
	exitStatus?: (ctx: StatusContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.version`.
	 * @param ctx the parse tree
	 */
	enterVersion?: (ctx: VersionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.version`.
	 * @param ctx the parse tree
	 */
	exitVersion?: (ctx: VersionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.identifierIri`.
	 * @param ctx the parse tree
	 */
	enterIdentifierIri?: (ctx: IdentifierIriContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.identifierIri`.
	 * @param ctx the parse tree
	 */
	exitIdentifierIri?: (ctx: IdentifierIriContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.name`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.name`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.description`.
	 * @param ctx the parse tree
	 */
	enterDescription?: (ctx: DescriptionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.description`.
	 * @param ctx the parse tree
	 */
	exitDescription?: (ctx: DescriptionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.code`.
	 * @param ctx the parse tree
	 */
	enterCode?: (ctx: CodeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.code`.
	 * @param ctx the parse tree
	 */
	exitCode?: (ctx: CodeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.scheme`.
	 * @param ctx the parse tree
	 */
	enterScheme?: (ctx: SchemeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.scheme`.
	 * @param ctx the parse tree
	 */
	exitScheme?: (ctx: SchemeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subclassOf`.
	 * @param ctx the parse tree
	 */
	enterSubclassOf?: (ctx: SubclassOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subclassOf`.
	 * @param ctx the parse tree
	 */
	exitSubclassOf?: (ctx: SubclassOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.equivalentTo`.
	 * @param ctx the parse tree
	 */
	enterEquivalentTo?: (ctx: EquivalentToContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.equivalentTo`.
	 * @param ctx the parse tree
	 */
	exitEquivalentTo?: (ctx: EquivalentToContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.disjointWith`.
	 * @param ctx the parse tree
	 */
	enterDisjointWith?: (ctx: DisjointWithContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.disjointWith`.
	 * @param ctx the parse tree
	 */
	exitDisjointWith?: (ctx: DisjointWithContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subpropertyOf`.
	 * @param ctx the parse tree
	 */
	enterSubpropertyOf?: (ctx: SubpropertyOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subpropertyOf`.
	 * @param ctx the parse tree
	 */
	exitSubpropertyOf?: (ctx: SubpropertyOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.inverseOf`.
	 * @param ctx the parse tree
	 */
	enterInverseOf?: (ctx: InverseOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.inverseOf`.
	 * @param ctx the parse tree
	 */
	exitInverseOf?: (ctx: InverseOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classExpression`.
	 * @param ctx the parse tree
	 */
	enterClassExpression?: (ctx: ClassExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classExpression`.
	 * @param ctx the parse tree
	 */
	exitClassExpression?: (ctx: ClassExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.iri`.
	 * @param ctx the parse tree
	 */
	enterIri?: (ctx: IriContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.iri`.
	 * @param ctx the parse tree
	 */
	exitIri?: (ctx: IriContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.roleGroup`.
	 * @param ctx the parse tree
	 */
	enterRoleGroup?: (ctx: RoleGroupContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.roleGroup`.
	 * @param ctx the parse tree
	 */
	exitRoleGroup?: (ctx: RoleGroupContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.role`.
	 * @param ctx the parse tree
	 */
	enterRole?: (ctx: RoleContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.role`.
	 * @param ctx the parse tree
	 */
	exitRole?: (ctx: RoleContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.dataRange`.
	 * @param ctx the parse tree
	 */
	enterDataRange?: (ctx: DataRangeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.dataRange`.
	 * @param ctx the parse tree
	 */
	exitDataRange?: (ctx: DataRangeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.rangeValue`.
	 * @param ctx the parse tree
	 */
	enterRangeValue?: (ctx: RangeValueContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.rangeValue`.
	 * @param ctx the parse tree
	 */
	exitRangeValue?: (ctx: RangeValueContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.typedString`.
	 * @param ctx the parse tree
	 */
	enterTypedString?: (ctx: TypedStringContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.typedString`.
	 * @param ctx the parse tree
	 */
	exitTypedString?: (ctx: TypedStringContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.valueCollection`.
	 * @param ctx the parse tree
	 */
	enterValueCollection?: (ctx: ValueCollectionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.valueCollection`.
	 * @param ctx the parse tree
	 */
	exitValueCollection?: (ctx: ValueCollectionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.dataRangeCollection`.
	 * @param ctx the parse tree
	 */
	enterDataRangeCollection?: (ctx: DataRangeCollectionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.dataRangeCollection`.
	 * @param ctx the parse tree
	 */
	exitDataRangeCollection?: (ctx: DataRangeCollectionContext) => void;
}

