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
	public static readonly COMMA=2;
	public static readonly OPENBRACKET=3;
	public static readonly CLOSEBRACKET=4;
	public static readonly AND=5;
	public static readonly OR=6;
	public static readonly NOT=7;
	public static readonly EQUALS=8;
	public static readonly PROPERTYSTART=9;
	public static readonly IRI=10;
	public static readonly QUANTIFICATION=11;
	public static readonly STRING=12;
	public static readonly WS=13;
	public static readonly RULE_definition = 0;
	public static readonly RULE_subClassExpression = 1;
	public static readonly RULE_expressionList = 2;
	public static readonly RULE_expression = 3;
	public static readonly RULE_intersection = 4;
	public static readonly RULE_union = 5;
	public static readonly RULE_complement = 6;
	public static readonly RULE_objectProperty = 7;
	public static readonly RULE_dataProperty = 8;
	public static readonly RULE_oneOf = 9;
	public static readonly RULE_property = 10;
	public static readonly RULE_iri = 11;
	public static readonly ruleNames: string[] = [
		"definition", "subClassExpression", "expressionList", "expression", "intersection", 
		"union", "complement", "objectProperty", "dataProperty", "oneOf", "property", 
		"iri"
	];

	private static readonly _LITERAL_NAMES: (string | undefined)[] = [
		undefined, "'SubClassOf '", "','", "'('", "')'", "' AND '", "' OR '", 
		"'!'", "' = '", "'PROPERTY('", undefined, "'some '"
	];
	private static readonly _SYMBOLIC_NAMES: (string | undefined)[] = [
		undefined, "SUBCLASSOF", "COMMA", "OPENBRACKET", "CLOSEBRACKET", "AND", 
		"OR", "NOT", "EQUALS", "PROPERTYSTART", "IRI", "QUANTIFICATION", "STRING", 
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
	public definition(): DefinitionContext {
		let _localctx: DefinitionContext = new DefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, DiscoverySyntaxParser.RULE_definition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 27;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.SUBCLASSOF) {
				{
				{
				this.state = 24;
				this.subClassExpression();
				}
				}
				this.state = 29;
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
	public subClassExpression(): SubClassExpressionContext {
		let _localctx: SubClassExpressionContext = new SubClassExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, DiscoverySyntaxParser.RULE_subClassExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 30;
			this.match(DiscoverySyntaxParser.SUBCLASSOF);
			this.state = 31;
			this.expressionList();
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
	public expressionList(): ExpressionListContext {
		let _localctx: ExpressionListContext = new ExpressionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, DiscoverySyntaxParser.RULE_expressionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 33;
			this.expression();
			this.state = 38;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.COMMA) {
				{
				{
				this.state = 34;
				this.match(DiscoverySyntaxParser.COMMA);
				this.state = 35;
				this.expression();
				}
				}
				this.state = 40;
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
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, DiscoverySyntaxParser.RULE_expression);
		try {
			this.state = 48;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,2,this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 41;
				this.iri();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 42;
				this.intersection();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 43;
				this.union();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 44;
				this.complement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 45;
				this.objectProperty();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 46;
				this.dataProperty();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 47;
				this.oneOf();
				}
				break;
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
	public intersection(): IntersectionContext {
		let _localctx: IntersectionContext = new IntersectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, DiscoverySyntaxParser.RULE_intersection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 50;
			this.match(DiscoverySyntaxParser.OPENBRACKET);
			this.state = 51;
			this.expression();
			this.state = 56;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.AND) {
				{
				{
				this.state = 52;
				this.match(DiscoverySyntaxParser.AND);
				this.state = 53;
				this.expression();
				}
				}
				this.state = 58;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 59;
			this.match(DiscoverySyntaxParser.CLOSEBRACKET);
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
	public union(): UnionContext {
		let _localctx: UnionContext = new UnionContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, DiscoverySyntaxParser.RULE_union);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 61;
			this.match(DiscoverySyntaxParser.OPENBRACKET);
			this.state = 62;
			this.expression();
			this.state = 67;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.OR) {
				{
				{
				this.state = 63;
				this.match(DiscoverySyntaxParser.OR);
				this.state = 64;
				this.expression();
				}
				}
				this.state = 69;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 70;
			this.match(DiscoverySyntaxParser.CLOSEBRACKET);
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
	public complement(): ComplementContext {
		let _localctx: ComplementContext = new ComplementContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, DiscoverySyntaxParser.RULE_complement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 72;
			this.match(DiscoverySyntaxParser.NOT);
			this.state = 73;
			this.expression();
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
	public objectProperty(): ObjectPropertyContext {
		let _localctx: ObjectPropertyContext = new ObjectPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, DiscoverySyntaxParser.RULE_objectProperty);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 75;
			this.match(DiscoverySyntaxParser.PROPERTYSTART);
			this.state = 76;
			this.property();
			this.state = 77;
			this.match(DiscoverySyntaxParser.EQUALS);
			this.state = 79;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.QUANTIFICATION) {
				{
				this.state = 78;
				this.match(DiscoverySyntaxParser.QUANTIFICATION);
				}
			}

			this.state = 81;
			this.expression();
			this.state = 82;
			this.match(DiscoverySyntaxParser.CLOSEBRACKET);
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
	public dataProperty(): DataPropertyContext {
		let _localctx: DataPropertyContext = new DataPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, DiscoverySyntaxParser.RULE_dataProperty);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 84;
			this.match(DiscoverySyntaxParser.PROPERTYSTART);
			this.state = 85;
			this.property();
			this.state = 86;
			this.match(DiscoverySyntaxParser.EQUALS);
			this.state = 87;
			this.match(DiscoverySyntaxParser.STRING);
			this.state = 88;
			this.match(DiscoverySyntaxParser.CLOSEBRACKET);
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
	public oneOf(): OneOfContext {
		let _localctx: OneOfContext = new OneOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, DiscoverySyntaxParser.RULE_oneOf);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 90;
			this.iri();
			this.state = 95;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input,6,this._ctx);
			while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
				if ( _alt===1 ) {
					{
					{
					this.state = 91;
					this.match(DiscoverySyntaxParser.COMMA);
					this.state = 92;
					this.iri();
					}
					} 
				}
				this.state = 97;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,6,this._ctx);
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
	public property(): PropertyContext {
		let _localctx: PropertyContext = new PropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, DiscoverySyntaxParser.RULE_property);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 98;
			this.iri();
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
	public iri(): IriContext {
		let _localctx: IriContext = new IriContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, DiscoverySyntaxParser.RULE_iri);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 100;
			this.match(DiscoverySyntaxParser.IRI);
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
		"\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03\x0Fi\x04\x02"+
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07"+
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x03"+
		"\x02\x07\x02\x1C\n\x02\f\x02\x0E\x02\x1F\v\x02\x03\x03\x03\x03\x03\x03"+
		"\x03\x04\x03\x04\x03\x04\x07\x04\'\n\x04\f\x04\x0E\x04*\v\x04\x03\x05"+
		"\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x053\n\x05\x03\x06"+
		"\x03\x06\x03\x06\x03\x06\x07\x069\n\x06\f\x06\x0E\x06<\v\x06\x03\x06\x03"+
		"\x06\x03\x07\x03\x07\x03\x07\x03\x07\x07\x07D\n\x07\f\x07\x0E\x07G\v\x07"+
		"\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x05\tR\n\t"+
		"\x03\t\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\v\x03\v\x03"+
		"\v\x07\v`\n\v\f\v\x0E\vc\v\v\x03\f\x03\f\x03\r\x03\r\x03\r\x02\x02\x02"+
		"\x0E\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02"+
		"\x14\x02\x16\x02\x18\x02\x02\x02h\x02\x1D\x03\x02\x02\x02\x04 \x03\x02"+
		"\x02\x02\x06#\x03\x02\x02\x02\b2\x03\x02\x02\x02\n4\x03\x02\x02\x02\f"+
		"?\x03\x02\x02\x02\x0EJ\x03\x02\x02\x02\x10M\x03\x02\x02\x02\x12V\x03\x02"+
		"\x02\x02\x14\\\x03\x02\x02\x02\x16d\x03\x02\x02\x02\x18f\x03\x02\x02\x02"+
		"\x1A\x1C\x05\x04\x03\x02\x1B\x1A\x03\x02\x02\x02\x1C\x1F\x03\x02\x02\x02"+
		"\x1D\x1B\x03\x02\x02\x02\x1D\x1E\x03\x02\x02\x02\x1E\x03\x03\x02\x02\x02"+
		"\x1F\x1D\x03\x02\x02\x02 !\x07\x03\x02\x02!\"\x05\x06\x04\x02\"\x05\x03"+
		"\x02\x02\x02#(\x05\b\x05\x02$%\x07\x04\x02\x02%\'\x05\b\x05\x02&$\x03"+
		"\x02\x02\x02\'*\x03\x02\x02\x02(&\x03\x02\x02\x02()\x03\x02\x02\x02)\x07"+
		"\x03\x02\x02\x02*(\x03\x02\x02\x02+3\x05\x18\r\x02,3\x05\n\x06\x02-3\x05"+
		"\f\x07\x02.3\x05\x0E\b\x02/3\x05\x10\t\x0203\x05\x12\n\x0213\x05\x14\v"+
		"\x022+\x03\x02\x02\x022,\x03\x02\x02\x022-\x03\x02\x02\x022.\x03\x02\x02"+
		"\x022/\x03\x02\x02\x0220\x03\x02\x02\x0221\x03\x02\x02\x023\t\x03\x02"+
		"\x02\x0245\x07\x05\x02\x025:\x05\b\x05\x0267\x07\x07\x02\x0279\x05\b\x05"+
		"\x0286\x03\x02\x02\x029<\x03\x02\x02\x02:8\x03\x02\x02\x02:;\x03\x02\x02"+
		"\x02;=\x03\x02\x02\x02<:\x03\x02\x02\x02=>\x07\x06\x02\x02>\v\x03\x02"+
		"\x02\x02?@\x07\x05\x02\x02@E\x05\b\x05\x02AB\x07\b\x02\x02BD\x05\b\x05"+
		"\x02CA\x03\x02\x02\x02DG\x03\x02\x02\x02EC\x03\x02\x02\x02EF\x03\x02\x02"+
		"\x02FH\x03\x02\x02\x02GE\x03\x02\x02\x02HI\x07\x06\x02\x02I\r\x03\x02"+
		"\x02\x02JK\x07\t\x02\x02KL\x05\b\x05\x02L\x0F\x03\x02\x02\x02MN\x07\v"+
		"\x02\x02NO\x05\x16\f\x02OQ\x07\n\x02\x02PR\x07\r\x02\x02QP\x03\x02\x02"+
		"\x02QR\x03\x02\x02\x02RS\x03\x02\x02\x02ST\x05\b\x05\x02TU\x07\x06\x02"+
		"\x02U\x11\x03\x02\x02\x02VW\x07\v\x02\x02WX\x05\x16\f\x02XY\x07\n\x02"+
		"\x02YZ\x07\x0E\x02\x02Z[\x07\x06\x02\x02[\x13\x03\x02\x02\x02\\a\x05\x18"+
		"\r\x02]^\x07\x04\x02\x02^`\x05\x18\r\x02_]\x03\x02\x02\x02`c\x03\x02\x02"+
		"\x02a_\x03\x02\x02\x02ab\x03\x02\x02\x02b\x15\x03\x02\x02\x02ca\x03\x02"+
		"\x02\x02de\x05\x18\r\x02e\x17\x03\x02\x02\x02fg\x07\f\x02\x02g\x19\x03"+
		"\x02\x02\x02\t\x1D(2:EQa";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!DiscoverySyntaxParser.__ATN) {
			DiscoverySyntaxParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(DiscoverySyntaxParser._serializedATN));
		}

		return DiscoverySyntaxParser.__ATN;
	}

}

export class DefinitionContext extends ParserRuleContext {
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
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_definition; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDefinition) listener.enterDefinition(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDefinition) listener.exitDefinition(this);
	}
}


export class SubClassExpressionContext extends ParserRuleContext {
	public SUBCLASSOF(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBCLASSOF, 0); }
	public expressionList(): ExpressionListContext {
		return this.getRuleContext(0, ExpressionListContext);
	}
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


export class ExpressionListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.COMMA);
		} else {
			return this.getToken(DiscoverySyntaxParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_expressionList; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterExpressionList) listener.enterExpressionList(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitExpressionList) listener.exitExpressionList(this);
	}
}


export class ExpressionContext extends ParserRuleContext {
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public intersection(): IntersectionContext | undefined {
		return this.tryGetRuleContext(0, IntersectionContext);
	}
	public union(): UnionContext | undefined {
		return this.tryGetRuleContext(0, UnionContext);
	}
	public complement(): ComplementContext | undefined {
		return this.tryGetRuleContext(0, ComplementContext);
	}
	public objectProperty(): ObjectPropertyContext | undefined {
		return this.tryGetRuleContext(0, ObjectPropertyContext);
	}
	public dataProperty(): DataPropertyContext | undefined {
		return this.tryGetRuleContext(0, DataPropertyContext);
	}
	public oneOf(): OneOfContext | undefined {
		return this.tryGetRuleContext(0, OneOfContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_expression; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterExpression) listener.enterExpression(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitExpression) listener.exitExpression(this);
	}
}


export class IntersectionContext extends ParserRuleContext {
	public OPENBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.OPENBRACKET, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public CLOSEBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLOSEBRACKET, 0); }
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.AND);
		} else {
			return this.getToken(DiscoverySyntaxParser.AND, i);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_intersection; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterIntersection) listener.enterIntersection(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitIntersection) listener.exitIntersection(this);
	}
}


export class UnionContext extends ParserRuleContext {
	public OPENBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.OPENBRACKET, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public CLOSEBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLOSEBRACKET, 0); }
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.OR);
		} else {
			return this.getToken(DiscoverySyntaxParser.OR, i);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_union; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterUnion) listener.enterUnion(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitUnion) listener.exitUnion(this);
	}
}


export class ComplementContext extends ParserRuleContext {
	public NOT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.NOT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_complement; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterComplement) listener.enterComplement(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitComplement) listener.exitComplement(this);
	}
}


export class ObjectPropertyContext extends ParserRuleContext {
	public PROPERTYSTART(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PROPERTYSTART, 0); }
	public property(): PropertyContext {
		return this.getRuleContext(0, PropertyContext);
	}
	public EQUALS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EQUALS, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public CLOSEBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLOSEBRACKET, 0); }
	public QUANTIFICATION(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.QUANTIFICATION, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_objectProperty; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterObjectProperty) listener.enterObjectProperty(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitObjectProperty) listener.exitObjectProperty(this);
	}
}


export class DataPropertyContext extends ParserRuleContext {
	public PROPERTYSTART(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PROPERTYSTART, 0); }
	public property(): PropertyContext {
		return this.getRuleContext(0, PropertyContext);
	}
	public EQUALS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EQUALS, 0); }
	public STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.STRING, 0); }
	public CLOSEBRACKET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLOSEBRACKET, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_dataProperty; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDataProperty) listener.enterDataProperty(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDataProperty) listener.exitDataProperty(this);
	}
}


export class OneOfContext extends ParserRuleContext {
	public iri(): IriContext[];
	public iri(i: number): IriContext;
	public iri(i?: number): IriContext | IriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IriContext);
		} else {
			return this.getRuleContext(i, IriContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.COMMA);
		} else {
			return this.getToken(DiscoverySyntaxParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_oneOf; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterOneOf) listener.enterOneOf(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitOneOf) listener.exitOneOf(this);
	}
}


export class PropertyContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_property; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterProperty) listener.enterProperty(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitProperty) listener.exitProperty(this);
	}
}


export class IriContext extends ParserRuleContext {
	public IRI(): TerminalNode { return this.getToken(DiscoverySyntaxParser.IRI, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_iri; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterIri) listener.enterIri(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitIri) listener.exitIri(this);
	}
}


