
Expression
	= head:Term tail:(_ ("+" / "-") _ Term)* {
			return tail.reduce(function(result, element) {
				if (element[1] === "+") { 
					return {
						location:location(),
						type:"Function",
						name:'ADD',
						params:[result,element[3]]
					}; 
				}
				if (element[1] === "-") { 
					return {
						location:location(),
						type:"Function",
						name:'SUB',
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
						type:"Function",
						name:'MULTIPLY',
						params:[result,element[3]]
					}; 
				}
				if (element[1] === "/") { 
					return {
						location:location(),
						type:"Function",
						name:'DIVIDE',
						params:[result,element[3]]
					}; 
				}
			}, head);
		}

Factor
	= "(" _ expr:Expression _ ")" { return expr; }
	/ Number
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

Number "number"
	= _ "-"? [0-9]+ ("\."[0-9]+)? { return {
		location:location(),
		type:"Number",
		value:parseFloat(text())
	}}

Variable
	= _ variableName:VariableName _ {
		return { 
			location:location(),
			type:"Variable",
			name:variableName.join("")
		} 
	}
	/ _ "{(" _ variableExpr:VariableExpr _ ")}" _ { return Object.assign({},{location:location()},variableExpr) }

VariableExpr
	= variableName:VariableName _ variableParams:VariableParams? _ variableDefault:VariableDefault?	{
	return {
		type:"Variable",
		name:variableName.join(""),
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
	= [a-z0-9_\.]i+
	
FunctionParam
	= p:Expression _ ps:ParamRest* {
			return [p].concat(ps)
	}
ParamRest
	= "," _ p:Expression {
		return p
}

Function
	= str:FunctionName _ "(" _ params:FunctionParam? _ ")" _ {
	return {
			location:location(),
			type:"Function",
			name:str.join(""),
			params
		}
}

_ "whitespace"
	= [ \t\n\r]*

