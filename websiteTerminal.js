document.head.innerHTML += `
<style>
#editing, #highlighting {
  margin: 8px;
  padding: 8px;
  border: 0px;
  border-radius: 8px;
  width: calc(100vw - 32px);
  height: 150px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  white-space: nowrap;
}
#editing, #highlighting, #highlighting * {
  font-size: 12pt;
  font-family: monospace;
  line-height: 16pt;
  tab-size: 2;
}
#editing {
  z-index: 1;
  color: transparent;
  background: transparent;
  caret-color: white;
  resize: none;
}
#highlighting {
  z-index: 0;
}

/* Syntax Highlighting from prism.js starts below, partly modified: */

/* PrismJS 1.23.0
https://prismjs.com/download.html#themes=prism-funky&languages=markup */
/**
 * prism.js Funky theme
 * Based on “Polyfilling the gaps” talk slides http://lea.verou.me/polyfilling-the-gaps/
 * @author Lea Verou
 */

code[class*="language-"],
pre[class*="language-"] {
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;

	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;

	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
	padding: .4em .8em;
	margin: .5em 0;
	overflow: auto;
	/* background: url('data:image/svg+xml;charset=utf-8,<svg%20version%3D"1.1"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20width%3D"100"%20height%3D"100"%20fill%3D"rgba(0%2C0%2C0%2C.2)">%0D%0A<polygon%20points%3D"0%2C50%2050%2C0%200%2C0"%20%2F>%0D%0A<polygon%20points%3D"0%2C100%2050%2C100%20100%2C50%20100%2C0"%20%2F>%0D%0A<%2Fsvg>');
	background-size: 1em 1em; - WebCoder49*/
  background: black; /* - WebCoder49 */
}

code[class*="language-"] {
	background: black;
	color: white;
	box-shadow: -.3em 0 0 .3em black, .3em 0 0 .3em black;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
	padding: .2em;
	border-radius: .3em;
	box-shadow: none;
	white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #aaa;
}

.token.punctuation {
	color: #999;
}

.token.namespace {
	opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol {
	color: #0cf;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin {
	color: yellow;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.token.variable,
.token.inserted {
	color: yellowgreen;
}

.token.atrule,
.token.attr-value,
.token.keyword {
	color: deeppink;
}

.token.regex,
.token.important {
	color: orange;
}

.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}

.token.deleted {
	color: red;
}

/* Plugin styles: Diff Highlight */
pre.diff-highlight.diff-highlight > code .token.deleted:not(.prefix),
pre > code.diff-highlight.diff-highlight .token.deleted:not(.prefix) {
	background-color: rgba(255, 0, 0, .3);
	display: inline;
}

pre.diff-highlight.diff-highlight > code .token.inserted:not(.prefix),
pre > code.diff-highlight.diff-highlight .token.inserted:not(.prefix) {
	background-color: rgba(0, 255, 128, .3);
	display: inline;
}

/* End of prism.js syntax highlighting*/
</style>
`;

document.body.innerHTML += `
<textarea id="editing" spellcheck="false" oninput="update(this.value); sync_scroll(this);" onscroll="sync_scroll(this);" onkeydown="check_tab(this, event);"></textarea>
<pre id="highlighting" aria-hidden="true">
<code class="language-html" id="highlighting-content"></code>
</pre>
`;

fetch('https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js').then(data=>{data.text().then(text=>{eval(text)})});

update = function(text) {
  let result_element = document.querySelector("#highlighting-content");
  if (text[text.length-1] == "\n") {
    text += " ";
  }
  result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
  Prism.highlightElement(result_element);
}

sync_scroll = function(element) {
  let result_element = document.querySelector("#highlighting");
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

check_tab = function(element, event) {
  let code = element.value;
  if (event.key == "Tab") {
    event.preventDefault();
    let before_tab = code.slice(0, element.selectionStart);
    let after_tab = code.slice(element.selectionEnd, element.value.length);
    let cursor_pos = element.selectionStart + 1;
    element.value = before_tab + "\t" + after_tab;
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value);
  }
}
