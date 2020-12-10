// Generated from ./src/app/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.6-SNAPSHOT


import { ATN } from 'antlr4ts/atn/ATN';
import { ATNDeserializer } from 'antlr4ts/atn/ATNDeserializer';
import { FailedPredicateException } from 'antlr4ts/FailedPredicateException';
import { NotNull } from 'antlr4ts/Decorators';
import { NoViableAltException } from 'antlr4ts/NoViableAltException';
import { Override } from 'antlr4ts/Decorators';
import { Parser } from 'antlr4ts/Parser';
import { ParserRuleContext } from 'antlr4ts/ParserRuleContext';
import { ParserATNSimulator } from 'antlr4ts/atn/ParserATNSimulator';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { RecognitionException } from 'antlr4ts/RecognitionException';
import { RuleContext } from 'antlr4ts/RuleContext';
import { RuleVersion } from 'antlr4ts/RuleVersion';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { Token } from 'antlr4ts/Token';
import { TokenStream } from 'antlr4ts/TokenStream';
import { Vocabulary } from 'antlr4ts/Vocabulary';
import { VocabularyImpl } from 'antlr4ts/VocabularyImpl';

import * as Utils from 'antlr4ts/misc/Utils';

import { DiscoverySyntaxListener } from './DiscoverySyntaxListener';

export class DiscoverySyntaxParser extends Parser {
	public static readonly SUBCLASSOF=1;
	public static readonly IRI=2;
	public static readonly ADD=3;
	public static readonly TODO=4;
	public static readonly COMPLETE=5;
	public static readonly STRING=6;
	public static readonly EOL=7;
	public static readonly WS=8;
	public static readonly RULE_todoExpressions = 0;
	public static readonly RULE_addExpression = 1;
	public static readonly RULE_completeExpression = 2;
	public static readonly RULE_subClassExpression = 3;
	public static readonly ruleNames: string[] = [
		"todoExpressions", "addExpression", "completeExpression", "subClassExpression"
	];

	private static readonly _LITERAL_NAMES: (string | undefined)[] = [
		undefined, "'SubClassOf'", undefined, "'ADD'", "'TODO'", "'COMPLETE'"
	];
	private static readonly _SYMBOLIC_NAMES: (string | undefined)[] = [
		undefined, "SUBCLASSOF", "IRI", "ADD", "TODO", "COMPLETE", "STRING", "EOL", 
		"WS"
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(DiscoverySyntaxParser._LITERAL_NAMES, DiscoverySyntaxParser._SYMBOLIC_NAMES, []);

	@Override
	@NotNull
	public get vocabulary(): Vocabulary {
		return DiscoverySyntaxParser.VOCABULARY;
	}

	@Override
	public get grammarFileName(): string { return "DiscoverySyntax.g4"; }

	@Override
	public get ruleNames(): string[] { return DiscoverySyntaxParser.ruleNames; }

	@Override
	public get serializedATN(): string { return DiscoverySyntaxParser._serializedATN; }

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(DiscoverySyntaxParser._ATN, this);
	}
	@RuleVersion(0)
	public todoExpressions(): TodoExpressionsContext {
		let _localctx: TodoExpressionsContext = new TodoExpressionsContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, DiscoverySyntaxParser.RULE_todoExpressions);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 11;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.ADD) {
				{
				{
				this.state = 8;
				this.addExpression();
				}
				}
				this.state = 13;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 17;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.COMPLETE) {
				{
				{
				this.state = 14;
				this.completeExpression();
				}
				}
				this.state = 19;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 23;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.SUBCLASSOF) {
				{
				{
				this.state = 20;
				this.subClassExpression();
				}
				}
				this.state = 25;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	@RuleVersion(0)
	public addExpression(): AddExpressionContext {
		let _localctx: AddExpressionContext = new AddExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, DiscoverySyntaxParser.RULE_addExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 26;
			this.match(DiscoverySyntaxParser.ADD);
			this.state = 27;
			this.match(DiscoverySyntaxParser.TODO);
			this.state = 28;
			this.match(DiscoverySyntaxParser.STRING);
			this.state = 29;
			this.match(DiscoverySyntaxParser.EOL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	@RuleVersion(0)
	public completeExpression(): CompleteExpressionContext {
		let _localctx: CompleteExpressionContext = new CompleteExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, DiscoverySyntaxParser.RULE_completeExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 31;
			this.match(DiscoverySyntaxParser.COMPLETE);
			this.state = 32;
			this.match(DiscoverySyntaxParser.TODO);
			this.state = 33;
			this.match(DiscoverySyntaxParser.STRING);
			this.state = 34;
			this.match(DiscoverySyntaxParser.EOL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	@RuleVersion(0)
	public subClassExpression(): SubClassExpressionContext {
		let _localctx: SubClassExpressionContext = new SubClassExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, DiscoverySyntaxParser.RULE_subClassExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 36;
			this.match(DiscoverySyntaxParser.SUBCLASSOF);
			this.state = 37;
			this.match(DiscoverySyntaxParser.IRI);
			this.state = 38;
			this.match(DiscoverySyntaxParser.EOL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03\n+\x04\x02\t"+
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x03\x02\x07\x02\f\n\x02"+
		"\f\x02\x0E\x02\x0F\v\x02\x03\x02\x07\x02\x12\n\x02\f\x02\x0E\x02\x15\v"+
		"\x02\x03\x02\x07\x02\x18\n\x02\f\x02\x0E\x02\x1B\v\x02\x03\x03\x03\x03"+
		"\x03\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05"+
		"\x03\x05\x03\x05\x03\x05\x03\x05\x02\x02\x02\x06\x02\x02\x04\x02\x06\x02"+
		"\b\x02\x02\x02)\x02\r\x03\x02\x02\x02\x04\x1C\x03\x02\x02\x02\x06!\x03"+
		"\x02\x02\x02\b&\x03\x02\x02\x02\n\f\x05\x04\x03\x02\v\n\x03\x02\x02\x02"+
		"\f\x0F\x03\x02\x02\x02\r\v\x03\x02\x02\x02\r\x0E\x03\x02\x02\x02\x0E\x13"+
		"\x03\x02\x02\x02\x0F\r\x03\x02\x02\x02\x10\x12\x05\x06\x04\x02\x11\x10"+
		"\x03\x02\x02\x02\x12\x15\x03\x02\x02\x02\x13\x11\x03\x02\x02\x02\x13\x14"+
		"\x03\x02\x02\x02\x14\x19\x03\x02\x02\x02\x15\x13\x03\x02\x02\x02\x16\x18"+
		"\x05\b\x05\x02\x17\x16\x03\x02\x02\x02\x18\x1B\x03\x02\x02\x02\x19\x17"+
		"\x03\x02\x02\x02\x19\x1A\x03\x02\x02\x02\x1A\x03\x03\x02\x02\x02\x1B\x19"+
		"\x03\x02\x02\x02\x1C\x1D\x07\x05\x02\x02\x1D\x1E\x07\x06\x02\x02\x1E\x1F"+
		"\x07\b\x02\x02\x1F \x07\t\x02\x02 \x05\x03\x02\x02\x02!\"\x07\x07\x02"+
		"\x02\"#\x07\x06\x02\x02#$\x07\b\x02\x02$%\x07\t\x02\x02%\x07\x03\x02\x02"+
		"\x02&\'\x07\x03\x02\x02\'(\x07\x04\x02\x02()\x07\t\x02\x02)\t\x03\x02"+
		"\x02\x02\x05\r\x13\x19";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!DiscoverySyntaxParser.__ATN) {
			DiscoverySyntaxParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(DiscoverySyntaxParser._serializedATN));
		}

		return DiscoverySyntaxParser.__ATN;
	}

}

export class TodoExpressionsContext extends ParserRuleContext {
	public addExpression(): AddExpressionContext[];
	public addExpression(i: number): AddExpressionContext;
	public addExpression(i?: number): AddExpressionContext | AddExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AddExpressionContext);
		} else {
			return this.getRuleContext(i, AddExpressionContext);
		}
	}
	public completeExpression(): CompleteExpressionContext[];
	public completeExpression(i: number): CompleteExpressionContext;
	public completeExpression(i?: number): CompleteExpressionContext | CompleteExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CompleteExpressionContext);
		} else {
			return this.getRuleContext(i, CompleteExpressionContext);
		}
	}
	public subClassExpression(): SubClassExpressionContext[];
	public subClassExpression(i: number): SubClassExpressionContext;
	public subClassExpression(i?: number): SubClassExpressionContext | SubClassExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SubClassExpressionContext);
		} else {
			return this.getRuleContext(i, SubClassExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_todoExpressions; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterTodoExpressions) listener.enterTodoExpressions(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitTodoExpressions) listener.exitTodoExpressions(this);
	}
}


export class AddExpressionContext extends ParserRuleContext {
	public ADD(): TerminalNode { return this.getToken(DiscoverySyntaxParser.ADD, 0); }
	public TODO(): TerminalNode { return this.getToken(DiscoverySyntaxParser.TODO, 0); }
	public STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.STRING, 0); }
	public EOL(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EOL, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_addExpression; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterAddExpression) listener.enterAddExpression(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitAddExpression) listener.exitAddExpression(this);
	}
}


export class CompleteExpressionContext extends ParserRuleContext {
	public COMPLETE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.COMPLETE, 0); }
	public TODO(): TerminalNode { return this.getToken(DiscoverySyntaxParser.TODO, 0); }
	public STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.STRING, 0); }
	public EOL(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EOL, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_completeExpression; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterCompleteExpression) listener.enterCompleteExpression(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitCompleteExpression) listener.exitCompleteExpression(this);
	}
}


export class SubClassExpressionContext extends ParserRuleContext {
	public SUBCLASSOF(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBCLASSOF, 0); }
	public IRI(): TerminalNode { return this.getToken(DiscoverySyntaxParser.IRI, 0); }
	public EOL(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EOL, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subClassExpression; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubClassExpression) listener.enterSubClassExpression(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubClassExpression) listener.exitSubClassExpression(this);
	}
}


