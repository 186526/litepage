/**
 * @file LitePage.js. {@link https://lab.186526.xyz/litepage/}
 * @author real186 <i@186526.xyz>
 */

import { render } from "./lib/ejs.js";
export const vdom = (type, props, ...children) => {
  return {
    type,
    props,
    children,
  };
};

function escape2Html(str) {
  var arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}

function getElementPath(el) {
  let path = el.nodeName;
  if (el.nextElementSibling !== null) {
    path += " #Next-" + el.nextElementSibling.nodeName;
  }
  if (el.previousElementSibling !== null) {
    path += " #previous-" + el.previousElementSibling.nodeName;
    let i = 0,
      c = el;
    while ((c = c.previousElementSibling) != null) i++;
    path += "@" + i;
  }
  let parent = el.parentNode;
  while (parent) {
    path = parent.nodeName + " -> " + path;
    parent = parent.parentNode;
  }
  return path;
}

function newUUID() {
  const fourChars = function () {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .substring(1)
      .toUpperCase();
  };
  return (
    fourChars() +
    fourChars() +
    "-" +
    fourChars() +
    "-" +
    fourChars() +
    "-" +
    fourChars() +
    "-" +
    fourChars() +
    fourChars() +
    fourChars()
  );
}

function ElementFilter(ele, filter) {
  const array = [];
  if (filter(ele)) {
    return [];
  }
  if (ele.childElementCount > 0) {
    for (let childEle of ele.children) {
      array.push(ElementFilter(childEle, filter));
    }
  } else {
    array.push(ele);
  }
  return array.flat(Infinity);
}

export default class LitePage {
  constructor(props) {
    let app = this;
    this.uuidMap = {};
    this.eventMap = {};
    this._events = [];
    this.props = new Proxy(props, {
      set: function (obj, prop, value) {
        const answer = app._events.reduce(
          (pre, cur, idx) => {
            if (cur.type === "setValue") {
              return cur.func(pre);
            }
          },
          { obj, prop, value }
        );
        answer.obj[answer.prop] = answer.value;
        app.update();
        return true;
      },
    });
  }
  on(events, callback) {
    this._events.push({
      type: events,
      func: callback,
    });
    return this;
  }
  create(template) {
    const TemplateDOM = new DOMParser().parseFromString(template, "text/html")
      .body;
    const dom = ElementFilter(TemplateDOM, (e) => {
      if (!escape2Html(e.innerHTML).includes("%>")) {
        e.setAttribute("static", "true");
        return true;
      } else {
        return false;
      }
    });
    dom.forEach((currentElement) => {
      const id = getElementPath(currentElement);
      if (!(id in this.uuidMap)) {
        this.uuidMap[id] = newUUID();
      }
      currentElement.id = this.uuidMap[id];
    });
    this.updateMap = dom.map((e) => escape2Html(e.outerHTML));
    this.template = escape2Html(TemplateDOM.innerHTML);
    return this;
  }
  render(template) {
    const doc = new DOMParser().parseFromString(
      render(template, this.props),
      "text/html"
    ).body.firstChild;
    return doc;
  }
  mount(dom) {
    this.mountOn = dom;
    this.dom = this.render(this.template, this.props);
    document.querySelector(dom).append(this.dom);
    this.listen();
    return this;
  }
  listen() {
    ElementFilter(document.querySelector(this.mountOn), (ele) => {
      if (ele.attributes.length > 0) {
        Array.from(ele.attributes).forEach((currect) => {
          if (currect.name.split(":").length === 2) {
            const name = currect.name.split(":")[1];
            const func = currect.value;

            if (ele.id === "") {
              const path = getElementPath(ele);
              if (!(path in this.uuidMap)) {
                this.uuidMap[path] = newUUID();
              }
              ele.id = this.uuidMap[path];
            }

            const id = ele.id;

            if (typeof this.eventMap[id] === "undefined") {
              this.eventMap[id] = {};
            }

            if (this.eventMap[id][name] === func) {
              return;
            } else {
              ele.addEventListener(name, (event) => {
                this.props[func](ele, this.props, event);
              });
              this.eventMap[id][name] = func;
            }
          }
        });
      }
      return false;
    });
  }
  update(props = {}) {
    this.props = Object.assign(this.props, props);

    const updateMap = this.updateMap;

    let isUpdate = false;

    updateMap.forEach((ejs) => {
      const newEle = new DOMParser().parseFromString(
        render(ejs, this.props),
        "text/html"
      ).body.firstChild;
      const oldEle = document.getElementById(newEle.id);
      if (!oldEle.isEqualNode(newEle)) {
        isUpdate = true;
        oldEle.parentElement.replaceChild(newEle, oldEle);
        this.eventMap[oldEle.id] = {};
      }
    });

    if (isUpdate) {
      this.listen();
    }
    return this;
  }
}
