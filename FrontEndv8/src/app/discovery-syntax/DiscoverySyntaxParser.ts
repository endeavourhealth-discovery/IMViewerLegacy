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
	public static readonly T__0=1;
	public static readonly T__1=2;
	public static readonly T__2=3;
	public static readonly T__3=4;
	public static readonly T__4=5;
	public static readonly T__5=6;
	public static readonly T__6=7;
	public static readonly T__7=8;
	public static readonly T__8=9;
	public static readonly EQ=10;
	public static readonly MEMBER=11;
	public static readonly EXPANSION=12;
	public static readonly STATUS=13;
	public static readonly ACTIVE=14;
	public static readonly INACTIVE=15;
	public static readonly DRAFT=16;
	public static readonly VERSION=17;
	public static readonly IRI_LABEL=18;
	public static readonly TYPE=19;
	public static readonly TERM=20;
	public static readonly SHAPE=21;
	public static readonly RECORDTYPE=22;
	public static readonly TARGETCLASS=23;
	public static readonly CLASS=24;
	public static readonly OBJECTPROPERTY=25;
	public static readonly DATAPROPERTY=26;
	public static readonly ANNOTATION=27;
	public static readonly PROPERTYCONSTRAINT=28;
	public static readonly DATATYPE=29;
	public static readonly VALUESET=30;
	public static readonly PATH=31;
	public static readonly MINCOUNT=32;
	public static readonly MAXCOUNT=33;
	public static readonly NAME=34;
	public static readonly DESCRIPTION=35;
	public static readonly CODE=36;
	public static readonly SCHEME=37;
	public static readonly MININCLUSIVE=38;
	public static readonly MAXINCLUSIVE=39;
	public static readonly MINEXCLUSIVE=40;
	public static readonly MAXEXCLUSIVE=41;
	public static readonly SUBCLASS=42;
	public static readonly EQUIVALENTTO=43;
	public static readonly DISJOINT=44;
	public static readonly SUBPROPERTY=45;
	public static readonly INVERSE=46;
	public static readonly INTEGER=47;
	public static readonly DOUBLE=48;
	public static readonly DIGIT=49;
	public static readonly EXACT=50;
	public static readonly AND=51;
	public static readonly OR=52;
	public static readonly PREFIXIRI=53;
	public static readonly IRIREF=54;
	public static readonly LOWERCASE=55;
	public static readonly UPPERCASE=56;
	public static readonly PLX=57;
	public static readonly PERCENT=58;
	public static readonly QUOTED_STRING=59;
	public static readonly HEX=60;
	public static readonly PN_LOCAL_ESC=61;
	public static readonly WS=62;
	public static readonly SC=63;
	public static readonly RULE_concept = 0;
	public static readonly RULE_classAxiom = 1;
	public static readonly RULE_propertyAxiom = 2;
	public static readonly RULE_type = 3;
	public static readonly RULE_classType = 4;
	public static readonly RULE_dataType = 5;
	public static readonly RULE_shape = 6;
	public static readonly RULE_recordType = 7;
	public static readonly RULE_objectProperty = 8;
	public static readonly RULE_dataProperty = 9;
	public static readonly RULE_annotationProperty = 10;
	public static readonly RULE_members = 11;
	public static readonly RULE_expansion = 12;
	public static readonly RULE_valueSet = 13;
	public static readonly RULE_shapeOf = 14;
	public static readonly RULE_propertyConstraint = 15;
	public static readonly RULE_constraintParameter = 16;
	public static readonly RULE_minCount = 17;
	public static readonly RULE_maxCount = 18;
	public static readonly RULE_minInclusive = 19;
	public static readonly RULE_maxInclusive = 20;
	public static readonly RULE_minExclusive = 21;
	public static readonly RULE_maxExclusive = 22;
	public static readonly RULE_classValue = 23;
	public static readonly RULE_label = 24;
	public static readonly RULE_status = 25;
	public static readonly RULE_version = 26;
	public static readonly RULE_identifierIri = 27;
	public static readonly RULE_name = 28;
	public static readonly RULE_description = 29;
	public static readonly RULE_code = 30;
	public static readonly RULE_scheme = 31;
	public static readonly RULE_subclassOf = 32;
	public static readonly RULE_equivalentTo = 33;
	public static readonly RULE_disjointWith = 34;
	public static readonly RULE_subpropertyOf = 35;
	public static readonly RULE_inverseOf = 36;
	public static readonly RULE_classExpression = 37;
	public static readonly RULE_iri = 38;
	public static readonly RULE_roleGroup = 39;
	public static readonly RULE_role = 40;
	public static readonly RULE_dataRange = 41;
	public static readonly RULE_rangeValue = 42;
	public static readonly RULE_typedString = 43;
	public static readonly RULE_valueCollection = 44;
	public static readonly RULE_dataRangeCollection = 45;
	public static readonly ruleNames: string[] = [
		"concept", "classAxiom", "propertyAxiom", "type", "classType", "dataType", 
		"shape", "recordType", "objectProperty", "dataProperty", "annotationProperty", 
		"members", "expansion", "valueSet", "shapeOf", "propertyConstraint", "constraintParameter", 
		"minCount", "maxCount", "minInclusive", "maxInclusive", "minExclusive", 
		"maxExclusive", "classValue", "label", "status", "version", "identifierIri", 
		"name", "description", "code", "scheme", "subclassOf", "equivalentTo", 
		"disjointWith", "subpropertyOf", "inverseOf", "classExpression", "iri", 
		"roleGroup", "role", "dataRange", "rangeValue", "typedString", "valueCollection", 
		"dataRangeCollection"
	];

	private static readonly _LITERAL_NAMES: (string | undefined)[] = [
		undefined, "'.'", "'('", "','", "')'", "'['", "']'", "'{'", "'}'", "'^^'", 
		"'='", undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		"'or'", undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, "';'"
	];
	private static readonly _SYMBOLIC_NAMES: (string | undefined)[] = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, "EQ", "MEMBER", "EXPANSION", "STATUS", 
		"ACTIVE", "INACTIVE", "DRAFT", "VERSION", "IRI_LABEL", "TYPE", "TERM", 
		"SHAPE", "RECORDTYPE", "TARGETCLASS", "CLASS", "OBJECTPROPERTY", "DATAPROPERTY", 
		"ANNOTATION", "PROPERTYCONSTRAINT", "DATATYPE", "VALUESET", "PATH", "MINCOUNT", 
		"MAXCOUNT", "NAME", "DESCRIPTION", "CODE", "SCHEME", "MININCLUSIVE", "MAXINCLUSIVE", 
		"MINEXCLUSIVE", "MAXEXCLUSIVE", "SUBCLASS", "EQUIVALENTTO", "DISJOINT", 
		"SUBPROPERTY", "INVERSE", "INTEGER", "DOUBLE", "DIGIT", "EXACT", "AND", 
		"OR", "PREFIXIRI", "IRIREF", "LOWERCASE", "UPPERCASE", "PLX", "PERCENT", 
		"QUOTED_STRING", "HEX", "PN_LOCAL_ESC", "WS", "SC"
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
	public concept(): ConceptContext {
		let _localctx: ConceptContext = new ConceptContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, DiscoverySyntaxParser.RULE_concept);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 92;
			this.identifierIri();
			this.state = 93;
			this.type();
			this.state = 94;
			this.match(DiscoverySyntaxParser.T__0);
			this.state = 95;
			this.match(DiscoverySyntaxParser.EOF);
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
	public classAxiom(): ClassAxiomContext {
		let _localctx: ClassAxiomContext = new ClassAxiomContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, DiscoverySyntaxParser.RULE_classAxiom);
		try {
			this.state = 100;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.SUBCLASS:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 97;
				this.subclassOf();
				}
				break;
			case DiscoverySyntaxParser.EQUIVALENTTO:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 98;
				this.equivalentTo();
				}
				break;
			case DiscoverySyntaxParser.DISJOINT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 99;
				this.disjointWith();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public propertyAxiom(): PropertyAxiomContext {
		let _localctx: PropertyAxiomContext = new PropertyAxiomContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, DiscoverySyntaxParser.RULE_propertyAxiom);
		try {
			this.state = 104;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.SUBPROPERTY:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 102;
				this.subpropertyOf();
				}
				break;
			case DiscoverySyntaxParser.INVERSE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 103;
				this.inverseOf();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public type(): TypeContext {
		let _localctx: TypeContext = new TypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, DiscoverySyntaxParser.RULE_type);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 106;
			this.match(DiscoverySyntaxParser.TYPE);
			this.state = 115;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.CLASS:
				{
				this.state = 107;
				this.classType();
				}
				break;
			case DiscoverySyntaxParser.DATATYPE:
				{
				this.state = 108;
				this.dataType();
				}
				break;
			case DiscoverySyntaxParser.RECORDTYPE:
				{
				this.state = 109;
				this.recordType();
				}
				break;
			case DiscoverySyntaxParser.SHAPE:
				{
				this.state = 110;
				this.shape();
				}
				break;
			case DiscoverySyntaxParser.VALUESET:
				{
				this.state = 111;
				this.valueSet();
				}
				break;
			case DiscoverySyntaxParser.OBJECTPROPERTY:
				{
				this.state = 112;
				this.objectProperty();
				}
				break;
			case DiscoverySyntaxParser.ANNOTATION:
				{
				this.state = 113;
				this.annotationProperty();
				}
				break;
			case DiscoverySyntaxParser.DATAPROPERTY:
				{
				this.state = 114;
				this.dataProperty();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public classType(): ClassTypeContext {
		let _localctx: ClassTypeContext = new ClassTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, DiscoverySyntaxParser.RULE_classType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 117;
			this.match(DiscoverySyntaxParser.CLASS);
			this.state = 129;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,5,this._ctx) ) {
			case 1:
				{
				this.state = 118;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 119;
				this.label();
				this.state = 126;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,4,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 120;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 122;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 121;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 128;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,4,this._ctx);
				}
				}
				break;
			}
			this.state = 142;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 131;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 132;
				this.classAxiom();
				this.state = 139;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 133;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 135;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (((((_la - 42)) & ~0x1F) === 0 && ((1 << (_la - 42)) & ((1 << (DiscoverySyntaxParser.SUBCLASS - 42)) | (1 << (DiscoverySyntaxParser.EQUIVALENTTO - 42)) | (1 << (DiscoverySyntaxParser.DISJOINT - 42)))) !== 0)) {
						{
						this.state = 134;
						this.classAxiom();
						}
					}

					}
					}
					this.state = 141;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public dataType(): DataTypeContext {
		let _localctx: DataTypeContext = new DataTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, DiscoverySyntaxParser.RULE_dataType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this.match(DiscoverySyntaxParser.DATATYPE);
			this.state = 156;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 145;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 146;
				this.label();
				this.state = 153;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 147;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 149;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
						{
						this.state = 148;
						this.label();
						}
					}

					}
					}
					this.state = 155;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public shape(): ShapeContext {
		let _localctx: ShapeContext = new ShapeContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, DiscoverySyntaxParser.RULE_shape);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 158;
			this.match(DiscoverySyntaxParser.SHAPE);
			this.state = 170;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,14,this._ctx) ) {
			case 1:
				{
				this.state = 159;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 160;
				this.label();
				this.state = 167;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,13,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 161;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 163;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 162;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 169;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,13,this._ctx);
				}
				}
				break;
			}
			this.state = 174;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,15,this._ctx) ) {
			case 1:
				{
				this.state = 172;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 173;
				this.subclassOf();
				}
				break;
			}
			this.state = 176;
			this.match(DiscoverySyntaxParser.SC);
			this.state = 177;
			this.shapeOf();
			{
			this.state = 178;
			this.match(DiscoverySyntaxParser.SC);
			this.state = 179;
			this.propertyConstraint();
			{
			this.state = 180;
			this.match(DiscoverySyntaxParser.SC);
			this.state = 181;
			this.propertyConstraint();
			}
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
	public recordType(): RecordTypeContext {
		let _localctx: RecordTypeContext = new RecordTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, DiscoverySyntaxParser.RULE_recordType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 183;
			this.match(DiscoverySyntaxParser.RECORDTYPE);
			this.state = 195;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,18,this._ctx) ) {
			case 1:
				{
				this.state = 184;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 185;
				this.label();
				this.state = 192;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,17,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 186;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 188;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 187;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 194;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,17,this._ctx);
				}
				}
				break;
			}
			this.state = 208;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,21,this._ctx) ) {
			case 1:
				{
				this.state = 197;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 198;
				this.classAxiom();
				this.state = 205;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,20,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 199;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 201;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 42)) & ~0x1F) === 0 && ((1 << (_la - 42)) & ((1 << (DiscoverySyntaxParser.SUBCLASS - 42)) | (1 << (DiscoverySyntaxParser.EQUIVALENTTO - 42)) | (1 << (DiscoverySyntaxParser.DISJOINT - 42)))) !== 0)) {
							{
							this.state = 200;
							this.classAxiom();
							}
						}

						}
						} 
					}
					this.state = 207;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,20,this._ctx);
				}
				}
				break;
			}
			this.state = 219;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 210;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 211;
				this.role();
				this.state = 216;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 212;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 213;
					this.role();
					}
					}
					this.state = 218;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public objectProperty(): ObjectPropertyContext {
		let _localctx: ObjectPropertyContext = new ObjectPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, DiscoverySyntaxParser.RULE_objectProperty);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 221;
			this.match(DiscoverySyntaxParser.OBJECTPROPERTY);
			this.state = 233;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,26,this._ctx) ) {
			case 1:
				{
				this.state = 222;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 223;
				this.label();
				this.state = 230;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,25,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 224;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 226;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 225;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 232;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,25,this._ctx);
				}
				}
				break;
			}
			this.state = 244;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 235;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 236;
				this.propertyAxiom();
				this.state = 241;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 237;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 238;
					this.propertyAxiom();
					}
					}
					this.state = 243;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public dataProperty(): DataPropertyContext {
		let _localctx: DataPropertyContext = new DataPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, DiscoverySyntaxParser.RULE_dataProperty);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 246;
			this.match(DiscoverySyntaxParser.DATAPROPERTY);
			this.state = 258;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,31,this._ctx) ) {
			case 1:
				{
				this.state = 247;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 248;
				this.label();
				this.state = 255;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,30,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 249;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 251;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 250;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 257;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,30,this._ctx);
				}
				}
				break;
			}
			this.state = 269;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 260;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 261;
				this.propertyAxiom();
				this.state = 266;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 262;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 263;
					this.propertyAxiom();
					}
					}
					this.state = 268;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public annotationProperty(): AnnotationPropertyContext {
		let _localctx: AnnotationPropertyContext = new AnnotationPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, DiscoverySyntaxParser.RULE_annotationProperty);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 271;
			this.match(DiscoverySyntaxParser.ANNOTATION);
			this.state = 283;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,36,this._ctx) ) {
			case 1:
				{
				this.state = 272;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 273;
				this.label();
				this.state = 280;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,35,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 274;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 276;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 275;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 282;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,35,this._ctx);
				}
				}
				break;
			}
			this.state = 294;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 285;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 286;
				this.propertyAxiom();
				this.state = 291;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 287;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 288;
					this.propertyAxiom();
					}
					}
					this.state = 293;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
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
	public members(): MembersContext {
		let _localctx: MembersContext = new MembersContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, DiscoverySyntaxParser.RULE_members);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 296;
			this.match(DiscoverySyntaxParser.MEMBER);
			this.state = 297;
			this.classExpression();
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
	public expansion(): ExpansionContext {
		let _localctx: ExpansionContext = new ExpansionContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, DiscoverySyntaxParser.RULE_expansion);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 299;
			this.match(DiscoverySyntaxParser.EXPANSION);
			this.state = 300;
			this.match(DiscoverySyntaxParser.T__1);
			this.state = 301;
			this.iri();
			this.state = 304; 
			this._errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					{
					this.state = 302;
					this.match(DiscoverySyntaxParser.T__2);
					this.state = 303;
					this.iri();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 306; 
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,39,this._ctx);
			} while ( _alt!==1 && _alt!==ATN.INVALID_ALT_NUMBER );
			this.state = 308;
			this.match(DiscoverySyntaxParser.T__3);
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
	public valueSet(): ValueSetContext {
		let _localctx: ValueSetContext = new ValueSetContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, DiscoverySyntaxParser.RULE_valueSet);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 310;
			this.match(DiscoverySyntaxParser.VALUESET);
			this.state = 322;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,42,this._ctx) ) {
			case 1:
				{
				this.state = 311;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 312;
				this.label();
				this.state = 319;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,41,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 313;
						this.match(DiscoverySyntaxParser.SC);
						this.state = 315;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (((((_la - 13)) & ~0x1F) === 0 && ((1 << (_la - 13)) & ((1 << (DiscoverySyntaxParser.STATUS - 13)) | (1 << (DiscoverySyntaxParser.VERSION - 13)) | (1 << (DiscoverySyntaxParser.NAME - 13)) | (1 << (DiscoverySyntaxParser.DESCRIPTION - 13)) | (1 << (DiscoverySyntaxParser.CODE - 13)) | (1 << (DiscoverySyntaxParser.SCHEME - 13)))) !== 0)) {
							{
							this.state = 314;
							this.label();
							}
						}

						}
						} 
					}
					this.state = 321;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,41,this._ctx);
				}
				}
				break;
			}
			this.state = 326;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,43,this._ctx) ) {
			case 1:
				{
				this.state = 324;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 325;
				this.subclassOf();
				}
				break;
			}
			this.state = 330;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,44,this._ctx) ) {
			case 1:
				{
				this.state = 328;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 329;
				this.members();
				}
				break;
			}
			this.state = 334;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 332;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 333;
				this.expansion();
				}
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
	public shapeOf(): ShapeOfContext {
		let _localctx: ShapeOfContext = new ShapeOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, DiscoverySyntaxParser.RULE_shapeOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 336;
			this.match(DiscoverySyntaxParser.TARGETCLASS);
			}
			this.state = 337;
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
	public propertyConstraint(): PropertyConstraintContext {
		let _localctx: PropertyConstraintContext = new PropertyConstraintContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, DiscoverySyntaxParser.RULE_propertyConstraint);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 339;
			this.match(DiscoverySyntaxParser.PROPERTYCONSTRAINT);
			this.state = 340;
			this.match(DiscoverySyntaxParser.T__4);
			this.state = 341;
			this.match(DiscoverySyntaxParser.PATH);
			this.state = 342;
			this.iri();
			this.state = 352;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.SC) {
				{
				this.state = 343;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 344;
				this.constraintParameter();
				this.state = 349;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===DiscoverySyntaxParser.SC) {
					{
					{
					this.state = 345;
					this.match(DiscoverySyntaxParser.SC);
					this.state = 346;
					this.constraintParameter();
					}
					}
					this.state = 351;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 354;
			this.match(DiscoverySyntaxParser.T__5);
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
	public constraintParameter(): ConstraintParameterContext {
		let _localctx: ConstraintParameterContext = new ConstraintParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, DiscoverySyntaxParser.RULE_constraintParameter);
		try {
			this.state = 362;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,48,this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 356;
				this.minCount();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 357;
				this.maxCount();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 358;
				this.minInclusive();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 359;
				this.maxInclusive();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 360;
				this.classValue();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 361;
				this.dataRange();
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
	public minCount(): MinCountContext {
		let _localctx: MinCountContext = new MinCountContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, DiscoverySyntaxParser.RULE_minCount);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 364;
			this.match(DiscoverySyntaxParser.MINCOUNT);
			this.state = 365;
			this.match(DiscoverySyntaxParser.INTEGER);
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
	public maxCount(): MaxCountContext {
		let _localctx: MaxCountContext = new MaxCountContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, DiscoverySyntaxParser.RULE_maxCount);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 367;
			this.match(DiscoverySyntaxParser.MAXCOUNT);
			this.state = 368;
			this.match(DiscoverySyntaxParser.INTEGER);
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
	public minInclusive(): MinInclusiveContext {
		let _localctx: MinInclusiveContext = new MinInclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, DiscoverySyntaxParser.RULE_minInclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 370;
			this.match(DiscoverySyntaxParser.MININCLUSIVE);
			this.state = 371;
			this.match(DiscoverySyntaxParser.DOUBLE);
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
	public maxInclusive(): MaxInclusiveContext {
		let _localctx: MaxInclusiveContext = new MaxInclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, DiscoverySyntaxParser.RULE_maxInclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 373;
			this.match(DiscoverySyntaxParser.MAXINCLUSIVE);
			this.state = 374;
			this.match(DiscoverySyntaxParser.DOUBLE);
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
	public minExclusive(): MinExclusiveContext {
		let _localctx: MinExclusiveContext = new MinExclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, DiscoverySyntaxParser.RULE_minExclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 376;
			this.match(DiscoverySyntaxParser.MINEXCLUSIVE);
			this.state = 377;
			this.match(DiscoverySyntaxParser.DOUBLE);
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
	public maxExclusive(): MaxExclusiveContext {
		let _localctx: MaxExclusiveContext = new MaxExclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, DiscoverySyntaxParser.RULE_maxExclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 379;
			this.match(DiscoverySyntaxParser.MAXEXCLUSIVE);
			this.state = 380;
			this.match(DiscoverySyntaxParser.DOUBLE);
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
	public classValue(): ClassValueContext {
		let _localctx: ClassValueContext = new ClassValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, DiscoverySyntaxParser.RULE_classValue);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 382;
			this.match(DiscoverySyntaxParser.CLASS);
			this.state = 388;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.PREFIXIRI:
			case DiscoverySyntaxParser.IRIREF:
			case DiscoverySyntaxParser.QUOTED_STRING:
				{
				this.state = 383;
				this.iri();
				}
				break;
			case DiscoverySyntaxParser.T__4:
				{
				this.state = 384;
				this.match(DiscoverySyntaxParser.T__4);
				this.state = 385;
				this.propertyConstraint();
				this.state = 386;
				this.match(DiscoverySyntaxParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public label(): LabelContext {
		let _localctx: LabelContext = new LabelContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, DiscoverySyntaxParser.RULE_label);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 396;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.NAME:
				{
				this.state = 390;
				this.name();
				}
				break;
			case DiscoverySyntaxParser.DESCRIPTION:
				{
				this.state = 391;
				this.description();
				}
				break;
			case DiscoverySyntaxParser.CODE:
				{
				this.state = 392;
				this.code();
				}
				break;
			case DiscoverySyntaxParser.SCHEME:
				{
				this.state = 393;
				this.scheme();
				}
				break;
			case DiscoverySyntaxParser.STATUS:
				{
				this.state = 394;
				this.status();
				}
				break;
			case DiscoverySyntaxParser.VERSION:
				{
				this.state = 395;
				this.version();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public status(): StatusContext {
		let _localctx: StatusContext = new StatusContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, DiscoverySyntaxParser.RULE_status);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 398;
			this.match(DiscoverySyntaxParser.STATUS);
			this.state = 399;
			_la = this._input.LA(1);
			if ( !((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << DiscoverySyntaxParser.ACTIVE) | (1 << DiscoverySyntaxParser.INACTIVE) | (1 << DiscoverySyntaxParser.DRAFT))) !== 0)) ) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
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
	public version(): VersionContext {
		let _localctx: VersionContext = new VersionContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, DiscoverySyntaxParser.RULE_version);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 401;
			this.match(DiscoverySyntaxParser.VERSION);
			this.state = 402;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
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
	public identifierIri(): IdentifierIriContext {
		let _localctx: IdentifierIriContext = new IdentifierIriContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, DiscoverySyntaxParser.RULE_identifierIri);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 405;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===DiscoverySyntaxParser.IRI_LABEL) {
				{
				this.state = 404;
				this.match(DiscoverySyntaxParser.IRI_LABEL);
				}
			}

			this.state = 407;
			this.iri();
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
	public name(): NameContext {
		let _localctx: NameContext = new NameContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, DiscoverySyntaxParser.RULE_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 409;
			this.match(DiscoverySyntaxParser.NAME);
			this.state = 410;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
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
	public description(): DescriptionContext {
		let _localctx: DescriptionContext = new DescriptionContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, DiscoverySyntaxParser.RULE_description);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 412;
			this.match(DiscoverySyntaxParser.DESCRIPTION);
			this.state = 413;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
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
	public code(): CodeContext {
		let _localctx: CodeContext = new CodeContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, DiscoverySyntaxParser.RULE_code);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 415;
			this.match(DiscoverySyntaxParser.CODE);
			this.state = 416;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
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
	public scheme(): SchemeContext {
		let _localctx: SchemeContext = new SchemeContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, DiscoverySyntaxParser.RULE_scheme);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 418;
			this.match(DiscoverySyntaxParser.SCHEME);
			this.state = 419;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
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
	public subclassOf(): SubclassOfContext {
		let _localctx: SubclassOfContext = new SubclassOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, DiscoverySyntaxParser.RULE_subclassOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 421;
			this.match(DiscoverySyntaxParser.SUBCLASS);
			this.state = 422;
			this.classExpression();
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
	public equivalentTo(): EquivalentToContext {
		let _localctx: EquivalentToContext = new EquivalentToContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, DiscoverySyntaxParser.RULE_equivalentTo);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 424;
			this.match(DiscoverySyntaxParser.EQUIVALENTTO);
			this.state = 425;
			this.classExpression();
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
	public disjointWith(): DisjointWithContext {
		let _localctx: DisjointWithContext = new DisjointWithContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, DiscoverySyntaxParser.RULE_disjointWith);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 427;
			this.match(DiscoverySyntaxParser.DISJOINT);
			this.state = 428;
			this.classExpression();
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
	public subpropertyOf(): SubpropertyOfContext {
		let _localctx: SubpropertyOfContext = new SubpropertyOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, DiscoverySyntaxParser.RULE_subpropertyOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 430;
			this.match(DiscoverySyntaxParser.SUBPROPERTY);
			this.state = 431;
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
	public inverseOf(): InverseOfContext {
		let _localctx: InverseOfContext = new InverseOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, DiscoverySyntaxParser.RULE_inverseOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 433;
			this.match(DiscoverySyntaxParser.INVERSE);
			this.state = 434;
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
	public classExpression(): ClassExpressionContext {
		let _localctx: ClassExpressionContext = new ClassExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, DiscoverySyntaxParser.RULE_classExpression);
		try {
			let _alt: number;
			this.state = 445;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.PREFIXIRI:
			case DiscoverySyntaxParser.IRIREF:
			case DiscoverySyntaxParser.QUOTED_STRING:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 436;
				this.iri();
				this.state = 441;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,52,this._ctx);
				while ( _alt!==2 && _alt!==ATN.INVALID_ALT_NUMBER ) {
					if ( _alt===1 ) {
						{
						{
						this.state = 437;
						this.match(DiscoverySyntaxParser.T__2);
						this.state = 438;
						this.classExpression();
						}
						} 
					}
					this.state = 443;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input,52,this._ctx);
				}
				}
				break;
			case DiscoverySyntaxParser.T__4:
			case DiscoverySyntaxParser.T__6:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 444;
				this.roleGroup();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
		this.enterRule(_localctx, 76, DiscoverySyntaxParser.RULE_iri);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 447;
			_la = this._input.LA(1);
			if ( !(((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (DiscoverySyntaxParser.PREFIXIRI - 53)) | (1 << (DiscoverySyntaxParser.IRIREF - 53)) | (1 << (DiscoverySyntaxParser.QUOTED_STRING - 53)))) !== 0)) ) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
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
	public roleGroup(): RoleGroupContext {
		let _localctx: RoleGroupContext = new RoleGroupContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, DiscoverySyntaxParser.RULE_roleGroup);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 449;
			_la = this._input.LA(1);
			if ( !(_la===DiscoverySyntaxParser.T__4 || _la===DiscoverySyntaxParser.T__6) ) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 450;
			this.role();
			this.state = 455;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===DiscoverySyntaxParser.SC) {
				{
				{
				this.state = 451;
				this.match(DiscoverySyntaxParser.SC);
				this.state = 452;
				this.role();
				}
				}
				this.state = 457;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 458;
			_la = this._input.LA(1);
			if ( !(_la===DiscoverySyntaxParser.T__5 || _la===DiscoverySyntaxParser.T__7) ) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
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
	public role(): RoleContext {
		let _localctx: RoleContext = new RoleContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, DiscoverySyntaxParser.RULE_role);
		let _la: number;
		try {
			this.state = 470;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.PREFIXIRI:
			case DiscoverySyntaxParser.IRIREF:
			case DiscoverySyntaxParser.QUOTED_STRING:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 460;
				this.iri();
				this.state = 462;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===DiscoverySyntaxParser.EQ) {
					{
					this.state = 461;
					this.match(DiscoverySyntaxParser.EQ);
					}
				}

				this.state = 466;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input,56,this._ctx) ) {
				case 1:
					{
					this.state = 464;
					this.classExpression();
					}
					break;

				case 2:
					{
					this.state = 465;
					this.dataRange();
					}
					break;
				}
				}
				break;
			case DiscoverySyntaxParser.MINCOUNT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 468;
				this.minCount();
				}
				break;
			case DiscoverySyntaxParser.MAXCOUNT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 469;
				this.maxCount();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public dataRange(): DataRangeContext {
		let _localctx: DataRangeContext = new DataRangeContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, DiscoverySyntaxParser.RULE_dataRange);
		try {
			this.state = 476;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,58,this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 472;
				this.valueCollection();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 473;
				this.typedString();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 474;
				this.match(DiscoverySyntaxParser.QUOTED_STRING);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 475;
				this.rangeValue();
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
	public rangeValue(): RangeValueContext {
		let _localctx: RangeValueContext = new RangeValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, DiscoverySyntaxParser.RULE_rangeValue);
		let _la: number;
		try {
			this.state = 488;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.MININCLUSIVE:
			case DiscoverySyntaxParser.MINEXCLUSIVE:
				this.enterOuterAlt(_localctx, 1);
				{
				{
				this.state = 478;
				_la = this._input.LA(1);
				if ( !(_la===DiscoverySyntaxParser.MININCLUSIVE || _la===DiscoverySyntaxParser.MINEXCLUSIVE) ) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 481;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case DiscoverySyntaxParser.QUOTED_STRING:
					{
					this.state = 479;
					this.typedString();
					}
					break;
				case DiscoverySyntaxParser.DOUBLE:
					{
					this.state = 480;
					this.match(DiscoverySyntaxParser.DOUBLE);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				break;
			case DiscoverySyntaxParser.MAXINCLUSIVE:
			case DiscoverySyntaxParser.MAXEXCLUSIVE:
				this.enterOuterAlt(_localctx, 2);
				{
				{
				this.state = 483;
				_la = this._input.LA(1);
				if ( !(_la===DiscoverySyntaxParser.MAXINCLUSIVE || _la===DiscoverySyntaxParser.MAXEXCLUSIVE) ) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 486;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case DiscoverySyntaxParser.QUOTED_STRING:
					{
					this.state = 484;
					this.typedString();
					}
					break;
				case DiscoverySyntaxParser.DOUBLE:
					{
					this.state = 485;
					this.match(DiscoverySyntaxParser.DOUBLE);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public typedString(): TypedStringContext {
		let _localctx: TypedStringContext = new TypedStringContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, DiscoverySyntaxParser.RULE_typedString);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 490;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
			this.state = 491;
			this.match(DiscoverySyntaxParser.T__8);
			this.state = 492;
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
	public valueCollection(): ValueCollectionContext {
		let _localctx: ValueCollectionContext = new ValueCollectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, DiscoverySyntaxParser.RULE_valueCollection);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 494;
			this.match(DiscoverySyntaxParser.T__1);
			this.state = 497;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input,62,this._ctx) ) {
			case 1:
				{
				this.state = 495;
				this.match(DiscoverySyntaxParser.QUOTED_STRING);
				}
				break;

			case 2:
				{
				this.state = 496;
				this.typedString();
				}
				break;
			}
			this.state = 504; 
			this._errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					{
					this.state = 499;
					this.match(DiscoverySyntaxParser.T__2);
					this.state = 502;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input,63,this._ctx) ) {
					case 1:
						{
						this.state = 500;
						this.match(DiscoverySyntaxParser.QUOTED_STRING);
						}
						break;

					case 2:
						{
						this.state = 501;
						this.typedString();
						}
						break;
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 506; 
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input,64,this._ctx);
			} while ( _alt!==1 && _alt!==ATN.INVALID_ALT_NUMBER );
			this.state = 508;
			this.match(DiscoverySyntaxParser.T__3);
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
	public dataRangeCollection(): DataRangeCollectionContext {
		let _localctx: DataRangeCollectionContext = new DataRangeCollectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, DiscoverySyntaxParser.RULE_dataRangeCollection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 510;
			this.match(DiscoverySyntaxParser.T__1);
			this.state = 511;
			this.dataRange();
			this.state = 514; 
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 512;
				this.match(DiscoverySyntaxParser.T__2);
				this.state = 513;
				this.dataRange();
				}
				}
				this.state = 516; 
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ( _la===DiscoverySyntaxParser.T__2 );
			this.state = 518;
			this.match(DiscoverySyntaxParser.T__3);
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
		"\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03A\u020B\x04\x02"+
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07"+
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04"+
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04"+
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04"+
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04"+
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#"+
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+"+
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02"+
		"\x03\x03\x03\x03\x03\x03\x05\x03g\n\x03\x03\x04\x03\x04\x05\x04k\n\x04"+
		"\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05"+
		"\x05\x05v\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06}\n\x06"+
		"\x07\x06\x7F\n\x06\f\x06\x0E\x06\x82\v\x06\x05\x06\x84\n\x06\x03\x06\x03"+
		"\x06\x03\x06\x03\x06\x05\x06\x8A\n\x06\x07\x06\x8C\n\x06\f\x06\x0E\x06"+
		"\x8F\v\x06\x05\x06\x91\n\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05"+
		"\x07\x98\n\x07\x07\x07\x9A\n\x07\f\x07\x0E\x07\x9D\v\x07\x05\x07\x9F\n"+
		"\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xA6\n\b\x07\b\xA8\n\b\f\b\x0E"+
		"\b\xAB\v\b\x05\b\xAD\n\b\x03\b\x03\b\x05\b\xB1\n\b\x03\b\x03\b\x03\b\x03"+
		"\b\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\xBF\n\t\x07\t"+
		"\xC1\n\t\f\t\x0E\t\xC4\v\t\x05\t\xC6\n\t\x03\t\x03\t\x03\t\x03\t\x05\t"+
		"\xCC\n\t\x07\t\xCE\n\t\f\t\x0E\t\xD1\v\t\x05\t\xD3\n\t\x03\t\x03\t\x03"+
		"\t\x03\t\x07\t\xD9\n\t\f\t\x0E\t\xDC\v\t\x05\t\xDE\n\t\x03\n\x03\n\x03"+
		"\n\x03\n\x03\n\x05\n\xE5\n\n\x07\n\xE7\n\n\f\n\x0E\n\xEA\v\n\x05\n\xEC"+
		"\n\n\x03\n\x03\n\x03\n\x03\n\x07\n\xF2\n\n\f\n\x0E\n\xF5\v\n\x05\n\xF7"+
		"\n\n\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v\xFE\n\v\x07\v\u0100\n\v\f\v\x0E"+
		"\v\u0103\v\v\x05\v\u0105\n\v\x03\v\x03\v\x03\v\x03\v\x07\v\u010B\n\v\f"+
		"\v\x0E\v\u010E\v\v\x05\v\u0110\n\v\x03\f\x03\f\x03\f\x03\f\x03\f\x05\f"+
		"\u0117\n\f\x07\f\u0119\n\f\f\f\x0E\f\u011C\v\f\x05\f\u011E\n\f\x03\f\x03"+
		"\f\x03\f\x03\f\x07\f\u0124\n\f\f\f\x0E\f\u0127\v\f\x05\f\u0129\n\f\x03"+
		"\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x06\x0E\u0133\n"+
		"\x0E\r\x0E\x0E\x0E\u0134\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x0F"+
		"\x03\x0F\x05\x0F\u013E\n\x0F\x07\x0F\u0140\n\x0F\f\x0F\x0E\x0F\u0143\v"+
		"\x0F\x05\x0F\u0145\n\x0F\x03\x0F\x03\x0F\x05\x0F\u0149\n\x0F\x03\x0F\x03"+
		"\x0F\x05\x0F\u014D\n\x0F\x03\x0F\x03\x0F\x05\x0F\u0151\n\x0F\x03\x10\x03"+
		"\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03"+
		"\x11\x07\x11\u015E\n\x11\f\x11\x0E\x11\u0161\v\x11\x05\x11\u0163\n\x11"+
		"\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12"+
		"\u016D\n\x12\x03\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x15\x03"+
		"\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x17\x03\x17\x03\x17\x03\x18\x03"+
		"\x18\x03\x18\x03\x19\x03\x19\x03\x19\x03\x19\x03\x19\x03\x19\x05\x19\u0187"+
		"\n\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x05\x1A\u018F\n"+
		"\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1C\x03\x1C\x03\x1C\x03\x1D\x05\x1D\u0198"+
		"\n\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03\x1F"+
		"\x03 \x03 \x03 \x03!\x03!\x03!\x03\"\x03\"\x03\"\x03#\x03#\x03#\x03$\x03"+
		"$\x03$\x03%\x03%\x03%\x03&\x03&\x03&\x03\'\x03\'\x03\'\x07\'\u01BA\n\'"+
		"\f\'\x0E\'\u01BD\v\'\x03\'\x05\'\u01C0\n\'\x03(\x03(\x03)\x03)\x03)\x03"+
		")\x07)\u01C8\n)\f)\x0E)\u01CB\v)\x03)\x03)\x03*\x03*\x05*\u01D1\n*\x03"+
		"*\x03*\x05*\u01D5\n*\x03*\x03*\x05*\u01D9\n*\x03+\x03+\x03+\x03+\x05+"+
		"\u01DF\n+\x03,\x03,\x03,\x05,\u01E4\n,\x03,\x03,\x03,\x05,\u01E9\n,\x05"+
		",\u01EB\n,\x03-\x03-\x03-\x03-\x03.\x03.\x03.\x05.\u01F4\n.\x03.\x03."+
		"\x03.\x05.\u01F9\n.\x06.\u01FB\n.\r.\x0E.\u01FC\x03.\x03.\x03/\x03/\x03"+
		"/\x03/\x06/\u0205\n/\r/\x0E/\u0206\x03/\x03/\x03/\x04\u0134\u01FC\x02"+
		"\x020\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02"+
		"\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02"+
		"(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02"+
		"D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02\x02"+
		"\b\x03\x02\x10\x12\x04\x0278==\x04\x02\x07\x07\t\t\x04\x02\b\b\n\n\x04"+
		"\x02((**\x04\x02))++\u0230\x02^\x03\x02\x02\x02\x04f\x03\x02\x02\x02\x06"+
		"j\x03\x02\x02\x02\bl\x03\x02\x02\x02\nw\x03\x02\x02\x02\f\x92\x03\x02"+
		"\x02\x02\x0E\xA0\x03\x02\x02\x02\x10\xB9\x03\x02\x02\x02\x12\xDF\x03\x02"+
		"\x02\x02\x14\xF8\x03\x02\x02\x02\x16\u0111\x03\x02\x02\x02\x18\u012A\x03"+
		"\x02\x02\x02\x1A\u012D\x03\x02\x02\x02\x1C\u0138\x03\x02\x02\x02\x1E\u0152"+
		"\x03\x02\x02\x02 \u0155\x03\x02\x02\x02\"\u016C\x03\x02\x02\x02$\u016E"+
		"\x03\x02\x02\x02&\u0171\x03\x02\x02\x02(\u0174\x03\x02\x02\x02*\u0177"+
		"\x03\x02\x02\x02,\u017A\x03\x02\x02\x02.\u017D\x03\x02\x02\x020\u0180"+
		"\x03\x02\x02\x022\u018E\x03\x02\x02\x024\u0190\x03\x02\x02\x026\u0193"+
		"\x03\x02\x02\x028\u0197\x03\x02\x02\x02:\u019B\x03\x02\x02\x02<\u019E"+
		"\x03\x02\x02\x02>\u01A1\x03\x02\x02\x02@\u01A4\x03\x02\x02\x02B\u01A7"+
		"\x03\x02\x02\x02D\u01AA\x03\x02\x02\x02F\u01AD\x03\x02\x02\x02H\u01B0"+
		"\x03\x02\x02\x02J\u01B3\x03\x02\x02\x02L\u01BF\x03\x02\x02\x02N\u01C1"+
		"\x03\x02\x02\x02P\u01C3\x03\x02\x02\x02R\u01D8\x03\x02\x02\x02T\u01DE"+
		"\x03\x02\x02\x02V\u01EA\x03\x02\x02\x02X\u01EC\x03\x02\x02\x02Z\u01F0"+
		"\x03\x02\x02\x02\\\u0200\x03\x02\x02\x02^_\x058\x1D\x02_`\x05\b\x05\x02"+
		"`a\x07\x03\x02\x02ab\x07\x02\x02\x03b\x03\x03\x02\x02\x02cg\x05B\"\x02"+
		"dg\x05D#\x02eg\x05F$\x02fc\x03\x02\x02\x02fd\x03\x02\x02\x02fe\x03\x02"+
		"\x02\x02g\x05\x03\x02\x02\x02hk\x05H%\x02ik\x05J&\x02jh\x03\x02\x02\x02"+
		"ji\x03\x02\x02\x02k\x07\x03\x02\x02\x02lu\x07\x15\x02\x02mv\x05\n\x06"+
		"\x02nv\x05\f\x07\x02ov\x05\x10\t\x02pv\x05\x0E\b\x02qv\x05\x1C\x0F\x02"+
		"rv\x05\x12\n\x02sv\x05\x16\f\x02tv\x05\x14\v\x02um\x03\x02\x02\x02un\x03"+
		"\x02\x02\x02uo\x03\x02\x02\x02up\x03\x02\x02\x02uq\x03\x02\x02\x02ur\x03"+
		"\x02\x02\x02us\x03\x02\x02\x02ut\x03\x02\x02\x02v\t\x03\x02\x02\x02w\x83"+
		"\x07\x1A\x02\x02xy\x07A\x02\x02y\x80\x052\x1A\x02z|\x07A\x02\x02{}\x05"+
		"2\x1A\x02|{\x03\x02\x02\x02|}\x03\x02\x02\x02}\x7F\x03\x02\x02\x02~z\x03"+
		"\x02\x02\x02\x7F\x82\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x80\x81\x03"+
		"\x02\x02\x02\x81\x84\x03\x02\x02\x02\x82\x80\x03\x02\x02\x02\x83x\x03"+
		"\x02\x02\x02\x83\x84\x03\x02\x02\x02\x84\x90\x03\x02\x02\x02\x85\x86\x07"+
		"A\x02\x02\x86\x8D\x05\x04\x03\x02\x87\x89\x07A\x02\x02\x88\x8A\x05\x04"+
		"\x03\x02\x89\x88\x03\x02\x02\x02\x89\x8A\x03\x02\x02\x02\x8A\x8C\x03\x02"+
		"\x02\x02\x8B\x87\x03\x02\x02\x02\x8C\x8F\x03\x02\x02\x02\x8D\x8B\x03\x02"+
		"\x02\x02\x8D\x8E\x03\x02\x02\x02\x8E\x91\x03\x02\x02\x02\x8F\x8D\x03\x02"+
		"\x02\x02\x90\x85\x03\x02\x02\x02\x90\x91\x03\x02\x02\x02\x91\v\x03\x02"+
		"\x02\x02\x92\x9E\x07\x1F\x02\x02\x93\x94\x07A\x02\x02\x94\x9B\x052\x1A"+
		"\x02\x95\x97\x07A\x02\x02\x96\x98\x052\x1A\x02\x97\x96\x03\x02\x02\x02"+
		"\x97\x98\x03\x02\x02\x02\x98\x9A\x03\x02\x02\x02\x99\x95\x03\x02\x02\x02"+
		"\x9A\x9D\x03\x02\x02\x02\x9B\x99\x03\x02\x02\x02\x9B\x9C\x03\x02\x02\x02"+
		"\x9C\x9F\x03\x02\x02\x02\x9D\x9B\x03\x02\x02\x02\x9E\x93\x03\x02\x02\x02"+
		"\x9E\x9F\x03\x02\x02\x02\x9F\r\x03\x02\x02\x02\xA0\xAC\x07\x17\x02\x02"+
		"\xA1\xA2\x07A\x02\x02\xA2\xA9\x052\x1A\x02\xA3\xA5\x07A\x02\x02\xA4\xA6"+
		"\x052\x1A\x02\xA5\xA4\x03\x02\x02\x02\xA5\xA6\x03\x02\x02\x02\xA6\xA8"+
		"\x03\x02\x02\x02\xA7\xA3\x03\x02\x02\x02\xA8\xAB\x03\x02\x02\x02\xA9\xA7"+
		"\x03\x02\x02\x02\xA9\xAA\x03\x02\x02\x02\xAA\xAD\x03\x02\x02\x02\xAB\xA9"+
		"\x03\x02\x02\x02\xAC\xA1\x03\x02\x02\x02\xAC\xAD\x03\x02\x02\x02\xAD\xB0"+
		"\x03\x02\x02\x02\xAE\xAF\x07A\x02\x02\xAF\xB1\x05B\"\x02\xB0\xAE\x03\x02"+
		"\x02\x02\xB0\xB1\x03\x02\x02\x02\xB1\xB2\x03\x02\x02\x02\xB2\xB3\x07A"+
		"\x02\x02\xB3\xB4\x05\x1E\x10\x02\xB4\xB5\x07A\x02\x02\xB5\xB6\x05 \x11"+
		"\x02\xB6\xB7\x07A\x02\x02\xB7\xB8\x05 \x11\x02\xB8\x0F\x03\x02\x02\x02"+
		"\xB9\xC5\x07\x18\x02\x02\xBA\xBB\x07A\x02\x02\xBB\xC2\x052\x1A\x02\xBC"+
		"\xBE\x07A\x02\x02\xBD\xBF\x052\x1A\x02\xBE\xBD\x03\x02\x02\x02\xBE\xBF"+
		"\x03\x02\x02\x02\xBF\xC1\x03\x02\x02\x02\xC0\xBC\x03\x02\x02\x02\xC1\xC4"+
		"\x03\x02\x02\x02\xC2\xC0\x03\x02\x02\x02\xC2\xC3\x03\x02\x02\x02\xC3\xC6"+
		"\x03\x02\x02\x02\xC4\xC2\x03\x02\x02\x02\xC5\xBA\x03\x02\x02\x02\xC5\xC6"+
		"\x03\x02\x02\x02\xC6\xD2\x03\x02\x02\x02\xC7\xC8\x07A\x02\x02\xC8\xCF"+
		"\x05\x04\x03\x02\xC9\xCB\x07A\x02\x02\xCA\xCC\x05\x04\x03\x02\xCB\xCA"+
		"\x03\x02\x02\x02\xCB\xCC\x03\x02\x02\x02\xCC\xCE\x03\x02\x02\x02\xCD\xC9"+
		"\x03\x02\x02\x02\xCE\xD1\x03\x02\x02\x02\xCF\xCD\x03\x02\x02\x02\xCF\xD0"+
		"\x03\x02\x02\x02\xD0\xD3\x03\x02\x02\x02\xD1\xCF\x03\x02\x02\x02\xD2\xC7"+
		"\x03\x02\x02\x02\xD2\xD3\x03\x02\x02\x02\xD3\xDD\x03\x02\x02\x02\xD4\xD5"+
		"\x07A\x02\x02\xD5\xDA\x05R*\x02\xD6\xD7\x07A\x02\x02\xD7\xD9\x05R*\x02"+
		"\xD8\xD6\x03\x02\x02\x02\xD9\xDC\x03\x02\x02\x02\xDA\xD8\x03\x02\x02\x02"+
		"\xDA\xDB\x03\x02\x02\x02\xDB\xDE\x03\x02\x02\x02\xDC\xDA\x03\x02\x02\x02"+
		"\xDD\xD4\x03\x02\x02\x02\xDD\xDE\x03\x02\x02\x02\xDE\x11\x03\x02\x02\x02"+
		"\xDF\xEB\x07\x1B\x02\x02\xE0\xE1\x07A\x02\x02\xE1\xE8\x052\x1A\x02\xE2"+
		"\xE4\x07A\x02\x02\xE3\xE5\x052\x1A\x02\xE4\xE3\x03\x02\x02\x02\xE4\xE5"+
		"\x03\x02\x02\x02\xE5\xE7\x03\x02\x02\x02\xE6\xE2\x03\x02\x02\x02\xE7\xEA"+
		"\x03\x02\x02\x02\xE8\xE6\x03\x02\x02\x02\xE8\xE9\x03\x02\x02\x02\xE9\xEC"+
		"\x03\x02\x02\x02\xEA\xE8\x03\x02\x02\x02\xEB\xE0\x03\x02\x02\x02\xEB\xEC"+
		"\x03\x02\x02\x02\xEC\xF6\x03\x02\x02\x02\xED\xEE\x07A\x02\x02\xEE\xF3"+
		"\x05\x06\x04\x02\xEF\xF0\x07A\x02\x02\xF0\xF2\x05\x06\x04\x02\xF1\xEF"+
		"\x03\x02\x02\x02\xF2\xF5\x03\x02\x02\x02\xF3\xF1\x03\x02\x02\x02\xF3\xF4"+
		"\x03\x02\x02\x02\xF4\xF7\x03\x02\x02\x02\xF5\xF3\x03\x02\x02\x02\xF6\xED"+
		"\x03\x02\x02\x02\xF6\xF7\x03\x02\x02\x02\xF7\x13\x03\x02\x02\x02\xF8\u0104"+
		"\x07\x1C\x02\x02\xF9\xFA\x07A\x02\x02\xFA\u0101\x052\x1A\x02\xFB\xFD\x07"+
		"A\x02\x02\xFC\xFE\x052\x1A\x02\xFD\xFC\x03\x02\x02\x02\xFD\xFE\x03\x02"+
		"\x02\x02\xFE\u0100\x03\x02\x02\x02\xFF\xFB\x03\x02\x02\x02\u0100\u0103"+
		"\x03\x02\x02\x02\u0101\xFF\x03\x02\x02\x02\u0101\u0102\x03\x02\x02\x02"+
		"\u0102\u0105\x03\x02\x02\x02\u0103\u0101\x03\x02\x02\x02\u0104\xF9\x03"+
		"\x02\x02\x02\u0104\u0105\x03\x02\x02\x02\u0105\u010F\x03\x02\x02\x02\u0106"+
		"\u0107\x07A\x02\x02\u0107\u010C\x05\x06\x04\x02\u0108\u0109\x07A\x02\x02"+
		"\u0109\u010B\x05\x06\x04\x02\u010A\u0108\x03\x02\x02\x02\u010B\u010E\x03"+
		"\x02\x02\x02\u010C\u010A\x03\x02\x02\x02\u010C\u010D\x03\x02\x02\x02\u010D"+
		"\u0110\x03\x02\x02\x02\u010E\u010C\x03\x02\x02\x02\u010F\u0106\x03\x02"+
		"\x02\x02\u010F\u0110\x03\x02\x02\x02\u0110\x15\x03\x02\x02\x02\u0111\u011D"+
		"\x07\x1D\x02\x02\u0112\u0113\x07A\x02\x02\u0113\u011A\x052\x1A\x02\u0114"+
		"\u0116\x07A\x02\x02\u0115\u0117\x052\x1A\x02\u0116\u0115\x03\x02\x02\x02"+
		"\u0116\u0117\x03\x02\x02\x02\u0117\u0119\x03\x02\x02\x02\u0118\u0114\x03"+
		"\x02\x02\x02\u0119\u011C\x03\x02\x02\x02\u011A\u0118\x03\x02\x02\x02\u011A"+
		"\u011B\x03\x02\x02\x02\u011B\u011E\x03\x02\x02\x02\u011C\u011A\x03\x02"+
		"\x02\x02\u011D\u0112\x03\x02\x02\x02\u011D\u011E\x03\x02\x02\x02\u011E"+
		"\u0128\x03\x02\x02\x02\u011F\u0120\x07A\x02\x02\u0120\u0125\x05\x06\x04"+
		"\x02\u0121\u0122\x07A\x02\x02\u0122\u0124\x05\x06\x04\x02\u0123\u0121"+
		"\x03\x02\x02\x02\u0124\u0127\x03\x02\x02\x02\u0125\u0123\x03\x02\x02\x02"+
		"\u0125\u0126\x03\x02\x02\x02\u0126\u0129\x03\x02\x02\x02\u0127\u0125\x03"+
		"\x02\x02\x02\u0128\u011F\x03\x02\x02\x02\u0128\u0129\x03\x02\x02\x02\u0129"+
		"\x17\x03\x02\x02\x02\u012A\u012B\x07\r\x02\x02\u012B\u012C\x05L\'\x02"+
		"\u012C\x19\x03\x02\x02\x02\u012D\u012E\x07\x0E\x02\x02\u012E\u012F\x07"+
		"\x04\x02\x02\u012F\u0132\x05N(\x02\u0130\u0131\x07\x05\x02\x02\u0131\u0133"+
		"\x05N(\x02\u0132\u0130\x03\x02\x02\x02\u0133\u0134\x03\x02\x02\x02\u0134"+
		"\u0135\x03\x02\x02\x02\u0134\u0132\x03\x02\x02\x02\u0135\u0136\x03\x02"+
		"\x02\x02\u0136\u0137\x07\x06\x02\x02\u0137\x1B\x03\x02\x02\x02\u0138\u0144"+
		"\x07 \x02\x02\u0139\u013A\x07A\x02\x02\u013A\u0141\x052\x1A\x02\u013B"+
		"\u013D\x07A\x02\x02\u013C\u013E\x052\x1A\x02\u013D\u013C\x03\x02\x02\x02"+
		"\u013D\u013E\x03\x02\x02\x02\u013E\u0140\x03\x02\x02\x02\u013F\u013B\x03"+
		"\x02\x02\x02\u0140\u0143\x03\x02\x02\x02\u0141\u013F\x03\x02\x02\x02\u0141"+
		"\u0142\x03\x02\x02\x02\u0142\u0145\x03\x02\x02\x02\u0143\u0141\x03\x02"+
		"\x02\x02\u0144\u0139\x03\x02\x02\x02\u0144\u0145\x03\x02\x02\x02\u0145"+
		"\u0148\x03\x02\x02\x02\u0146\u0147\x07A\x02\x02\u0147\u0149\x05B\"\x02"+
		"\u0148\u0146\x03\x02\x02\x02\u0148\u0149\x03\x02\x02\x02\u0149\u014C\x03"+
		"\x02\x02\x02\u014A\u014B\x07A\x02\x02\u014B\u014D\x05\x18\r\x02\u014C"+
		"\u014A\x03\x02\x02\x02\u014C\u014D\x03\x02\x02\x02\u014D\u0150\x03\x02"+
		"\x02\x02\u014E\u014F\x07A\x02\x02\u014F\u0151\x05\x1A\x0E\x02\u0150\u014E"+
		"\x03\x02\x02\x02\u0150\u0151\x03\x02\x02\x02\u0151\x1D\x03\x02\x02\x02"+
		"\u0152\u0153\x07\x19\x02\x02\u0153\u0154\x05N(\x02\u0154\x1F\x03\x02\x02"+
		"\x02\u0155\u0156\x07\x1E\x02\x02\u0156\u0157\x07\x07\x02\x02\u0157\u0158"+
		"\x07!\x02\x02\u0158\u0162\x05N(\x02\u0159\u015A\x07A\x02\x02\u015A\u015F"+
		"\x05\"\x12\x02\u015B\u015C\x07A\x02\x02\u015C\u015E\x05\"\x12\x02\u015D"+
		"\u015B\x03\x02\x02\x02\u015E\u0161\x03\x02\x02\x02\u015F\u015D\x03\x02"+
		"\x02\x02\u015F\u0160\x03\x02\x02\x02\u0160\u0163\x03\x02\x02\x02\u0161"+
		"\u015F\x03\x02\x02\x02\u0162\u0159\x03\x02\x02\x02\u0162\u0163\x03\x02"+
		"\x02\x02\u0163\u0164\x03\x02\x02\x02\u0164\u0165\x07\b\x02\x02\u0165!"+
		"\x03\x02\x02\x02\u0166\u016D\x05$\x13\x02\u0167\u016D\x05&\x14\x02\u0168"+
		"\u016D\x05(\x15\x02\u0169\u016D\x05*\x16\x02\u016A\u016D\x050\x19\x02"+
		"\u016B\u016D\x05T+\x02\u016C\u0166\x03\x02\x02\x02\u016C\u0167\x03\x02"+
		"\x02\x02\u016C\u0168\x03\x02\x02\x02\u016C\u0169\x03\x02\x02\x02\u016C"+
		"\u016A\x03\x02\x02\x02\u016C\u016B\x03\x02\x02\x02\u016D#\x03\x02\x02"+
		"\x02\u016E\u016F\x07\"\x02\x02\u016F\u0170\x071\x02\x02\u0170%\x03\x02"+
		"\x02\x02\u0171\u0172\x07#\x02\x02\u0172\u0173\x071\x02\x02\u0173\'\x03"+
		"\x02\x02\x02\u0174\u0175\x07(\x02\x02\u0175\u0176\x072\x02\x02\u0176)"+
		"\x03\x02\x02\x02\u0177\u0178\x07)\x02\x02\u0178\u0179\x072\x02\x02\u0179"+
		"+\x03\x02\x02\x02\u017A\u017B\x07*\x02\x02\u017B\u017C\x072\x02\x02\u017C"+
		"-\x03\x02\x02\x02\u017D\u017E\x07+\x02\x02\u017E\u017F\x072\x02\x02\u017F"+
		"/\x03\x02\x02\x02\u0180\u0186\x07\x1A\x02\x02\u0181\u0187\x05N(\x02\u0182"+
		"\u0183\x07\x07\x02\x02\u0183\u0184\x05 \x11\x02\u0184\u0185\x07\b\x02"+
		"\x02\u0185\u0187\x03\x02\x02\x02\u0186\u0181\x03\x02\x02\x02\u0186\u0182"+
		"\x03\x02\x02\x02\u01871\x03\x02\x02\x02\u0188\u018F\x05:\x1E\x02\u0189"+
		"\u018F\x05<\x1F\x02\u018A\u018F\x05> \x02\u018B\u018F\x05@!\x02\u018C"+
		"\u018F\x054\x1B\x02\u018D\u018F\x056\x1C\x02\u018E\u0188\x03\x02\x02\x02"+
		"\u018E\u0189\x03\x02\x02\x02\u018E\u018A\x03\x02\x02\x02\u018E\u018B\x03"+
		"\x02\x02\x02\u018E\u018C\x03\x02\x02\x02\u018E\u018D\x03\x02\x02\x02\u018F"+
		"3\x03\x02\x02\x02\u0190\u0191\x07\x0F\x02\x02\u0191\u0192\t\x02\x02\x02"+
		"\u01925\x03\x02\x02\x02\u0193\u0194\x07\x13\x02\x02\u0194\u0195\x07=\x02"+
		"\x02\u01957\x03\x02\x02\x02\u0196\u0198\x07\x14\x02\x02\u0197\u0196\x03"+
		"\x02\x02\x02\u0197\u0198\x03\x02\x02\x02\u0198\u0199\x03\x02\x02\x02\u0199"+
		"\u019A\x05N(\x02\u019A9\x03\x02\x02\x02\u019B\u019C\x07$\x02\x02\u019C"+
		"\u019D\x07=\x02\x02\u019D;\x03\x02\x02\x02\u019E\u019F\x07%\x02\x02\u019F"+
		"\u01A0\x07=\x02\x02\u01A0=\x03\x02\x02\x02\u01A1\u01A2\x07&\x02\x02\u01A2"+
		"\u01A3\x07=\x02\x02\u01A3?\x03\x02\x02\x02\u01A4\u01A5\x07\'\x02\x02\u01A5"+
		"\u01A6\x07=\x02\x02\u01A6A\x03\x02\x02\x02\u01A7\u01A8\x07,\x02\x02\u01A8"+
		"\u01A9\x05L\'\x02\u01A9C\x03\x02\x02\x02\u01AA\u01AB\x07-\x02\x02\u01AB"+
		"\u01AC\x05L\'\x02\u01ACE\x03\x02\x02\x02\u01AD\u01AE\x07.\x02\x02\u01AE"+
		"\u01AF\x05L\'\x02\u01AFG\x03\x02\x02\x02\u01B0\u01B1\x07/\x02\x02\u01B1"+
		"\u01B2\x05N(\x02\u01B2I\x03\x02\x02\x02\u01B3\u01B4\x070\x02\x02\u01B4"+
		"\u01B5\x05N(\x02\u01B5K\x03\x02\x02\x02\u01B6\u01BB\x05N(\x02\u01B7\u01B8"+
		"\x07\x05\x02\x02\u01B8\u01BA\x05L\'\x02\u01B9\u01B7\x03\x02\x02\x02\u01BA"+
		"\u01BD\x03\x02\x02\x02\u01BB\u01B9\x03\x02\x02\x02\u01BB\u01BC\x03\x02"+
		"\x02\x02\u01BC\u01C0\x03\x02\x02\x02\u01BD\u01BB\x03\x02\x02\x02\u01BE"+
		"\u01C0\x05P)\x02\u01BF\u01B6\x03\x02\x02\x02\u01BF\u01BE\x03\x02\x02\x02"+
		"\u01C0M\x03\x02\x02\x02\u01C1\u01C2\t\x03\x02\x02\u01C2O\x03\x02\x02\x02"+
		"\u01C3\u01C4\t\x04\x02\x02\u01C4\u01C9\x05R*\x02\u01C5\u01C6\x07A\x02"+
		"\x02\u01C6\u01C8\x05R*\x02\u01C7\u01C5\x03\x02\x02\x02\u01C8\u01CB\x03"+
		"\x02\x02\x02\u01C9\u01C7\x03\x02\x02\x02\u01C9\u01CA\x03\x02\x02\x02\u01CA"+
		"\u01CC\x03\x02\x02\x02\u01CB\u01C9\x03\x02\x02\x02\u01CC\u01CD\t\x05\x02"+
		"\x02\u01CDQ\x03\x02\x02\x02\u01CE\u01D0\x05N(\x02\u01CF\u01D1\x07\f\x02"+
		"\x02\u01D0\u01CF\x03\x02\x02\x02\u01D0\u01D1\x03\x02\x02\x02\u01D1\u01D4"+
		"\x03\x02\x02\x02\u01D2\u01D5\x05L\'\x02\u01D3\u01D5\x05T+\x02\u01D4\u01D2"+
		"\x03\x02\x02\x02\u01D4\u01D3\x03\x02\x02\x02\u01D5\u01D9\x03\x02\x02\x02"+
		"\u01D6\u01D9\x05$\x13\x02\u01D7\u01D9\x05&\x14\x02\u01D8\u01CE\x03\x02"+
		"\x02\x02\u01D8\u01D6\x03\x02\x02\x02\u01D8\u01D7\x03\x02\x02\x02\u01D9"+
		"S\x03\x02\x02\x02\u01DA\u01DF\x05Z.\x02\u01DB\u01DF\x05X-\x02\u01DC\u01DF"+
		"\x07=\x02\x02\u01DD\u01DF\x05V,\x02\u01DE\u01DA\x03\x02\x02\x02\u01DE"+
		"\u01DB\x03\x02\x02\x02\u01DE\u01DC\x03\x02\x02\x02\u01DE\u01DD\x03\x02"+
		"\x02\x02\u01DFU\x03\x02\x02\x02\u01E0\u01E3\t\x06\x02\x02\u01E1\u01E4"+
		"\x05X-\x02\u01E2\u01E4\x072\x02\x02\u01E3\u01E1\x03\x02\x02\x02\u01E3"+
		"\u01E2\x03\x02\x02\x02\u01E4\u01EB\x03\x02\x02\x02\u01E5\u01E8\t\x07\x02"+
		"\x02\u01E6\u01E9\x05X-\x02\u01E7\u01E9\x072\x02\x02\u01E8\u01E6\x03\x02"+
		"\x02\x02\u01E8\u01E7\x03\x02\x02\x02\u01E9\u01EB\x03\x02\x02\x02\u01EA"+
		"\u01E0\x03\x02\x02\x02\u01EA\u01E5\x03\x02\x02\x02\u01EBW\x03\x02\x02"+
		"\x02\u01EC\u01ED\x07=\x02\x02\u01ED\u01EE\x07\v\x02\x02\u01EE\u01EF\x05"+
		"N(\x02\u01EFY\x03\x02\x02\x02\u01F0\u01F3\x07\x04\x02\x02\u01F1\u01F4"+
		"\x07=\x02\x02\u01F2\u01F4\x05X-\x02\u01F3\u01F1\x03\x02\x02\x02\u01F3"+
		"\u01F2\x03\x02\x02\x02\u01F4\u01FA\x03\x02\x02\x02\u01F5\u01F8\x07\x05"+
		"\x02\x02\u01F6\u01F9\x07=\x02\x02\u01F7\u01F9\x05X-\x02\u01F8\u01F6\x03"+
		"\x02\x02\x02\u01F8\u01F7\x03\x02\x02\x02\u01F9\u01FB\x03\x02\x02\x02\u01FA"+
		"\u01F5\x03\x02\x02\x02\u01FB\u01FC\x03\x02\x02\x02\u01FC\u01FD\x03\x02"+
		"\x02\x02\u01FC\u01FA\x03\x02\x02\x02\u01FD\u01FE\x03\x02\x02\x02\u01FE"+
		"\u01FF\x07\x06\x02\x02\u01FF[\x03\x02\x02\x02\u0200\u0201\x07\x04\x02"+
		"\x02\u0201\u0204\x05T+\x02\u0202\u0203\x07\x05\x02\x02\u0203\u0205\x05"+
		"T+\x02\u0204\u0202\x03\x02\x02\x02\u0205\u0206\x03\x02\x02\x02\u0206\u0204"+
		"\x03\x02\x02\x02\u0206\u0207\x03\x02\x02\x02\u0207\u0208\x03\x02\x02\x02"+
		"\u0208\u0209\x07\x06\x02\x02\u0209]\x03\x02\x02\x02Dfju|\x80\x83\x89\x8D"+
		"\x90\x97\x9B\x9E\xA5\xA9\xAC\xB0\xBE\xC2\xC5\xCB\xCF\xD2\xDA\xDD\xE4\xE8"+
		"\xEB\xF3\xF6\xFD\u0101\u0104\u010C\u010F\u0116\u011A\u011D\u0125\u0128"+
		"\u0134\u013D\u0141\u0144\u0148\u014C\u0150\u015F\u0162\u016C\u0186\u018E"+
		"\u0197\u01BB\u01BF\u01C9\u01D0\u01D4\u01D8\u01DE\u01E3\u01E8\u01EA\u01F3"+
		"\u01F8\u01FC\u0206";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!DiscoverySyntaxParser.__ATN) {
			DiscoverySyntaxParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(DiscoverySyntaxParser._serializedATN));
		}

		return DiscoverySyntaxParser.__ATN;
	}

}

export class ConceptContext extends ParserRuleContext {
	public identifierIri(): IdentifierIriContext {
		return this.getRuleContext(0, IdentifierIriContext);
	}
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	public EOF(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EOF, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_concept; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterConcept) listener.enterConcept(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitConcept) listener.exitConcept(this);
	}
}


export class ClassAxiomContext extends ParserRuleContext {
	public subclassOf(): SubclassOfContext | undefined {
		return this.tryGetRuleContext(0, SubclassOfContext);
	}
	public equivalentTo(): EquivalentToContext | undefined {
		return this.tryGetRuleContext(0, EquivalentToContext);
	}
	public disjointWith(): DisjointWithContext | undefined {
		return this.tryGetRuleContext(0, DisjointWithContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classAxiom; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassAxiom) listener.enterClassAxiom(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassAxiom) listener.exitClassAxiom(this);
	}
}


export class PropertyAxiomContext extends ParserRuleContext {
	public subpropertyOf(): SubpropertyOfContext | undefined {
		return this.tryGetRuleContext(0, SubpropertyOfContext);
	}
	public inverseOf(): InverseOfContext | undefined {
		return this.tryGetRuleContext(0, InverseOfContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_propertyAxiom; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPropertyAxiom) listener.enterPropertyAxiom(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPropertyAxiom) listener.exitPropertyAxiom(this);
	}
}


export class TypeContext extends ParserRuleContext {
	public TYPE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.TYPE, 0); }
	public classType(): ClassTypeContext | undefined {
		return this.tryGetRuleContext(0, ClassTypeContext);
	}
	public dataType(): DataTypeContext | undefined {
		return this.tryGetRuleContext(0, DataTypeContext);
	}
	public recordType(): RecordTypeContext | undefined {
		return this.tryGetRuleContext(0, RecordTypeContext);
	}
	public shape(): ShapeContext | undefined {
		return this.tryGetRuleContext(0, ShapeContext);
	}
	public valueSet(): ValueSetContext | undefined {
		return this.tryGetRuleContext(0, ValueSetContext);
	}
	public objectProperty(): ObjectPropertyContext | undefined {
		return this.tryGetRuleContext(0, ObjectPropertyContext);
	}
	public annotationProperty(): AnnotationPropertyContext | undefined {
		return this.tryGetRuleContext(0, AnnotationPropertyContext);
	}
	public dataProperty(): DataPropertyContext | undefined {
		return this.tryGetRuleContext(0, DataPropertyContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_type; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterType) listener.enterType(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitType) listener.exitType(this);
	}
}


export class ClassTypeContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLASS, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public classAxiom(): ClassAxiomContext[];
	public classAxiom(i: number): ClassAxiomContext;
	public classAxiom(i?: number): ClassAxiomContext | ClassAxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassAxiomContext);
		} else {
			return this.getRuleContext(i, ClassAxiomContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classType; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassType) listener.enterClassType(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassType) listener.exitClassType(this);
	}
}


export class DataTypeContext extends ParserRuleContext {
	public DATATYPE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DATATYPE, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_dataType; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDataType) listener.enterDataType(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDataType) listener.exitDataType(this);
	}
}


export class ShapeContext extends ParserRuleContext {
	public SHAPE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SHAPE, 0); }
	public shapeOf(): ShapeOfContext {
		return this.getRuleContext(0, ShapeOfContext);
	}
	public propertyConstraint(): PropertyConstraintContext[];
	public propertyConstraint(i: number): PropertyConstraintContext;
	public propertyConstraint(i?: number): PropertyConstraintContext | PropertyConstraintContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyConstraintContext);
		} else {
			return this.getRuleContext(i, PropertyConstraintContext);
		}
	}
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public subclassOf(): SubclassOfContext | undefined {
		return this.tryGetRuleContext(0, SubclassOfContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_shape; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterShape) listener.enterShape(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitShape) listener.exitShape(this);
	}
}


export class RecordTypeContext extends ParserRuleContext {
	public RECORDTYPE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.RECORDTYPE, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public classAxiom(): ClassAxiomContext[];
	public classAxiom(i: number): ClassAxiomContext;
	public classAxiom(i?: number): ClassAxiomContext | ClassAxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassAxiomContext);
		} else {
			return this.getRuleContext(i, ClassAxiomContext);
		}
	}
	public role(): RoleContext[];
	public role(i: number): RoleContext;
	public role(i?: number): RoleContext | RoleContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RoleContext);
		} else {
			return this.getRuleContext(i, RoleContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_recordType; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRecordType) listener.enterRecordType(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRecordType) listener.exitRecordType(this);
	}
}


export class ObjectPropertyContext extends ParserRuleContext {
	public OBJECTPROPERTY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.OBJECTPROPERTY, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public propertyAxiom(): PropertyAxiomContext[];
	public propertyAxiom(i: number): PropertyAxiomContext;
	public propertyAxiom(i?: number): PropertyAxiomContext | PropertyAxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyAxiomContext);
		} else {
			return this.getRuleContext(i, PropertyAxiomContext);
		}
	}
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
	public DATAPROPERTY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DATAPROPERTY, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public propertyAxiom(): PropertyAxiomContext[];
	public propertyAxiom(i: number): PropertyAxiomContext;
	public propertyAxiom(i?: number): PropertyAxiomContext | PropertyAxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyAxiomContext);
		} else {
			return this.getRuleContext(i, PropertyAxiomContext);
		}
	}
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


export class AnnotationPropertyContext extends ParserRuleContext {
	public ANNOTATION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.ANNOTATION, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public propertyAxiom(): PropertyAxiomContext[];
	public propertyAxiom(i: number): PropertyAxiomContext;
	public propertyAxiom(i?: number): PropertyAxiomContext | PropertyAxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyAxiomContext);
		} else {
			return this.getRuleContext(i, PropertyAxiomContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_annotationProperty; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterAnnotationProperty) listener.enterAnnotationProperty(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitAnnotationProperty) listener.exitAnnotationProperty(this);
	}
}


export class MembersContext extends ParserRuleContext {
	public MEMBER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MEMBER, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_members; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMembers) listener.enterMembers(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMembers) listener.exitMembers(this);
	}
}


export class ExpansionContext extends ParserRuleContext {
	public EXPANSION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EXPANSION, 0); }
	public iri(): IriContext[];
	public iri(i: number): IriContext;
	public iri(i?: number): IriContext | IriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IriContext);
		} else {
			return this.getRuleContext(i, IriContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_expansion; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterExpansion) listener.enterExpansion(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitExpansion) listener.exitExpansion(this);
	}
}


export class ValueSetContext extends ParserRuleContext {
	public VALUESET(): TerminalNode { return this.getToken(DiscoverySyntaxParser.VALUESET, 0); }
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	public subclassOf(): SubclassOfContext | undefined {
		return this.tryGetRuleContext(0, SubclassOfContext);
	}
	public members(): MembersContext | undefined {
		return this.tryGetRuleContext(0, MembersContext);
	}
	public expansion(): ExpansionContext | undefined {
		return this.tryGetRuleContext(0, ExpansionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_valueSet; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterValueSet) listener.enterValueSet(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitValueSet) listener.exitValueSet(this);
	}
}


export class ShapeOfContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	public TARGETCLASS(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.TARGETCLASS, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_shapeOf; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterShapeOf) listener.enterShapeOf(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitShapeOf) listener.exitShapeOf(this);
	}
}


export class PropertyConstraintContext extends ParserRuleContext {
	public PROPERTYCONSTRAINT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PROPERTYCONSTRAINT, 0); }
	public PATH(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PATH, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	public constraintParameter(): ConstraintParameterContext[];
	public constraintParameter(i: number): ConstraintParameterContext;
	public constraintParameter(i?: number): ConstraintParameterContext | ConstraintParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConstraintParameterContext);
		} else {
			return this.getRuleContext(i, ConstraintParameterContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_propertyConstraint; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPropertyConstraint) listener.enterPropertyConstraint(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPropertyConstraint) listener.exitPropertyConstraint(this);
	}
}


export class ConstraintParameterContext extends ParserRuleContext {
	public minCount(): MinCountContext | undefined {
		return this.tryGetRuleContext(0, MinCountContext);
	}
	public maxCount(): MaxCountContext | undefined {
		return this.tryGetRuleContext(0, MaxCountContext);
	}
	public minInclusive(): MinInclusiveContext | undefined {
		return this.tryGetRuleContext(0, MinInclusiveContext);
	}
	public maxInclusive(): MaxInclusiveContext | undefined {
		return this.tryGetRuleContext(0, MaxInclusiveContext);
	}
	public classValue(): ClassValueContext | undefined {
		return this.tryGetRuleContext(0, ClassValueContext);
	}
	public dataRange(): DataRangeContext | undefined {
		return this.tryGetRuleContext(0, DataRangeContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_constraintParameter; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterConstraintParameter) listener.enterConstraintParameter(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitConstraintParameter) listener.exitConstraintParameter(this);
	}
}


export class MinCountContext extends ParserRuleContext {
	public MINCOUNT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MINCOUNT, 0); }
	public INTEGER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INTEGER, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minCount; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinCount) listener.enterMinCount(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinCount) listener.exitMinCount(this);
	}
}


export class MaxCountContext extends ParserRuleContext {
	public MAXCOUNT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAXCOUNT, 0); }
	public INTEGER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INTEGER, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxCount; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxCount) listener.enterMaxCount(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxCount) listener.exitMaxCount(this);
	}
}


export class MinInclusiveContext extends ParserRuleContext {
	public MININCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MININCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minInclusive; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinInclusive) listener.enterMinInclusive(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinInclusive) listener.exitMinInclusive(this);
	}
}


export class MaxInclusiveContext extends ParserRuleContext {
	public MAXINCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAXINCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxInclusive; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxInclusive) listener.enterMaxInclusive(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxInclusive) listener.exitMaxInclusive(this);
	}
}


export class MinExclusiveContext extends ParserRuleContext {
	public MINEXCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MINEXCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minExclusive; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinExclusive) listener.enterMinExclusive(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinExclusive) listener.exitMinExclusive(this);
	}
}


export class MaxExclusiveContext extends ParserRuleContext {
	public MAXEXCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAXEXCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxExclusive; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxExclusive) listener.enterMaxExclusive(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxExclusive) listener.exitMaxExclusive(this);
	}
}


export class ClassValueContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CLASS, 0); }
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public propertyConstraint(): PropertyConstraintContext | undefined {
		return this.tryGetRuleContext(0, PropertyConstraintContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classValue; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassValue) listener.enterClassValue(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassValue) listener.exitClassValue(this);
	}
}


export class LabelContext extends ParserRuleContext {
	public name(): NameContext | undefined {
		return this.tryGetRuleContext(0, NameContext);
	}
	public description(): DescriptionContext | undefined {
		return this.tryGetRuleContext(0, DescriptionContext);
	}
	public code(): CodeContext | undefined {
		return this.tryGetRuleContext(0, CodeContext);
	}
	public scheme(): SchemeContext | undefined {
		return this.tryGetRuleContext(0, SchemeContext);
	}
	public status(): StatusContext | undefined {
		return this.tryGetRuleContext(0, StatusContext);
	}
	public version(): VersionContext | undefined {
		return this.tryGetRuleContext(0, VersionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_label; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterLabel) listener.enterLabel(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitLabel) listener.exitLabel(this);
	}
}


export class StatusContext extends ParserRuleContext {
	public STATUS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.STATUS, 0); }
	public ACTIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.ACTIVE, 0); }
	public INACTIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.INACTIVE, 0); }
	public DRAFT(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.DRAFT, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_status; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterStatus) listener.enterStatus(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitStatus) listener.exitStatus(this);
	}
}


export class VersionContext extends ParserRuleContext {
	public VERSION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.VERSION, 0); }
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_version; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterVersion) listener.enterVersion(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitVersion) listener.exitVersion(this);
	}
}


export class IdentifierIriContext extends ParserRuleContext {
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public IRI_LABEL(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.IRI_LABEL, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_identifierIri; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterIdentifierIri) listener.enterIdentifierIri(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitIdentifierIri) listener.exitIdentifierIri(this);
	}
}


export class NameContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(DiscoverySyntaxParser.NAME, 0); }
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_name; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterName) listener.enterName(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitName) listener.exitName(this);
	}
}


export class DescriptionContext extends ParserRuleContext {
	public DESCRIPTION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DESCRIPTION, 0); }
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_description; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDescription) listener.enterDescription(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDescription) listener.exitDescription(this);
	}
}


export class CodeContext extends ParserRuleContext {
	public CODE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CODE, 0); }
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_code; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterCode) listener.enterCode(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitCode) listener.exitCode(this);
	}
}


export class SchemeContext extends ParserRuleContext {
	public SCHEME(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SCHEME, 0); }
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_scheme; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterScheme) listener.enterScheme(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitScheme) listener.exitScheme(this);
	}
}


export class SubclassOfContext extends ParserRuleContext {
	public SUBCLASS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBCLASS, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subclassOf; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubclassOf) listener.enterSubclassOf(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubclassOf) listener.exitSubclassOf(this);
	}
}


export class EquivalentToContext extends ParserRuleContext {
	public EQUIVALENTTO(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EQUIVALENTTO, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_equivalentTo; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterEquivalentTo) listener.enterEquivalentTo(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitEquivalentTo) listener.exitEquivalentTo(this);
	}
}


export class DisjointWithContext extends ParserRuleContext {
	public DISJOINT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DISJOINT, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_disjointWith; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDisjointWith) listener.enterDisjointWith(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDisjointWith) listener.exitDisjointWith(this);
	}
}


export class SubpropertyOfContext extends ParserRuleContext {
	public SUBPROPERTY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBPROPERTY, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subpropertyOf; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubpropertyOf) listener.enterSubpropertyOf(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubpropertyOf) listener.exitSubpropertyOf(this);
	}
}


export class InverseOfContext extends ParserRuleContext {
	public INVERSE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INVERSE, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_inverseOf; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterInverseOf) listener.enterInverseOf(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitInverseOf) listener.exitInverseOf(this);
	}
}


export class ClassExpressionContext extends ParserRuleContext {
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public classExpression(): ClassExpressionContext[];
	public classExpression(i: number): ClassExpressionContext;
	public classExpression(i?: number): ClassExpressionContext | ClassExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassExpressionContext);
		} else {
			return this.getRuleContext(i, ClassExpressionContext);
		}
	}
	public roleGroup(): RoleGroupContext | undefined {
		return this.tryGetRuleContext(0, RoleGroupContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classExpression; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassExpression) listener.enterClassExpression(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassExpression) listener.exitClassExpression(this);
	}
}


export class IriContext extends ParserRuleContext {
	public IRIREF(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.IRIREF, 0); }
	public PREFIXIRI(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.PREFIXIRI, 0); }
	public QUOTED_STRING(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
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


export class RoleGroupContext extends ParserRuleContext {
	public role(): RoleContext[];
	public role(i: number): RoleContext;
	public role(i?: number): RoleContext | RoleContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RoleContext);
		} else {
			return this.getRuleContext(i, RoleContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_roleGroup; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRoleGroup) listener.enterRoleGroup(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRoleGroup) listener.exitRoleGroup(this);
	}
}


export class RoleContext extends ParserRuleContext {
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public classExpression(): ClassExpressionContext | undefined {
		return this.tryGetRuleContext(0, ClassExpressionContext);
	}
	public dataRange(): DataRangeContext | undefined {
		return this.tryGetRuleContext(0, DataRangeContext);
	}
	public minCount(): MinCountContext | undefined {
		return this.tryGetRuleContext(0, MinCountContext);
	}
	public maxCount(): MaxCountContext | undefined {
		return this.tryGetRuleContext(0, MaxCountContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_role; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRole) listener.enterRole(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRole) listener.exitRole(this);
	}
}


export class DataRangeContext extends ParserRuleContext {
	public valueCollection(): ValueCollectionContext | undefined {
		return this.tryGetRuleContext(0, ValueCollectionContext);
	}
	public typedString(): TypedStringContext | undefined {
		return this.tryGetRuleContext(0, TypedStringContext);
	}
	public QUOTED_STRING(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	public rangeValue(): RangeValueContext | undefined {
		return this.tryGetRuleContext(0, RangeValueContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_dataRange; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDataRange) listener.enterDataRange(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDataRange) listener.exitDataRange(this);
	}
}


export class RangeValueContext extends ParserRuleContext {
	public MININCLUSIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.MININCLUSIVE, 0); }
	public MINEXCLUSIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.MINEXCLUSIVE, 0); }
	public typedString(): TypedStringContext | undefined {
		return this.tryGetRuleContext(0, TypedStringContext);
	}
	public DOUBLE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.DOUBLE, 0); }
	public MAXINCLUSIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.MAXINCLUSIVE, 0); }
	public MAXEXCLUSIVE(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.MAXEXCLUSIVE, 0); }
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_rangeValue; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRangeValue) listener.enterRangeValue(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRangeValue) listener.exitRangeValue(this);
	}
}


export class TypedStringContext extends ParserRuleContext {
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_typedString; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterTypedString) listener.enterTypedString(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitTypedString) listener.exitTypedString(this);
	}
}


export class ValueCollectionContext extends ParserRuleContext {
	public QUOTED_STRING(): TerminalNode[];
	public QUOTED_STRING(i: number): TerminalNode;
	public QUOTED_STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.QUOTED_STRING);
		} else {
			return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, i);
		}
	}
	public typedString(): TypedStringContext[];
	public typedString(i: number): TypedStringContext;
	public typedString(i?: number): TypedStringContext | TypedStringContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypedStringContext);
		} else {
			return this.getRuleContext(i, TypedStringContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_valueCollection; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterValueCollection) listener.enterValueCollection(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitValueCollection) listener.exitValueCollection(this);
	}
}


export class DataRangeCollectionContext extends ParserRuleContext {
	public dataRange(): DataRangeContext[];
	public dataRange(i: number): DataRangeContext;
	public dataRange(i?: number): DataRangeContext | DataRangeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DataRangeContext);
		} else {
			return this.getRuleContext(i, DataRangeContext);
		}
	}
	constructor(parent: ParserRuleContext, invokingState: number);
	constructor(parent: ParserRuleContext, invokingState: number) {
		super(parent, invokingState);

	}
	@Override public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_dataRangeCollection; }
	@Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDataRangeCollection) listener.enterDataRangeCollection(this);
	}
	@Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDataRangeCollection) listener.exitDataRangeCollection(this);
	}
}


