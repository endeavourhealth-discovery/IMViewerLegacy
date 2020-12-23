// Generated from ./src/app/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.6-SNAPSHOT


import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { DefinitionContext } from './DiscoverySyntaxParser';
import { SubClassExpressionContext } from './DiscoverySyntaxParser';
import { ExpressionListContext } from './DiscoverySyntaxParser';
import { ExpressionContext } from './DiscoverySyntaxParser';
import { IntersectionContext } from './DiscoverySyntaxParser';
import { UnionContext } from './DiscoverySyntaxParser';
import { ComplementContext } from './DiscoverySyntaxParser';
import { ObjectPropertyContext } from './DiscoverySyntaxParser';
import { DataPropertyContext } from './DiscoverySyntaxParser';
import { OneOfContext } from './DiscoverySyntaxParser';
import { PropertyContext } from './DiscoverySyntaxParser';
import { IriContext } from './DiscoverySyntaxParser';


/**
 * This interface defines a complete listener for a parse tree produced by
 * `DiscoverySyntaxParser`.
 */
export interface DiscoverySyntaxListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.definition`.
	 * @param ctx the parse tree
	 */
	enterDefinition?: (ctx: DefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.definition`.
	 * @param ctx the parse tree
	 */
	exitDefinition?: (ctx: DefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subClassExpression`.
	 * @param ctx the parse tree
	 */
	enterSubClassExpression?: (ctx: SubClassExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subClassExpression`.
	 * @param ctx the parse tree
	 */
	exitSubClassExpression?: (ctx: SubClassExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.expressionList`.
	 * @param ctx the parse tree
	 */
	enterExpressionList?: (ctx: ExpressionListContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.expressionList`.
	 * @param ctx the parse tree
	 */
	exitExpressionList?: (ctx: ExpressionListContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.intersection`.
	 * @param ctx the parse tree
	 */
	enterIntersection?: (ctx: IntersectionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.intersection`.
	 * @param ctx the parse tree
	 */
	exitIntersection?: (ctx: IntersectionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.union`.
	 * @param ctx the parse tree
	 */
	enterUnion?: (ctx: UnionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.union`.
	 * @param ctx the parse tree
	 */
	exitUnion?: (ctx: UnionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.complement`.
	 * @param ctx the parse tree
	 */
	enterComplement?: (ctx: ComplementContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.complement`.
	 * @param ctx the parse tree
	 */
	exitComplement?: (ctx: ComplementContext) => void;

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
	 * Enter a parse tree produced by `DiscoverySyntaxParser.oneOf`.
	 * @param ctx the parse tree
	 */
	enterOneOf?: (ctx: OneOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.oneOf`.
	 * @param ctx the parse tree
	 */
	exitOneOf?: (ctx: OneOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.property`.
	 * @param ctx the parse tree
	 */
	enterProperty?: (ctx: PropertyContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.property`.
	 * @param ctx the parse tree
	 */
	exitProperty?: (ctx: PropertyContext) => void;

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
}

