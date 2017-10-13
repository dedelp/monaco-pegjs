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
		this.state = {
			columns: ["amount","total"],
			functions: [{
				name:'round',
				inputs:[{name:'number',type:'Number'},{name:'n',type:'Number'}],
				description: 'Rounds a number to n decimal places.'
			}],
			value:"round( {(row.Amount)} , 2)"
		}
		this.onChange = debounce(this.onChange,200).bind(this)
		this.editorDidMount = this.editorDidMount.bind(this)
		this.editorWillMount = this.editorWillMount.bind(this)
		this.tryParse = this.tryParse.bind(this)
		this.addError = this.addError.bind(this)
		this.addErrorAtLocation = this.addErrorAtLocation.bind(this)
	}
	editorWillMount(monaco) {
		this.monaco = monaco
		const self = this 
		monaco.languages.register({ id: 'RVD-Equation' });
		monaco.languages.registerCompletionItemProvider('RVD-Equation', {
			provideCompletionItems: () => {
				console.log("provideCompletionItems")
				return this.state.columns.map(c => (
					{
						label: 'row.'+c,
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: {
							value: 'row.'+c
						}
					})
				)
			}
		});
		monaco.languages.registerHoverProvider('RVD-Equation', {
			provideHover: function(model, position) {
				const {tokens} = self.state
				var item = (tokens||[]).find(t => 
					t.location.start.line == position.lineNumber && 
					t.location.start.column <= position.column &&
					t.location.end.column >= position.column
				)
				if(!item) return {}
				if(item.type == 'Function') return {
					range: new monaco.Range(item.location.start.line, item.location.start.column, item.location.end.line, item.location.end.column),
					contents: [
						{ language: 'RVD-Equation', value: "("+item.type+") "+item.name+" : {"+this.state.functions[item.name].inputs.map(i => i.name+" - "+i.type).join(",\n")+"}"  }
					]
				}
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
				var tokens = []
				;(this.state.tokens || []).forEach(t => {
					if(typeof t === 'object')
					{
						tokens.push({
							startIndex:t.location.start.offset,
							scopes:t.type
						})
					}
				})
				console.log(tokens)
				return {tokens,endState: {
					clone:() => {},
					equals:() => true
				}}
			}
		})*/
		monaco.editor.defineTheme('myCustomTheme', {
			base: 'vs', // can also be vs-dark or hc-black
			inherit: true, // can also be false to completely replace the builtin rules
			rules: [
				{ token: 'Variable', foreground: '0000ff' },
			]
		});
	}

	addErrorAtLocation(location,message) {
		return this.addError(location.start.line,location.start.column,location.end.line,location.end.column,message)
	}
	addError(startLineNumber,startColumn,endLineNumber,endColumn,message) {
		var {monaco,editor} = this
		monaco.editor.setModelMarkers(editor.getModel(),'RVD-Equation',[{
			severity: monaco.Severity.Error,
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			message: message
		}])
	}

	flatten(tree) {
		if(typeof tree === 'object')
		{
			switch(tree.type){
				case 'Function':
					if(!this.state.functions.find(f => f.name==tree.name)) 
					{
						this.addErrorAtLocation(tree.location,tree.name+' is not a valid function')
					}
					return [tree].concat(...(tree.params||[]).map(p => this.flatten(p)))
				case 'Variable':
					var nameParts = tree.name.split('.')
					if(nameParts[0] !== 'row' || !~this.state.columns.indexOf(nameParts[1])) 
					{
						this.addErrorAtLocation(tree.location,tree.name+' is not a valid variable name')
					}
					return [tree]
				default:
					return [tree]
					
			}
		}
	}

	editorDidMount(editor,monaco)
	{
		this.editor = editor
		this.monaco = monaco
		this.tryParse(editor.getValue())
	}
	tryParse(val) {
		const {model,editor} = this
		try {
			var res = ParserService.parseEquation(val)
			monaco.editor.setModelMarkers(editor.getModel(),'RVD-Equation',[])
			this.setState( state => {
				var tokens = this.flatten(res)
				console.log(tokens)
				state.tokens = tokens
				state.value = editor.getValue()
			});
			console.log(res)
		} catch(e) {
			if(e.location)
			{
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
			}
			console.log(e)
		}
	}
	onChange(val) {
		this.tryParse(val)
	}
	render() {

		return (
			<div style={{display:'flex'}}>
				<div style={{}}>
					<MonacoEditor
						width="800"
						height="600"
						theme= 'myCustomTheme'
						value={this.state.value}
						language="RVD-Equation"
						onChange = {this.onChange}
						requireConfig={requireConfig}
						editorDidMount={this.editorDidMount}
						editorWillMount={this.editorWillMount}
					/>
				</div>
				<div style={{flexGrow:1}}>
					{JSON.stringify(this.state.tokens)}
				</div>
			</div>
		)
	}
}