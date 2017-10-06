import pegjs from 'pegjs'
import equation from '../grammars/Equation.pegjs'

export const Parser = pegjs.generate(equation)


export const parseEquation = (statement) => {
	return Parser.parse(statement)
}
