<template>
  <div>
    <div
      :class="visible && mask ? 'note-none note-tool-mask' : 'note-none'"
    ></div>
    <div class="note-tool" ref="toolContainer">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { marginVertical } from "../constants";
import insideElement from "../insideElement";
export default {
  name: "ToolBar",
  data() {
    return {
      toolContainer: null,
    };
  },
  props: {
    visible: {
      type: Boolean,
    },
    mask: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    autoClosable: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    wrapClassName: {
      type: String,
    },
    onCancel: {
      type: Function,
    },
  },
  components: {},

  computed: {},

  mounted() {
    const wrapContainer = this.$globalVariable.wrapContainer;
    this.toolContainer = this.$refs.toolContainer;

    if (!wrapContainer.className || !this.toolContainer.className) return;

    this.toolContainer.style.display = this.visible ? "flex" : "none";

    if (!this.visible) return;

    let range;

    range = window.getSelection().getRangeAt(0);

    if (!range) return;

    const rangeRect = range.getBoundingClientRect();

    const wrapContainerRect = wrapContainer.getBoundingClientRect();
    const toolContainerRect = this.toolContainer.getBoundingClientRect();

    let top;
    let toolClassName;
    let left;

    if (rangeRect.top > marginVertical + toolContainerRect.height) {
      toolClassName = "up";
      top =
        rangeRect.top -
        wrapContainerRect.top -
        marginVertical -
        toolContainerRect.height;
    } else {
      toolClassName = "down";
      top = rangeRect.bottom - wrapContainerRect.top + marginVertical;
    }

    const leftPoint =
      (rangeRect.left + rangeRect.right) / 2 - wrapContainerRect.left;

    if (leftPoint - toolContainerRect.width / 2 < 0) {
      left = 0;
      // arrowLeft = leftPoint < 6 ? 6 : leftPoint;
    } else if (
      leftPoint + toolContainerRect.width / 2 >
      wrapContainerRect.width
    ) {
      left = wrapContainerRect.width - toolContainerRect.width;
      // arrowLeft = wrapContainerRect.left - leftPoint < 6 ? 6 : leftPoint;
    } else {
      left =
        (rangeRect.left + rangeRect.right) / 2 -
        toolContainerRect.width / 2 -
        wrapContainerRect.left;
      // arrowLeft = leftPoint;
    }

    this.toolContainer.style.top = `${top}px`;
    this.toolContainer.style.left = `${left}px`;
    this.toolContainer.classList.remove("up", "down");
    this.toolContainer.classList.add(toolClassName);

    // TODO 没有想到好的方式去移除弹窗，后续优化
    setTimeout(() => {
      document.addEventListener("click", this.handle);
    });
    //
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handle);
  },
  methods: {
    handle(e) {
      /* typeof onCancel !== "function" || */
      if (
        !this.toolContainer.className ||
        insideElement(e.target, this.toolContainer)
      )
        return;
      if (this.autoClosable) {
        this.$emit("onCancel");
      }
    },
  },
};
</script>
<style lang="less">
@import url("./index.less");
</style>
