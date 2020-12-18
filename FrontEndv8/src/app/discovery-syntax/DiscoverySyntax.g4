grammar DiscoverySyntax;

todoExpressions : (addExpression)* (completeExpression)* (subClassExpression)*;

addExpression : ADD TODO STRING EOL;
completeExpression : COMPLETE TODO STRING EOL;
subClassExpression : SUBCLASSOF IRI EOL;

SUBCLASSOF : 'SubClassOf';
IRI: '"' ~[:]*? ':' ~[:]*? '"';

ADD : 'ADD';
TODO : 'TODO';
COMPLETE: 'COMPLETE';
STRING: '"' ~ ["]* '"';
EOL: [\r\n] +;
WS: [ \t] -> skip;

