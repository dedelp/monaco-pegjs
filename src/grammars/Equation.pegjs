
Expression
	= head:Term tail:(_ ("+" / "-") _ Term)* {
			return tail.reduce(function(result, element) {
				if (element[1] === "+") { 
					return {
							location:location(),
					function:'ADD',
								params:[result,element[3]]
					}; 
				}
				if (element[1] === "-") { 
					return {
							location:location(),
					function:'SUB',
								params:[result,element[3]]
					}; 
				}
			}, head);
		}
		
Term
	= head:Factor tail:(_ ("*" / "/") _ Factor)* {
			return tail.reduce(function(result, element) {
				if (element[1] === "*") { 
					return {
							location:location(),
					function:'MULTIPLY',
								params:[result,element[3]]
					}; 
				}
				if (element[1] === "/") { 
					return {
							location:location(),
					function:'DIVIDE',
								params:[result,element[3]]
					}; 
				}
			}, head);
		}

Factor
	= "(" _ expr:Expression _ ")" { return expr; }
	/ Integer
	/ Function
	/ Variable
	/ String
	
String "string"
	= '"' str:ValidStringChar* '"' {
		return str.join("");
	}

ValidStringChar
	= !'"' c:. {
		return c;
	}

Integer "integer"
	= _ [0-9]+ { return parseInt(text(), 10); }

Variable
	= "{(" _ variableExpr:VariableExpr _ ")}" {
	return variableExpr
}

VariableExpr
	= variableName:VariableName _ variableParams:VariableParams? _ variableDefault:VariableDefault?	{
	return {
		location:location(),
		variable:variableName.join(""),
		default:variableDefault,
		params:variableParams
	}
}

VariableDefault
	= _ "||" _ variableDefault:Expression {
	return {
		location:location(),
		variableDefault
	}
}

VariableParams
	= "," _ p:VariableParam* _ {
	return {
		location:location(),
		value:p.join("")
	}
}

VariableParam 
	= !")}" !"||" c:. {
		return c;
	}

VariableName
	= [a-z0-9_\.]i+

FunctionName
	= !"(" !")" c:. {
		return c;
	}
	
FunctionParam
	= p:Expression _ ps:ParamRest* {
			return [p].concat(ps)
	}
ParamRest
	= "," _ p:Expression {
		return p
}

Function
	= str:FunctionName+ _ "(" _ params:FunctionParam? _ ")" _ {
	return {
			location:location(),
			function:str.join(""),
				params
		}
}

_ "whitespace"
	= [ \t\n\r]*

