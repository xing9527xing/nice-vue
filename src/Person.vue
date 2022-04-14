<template>
  <div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer" @click="hideOverlay"></a>
    <div id="popup-content">
      <div class="info-wrap">
        <div class="info-item">
          <p><span>姓名: </span>{{ personData.Name }}</p>
          <p>
            <span>性别: </span>{{ personData.DriverGender == 1 ? "女" : "男" }}
          </p>
        </div>
        <div class="info-item info-alone">
          <p><span>班组: </span>{{ personData.GroupName }}</p>
        </div>
        <div class="info-item">
          <p><span>工种: </span>{{ personData.WorkType }}</p>
          <p><span>上工时间: </span>{{ personData.Name }}</p>
        </div>
        <div class="info-item">
          <p>
            <el-date-picker
              style="width: 97%"
              v-model="day"
              value-format="yyyy-MM-dd"
              :clearable="false"
              type="date"
            >
            </el-date-picker>
          </p>
          <p>
            <button class="look-route" @click="routeLineClick">
              {{showPolyline ? '隐藏轨迹' : '查看轨迹'}}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    personData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      day: new Date,
      showPolyline: false
    };
  },
  mounted() {},
  methods: {
    routeLineClick() {
      this.showPolyline = !this.showPolyline;
      this.$emit('routeLineClick',this.showPolyline,this.day)
    },
    hideOverlay() {
      this.$emit('hideOverlay')
    },
    beforeClose() {
      this.showPolyline = false
    }
  },
};
</script>

<style lang="scss">
.ol-popup {
  position: absolute;
  background-color: rgba(5, 17, 65, 0.5);
  // box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
  padding: 11px;
  border-radius: 10px;
  border: 1px solid #67bfd5;
  bottom: 12px;
  left: 7px;
  min-width: 310px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 148px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 148px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
}

.info-wrap p {
  color: #d8d8dd;
  font-size: 14px;

  /* width: 50; */
}

.info-item p {
  display: inline-block;
  width: 50%;
  margin: 10px 0;
}

.info-alone p {
  width: 100%;
}

.info-wrap p span {
  color: #e19e50;
}

.info-left {
  width: 50%;
  float: left;
}

.info-right {
  width: 50%;
  float: left;
}

.info-wrap .look-route {
  width: 134px;
  line-height: 40px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  background-color: #53658f;
  border: none;
  cursor: pointer;
}
</style>
