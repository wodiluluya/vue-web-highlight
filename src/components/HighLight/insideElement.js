const insideElement = (target, wrap) => {
  let node = target;
  while (node) {
    if (node === wrap) return true;
    node = node.parentElement;
  }
  return false;
};

export default insideElement;
