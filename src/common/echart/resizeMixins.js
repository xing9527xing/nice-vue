// 混入代码 resize-mixins.js
import { debounce } from '@/utils';
import bus from '../../utils/bus';
const resizeChartMethod = '$__resizeChartMethod';

export default {
  data() {
    // 在组件内部将图表 init 的引用映射到 chart 属性上
    return {
      chart: null,
    };
  },
  mounted() {
    // window.addEventListener('resize', this[resizeChartMethod], false);
    console.log('created');
    bus.$on('layoutResize', this[resizeChartMethod])
  },
  activated() {
    // 防止 keep-alive 之后图表变形
    if (this.chart) {
      this.chart.resize({ animation: { duration: 0.2 } })
    }
  },
  destroyed() {
    // bus.$off('layoutResize')
  },
  methods: {
    // 防抖函数来控制 resize 的频率
    [resizeChartMethod]: debounce(function () {
      console.log(234234234);
      if (this.chart) {
        this.chart.resize({
          animation: {
            duration: 300,
            easing: 'cubicInOut'
          }
        });
      }
    }, 300),
  },
};
