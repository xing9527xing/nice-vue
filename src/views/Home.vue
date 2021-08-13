<template>
  <div>
    <div style="position: fixed; top: 10px; left: 100px; z-index: 2">
      <button @click="saveLayout">保存</button>
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
        ref="gridlayout"
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
        >
          <component
            style="backgound: yellow"
            :ref="item.code"
            class="item-content"
            v-bind:is="item.code"
          ></component>
        </grid-item>
      </grid-layout>
    </div>
    <div class="panal-list">
      <div
        v-for="item in series"
        :key="item.name"
        @drag="drag(item)"
        @dragend="dragend(item)"
        draggable="true"
        unselectable="on"
      >
        <div>
          <img
            :src="require(`@/assets/${item.image}.jpg`)"
            style="object-fit: contain; width: 100%"
            class="image"
          />
        </div>
        <div style="padding: 14px">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";
import safe from "@/components/layoutComponents/safe.vue";
import construction from "@/components/layoutComponents/construction.vue";
const wrapperH = 720;

let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
// const wrapperW = 960
export default {
  data() {
    return {
      layout: [
        // { code: "safe", h: 44, i: "0", moved: false, w: 18, x: 13, y: 15 },
        // { code: "construction", h: 27, i: "1", moved: false, w: 6, x: 5, y: 6 },
        // { h: 27, i: "1", moved: false, w: 6, x: 5, y: 6 },
        // { h: 27, i: "2", moved: false, w: 6, x: 5, y: 6 },
        // { h: 27, i: "3", moved: false, w: 6, x: 5, y: 6 },
        // { h: 27, i: "4", moved: false, w: 6, x: 5, y: 6 },
      ],
      series: [
        { code: "safe", name: "安全", image: 2 },
        { code: "construction", name: "施工", image: 1 },
      ],
      lastLayout: "",
      rowHeight: 10,
      maxRows: 72,
      layoutCopy: [],
      colNum: 40,
      dragingItem: {},
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    safe,
    construction,
  },
  mounted() {
    // this.maxRows = 540 / this.rowHeight
    this.layoutCopy = _.cloneDeep(this.layout);
    document.addEventListener(
      "dragover",
      function (e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
  },
  methods: {
    layoutUpdatedEvent() {
      // console.log('layoutUpdatedEventlayoutUpdatedEvent');
    },
    saveLayout() {
      const height = document.querySelector("#kk").offsetHeight;
      if (height > wrapperH) {
        // this.layout = _.cloneDeep(this.layoutCopy);
        this.$message("内容不可超出边框区域");
      } else {
        this.layoutCopy = _.cloneDeep(this.layout);
        console.log("不超出");
        localStorage.setItem("layout", JSON.stringify(this.layout));
      }
    },
    // resizedEvent() {
    //   const height = document.querySelector("#kk").offsetHeight;
    //   if (height > wrapperH) {
    //     this.layout = _.cloneDeep(this.layoutCopy);
    //     console.log('超出');
    //   } else {
    //     this.layoutCopy = _.cloneDeep(this.layout);
    //     console.log('不超出');
    //   }
    // },
    drag: function (item) {
      let parentRect = document
        .getElementById("wrapper")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 5,
          h: 10,
          i: "drop",
          code: item.code,
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          this.layout = this.layout.filter((obj) => obj.i !== "drop");
        }
      }
    },
    dragend: function (item) {
      let parentRect = document
        .getElementById("wrapper")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent(
          "dragend",
          "drop",
          DragPos.x,
          DragPos.y,
          1,
          1
        );
        this.layout = this.layout.filter((obj) => obj.i !== "drop");
        this.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 5,
          h: 10,
          i: DragPos.i,
          code: item.code,
        });
        this.$refs.gridLayout.dragEvent(
          "dragend",
          DragPos.i,
          DragPos.x,
          DragPos.y,
          1,
          1
        );
      }
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
    background: yellow;
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
.panal-list {
  position: fixed;
  height: 200px;
  width: 300px;
  right: 100px;
  top: 200px;
  list-style: none;
  li {
    margin-bottom: 10px;
  }
}
</style>
