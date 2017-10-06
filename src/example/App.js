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
	}
	editorWillMount(monaco) {
		monaco.languages.register({ id: 'RVD-Equation' });
		monaco.languages.registerCompletionItemProvider('RVD-Equation', {
			provideCompletionItems: () => {
				console.log("provideCompletionItems")
				return [
					{
						label: '{(row.amount)}',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: {
							value: '{(row.amount${1:,options} ${2:|| default})'
						}
					},

				]
			}
		});
		monaco.languages.setMonarchTokensProvider('RVD-Equation', {
			tokenizer: {
				root: [
					[/\{\(.*\)\}/, "variable"],
				]
			}
		});
		monaco.editor.defineTheme('RVD-Theme', {
			base: 'vs',
			inherit: false,
			rules: [
				{ token: 'variable', foreground: '0000FF' },
			]
		});
		
	}
	editorDidMount(editor,monaco)
	{
		//this.tryParse(editor.value);	
	}
	tryParse(val) {
		try {
			var res = ParserService.parseEquation(val)
			console.log(res)
		} catch(e) {
			console.log(e)
		}
	}
	onChange(val) {
		this.tryParse(val)
	}
	render() {
		
		var code= "round( {(row.Amount)} , 2)"
		return (
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
		)
	}
}