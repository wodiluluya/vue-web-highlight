import getJSON from "../getJSON";
import { getDomFromHTMLTemp } from "../tool";
import { customAttr as attr, customTag as tagName } from "../constants";
import cloneDeep from "lodash/cloneDeep";

const parseDom = (dom, parent) => {
  if (dom instanceof Element) {
    const element = {
      children: [],
      attributes: [],
      parent,
      tagName: dom.tagName.toLocaleLowerCase(),
      type: "element",
    };

    const attrs = dom.getAttributeNames();
    element.attributes = attrs.map((key) => {
      const value = dom.getAttribute(key) || "";

      if (key === "id") {
        element.id = value;
      } else if (key === "class") {
        element.class = value;
      }
      return {
        name: key,
        value,
      };
    });

    const childNodes = dom.childNodes;

    if (childNodes && childNodes.length) {
      for (let i = 0; i < childNodes.length; i++) {
        const ast = parseDom(childNodes[i], element);
        if (ast) {
          element.children.push(ast);
        }
      }
    }

    return element;
  } else if (dom instanceof Text) {
    const textContent = dom.textContent || "";
    const text = {
      parent: parent,
      content: textContent,
      type: "text",
    };
    return text;
  } else if (dom instanceof Comment) {
    return null;
  }

  throw new Error("类型错误");
};

const parse = (template) => {
  const doms = getDomFromHTMLTemp(template);
  const nodes = [];
  for (let i = 0; i < doms.length; i++) {
    const ast = parseDom(doms[i]);
    if (ast) {
      nodes.push(ast);
    }
  }
  return nodes;
};

class Parse {
  template;
  ast;
  // list: INoteTextHighlightInfo[];
  custom;
  constructor(props) {
    const { template, customAttr, customTag } = props;
    this.template = template;
    this.ast = parse(template);
    // this.list = list;
    this.custom = {
      attrName: customAttr || attr,
      tagName: customTag || tagName,
    };
  }

  // getHTML(list?: INoteTextHighlightInfo[]) {
  //   const snapshot = cloneDeep(this.ast);
  //   return getHTML(snapshot, list);
  // }

  getJSON(list) {
    const snapshot = cloneDeep(this.ast);
    return getJSON(snapshot, list);
  }
}

export default Parse;
