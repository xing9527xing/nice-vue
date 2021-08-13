<template>
  <div :id="id" />
</template>

<script>
// import resizeMixins from "./resizeMixins";
import * as echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "echart",
  props: {
    id: {
      type: String,
      default: "chart" + parseInt(Math.random() * 1000),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        if (this.chart) {
          // 设置true清空echart缓存
          this.chart.setOption(options);
        }
      },
    },
  },
  mounted() {
    console.log("mounted");
    this.initChart();
  },
  methods: {
    initChart() {
      setTimeout(() => {
        this.chart = echarts.init(this.$el);
        this.chart.setOption(this.options);
      }, 200);
    },
    resizeChartMethod: debounce(function () {
      console.log(123123);
      if (this.chart) {
        this.chart.resize({
          animation: {
            duration: 300,
            easing: "cubicInOut",
          },
        });
      }
    }, 300),
  },
};
</script>

<style scoped lang="scss">
</style>
