<template>
  <div class="www">
    <button class="read" @click="readLayout">读取</button>
    <div class="wrap" id="wrap">
      <div :style="lay" v-if="loadedLayoutData">
        <grid-layout
          style="transition: all 0.3s"
          :layout.sync="layout"
          :col-num="config.colNum"
          :row-height="config.rowHeight"
          :is-draggable="false"
          :is-resizable="false"
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
            <component class="item-content" v-bind:is="item.code"></component>
          </grid-item>
        </grid-layout>
      </div>
      <!-- <div class="kk" id="kk"></div> -->
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import safe from "@/components/layoutComponents/safe.vue";
import construction from "@/components/layoutComponents/construction.vue";
export default {
  data() {
    return {
      layout: [],
      lay: {
        width: "1",
        height: "2",
        margin: "0",
      },
      config: {},
      scale: 1,
      loadedLayoutData: false,
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    safe,
    construction,
  },
  mounted() {
    window.onresize = this.readLayout;
  },
  methods: {
    readLayout() {
      const wrapW = document.querySelector("#wrap").offsetWidth;
      const { baseConfig, layout } = JSON.parse(
        localStorage.getItem("layoutConfig")
      );
      this.scale = wrapW / baseConfig.wrapperWidth;
      this.config = baseConfig;
      this.layout = layout;
      const heightr = baseConfig.wrapperHeight * this.scale;
      const rowHeight = this.config.rowHeight
      this.config.rowHeight = rowHeight * this.scale
      const bodyH = document.body.offsetHeight;
      const margin = (bodyH - heightr) / 2 < 0 ? 0 : (bodyH - heightr) / 2;
      this.lay = {
        width: wrapW + `px`,
        height: heightr + `px`,
        margin: `${margin}px 0`,
        position: "relative",
      };
      this.loadedLayoutData = true;
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  width: 0px; /*对垂直流动条有效*/
  height: 0px; /*对水平流动条有效*/
}
</style>
<style scoped lang="scss">
.read {
  position: fixed;
  left: 100px;
  top: 100px;
  z-index: 1000;
}
.www {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrap {
  width: 100%;
  height: 100%;
  // background: black;
  overflow: hidden auto;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>

