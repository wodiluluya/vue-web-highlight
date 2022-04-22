<template>
  <div class="text-highlight-wrap" ref="wrapContainer">
    <div
      class="text-highlight"
      id="text-highlight"
      ref="noteContainer"
      @mousedown="handleMouseDown"
      @mouseup="handleSelectedText"
      @click="handleClick"
    >
      <template v-for="(item, index) in content">
        <RenderDom :vNode="item" :key="index"></RenderDom>
      </template>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import getSelectedInfo from '../getSelectedInfo'
import { setCustomValue } from '../customAttrValue'
import RenderDom from './render.js'
import { isEmpty } from 'lodash'
import Parse from '../Parse/index'
import {
  customTag as cTag,
  customAttr as cAttr,
  customRowKey,
  customSplitAttr,
  customSelectedAttr,
} from '../constants'
export default {
  name: 'Note',
  data() {
    return {
      content: null,
      customValue: null,
      snapShoot: null,
      noteContainer: null,
    }
  },
  props: {
    template: {
      type: String,
    },
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    tagName: {
      type: String,
      default: cTag,
    },
    rowKey: {
      type: String,
      default: customRowKey,
    },
    onAdd: {
      type: Function,
    },
    onUpdate: {
      type: Function,
    },
    modes: {
      type: Array,
    },
  },
  components: { RenderDom },
  mounted() {
    let tem
    if (this.template) {
      const div = document.createElement('div')
      div.innerHTML = this.template
      tem = div.innerHTML
    }
    const parse = new Parse({ template: tem })
    console.log(this.value)
    this.snapShoot = parse.getJSON(this.value)
    const modeClassNames = {}
    if (this.modes && this.modes.length) {
      this.modes.forEach((item) => {
        if (item.mode) {
          modeClassNames[item.mode] = item.class || ''
        }
      })
    }
    setCustomValue({
      tagName: this.tagName,
      attrName: cAttr,
      rowKey: this.rowKey,
      splitAttrName: customSplitAttr,
      selectedAttr: customSelectedAttr,
      modeClassNames: modeClassNames,
    })
    this.content = this.getContext(this.snapShoot)
    this.noteContainer = this.$refs.noteContainer
    this.$globalVariable.setWrapContainer(this.$refs.wrapContainer)
    // this.$store.commit('setWrapContainer', this.$refs.wrapContainer)
  },

  methods: {
    vnodeRender(vnode) {
      this.__patch__(this.$refs.noteContainer, vnode, true, false)
    },
    getContext(snapShoot) {
      const nodes = []
      for (let i = 0; i < snapShoot.length; i++) {
        const node = snapShoot[i]
        if (node.type === 'text') {
          nodes.push(node.content)
        } else if (node.type === 'element') {
          let children = []
          if (!isEmpty(node.children)) {
            children = this.getContext(node.children)
          }
          const props = node.attributes.reduce((attrs, attribute) => {
            if (attribute.name === 'class') {
              attrs.class = attribute.value
            } else {
              attrs[attribute.name] = attribute.value
            }

            return attrs
          }, {})

          props.key = `${node.tagName}-${i}`
          /*
    https://cn.vuejs.org/v2/guide/render-function.html 深入数据对象
    */
          nodes.push(
            this.$createElement(node.tagName, { attrs: props }, children),
          )
        } else {
          throw new Error('类型错误')
        }
      }
      return nodes
    },

    handleSelectedText() {
      const range = window.getSelection().getRangeAt(0)
      if (!range) return

      const text = range.toString()

      const { collapsed = true, endContainer, startContainer } = range

      // 返回条件 1. 光标起始点相同（即没有选中文本），2. 起点或者终点不在当前容器内
      if (
        collapsed ||
        !this.noteContainer ||
        !this.noteContainer.contains(startContainer) ||
        !this.noteContainer.contains(endContainer)
      )
        return

      const list = getSelectedInfo({
        range: range,
        noteContainer: this.noteContainer,
      })

      const data = {
        list,
        text: text,
      }

      //this.$store.commit('setAction', 'add')
      // this.$store.commit('setSelectedValue', data)
      this.$globalVariable.setAction('add')
      this.$globalVariable.setSelectedValue(data)
      debugger

      this.$emit('onAdd', data)
    },

    handleClick(e) {
      if (!this.noteContainer || !e.target) return
      let node = e.target
      const uuids = []
      while (node) {
        const uuid = node.getAttribute(customSelectedAttr)
        if (uuid) {
          uuids.push(uuid)
          node = node.parentNode
        } else {
          break
        }
      }

      if (!uuids.length) return

      const findData = []

      uuids.forEach((uuid) => {
        const data = this.value.find((item) => item[this.rowKey] === uuid)
        if (data) {
          findData.push(data)
        }
      })
      this.$globalVariable.setAction('update')
      //  this.$store.commit('setAction', 'update')
      this.$emit('onUpdate', findData)
    },
    handleMouseDown() {
      if (!this.noteContainer) return
    },
  },
}
</script>
<style lang="less">
@import url('./index.less');
</style>
