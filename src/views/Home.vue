<template>
  <div>
    <div style="position: fixed; top: 10px; left: 10px; z-index: 2">
      <button @click="saveLayout">保存</button>
      <button @click="addLayoutItem">添加</button>
    </div>
    <div id="wrapper" class="wrapper">
      <div
        style="width: 100%; height: 100%; position: reletive; left: 0; top: 0"
      >
        <div
          v-for="i in colNum"
          :key="i"
          :style="{ left: i * 32 + 'px' }"
          class="bb"
        ></div>
        <div
          v-for="i in maxRows"
          :key="i + colNum"
          :style="{ top: i * rowHeight + 'px' }"
          class="aa"
        ></div>
      </div>
      <grid-layout
        id="kk"
        :layout.sync="layout"
        :col-num="colNum"
        :row-height="rowHeight"
        :max-rows="maxRows"
        :is-draggable="true"
        :is-mirrored="false"
        :is-resizable="true"
        :vertical-compact="false"
        :margin="[0, 0]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          @resized="resizedEvent"
          @moved="resizedEvent"
        >
          <component class="item-content" v-bind:is="item.code"></component>
          <!-- <div class="item-content">{{ item.i }}</div> -->
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";
import safe from '@/components/layoutComponents/safe.vue'
import construction from '@/components/layoutComponents/construction.vue'
const wrapperH = 720;
// const wrapperW = 960
export default {
  data() {
    return {
      layout: [
        { x: 0, y: 0, w: 5, h: 10, i: "0",code: 'safe' },
        { x: 2, y: 0, w: 10, h: 30, i: "1",code: 'construction' },
        // { x: 4, y: 0, w: 2, h: 10, i: "2" },
        // { x: 6, y: 0, w: 2, h: 10, i: "3" },
        // { x: 8, y: 0, w: 2, h: 10, i: "4" },
        // { x: 10, y: 0, w: 2, h: 10, i: "5" },
        // { x: 0, y: 0, w: 2, h: 5, i: "6" },
        // { x: 2, y: 5, w: 2, h: 5, i: "7" },
        // { x: 4, y: 0, w: 2, h: 5, i: "8" },
        // { x: 6, y: 0, w: 2, h: 4, i: "9" },
      ],
      lastLayout: "",
      rowHeight: 10,
      maxRows: 72,
      layoutCopy: [],
      colNum: 40,
      code: 'safe'
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    safe,
    construction
  },
  mounted() {
    // this.maxRows = 540 / this.rowHeight
    this.layoutCopy = _.cloneDeep(this.layout);
  },
  methods: {
    saveLayout() {
      localStorage.setItem("layout", JSON.stringify(this.layout));
    },
    resizedEvent() {
      console.log("resizedEvent");
      const height = document.querySelector("#kk").offsetHeight;
      if (height > wrapperH) {
        console.log("超出了");
        this.layout = _.cloneDeep(this.layoutCopy);
      } else {
        console.log("没有超出");
        this.layoutCopy = _.cloneDeep(this.layout);
      }
    },
    addLayoutItem() {
      this.layout.push({
        // x: (this.layout.length * 2) % (this.colNum),
        // y: this.layout.length + (this.colNum), // puts it at the bottom
        x: this.colNum - 2,
        y: this.layout.length + (this.colNum),
        w: 2,
        h: 2,
        i: this.index,
        code: this.code
      });
    },
  },
  computed: {
    index() {
      return this.layout.length;
    },
  },
};
</script>

<style lang="scss">
#wrapper {
  width: 1280px;
  height: 720px;
  z-index: 1;
  border: 1px solid #ccc;
  position: absolute;
  top: 100px;
  left: 100px;
  transform-origin: left top;
  overflow: hidden;
}
#kk {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.vue-grid-item {
  box-sizing: border-box;
  .item-content {
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // background: yellow;
    width: 100%;
    height: 100%;
    border: 1px solid;
  }
}
.bb {
  height: 100%;
  position: absolute;
  left: 35px;
  border-left: 1px dashed #c3cbdd;
}
.aa {
  position: absolute;
  width: 100%;
  border-top: 1px dashed #c3cbdd;
}
</style>
