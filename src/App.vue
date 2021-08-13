<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 300,
      options: {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 40],
          },
        ],
      },
    };
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
.vue-grid-item {
  background: oldlace;
}
</style>
