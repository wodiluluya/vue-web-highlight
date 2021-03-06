/**
 * 获取层级
 * @param node
 * @param TopNode
 */

const getLevelList = (node, TopNode) => {
  const list = [];
  while (node !== TopNode) {
    const parent = node.parentNode;
    const children = parent.childNodes;
    for (let i = 0; i < children.length; i++) {
      if (node === children[i]) {
        list.push(i);
        break;
      }
    }
    node = parent;
  }
  return list.reverse();
};

export default getLevelList;
