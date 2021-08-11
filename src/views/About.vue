<template>
  <div style="width: 100%; height: 100%">
    <button class="read" @click="readLayout">读取</button>
    <div class="wrap" id="wrap">
      <div :style="lay" v-if="loadedLayoutData">
        <grid-layout
          id="kk"
           style="transition: all .3s;"
          :layout.sync="layout"
          :col-num="colNum"
          :row-height="10"
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
            <!-- <div class="item-content">{{item.code}}-{{item.i}}</div> -->
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
import safe from '@/components/layoutComponents/safe.vue'
import construction from '@/components/layoutComponents/construction.vue'
export default {
  data() {
    return {
      layout: [],
      lay: {
        width: "1",
        height: "2",
        margin: '0'
      },
      scale: 1,
      colNum: 40,
      loadedLayoutData: false,
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    safe,
    construction
  },
  mounted() {
    window.onresize = this.readLayout
  },
  methods: {
    readLayout() {
      const wrapW = document.querySelector("#wrap").offsetWidth;
      this.scale = wrapW / 1920;
      this.layout = JSON.parse(localStorage.getItem("layout")).map((item) => {
        const { x, y, w, i, h } = item;
        return {
          ...item,
          x,
          y: y * 1.5,
          w,
          i,
          h: h * 1.5,
        };
      });
      const height = 1080 * this.scale
      const bodyH = document.body.offsetHeight
      const margin = (bodyH - height) / 2 < 0 ? 0 : (bodyH - height) / 2
      this.lay = {
        width: 1920 * this.scale + `px`,
        height: height + `px`,
        margin: `${margin}px 0`,
        position: 'relative'
      };
      this.loadedLayoutData = true;
      this.$nextTick(() => {
        const kk = document.querySelector("#kk");
        kk.style.transform = `scale(${this.scale}, ${this.scale})`;
      });
    },
  },
  
};
</script>
<style>
::-webkit-scrollbar {
  width: 5px; /*对垂直流动条有效*/
  height: 10px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px transparent;
  border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  background-color: transparent;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  height: 0;
}

</style>
<style scoped lang="scss">
.read {
  position: fixed;
  left: 100px;
  top: 100px;
  z-index: 1000;
}
.wrap {
  width: 100%;
  height: 100%;
  // background: black;
  overflow: hidden auto;
  box-sizing: border-box;
}

// 辅助驾驶
#kk {
  width: 1920px;
  height: 1080px;
  transform-origin: left top;
}
</style>

