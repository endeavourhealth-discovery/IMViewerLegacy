// Generated from ./src/app/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.6-SNAPSHOT


import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { TodoExpressionsContext } from './DiscoverySyntaxParser';
import { AddExpressionContext } from './DiscoverySyntaxParser';
import { CompleteExpressionContext } from './DiscoverySyntaxParser';
import { SubClassExpressionContext } from './DiscoverySyntaxParser';


/**
 * This interface defines a complete listener for a parse tree produced by
 * `DiscoverySyntaxParser`.
 */
export interface DiscoverySyntaxListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	enterTodoExpressions?: (ctx: TodoExpressionsContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	exitTodoExpressions?: (ctx: TodoExpressionsContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.addExpression`.
	 * @param ctx the parse tree
	 */
	enterAddExpression?: (ctx: AddExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.addExpression`.
	 * @param ctx the parse tree
	 */
	exitAddExpression?: (ctx: AddExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	enterCompleteExpression?: (ctx: CompleteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	exitCompleteExpression?: (ctx: CompleteExpressionContext) => void;

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
}

