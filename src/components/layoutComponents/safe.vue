<template>
  <div class="safe" id="safe">
    <div class="title">标题</div>
    <v-chart :init-options="{renderer:'svg'}" autoresize id="main" :option="this.options" />
  </div>
</template>

<script>
export default {
  name: "safe",
  data() {
    return {
      options: {},
      kk: false,
    };
  },
  mounted() {
    // 绘制图表
    this.options = {
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
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.safe {
  display: flex;
  flex-direction: column;
}
.title {
  height: 20px;
}
#main {
  flex-grow: 1;
}
</style>
