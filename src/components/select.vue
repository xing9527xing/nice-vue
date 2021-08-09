<!--组件部分 （vue文件）-->
<template>
  <TreeSelect
    ref="tagSelectRef"
    v-model="valueSelf"
    placeholder="请输入或选择标签"
    async
    v-bind="$attrs"
    :normalizer="normalizer"
    :default-options="true"
    :load-options="loadTagsOptions"
    :clear-on-select="clearOnSelect"
    @select="selectItem"
  >
    <label slot="option-label" slot-scope="{ node }">
      <b v-if="node.isNew">{{ node.label }}{{ "  (新标签)" }}</b>
      <span v-else>{{ node.label }}</span>
    </label>
  </TreeSelect>
</template>
 
<script>
import TreeSelect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "tag-select",
  components: {
    TreeSelect,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    //选择的数据项
    value: {
      type: [Array,String],
    },
    //已有的数据项
    allTags: {
      type: Array,
    },
    // 选择后是否清除搜索文字
    clearOnSelect: {
      type: Boolean,
      default: true,
    },
    // 新标签是否区别颜色
    isNewTagDifference: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      valueSelf: this.value, //自身展示的value
    };
  },
  watch: {
    valueSelf(newValue) {
      if (newValue !== this.value) {
        this.$emit("change", newValue);
      }
    },
    value() {
      this.valueSelf = this.value;
    }
  },
  methods: {
    //异步加载标签
    loadTagsOptions({ action, searchQuery, callback }) {
      //输入时异步加载
      if (action === ASYNC_SEARCH) {
        let options = [];
        // 1. 搜索空字符串，则展示全部已有标签
        if (searchQuery.trim() === "") {
          options = this.allTags;
        }
        // 2. 不为空，则生成新标签 + 过滤已有标签
        else {
          //2.1 过滤已有标签
          this.allTags.forEach((x) => {
            if (x.label.indexOf(searchQuery) > -1) {
              options.push({
                id: x,
                label: x,
              });
            }
          });
          //2.2 新增标签(如果没有完全匹配，则新增)
          if (!this.allTags.find((x) => x === searchQuery))
            options.push({
              id: searchQuery,
              label: searchQuery,
              isNew: this.isNewTagDifference,
            });
        }
        //3. 回传
        callback(null, options);
      }
    },
    normalizer(node) {
      return {
        id: node.Id,
        label: node.Name,
        children: node.Children
      }
    },
    //选择菜单项后强行清空搜索字符串
    selectItem() {
      if (this.clearOnSelect) this.$refs.tagSelectRef.resetSearchQuery();
    },
  },
};
</script>