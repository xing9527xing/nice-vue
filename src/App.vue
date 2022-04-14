<template>
  <div>
    <div id="map" style="width: 100%; height: 800px"></div>
    <PersonLayer
      ref="PersonLayer"
      :personData="personData"
      @hideOverlay="hideOverlay"
      @routeLineClick="routeLineClick"
    ></PersonLayer>
    <!-- <CarLayer ref="CarLayer" :personData="personData"></CarLayer> -->
  </div>
</template>

<script>
import {
  Login,
  GetBroadSetting,
  GetAllWorkerLocation,
  GetAllCarLocation,
  GetUserDetailedInfo,
  GetUserPolylineById,
  GetMarkedElements,
} from "@/api";
import PersonLayer from "./Person.vue";
import JtMap from "./JtMap";
import { ENUM_LAYERID, ENUM_FEATURE_TYPE,ENUM_OVERLAY_ID } from "./enums";
import moment from "moment";
export default {
  components: { PersonLayer },
  data() {
    return {
      mapInstanse: null,
      personData: {},
    };
  },
  mounted() {
    this.getSettings();
  },
  methods: {
    async getSettings() {
      const loginResponse = await Login({ Name: "zhangkai", Pwd: "123123" });
      sessionStorage.setItem("userInfo", JSON.stringify(loginResponse.Data));
      const { Data } = await GetBroadSetting();
      const {
        Type: displayType,
        ShowType: mapType,
        Coordinate: coordinate,
        KmlFileBizId: kmlFileBizId,
        Scaling: scaling,
        PicFileBizId: picFileBizId,
      } = Data;
      const mapParam = {
        displayType,
        mapType,
        coordinate,
        kmlFileBizId,
        scaling,
        picFileBizId,
      };
      this.mapInstanse = new JtMap(mapParam);
      this.getAllWorkerLocation();
      this.getAllCarLocation();
      this.addOverlay();
      this.getMarkedElements(displayType);
      this.addMapClickEvent();
    },
    /**
     * 获取人员信息并添加定位layer
     */
    async getAllWorkerLocation() {
      const workerLocationResponse = await GetAllWorkerLocation();
      this.mapInstanse.addLocationLayer(
        workerLocationResponse.Data || [],
        ENUM_LAYERID.WORKER,
        ENUM_FEATURE_TYPE.WORKER
      );
      // setTimeout(() => {
      //   this.getAllWorkerLocation()
      // }, 30000);
    },
    async getAllCarLocation() {
      const carLocationResponse = await GetAllCarLocation();
      this.mapInstanse.addLocationLayer(
        carLocationResponse.Data || [],
        ENUM_LAYERID.CAR,
        ENUM_FEATURE_TYPE.CAR
      );
      // setTimeout(() => {
      //   this.getAllCarLocation()
      // }, 30000);
    },
    /**
     * 初始化人员和车overlay
     */
    addOverlay() {
      this.mapInstanse.initOverLay(
        this.$refs.PersonLayer.$el,
        ENUM_OVERLAY_ID.WORKER
      );
    },
    /***
     * overlay点击查看轨迹时添加轨迹的方法
     */
    async routeLineClick(showPolyline, day) {
      if (showPolyline) {
        // true展示
        const responseData = await GetUserPolylineById({
          DriverId: this.personData.Id + "",
          StartTime: moment(day).format("YYYY-MM-DD"),
          EndTime: moment(day).format("YYYY-MM-DD"),
        });
        const { Polylines, Points } = responseData.Data;
        this.mapInstanse.addTrackLayer(Polylines, Points);
      } else {
        // false隐藏轨迹
        this.mapInstanse.removeLayerByLayerId(ENUM_LAYERID.TRACK);
      }
    },
    /**
     * 隐藏overlay
     */
    hideOverlay() {
      this.mapInstanse.removeAllOverlay();
      this.$refs.PersonLayer.beforeClose();
    },
    /**
     * 添加地图点击事件
     */
    addMapClickEvent() {
      this.mapInstanse.map.on("singleclick", async (evt) => {
        const coordinate = evt.coordinate;
        let feature = this.mapInstanse.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );
        if (feature) {
          const featureType = feature.get("featureType");
          // 是人员定位feature
          if (featureType === ENUM_FEATURE_TYPE.WORKER) {
            this.personData = {};
            const ovla = this.mapInstanse.map.getOverlayById(ENUM_OVERLAY_ID.WORKER);
            ovla.setPosition(coordinate);
            const personInfo = await GetUserDetailedInfo({
              Ids: feature.getId(),
            });
            this.personData = personInfo.Data || {};
          } else if(featureType === ENUM_FEATURE_TYPE.CAR) { // 是工程机械定位

          } else if(featureType === ENUM_FEATURE_TYPE.DEVICE) { // 是特殊设备要展示面板

          }
        } else {
          this.hideOverlay();
          this.mapInstanse.removeLayerByLayerId(ENUM_LAYERID.TRACK);
        }
      });
    },
    /**
     * displayType 展示方式
     */
    async getMarkedElements(displayType) {
      const response = await GetMarkedElements({ MarkType: displayType });
      // 地图图层添加标记
      this.mapInstanse.addMarkes(response.Data);
    },
  },
};
</script>

<style  lang="scss">
#map {
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
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
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
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
</style>
