<div> 

    <h1 align="center"><code>React Web Highlighter的vue版本</code>&nbsp;&nbsp;🖍️</h1>
    <p align="center">
    依据React Web Highlighter改写了vue版本
    </p>
    <p align="center">
        <strong>一个富文本高亮笔记前端库，支持高亮文本的持久化存储与还原</strong>
    </p>

</div>

## 0. 在线案例

[点我点我](http://web-highlight.iweijie.cn/)

## 2. 安装

```bash
npm i vue-web-highlights or cnpm i vue-web-highlights
```

## 3. 使用方式

* main.js中

```js
import {
    setSelectRange,
    globalVariable
} from "vue-web-highlights";
Vue.prototype.$setSelectRange = setSelectRange;
Vue.prototype.$globalVariable = globalVariable;
```

* 在vue组件中

```vue
<template>
<HighLight
        :value="data"
        :template="template"
        :modes="toolBarList"
        @onAdd="onAdd"
        :key="update"
        @onUpdate="onUpdate"
      >
        <ToolBar v-if="visible" :visible="visible" @onCancel="onToolBarCancel">
         </ToolBar>
</HighLight>
</template>
<script>
import { HighLight, ToolBar } from "vue-web-highlights";
 //  components: { ToolBar, HighLight },
</script>
```

## 5. `TextHighlight` 组件参数说明

* `TextHighlight`组件属性
    | 参数名   | 类型                                   | 描述                                                                                                     | 是否必须 | 默认值 |
    | -------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- | ------ |
    | template | `string` | 富文本 HTML 字符串                                                                                       | 是       | `--` |
    | value    | `INoteTextHighlightInfo[]` | 高亮的选区数据                                                                                           | 否       | `--` |
    | tagName  | `string` | 用于包裹高亮文本的 HTML 标签名                                                                           | 否       | `span` |
    | onAdd    | `(data:INoteTextHighlightInfo)=>any` | 新增选区时触发的回调                                                                                     | 否       | `--` |
    | onUpdate | `(data:INoteTextHighlightInfo[])=>any` | 选中已存在的选区时触发的回调(由于选区会有重叠，所以参数为数组列表，会返回当前标记当前选中选区的所有节点) | 否       | `--` |
    | rowKey   | `string` | 每条数据的唯一值                                                                                         | 否       | `id` |
    | modes    | `IModeProps[]` | 用于区分类型与不同类型设置样式                                                                           | 否       | `--` |

* `INoteTextHighlightInfo` 类型属性:

  | 参数名 | 类型                           | 描述                               | 是否必须 |
  | ------ | ------------------------------ | ---------------------------------- | -------- |
  | list   | `INoteTextHighlightInfoItem[]` | 选区数据                           | 是       |
  | text   | `string` | 选区选中的文本数据                 | 是       |
  | mode   | `string` | 当前数据类型（例如：笔记，画线等） | 否       |

* `INoteTextHighlightInfoItem` 类型属性:

  | 参数名 | 类型       | 描述                                               | 是否必须 |
  | ------ | ---------- | -------------------------------------------------- | -------- |
  | level  | `number[]` | 选区层级数据，依据顶级节点一层层下钻到选中文本节点 | 是       |
  | start  | `number` | 当前选中的开始文本节点的偏移量                     | 是       |
  | end    | `string` | 当前选中的结束文本节点的偏移量                     | 是       |
  | text   | `string` | 当前文本节点选中的文本                             | 是       |

* `IModeProps` 类型属性:

  | 参数名    | 类型     | 描述                   | 是否必须 |
  | --------- | -------- | ---------------------- | -------- |
  | mode      | `string` | 类型                   | 是       |
  | className | `string` | 用于设置当前类型的类名 | 是       |

## 5.1  ToolBar 组件参数说明

> ToolBar 需作为 TextHighlight 的子元素存在

  | 参数名        | 类型        | 描述                   | 是否必须 | 默认值 |
  | ------------- | ----------- | ---------------------- | -------- | ------ |
  | mask          | `boolean` | 是否显示遮罩层         | 否       | true   |
  | visible       | `boolean` | 用于控制弹窗的显示隐藏 | 否       | false  |
  | autoClosable  | `boolean` | 点击自动触发管         | 否       | true   |
  | wrapClassName | `string` | 设置样式               | 否       | --     |
  | onCancel      | `function` | 设置关闭的回调         | 否       | --     |
  | children      | `ReactNode` | 弹窗内部的子元素       | 否       | --     |

## 6.  方法

`setSelectRange` 方法:
| 参数名 | 类型 | 描述 | 是否必须 |
| --------- | -------- | ---------------------- | -------- |
| node | `INoteTextHighlightInfo` | 用于设置原生选中文本的方法 | 是 |
