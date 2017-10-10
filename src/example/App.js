import * as React from 'react';
//import './app.scss';
import MonacoEditor from 'react-monaco-editor';
import * as ParserService from '../services/parserService'

const requireConfig = {
	url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
	paths: {
		'vs': '/static/vs/'
	}
};
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.onChange = debounce(this.onChange,200).bind(this)
		this.editorDidMount = this.editorDidMount.bind(this)
		this.editorWillMount = this.editorWillMount.bind(this)
		this.tryParse = this.tryParse.bind(this)
		this.resetCompletions = this.resetCompletions.bind(this)
	}
	editorWillMount(monaco) {
		this.monaco = monaco
		monaco.languages.register({ id: 'RVD-Equation' });
		monaco.languages.registerCompletionItemProvider('RVD-Equation', {
			provideCompletionItems: () => {
				console.log("provideCompletionItems")
				return [
					{
						label: 'row.amount',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: {
							value: '{(row.amount${1:,options} ${2:|| default})}'
						}
					},

				]
			}
		});
		
		/*monaco.languages.setTokensProvider('RVD-Equation',{
			getInitialState: () => {
				console.log('Get Token Initial State')
				return {
					clone:() => {},
					equals:() => true
				}
			},
			tokenize: (line,state) => {
				console.log('tokenize',line,state)
				return {
					tokens:[],
					endState: {
						clone:() => {},
						equals:() => true
					}
				}
			}
		})*/

		
	}
	resetCompletions() {
		const {monaco} = this
		monaco.languages.registerCompletionItemProvider('RVD-Equation', {
			provideCompletionItems: () => {
				console.log("provideCompletionItems")
				return [
					{
						label: 'row.total',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: {
							value: '{(row.total${1:,options} ${2:|| default})}'
						}
					},

				]
			}
		});
	}
	editorDidMount(editor,monaco)
	{
		//this.tryParse(editor.value);	
		this.editor = editor
		this.monaco = monaco
	}
	tryParse(val) {
		const {model,editor} = this
		try {
			var res = ParserService.parseEquation(val)
			monaco.editor.setModelMarkers(editor.getModel(),'RVD-Equation',[])
			console.log(res)
		} catch(e) {
			var startLineNumber = e.location.start.line,
			startColumn = e.location.start.column,
			endLineNumber = e.location.end.line,
			endColumn = e.location.end.column
			monaco.editor.setModelMarkers(editor.getModel(),'RVD-Equation',[{
				severity: monaco.Severity.Error,
				startLineNumber,
				startColumn,
				endLineNumber,
				endColumn,
				message: e.name + ":" +e.message
			}])
			console.log(e)
		}
	}
	onChange(val) {
		this.tryParse(val)
	}
	render() {
		
		var code= "round( {(row.Amount)} , 2)"
		return (
			<div>
				<MonacoEditor
					width="800"
					height="600"
					theme= 'myCoolTheme'
					value={code}
					language="RVD-Equation"
					theme="RVD-Theme"
					onChange = {this.onChange}
					requireConfig={requireConfig}
					editorDidMount={this.editorDidMount}
					editorWillMount={this.editorWillMount}
				/>
				<button onClick={this.resetCompletions} >Change completions</button>
			</div>
		)
	}
}