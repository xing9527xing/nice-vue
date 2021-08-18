<template>
  <div style="height: 3000px">
    <div style="position: fixed; top: 10px; left: 100px; z-index: 2">
      <button @click="saveLayout">保存</button>
      <el-select
        @change="calc"
        allow-create
        filterable
        v-model="config.screenSize"
        size="mini"
      >
        <el-option label="3840*1080" value="3840*1080"> </el-option>
        <el-option label="1920*1080" value="1920*1080"> </el-option>
        <el-option label="1280*1024" value="1280*1024"> </el-option>
        <el-option label="1366*768" value="1366*768"> </el-option>
      </el-select>
    </div>
    <div
      ref="wrapper"
      id="wrapper"
      class="wrapper"
      :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }"
    >
      <!-- 背景网格 -->
      <div class="background-grid">
        <div
          v-for="i in config.colNum - 1"
          :key="i"
          :style="{ left: (i * wrapperWidth) / config.colNum + 'px' }"
          class="bb"
        ></div>
        <div
          v-for="i in config.maxRows - 1"
          :key="i + config.colNum"
          :style="{ top: i * config.rowHeight + 'px' }"
          class="aa"
        ></div>
      </div>
      <!-- grid布局 -->
      <grid-layout
        id="kk"
        ref="gridlayout"
        :layout.sync="layout"
        :col-num="config.colNum"
        :row-height="config.rowHeight"
        :max-rows="config.maxRows"
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
          :minW="item.minW"
          :minH="item.minH"
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
import safe from "@/components/layoutComponents/safe.vue";
import construction from "@/components/layoutComponents/construction.vue";

let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
export default {
  data() {
    return {
      config: {
        screenSize: "1920*1080", // 用户选定屏幕分辨率(尺寸)
        rowHeight: 10,
        maxRows: 72,
        colNum: 192, // screenSize[0] / 10
      },
      layout: [
        { x: 0, y: 0, w: 1, h: 5, i: 1,minW: 20,minH: 5 },
        // { x: 10, y: 0, w: 20, h: 40, i: 2 },
      ],
      series: [
        { code: "safe", name: "安全", image: 2, minWidth: 480, minHeight: 200 },
        {
          code: "construction",
          name: "施工",
          image: 1,
          minWidth: 500,
          minHeight: 200,
        },
      ],
      wrapperWidth: 1280,
      wrapperHeight: 720,
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    safe,
    construction,
  },
  mounted() {
    this.calc()
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
    calc() {
      const a = this.config.screenSize.split("*");
      this.wrapperHeight =
        Math.floor((a[1] * this.wrapperWidth) / a[0] / 10) * 10;
      this.$refs.wrapper.style.height = this.wrapperHeight + "px";
      this.config.maxRows = Math.floor(
        this.wrapperHeight / this.config.rowHeight
      );
      this.series.forEach((serie) => {
        serie.minW = Math.ceil(
          serie.minWidth /
            (this.config.screenSize.split("*")[0] / this.config.colNum)
        );
        serie.minH = Math.ceil(
          serie.minHeight /
            (this.config.screenSize.split("*")[1] / this.config.maxRows)
        );
      });
    },
    // 保存布局
    saveLayout() {
      const height = document.querySelector("#kk").offsetHeight;
      if (height > this.wrapperHeight) {
        this.$message("内容不可超出边框区域");
      } else {
        console.log("不超出");
        localStorage.setItem("layout", JSON.stringify(this.layout));
        localStorage.setItem(
          "layoutConfig",
          JSON.stringify({
            layout: this.layout,
            baseConfig: {
              ...this.config,
              wrapperWidth: this.wrapperWidth,
              wrapperHeight: this.wrapperHeight,
            },
          })
        );
      }
    },
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
          x: (this.layout.length * 2) % (this.config.colNum || 12),
          y: this.layout.length + (this.config.colNum || 12), // puts it at the bottom
          w: item.minW,
          h: item.minH,
          minW: item.minW,
          minH: item.minH,
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
          w: item.minW,
          h: item.minH,
          minW: item.minW,
          minH: item.minH,
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
  z-index: 1;
  border: 1px solid #ccc;
  position: absolute;
  top: 100px;
  left: 100px;
  transform-origin: left top;
  overflow: visible;
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
    background: yellow;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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
.background-grid {
  width: 100%;
  height: 100%;
  position: reletive;
  left: 0;
  top: 0;
}
</style>
