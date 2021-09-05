var f={},P=/[|\\{}()[\]^$+*?.]/g;f.escapeRegExpChars=function(t){return t?String(t).replace(P,"\\$&"):""};var H={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},j=/[&<>'"]/g;function U(t){return H[t]||t}var k=`var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
`;f.escapeXML=function(t){return t==null?"":String(t).replace(j,U)};f.escapeXML.toString=function(){return Function.prototype.toString.call(this)+`;
`+k};f.shallowCopy=function(t,r){r=r||{};for(var e in r)t[e]=r[e];return t};f.shallowCopyFromList=function(t,r,e){for(var n=0;n<e.length;n++){var i=e[n];typeof r[i]!="undefined"&&(t[i]=r[i])}return t};f.hyphenToCamel=function(t){return t.replace(/-[a-z]/g,function(r){return r[1].toUpperCase()})};var p=f;var o={};var S=!1,W="0.1",q="<",V=">",X="%",T="locals",J="ejs",$="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",M=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],K=M.concat("cache"),D=/^\uFEFF/;o.cache=p.cache;o.localsName=T;o.promiseImpl=new Function("return this;")().Promise;function B(t,r){var e,n=t.filename,i=arguments.length>1;if(t.cache){if(!n)throw new Error("cache option requires a filename");if(e=o.cache.get(n),e)return e;i||(r=fileLoader(n).toString().replace(D,""))}else if(!i){if(!n)throw new Error("Internal EJS error: no file name or template provided");r=fileLoader(n).toString().replace(D,"")}return e=o.compile(r,t),t.cache&&o.cache.set(n,e),e}function C(t,r,e,n,i){var a=r.split(`
`),s=Math.max(n-3,0),h=Math.min(a.length,n+3),u=i(e),m=a.slice(s,h).map(function(v,_){var d=_+s+1;return(d==n?" >> ":"    ")+d+"| "+v}).join(`
`);throw t.path=u,t.message=(u||"ejs")+":"+n+`
`+m+`

`+t.message,t}function O(t){return t.replace(/;(\s*$)/,"$1")}o.compile=function(r,e){var n;return e&&e.scope&&(S||(console.warn("`scope` option is deprecated and will be removed in EJS 3"),S=!0),e.context||(e.context=e.scope),delete e.scope),n=new c(r,e),n.compile()};o.render=function(t,r,e){var n=r||{},i=e||{};return arguments.length==2&&p.shallowCopyFromList(i,n,M),B(i,t)(n)};o.Template=c;function c(t,r){r=r||{};var e={};this.templateText=t,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",e.client=r.client||!1,e.escapeFunction=r.escape||r.escapeFunction||p.escapeXML,e.compileDebug=r.compileDebug!==!1,e.debug=!!r.debug,e.filename=r.filename,e.openDelimiter=r.openDelimiter||o.openDelimiter||q,e.closeDelimiter=r.closeDelimiter||o.closeDelimiter||V,e.delimiter=r.delimiter||o.delimiter||X,e.strict=r.strict||!1,e.context=r.context,e.cache=r.cache||!1,e.rmWhitespace=r.rmWhitespace,e.root=r.root,e.includer=r.includer,e.outputFunctionName=r.outputFunctionName,e.localsName=r.localsName||o.localsName||T,e.views=r.views,e.async=r.async,e.destructuredLocals=r.destructuredLocals,e.legacyInclude=typeof r.legacyInclude!="undefined"?!!r.legacyInclude:!0,e.strict?e._with=!1:e._with=typeof r._with!="undefined"?r._with:!0,this.opts=e,this.regex=this.createRegex()}c.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};c.prototype={createRegex:function(){var t=$,r=p.escapeRegExpChars(this.opts.delimiter),e=p.escapeRegExpChars(this.opts.openDelimiter),n=p.escapeRegExpChars(this.opts.closeDelimiter);return t=t.replace(/%/g,r).replace(/</g,e).replace(/>/g,n),new RegExp(t)},compile:function(){var t,r,e=this.opts,n="",i="",a=e.escapeFunction,s,h=e.filename?JSON.stringify(e.filename):"undefined";if(!this.source){if(this.generateSource(),n+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,e.outputFunctionName&&(n+="  var "+e.outputFunctionName+` = __append;
`),e.destructuredLocals&&e.destructuredLocals.length){for(var u="  var __locals = ("+e.localsName+` || {}),
`,m=0;m<e.destructuredLocals.length;m++){var v=e.destructuredLocals[m];m>0&&(u+=`,
  `),u+=v+" = __locals."+v}n+=u+`;
`}e._with!==!1&&(n+="  with ("+e.localsName+` || {}) {
`,i+=`  }
`),i+=`  return __output;
`,this.source=n+this.source+i}e.compileDebug?t=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+h+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`:t=this.source,e.client&&(t="escapeFn = escapeFn || "+a.toString()+`;
`+t,e.compileDebug&&(t="rethrow = rethrow || "+C.toString()+`;
`+t)),e.strict&&(t=`"use strict";
`+t),e.debug&&console.log(t),e.compileDebug&&e.filename&&(t=t+`
//# sourceURL=`+h+`
`);try{if(e.async)try{s=new Function("return (async function(){}).constructor;")()}catch(l){throw l instanceof SyntaxError?new Error("This environment does not support async/await"):l}else s=Function;r=new s(e.localsName+", escapeFn, include, rethrow",t)}catch(l){throw l instanceof SyntaxError&&(e.filename&&(l.message+=" in "+e.filename),l.message+=` while compiling ejs

`,l.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,l.message+="https://github.com/RyanZim/EJS-Lint",e.async||(l.message+=`
`,l.message+="Or, if you meant to create an async function, pass `async: true` as an option.")),l}var _=e.client?r:function(x){var I=function(R,b){var E=p.shallowCopy({},x);return b&&(E=p.shallowCopy(E,b)),includeFile(R,e)(E)};return r.apply(e.context,[x||{},a,I,C])};if(e.filename&&typeof Object.defineProperty=="function"){var d=e.filename,N=path.basename(d,path.extname(d));try{Object.defineProperty(_,"name",{value:N,writable:!1,enumerable:!1,configurable:!0})}catch(l){}}return _},generateSource:function(){var t=this.opts;t.rmWhitespace&&(this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"")),this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var r=this,e=this.parseTemplateText(),n=this.opts.delimiter,i=this.opts.openDelimiter,a=this.opts.closeDelimiter;e&&e.length&&e.forEach(function(s,h){var u;if(s.indexOf(i+n)===0&&s.indexOf(i+n+n)!==0&&(u=e[h+2],!(u==n+a||u=="-"+n+a||u=="_"+n+a)))throw new Error('Could not find matching close tag for "'+s+'".');r.scanLine(s)})},parseTemplateText:function(){for(var t=this.templateText,r=this.regex,e=r.exec(t),n=[],i;e;)i=e.index,i!==0&&(n.push(t.substring(0,i)),t=t.slice(i)),n.push(e[0]),t=t.slice(e[0].length),e=r.exec(t);return t&&n.push(t),n},_addOutput:function(t){if(this.truncate&&(t=t.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1),!t)return t;t=t.replace(/\\/g,"\\\\"),t=t.replace(/\n/g,"\\n"),t=t.replace(/\r/g,"\\r"),t=t.replace(/"/g,'\\"'),this.source+='    ; __append("'+t+`")
`},scanLine:function(t){var r=this,e=this.opts.delimiter,n=this.opts.openDelimiter,i=this.opts.closeDelimiter,a=0;switch(a=t.split(`
`).length-1,t){case n+e:case n+e+"_":this.mode=c.modes.EVAL;break;case n+e+"=":this.mode=c.modes.ESCAPED;break;case n+e+"-":this.mode=c.modes.RAW;break;case n+e+"#":this.mode=c.modes.COMMENT;break;case n+e+e:this.mode=c.modes.LITERAL,this.source+='    ; __append("'+t.replace(n+e+e,n+e)+`")
`;break;case e+e+i:this.mode=c.modes.LITERAL,this.source+='    ; __append("'+t.replace(e+e+i,e+i)+`")
`;break;case e+i:case"-"+e+i:case"_"+e+i:this.mode==c.modes.LITERAL&&this._addOutput(t),this.mode=null,this.truncate=t.indexOf("-")===0||t.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case c.modes.EVAL:case c.modes.ESCAPED:case c.modes.RAW:t.lastIndexOf("//")>t.lastIndexOf(`
`)&&(t+=`
`)}switch(this.mode){case c.modes.EVAL:this.source+="    ; "+t+`
`;break;case c.modes.ESCAPED:this.source+="    ; __append(escapeFn("+O(t)+`))
`;break;case c.modes.RAW:this.source+="    ; __append("+O(t)+`)
`;break;case c.modes.COMMENT:break;case c.modes.LITERAL:this._addOutput(t);break}}else this._addOutput(t)}r.opts.compileDebug&&a&&(this.currentLine+=a,this.source+="    ; __line = "+this.currentLine+`
`)}};o.escapeXML=p.escapeXML;o.__express=o.renderFile;o.VERSION=W;o.name=J;typeof window!="undefined"&&(window.ejs=o);var L=o.render;function w(t){var r={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return t.replace(/&(lt|gt|nbsp|amp|quot);/gi,function(e,n){return r[n]})}function A(t){let r=t.nodeName;if(t.nextElementSibling!==null&&(r+=" #Next-"+t.nextElementSibling.nodeName),t.previousElementSibling!==null){r+=" #previous-"+t.previousElementSibling.nodeName;let n=0,i=t;for(;(i=i.previousElementSibling)!=null;)n++;r+="@"+n}let e=t.parentNode;for(;e;)r=e.nodeName+" -> "+r,e=e.parentNode;return r}function F(){let t=function(){return((1+Math.random())*65536|0).toString(16).substring(1).toUpperCase()};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function y(t,r){let e=[];if(r(t))return[];if(t.childElementCount>0)for(let n of t.children)e.push(y(n,r));else e.push(t);return e.flat(1/0)}var g=class{constructor(r){let e=this;this.uuidMap={},this.eventMap={},this._events=[],this.props=new Proxy(r,{set:function(n,i,a){let s=e._events.reduce((h,u,m)=>{if(u.type==="setValue")return u.func(h)},{obj:n,prop:i,value:a});return s.obj[s.prop]=s.value,e.update(),!0}})}on(r,e){return this._events.push({type:r,func:e}),this}create(r){let e=new DOMParser().parseFromString(r,"text/html").body,n=y(e,i=>w(i.innerHTML).includes("%>")?!1:(i.setAttribute("static","true"),!0));return n.forEach(i=>{let a=A(i);a in this.uuidMap||(this.uuidMap[a]=F()),i.id=this.uuidMap[a]}),this.updateMap=n.map(i=>w(i.outerHTML)),this.template=w(e.innerHTML),this}render(r){return new DOMParser().parseFromString(L(r,this.props),"text/html").body.firstChild}mount(r){return this.mountOn=r,this.dom=this.render(this.template,this.props),document.querySelector(r).append(this.dom),this.listen(),this}listen(){y(document.querySelector(this.mountOn),r=>(r.attributes.length>0&&Array.from(r.attributes).forEach(e=>{if(e.name.split(":").length===2){let n=e.name.split(":")[1],i=e.value;if(r.id===""){let s=A(r);s in this.uuidMap||(this.uuidMap[s]=F()),r.id=this.uuidMap[s]}let a=r.id;if(typeof this.eventMap[a]=="undefined"&&(this.eventMap[a]={}),this.eventMap[a][n]===i)return;r.addEventListener(n,s=>{this.props[i](r,this.props,s)}),this.eventMap[a][n]=i}}),!1))}update(r={}){this.props=Object.assign(this.props,r);let e=this.updateMap,n=!1;return e.forEach(i=>{let a=new DOMParser().parseFromString(L(i,this.props),"text/html").body.firstChild,s=document.getElementById(a.id);s.isEqualNode(a)||(n=!0,s.parentElement.replaceChild(a,s),this.eventMap[s.id]={})}),n&&this.listen(),this}};globalThis.LitePage=g;function G(t){let r={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return t.replace(/&(lt|gt|nbsp|amp|quot);/gi,function(e,n){return r[n]})}globalThis.from=t=>{let r=document.querySelector(t).innerHTML,e=document.querySelector(t);return e.parentElement.removeChild(e),G(r)};var re=g,ne=globalThis.from;export{re as default,ne as from};
/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */
//# sourceMappingURL=main.js.map
