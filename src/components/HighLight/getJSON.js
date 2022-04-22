import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import resolveIntersection from "./resolveIntersection";
import { getCustomValue } from "./customAttrValue";
import {
  customAttr,
  customTag,
  customSplitAttr,
  customRowKey,
  customSelectedAttr,
} from "./constants";

const getElementHTML = (item) => {
  if (item.type === "element") {
    const { tagName, attributes, children } = item;
    const attrStr = isEmpty(attributes)
      ? ""
      : " " +
        attributes
          .map((attr) => {
            const { value, name } = attr;
            return value ? `${name}="${value}"` : name;
          })
          .join(" ");
    const child = getAstToHTML(children);
    return `<${tagName}${attrStr}>${child}</${tagName}>`;
  } else if (item.type === "text") {
    return item.content;
  }
  throw new Error("解析类型错误");
};

const getAstToHTML = (ast) => {
  if (isEmpty(ast)) return "";
  return ast
    .map((item) => {
      return getElementHTML(item);
    })
    .join("");
};

const getLastAst = (astItem, path) => {
  if (astItem.isCustom) return astItem;
  return get(astItem, path) || get(astItem.children, path) || astItem;
};

const translateAstNodes = (ast, options) => {
  // TODO 数据合并
  const {
    tagName = customTag,
    splitAttrName = customSplitAttr,
    attrName = customAttr,
    selectedAttr = customSelectedAttr,
    rowKey = customRowKey,
    modeClassNames = {},
  } = getCustomValue();

  const translateNodeList = [];
  if (!options || isEmpty(options)) return;

  options.forEach((optionItem) => {
    const { list, mode } = optionItem;
    const uuid = optionItem[rowKey];
    if (!Array.isArray(list) || !list.length) return;
    list.forEach((item) => {
      // @ts-ignore
      const node = item.level.reduce(getLastAst, ast);

      const { type, attributes } = node;

      if (
        type === "text" ||
        (type === "element" &&
          attributes.find((item) => item.name === attrName))
      ) {
        const parentNode = node.parent;

        if (!parentNode) return;

        let cNode = node;
        if (!node.isCustom) {
          cNode = {
            attributes: [
              {
                name: attrName,
                value: "true",
              },
            ],
            isCustom: true,
            custom: {
              list: [{ d: item, m: mode, u: uuid }],
              node,
            },
            children: [],
            parent: node.parent,
            tagName,
            type: "element",
          };

          translateNodeList.push(cNode);

          const index = parentNode.children.findIndex((item) => item === node);

          if (index !== -1) {
            parentNode.children.splice(index, 1, cNode);
          }
        } else {
          cNode.custom.list.push({ d: item, m: mode, u: uuid });
        }
      }
    });
  });

  translateNodeList.forEach((item) => {
    const { list, node } = item.custom;
    // 解决字符转义后路径对应问题
    const content = node.content;
    // 过滤不匹配文本
    const filterData = list.filter((item) => {
      const { start, end, text } = item.d;
      const comparisonText = content.slice(start, end);
      return comparisonText === text;
    });

    const children = resolveIntersection(filterData, content).map((item) => {
      const { text, options } = item;
      // 用于解决文本转标签注入的问题
      const content = text;

      if (isEmpty(options)) {
        return {
          content,
          type: "text",
        };
      }

      // @ts-ignore
      const ref = { children: [] };

      const lastNode = options.reduce((parent, option) => {
        const { uuid, mode } = option;
        const item = {
          type: "element",
          tagName,
          parent: null,
          attributes: [
            {
              name: "class",
              value: mode ? modeClassNames[mode] : "",
            },
            {
              name: splitAttrName,
              value: "true",
            },
            {
              name: selectedAttr,
              value: uuid,
            },
          ],
          children: [],
        };

        parent.children.push(item);

        return item;
      }, ref);

      lastNode.children.push({
        content,
        type: "text",
      });

      return ref.children[0];
    });

    item.children.push(...children);
  });
};

const getJSON = (ast, list) => {
  translateAstNodes(ast, list);
  return ast;
};

export default getJSON;
