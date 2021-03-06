import { customAttr } from "./constants";

/**
 * @description 如果外层有 customAttr 属性， 表示当前节点为自定义分割节点，取最近的一层, 如果没有就取当前节点
 * @param startContainer
 * @param noteContainer
 */
const getStartNode = (startContainer, noteContainer) => {
  let node = startContainer;
  let lastNode = startContainer;

  while (node && node !== noteContainer) {
    const isCustom = node.getAttribute && node.getAttribute(customAttr);
    if (isCustom) {
      lastNode = node;
      break;
    }
    node = node.parentNode;
  }

  return lastNode;
};

export default getStartNode;
