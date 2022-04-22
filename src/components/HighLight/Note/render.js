export default {
  name: "RenderDom",
  props: {
    vNode: [Array, String, Object, Number],
  },
  render(h) {
    return this.vNode;
  },
};
