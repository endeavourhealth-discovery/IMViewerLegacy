grammar DiscoverySyntax;

// VSET_Covid1 definition
// SubClassOf (":VSET_Covid0" AND PROPERTY(":hasMembers" = some ("sn:1240521000000100" AND "sn:1240531000000103")))

definition : (subClassExpression)*;

subClassExpression : SUBCLASSOF expressionList;
expressionList: expression (COMMA expression)*;
expression: iri
          | intersection
          | union
          | complement
          | objectProperty
          | dataProperty
          | oneOf
          ;
intersection: OPENBRACKET expression (AND expression)* CLOSEBRACKET;
union: OPENBRACKET expression (OR expression)* CLOSEBRACKET;
complement: NOT expression;
objectProperty: PROPERTYSTART property EQUALS QUANTIFICATION? expression CLOSEBRACKET;
dataProperty: PROPERTYSTART property EQUALS STRING CLOSEBRACKET;
oneOf: iri (COMMA iri)*;
property: iri;
iri: IRI;

SUBCLASSOF : 'SubClassOf ';
COMMA: ',';
OPENBRACKET: '(';
CLOSEBRACKET: ')';
AND: ' AND ';
OR: ' OR ';
NOT: '!';
EQUALS: ' = ';
PROPERTYSTART: 'PROPERTY(';

IRI: '"' ~[:]*? ':' ~[:]*? '"';

QUANTIFICATION: 'some ';

STRING: '"' ~ ["]* '"';
WS: [\r\n \t] -> skip;

