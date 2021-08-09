<template>
  <div id="app">
    <div style="position: fixed; top: 10px; left: 10px; z-index: 2">
      <button @click="saveLayout">保存</button>
      <button @click="readLayout">读取</button>
    </div>
    <div id="wrapper" class="wrapper">
      <!-- wraper = (rowHeight * maxRows) + (maxRows - 1) * margin + 2 * margin -->
      <!-- maxRows = (wraper - 10) / (rowHeight + 10) -->
      <!-- gridItemHeight = rowHeight * itemH + (itemH - 1) * margin -->
      <grid-layout
        id="kk"
        :layout.sync="layout"
        :col-num="48"
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
          <div class="item-content">{{ item.i }}</div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";
const wrapperH = 540;
// const wrapperW = 960
export default {
  data() {
    return {
      layout: [
        { x: 10, y: 0, w: 2, h: 10, i: "0" },
        { x: 2, y: 0, w: 2, h: 10, i: "1" },
        { x: 4, y: 0, w: 2, h: 10, i: "2" },
        { x: 6, y: 0, w: 2, h: 10, i: "3" },
        { x: 8, y: 0, w: 2, h: 10, i: "4" },
        { x: 10, y: 0, w: 2, h: 10, i: "5" },
        { x: 0, y: 0, w: 2, h: 5, i: "6" },
        // { x: 2, y: 5, w: 2, h: 5, i: "7" },
        // { x: 4, y: 0, w: 2, h: 5, i: "8" },
        // { x: 6, y: 0, w: 2, h: 4, i: "9" },
      ],
      lastLayout: "",
      rowHeight: 10,
      maxRows: 54,
      layoutCopy: [],
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  mounted() {
    // this.maxRows = 540 / this.rowHeight
    this.layoutCopy = _.cloneDeep(this.layout);
  },
  methods: {
    saveLayout() {
      sessionStorage.setItem("layout", JSON.stringify(this.layout));
    },
    readLayout() {
      const screenH = window.screen.height;
      const proportion = screenH / wrapperH;
      this.layout = JSON.parse(sessionStorage.getItem("layout")).map((item) => {
        const { x, y, w, i, h } = item;
        return {
          x,
          y,
          w,
          i,
          h: h * proportion,
        };
      });
    },
    resizedEvent() {
      console.log("resizedEvent");
      const height = document.querySelector("#kk").offsetHeight;
      if (height > wrapperH) {
        console.log("超出了");
        this.layout = _.cloneDeep(this.layoutCopy);
      } else {
        console.log('没有超出');
        this.layoutCopy = _.cloneDeep(this.layout);
      }
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
}
#wrapper {
  width: 960px;
  height: 540px;
  z-index: 1;
  background: #ccc;
  position: absolute;
  top: 100px;
  left: 100px;
  overflow: auto;
  transform-origin: left top;
  padding: 5px;
  overflow: hidden;
}
.vue-grid-item {
  box-sizing: border-box;
  padding: 5px;
  .item-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: yellow;
    width: 100%;
    height: 100%;
  }
}
</style>
