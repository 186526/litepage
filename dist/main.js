(() => {
  var f = {},
    H = /[|\\{}()[\]^$+*?.]/g;
  f.escapeRegExpChars = function (t) {
    return t ? String(t).replace(H, "\\$&") : "";
  };
  var U = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&#34;",
      "'": "&#39;",
    },
    j = /[&<>'"]/g;
  function k(t) {
    return U[t] || t;
  }
  var W = `var _ENCODE_HTML_RULES = {
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
`;
  f.escapeXML = function (t) {
    return t == null ? "" : String(t).replace(j, k);
  };
  f.escapeXML.toString = function () {
    return (
      Function.prototype.toString.call(this) +
      `;
` +
      W
    );
  };
  f.shallowCopy = function (t, r) {
    r = r || {};
    for (var e in r) t[e] = r[e];
    return t;
  };
  f.shallowCopyFromList = function (t, r, e) {
    for (var n = 0; n < e.length; n++) {
      var i = e[n];
      typeof r[i] != "undefined" && (t[i] = r[i]);
    }
    return t;
  };
  f.hyphenToCamel = function (t) {
    return t.replace(/-[a-z]/g, function (r) {
      return r[1].toUpperCase();
    });
  };
  var h = f;
  var o = {};
  var T = !1,
    q = "0.1",
    V = "<",
    X = ">",
    $ = "%",
    M = "locals",
    J = "ejs",
    B = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",
    S = [
      "delimiter",
      "scope",
      "context",
      "debug",
      "compileDebug",
      "client",
      "_with",
      "rmWhitespace",
      "strict",
      "filename",
      "async",
    ],
    K = S.concat("cache"),
    A = /^\uFEFF/;
  o.cache = h.cache;
  o.localsName = M;
  o.promiseImpl = new Function("return this;")().Promise;
  function G(t, r) {
    var e,
      n = t.filename,
      i = arguments.length > 1;
    if (t.cache) {
      if (!n) throw new Error("cache option requires a filename");
      if (((e = o.cache.get(n)), e)) return e;
      i || (r = fileLoader(n).toString().replace(A, ""));
    } else if (!i) {
      if (!n)
        throw new Error(
          "Internal EJS error: no file name or template provided"
        );
      r = fileLoader(n).toString().replace(A, "");
    }
    return (e = o.compile(r, t)), t.cache && o.cache.set(n, e), e;
  }
  function C(t, r, e, n, i) {
    var s = r.split(`
`),
      a = Math.max(n - 3, 0),
      u = Math.min(s.length, n + 3),
      l = i(e),
      m = s.slice(a, u).map(function (v, _) {
        var d = _ + a + 1;
        return (d == n ? " >> " : "    ") + d + "| " + v;
      }).join(`
`);
    throw (
      ((t.path = l),
      (t.message =
        (l || "ejs") +
        ":" +
        n +
        `
` +
        m +
        `

` +
        t.message),
      t)
    );
  }
  function D(t) {
    return t.replace(/;(\s*$)/, "$1");
  }
  o.compile = function (r, e) {
    var n;
    return (
      e &&
        e.scope &&
        (T ||
          (console.warn(
            "`scope` option is deprecated and will be removed in EJS 3"
          ),
          (T = !0)),
        e.context || (e.context = e.scope),
        delete e.scope),
      (n = new c(r, e)),
      n.compile()
    );
  };
  o.render = function (t, r, e) {
    var n = r || {},
      i = e || {};
    return arguments.length == 2 && h.shallowCopyFromList(i, n, S), G(i, t)(n);
  };
  o.Template = c;
  function c(t, r) {
    r = r || {};
    var e = {};
    (this.templateText = t),
      (this.mode = null),
      (this.truncate = !1),
      (this.currentLine = 1),
      (this.source = ""),
      (e.client = r.client || !1),
      (e.escapeFunction = r.escape || r.escapeFunction || h.escapeXML),
      (e.compileDebug = r.compileDebug !== !1),
      (e.debug = !!r.debug),
      (e.filename = r.filename),
      (e.openDelimiter = r.openDelimiter || o.openDelimiter || V),
      (e.closeDelimiter = r.closeDelimiter || o.closeDelimiter || X),
      (e.delimiter = r.delimiter || o.delimiter || $),
      (e.strict = r.strict || !1),
      (e.context = r.context),
      (e.cache = r.cache || !1),
      (e.rmWhitespace = r.rmWhitespace),
      (e.root = r.root),
      (e.includer = r.includer),
      (e.outputFunctionName = r.outputFunctionName),
      (e.localsName = r.localsName || o.localsName || M),
      (e.views = r.views),
      (e.async = r.async),
      (e.destructuredLocals = r.destructuredLocals),
      (e.legacyInclude =
        typeof r.legacyInclude != "undefined" ? !!r.legacyInclude : !0),
      e.strict
        ? (e._with = !1)
        : (e._with = typeof r._with != "undefined" ? r._with : !0),
      (this.opts = e),
      (this.regex = this.createRegex());
  }
  c.modes = {
    EVAL: "eval",
    ESCAPED: "escaped",
    RAW: "raw",
    COMMENT: "comment",
    LITERAL: "literal",
  };
  c.prototype = {
    createRegex: function () {
      var t = B,
        r = h.escapeRegExpChars(this.opts.delimiter),
        e = h.escapeRegExpChars(this.opts.openDelimiter),
        n = h.escapeRegExpChars(this.opts.closeDelimiter);
      return (
        (t = t.replace(/%/g, r).replace(/</g, e).replace(/>/g, n)),
        new RegExp(t)
      );
    },
    compile: function () {
      var t,
        r,
        e = this.opts,
        n = "",
        i = "",
        s = e.escapeFunction,
        a,
        u = e.filename ? JSON.stringify(e.filename) : "undefined";
      if (!this.source) {
        if (
          (this.generateSource(),
          (n += `  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`),
          e.outputFunctionName &&
            (n +=
              "  var " +
              e.outputFunctionName +
              ` = __append;
`),
          e.destructuredLocals && e.destructuredLocals.length)
        ) {
          for (
            var l =
                "  var __locals = (" +
                e.localsName +
                ` || {}),
`,
              m = 0;
            m < e.destructuredLocals.length;
            m++
          ) {
            var v = e.destructuredLocals[m];
            m > 0 &&
              (l += `,
  `),
              (l += v + " = __locals." + v);
          }
          n +=
            l +
            `;
`;
        }
        e._with !== !1 &&
          ((n +=
            "  with (" +
            e.localsName +
            ` || {}) {
`),
          (i += `  }
`)),
          (i += `  return __output;
`),
          (this.source = n + this.source + i);
      }
      e.compileDebug
        ? (t =
            `var __line = 1
  , __lines = ` +
            JSON.stringify(this.templateText) +
            `
  , __filename = ` +
            u +
            `;
try {
` +
            this.source +
            `} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`)
        : (t = this.source),
        e.client &&
          ((t =
            "escapeFn = escapeFn || " +
            s.toString() +
            `;
` +
            t),
          e.compileDebug &&
            (t =
              "rethrow = rethrow || " +
              C.toString() +
              `;
` +
              t)),
        e.strict &&
          (t =
            `"use strict";
` + t),
        e.debug && console.log(t),
        e.compileDebug &&
          e.filename &&
          (t =
            t +
            `
//# sourceURL=` +
            u +
            `
`);
      try {
        if (e.async)
          try {
            a = new Function("return (async function(){}).constructor;")();
          } catch (p) {
            throw p instanceof SyntaxError
              ? new Error("This environment does not support async/await")
              : p;
          }
        else a = Function;
        r = new a(e.localsName + ", escapeFn, include, rethrow", t);
      } catch (p) {
        throw (
          (p instanceof SyntaxError &&
            (e.filename && (p.message += " in " + e.filename),
            (p.message += ` while compiling ejs

`),
            (p.message += `If the above error is not helpful, you may want to try EJS-Lint:
`),
            (p.message += "https://github.com/RyanZim/EJS-Lint"),
            e.async ||
              ((p.message += `
`),
              (p.message +=
                "Or, if you meant to create an async function, pass `async: true` as an option."))),
          p)
        );
      }
      var _ = e.client
        ? r
        : function (x) {
            var R = function (P, b) {
              var w = h.shallowCopy({}, x);
              return b && (w = h.shallowCopy(w, b)), includeFile(P, e)(w);
            };
            return r.apply(e.context, [x || {}, s, R, C]);
          };
      if (e.filename && typeof Object.defineProperty == "function") {
        var d = e.filename,
          I = path.basename(d, path.extname(d));
        try {
          Object.defineProperty(_, "name", {
            value: I,
            writable: !1,
            enumerable: !1,
            configurable: !0,
          });
        } catch (p) {}
      }
      return _;
    },
    generateSource: function () {
      var t = this.opts;
      t.rmWhitespace &&
        (this.templateText = this.templateText
          .replace(
            /[\r\n]+/g,
            `
`
          )
          .replace(/^\s+|\s+$/gm, "")),
        (this.templateText = this.templateText
          .replace(/[ \t]*<%_/gm, "<%_")
          .replace(/_%>[ \t]*/gm, "_%>"));
      var r = this,
        e = this.parseTemplateText(),
        n = this.opts.delimiter,
        i = this.opts.openDelimiter,
        s = this.opts.closeDelimiter;
      e &&
        e.length &&
        e.forEach(function (a, u) {
          var l;
          if (
            a.indexOf(i + n) === 0 &&
            a.indexOf(i + n + n) !== 0 &&
            ((l = e[u + 2]),
            !(l == n + s || l == "-" + n + s || l == "_" + n + s))
          )
            throw new Error(
              'Could not find matching close tag for "' + a + '".'
            );
          r.scanLine(a);
        });
    },
    parseTemplateText: function () {
      for (
        var t = this.templateText, r = this.regex, e = r.exec(t), n = [], i;
        e;

      )
        (i = e.index),
          i !== 0 && (n.push(t.substring(0, i)), (t = t.slice(i))),
          n.push(e[0]),
          (t = t.slice(e[0].length)),
          (e = r.exec(t));
      return t && n.push(t), n;
    },
    _addOutput: function (t) {
      if (
        (this.truncate &&
          ((t = t.replace(/^(?:\r\n|\r|\n)/, "")), (this.truncate = !1)),
        !t)
      )
        return t;
      (t = t.replace(/\\/g, "\\\\")),
        (t = t.replace(/\n/g, "\\n")),
        (t = t.replace(/\r/g, "\\r")),
        (t = t.replace(/"/g, '\\"')),
        (this.source +=
          '    ; __append("' +
          t +
          `")
`);
    },
    scanLine: function (t) {
      var r = this,
        e = this.opts.delimiter,
        n = this.opts.openDelimiter,
        i = this.opts.closeDelimiter,
        s = 0;
      switch (
        ((s =
          t.split(`
`).length - 1),
        t)
      ) {
        case n + e:
        case n + e + "_":
          this.mode = c.modes.EVAL;
          break;
        case n + e + "=":
          this.mode = c.modes.ESCAPED;
          break;
        case n + e + "-":
          this.mode = c.modes.RAW;
          break;
        case n + e + "#":
          this.mode = c.modes.COMMENT;
          break;
        case n + e + e:
          (this.mode = c.modes.LITERAL),
            (this.source +=
              '    ; __append("' +
              t.replace(n + e + e, n + e) +
              `")
`);
          break;
        case e + e + i:
          (this.mode = c.modes.LITERAL),
            (this.source +=
              '    ; __append("' +
              t.replace(e + e + i, e + i) +
              `")
`);
          break;
        case e + i:
        case "-" + e + i:
        case "_" + e + i:
          this.mode == c.modes.LITERAL && this._addOutput(t),
            (this.mode = null),
            (this.truncate = t.indexOf("-") === 0 || t.indexOf("_") === 0);
          break;
        default:
          if (this.mode) {
            switch (this.mode) {
              case c.modes.EVAL:
              case c.modes.ESCAPED:
              case c.modes.RAW:
                t.lastIndexOf("//") >
                  t.lastIndexOf(`
`) &&
                  (t += `
`);
            }
            switch (this.mode) {
              case c.modes.EVAL:
                this.source +=
                  "    ; " +
                  t +
                  `
`;
                break;
              case c.modes.ESCAPED:
                this.source +=
                  "    ; __append(escapeFn(" +
                  D(t) +
                  `))
`;
                break;
              case c.modes.RAW:
                this.source +=
                  "    ; __append(" +
                  D(t) +
                  `)
`;
                break;
              case c.modes.COMMENT:
                break;
              case c.modes.LITERAL:
                this._addOutput(t);
                break;
            }
          } else this._addOutput(t);
      }
      r.opts.compileDebug &&
        s &&
        ((this.currentLine += s),
        (this.source +=
          "    ; __line = " +
          this.currentLine +
          `
`));
    },
  };
  o.escapeXML = h.escapeXML;
  o.__express = o.renderFile;
  o.VERSION = q;
  o.name = J;
  typeof window != "undefined" && (window.ejs = o);
  var L = o.render;
  function E(t) {
    var r = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
    return t.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (e, n) {
      return r[n];
    });
  }
  function O(t) {
    let r = t.nodeName;
    if (
      (t.nextElementSibling !== null &&
        (r += " #Next-" + t.nextElementSibling.nodeName),
      t.previousElementSibling !== null)
    ) {
      r += " #previous-" + t.previousElementSibling.nodeName;
      let n = 0,
        i = t;
      for (; (i = i.previousElementSibling) != null; ) n++;
      r += "@" + n;
    }
    let e = t.parentNode;
    for (; e; ) (r = e.nodeName + " -> " + r), (e = e.parentNode);
    return r;
  }
  function F() {
    let t = function () {
      return (((1 + Math.random()) * 65536) | 0)
        .toString(16)
        .substring(1)
        .toUpperCase();
    };
    return (
      t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
    );
  }
  function y(t, r) {
    let e = [];
    if (r(t)) return [];
    if (t.childElementCount > 0) for (let n of t.children) e.push(y(n, r));
    else e.push(t);
    return e.flat(1 / 0);
  }
  var g = class {
    constructor(r) {
      let e = this;
      (this.uuidMap = {}),
        (this.eventMap = {}),
        (this._events = []),
        (this._components = {}),
        (this.props = new Proxy(r, {
          set: function (n, i, s) {
            let a = e._events.reduce(
              (u, l, m) => (l.type === "setValue" ? l.func(u) : u),
              { obj: n, prop: i, value: s }
            );
            return (a.obj[a.prop] = a.value), e.update(), !0;
          },
          get: function (n, i) {
            return e._events.reduce(
              (a, u, l) => (u.type === "getValue" ? u.func(a) : a),
              { obj: n, prop: i, value: n[i] }
            ).value;
          },
        }));
    }
    extend(r) {
      return (
        r.forEach((e) => {
          let n = new DOMParser().parseFromString(e, "text/html").body
            .firstChild;
          this._components[n.getAttribute("name").toUpperCase()] = n;
        }),
        this
      );
    }
    on(r, e) {
      return this._events.push({ type: r, func: e }), this;
    }
    create(r) {
      let e = new DOMParser().parseFromString(r, "text/html").body,
        n = y(e, (i) => {
          if (i.getAttribute("use") === "component") {
            let a = this._components[i.tagName];
            return (
              a
                .getAttribute("arguments")
                .split(",")
                .forEach((u) => {
                  if (i.hasAttribute(u))
                    a.innerHTML = E(
                      a.innerHTML.replaceAll(
                        `arguments.${u}`,
                        i.getAttribute(u)
                      )
                    );
                  else throw new Error(`Arguments ${u} not found in template.`);
                  return !0;
                }),
              i.replaceWith(a),
              i.setAttribute("static", "false"),
              !0
            );
          }
          let s = E(i.innerHTML);
          return !s.includes("%>") &&
            !(s.includes('use="component"') || s.includes("use='component'"))
            ? (i.setAttribute("static", "true"), !0)
            : !1;
        });
      return (
        n.forEach((i) => {
          let s = O(i);
          s in this.uuidMap || (this.uuidMap[s] = F()),
            (i.id = this.uuidMap[s]);
        }),
        (this.updateMap = n.map((i) => E(i.outerHTML))),
        (this.template = E(e.innerHTML)),
        this
      );
    }
    render(r) {
      return new DOMParser().parseFromString(L(r, this.props), "text/html").body
        .firstChild;
    }
    mount(r) {
      return (
        (this.mountOn = r),
        (this.dom = this.render(this.template, this.props)),
        document.querySelector(r).append(this.dom),
        this.listen(),
        this
      );
    }
    listen() {
      y(
        document.querySelector(this.mountOn),
        (r) => (
          r.attributes.length > 0 &&
            Array.from(r.attributes).forEach((e) => {
              if (e.name.split(":").length === 2) {
                let n = e.name.split(":")[1],
                  i = e.value;
                if (r.id === "") {
                  let a = O(r);
                  a in this.uuidMap || (this.uuidMap[a] = F()),
                    (r.id = this.uuidMap[a]);
                }
                let s = r.id;
                if (
                  (typeof this.eventMap[s] == "undefined" &&
                    (this.eventMap[s] = {}),
                  this.eventMap[s][n] === i)
                )
                  return;
                r.addEventListener(n, (a) => {
                  this.props[i](r, this.props, a);
                }),
                  (this.eventMap[s][n] = i);
              }
              e.name === "mount" && (this.props[e.value] = r);
            }),
          !1
        )
      );
    }
    update(r = {}) {
      this.props = Object.assign(this.props, r);
      let e = this.updateMap,
        n = !1;
      return (
        e.forEach((i) => {
          let s = new DOMParser().parseFromString(L(i, this.props), "text/html")
              .body.firstChild,
            a = document.getElementById(s.id);
          a.isEqualNode(s) ||
            ((n = !0),
            a.parentElement.replaceChild(s, a),
            (this.eventMap[a.id] = {}));
        }),
        n && this.listen(),
        this
      );
    }
  };
  globalThis.LitePage = g;
  function N(t) {
    let r = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
    return t.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (e, n) {
      return r[n];
    });
  }
  globalThis.from = (t) => {
    let r = document.querySelector(t).innerHTML,
      e = document.querySelector(t);
    return e.parentElement.removeChild(e), N(r);
  };
  globalThis.fromAll = (t) => {
    let r = document.querySelectorAll(t);
    return Array.from(r).map((n) => {
      let i = n.outerHTML;
      return n.parentElement.removeChild(n), N(i);
    });
  };
  var re = g,
    ne = globalThis.from,
    ie = globalThis.fromAll;
})();
/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */
//# sourceMappingURL=main.js.map
