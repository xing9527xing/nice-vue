import { Map, View, Feature, Overlay } from "ol";
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer, Heatmap as HeatmapLayer } from "ol/layer";
import { XYZ, Vector as VectorSource, ImageStatic as Static } from "ol/source";
import { fromLonLat, Projection } from "ol/proj";
import { Point, LineString, Polygon } from "ol/geom";
import { Style, Icon, Fill, Stroke, Circle } from "ol/style";
import { getCenter } from 'ol/extent'
import { getUplodedListApi } from '@/api'
import { KML, GeoJSON } from "ol/format";
import workerIcon from '../public/static/images/worker.png'
import carIcon from '../public/static/images/car.png'
import { ENUM_LAYERID, ENUM_DRAW_TYPE, ENUM_FEATURE_TYPE } from './enums'
import {generatStyle} from './maputil'
// import { styleFunction, showFeatures, drawType } from "./maputil.js"
const DISPLAY_TYPE = {
  map: 1, // 地图
  image: 2 // 平面图
}
const MAP_TYPE = {
  normal: 1, // 正常地图
  satellite: 2 // 卫星地图
}
// 默认参数
const defaultParams = {
  displayType: 1,
  mapType: 1,
  coordinate: '113.808736,34.794607',
  kmlFileBizId: "04ec0220-d712-4fd6-ba22-cba98ed4e862",
  scaling: 1,
  picFileBizId: "fdc16212-720c-4503-95e3-c31fecfa6fa2"
}
class JtMap {
  // displayType: 1 地图 2平面图
  // mapType: 1 地图 2 卫星地图
  constructor(params = defaultParams) {
    this.map = new Map({
      target: "map",
      layers: [],
      view: new View({
        center: fromLonLat([113.808736, 34.794607]),
        zoom: 12,
        maxZoom: 19,
        projection: 'EPSG:3857'	  //'EPSG:3857'(默认 墨卡托)    EPSG:4326()
      })
    });
    this.mapParams = params
    this.initMap(params)
  }
  // 根据地图的类型
  initMap(params) {
    const { displayType, coordinate } = params;
    // 展示地图基本图层
    if (displayType === DISPLAY_TYPE.map) {
      // 绘制地图
      this.displayMap()
      // 根据参数设置地图的中心点
      this.view.setCenter(fromLonLat(coordinate.split(',')))
    } else if (displayType === DISPLAY_TYPE.image) {
      // 绘制平面图
      this.displaStaticImage()
    }
    // this.initOverLay()
  }
  // 绘制地图(分为卫星图和正常图)
  displayMap() {
    if (this.mapParams.mapType === MAP_TYPE.normal) {
      this.map.addLayer(new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&scl=1&x={x}&y={y}&z={z}`,
        }),
      }))
    } else if (this.mapParams.mapType === MAP_TYPE.satellite) {
      this.map.addLayer(new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&scl=1&x={x}&y={y}&z={z}`,
        }),
      }))
      this.map.addLayer(new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&scl=1&x={x}&y={y}&z={z}`,
        }),
      }))
    }
    // 请求用户上传的kml文件如果有就展示到地图上
    getUplodedListApi({ BizId: this.mapParams.kmlFileBizId, BizCode: '' }).then(res => {
      if (res.Data[0] && res.Data[0].SuffixName === 'kml') {
        const Id = res.Data[0].Id
        let token = JSON.parse(sessionStorage.getItem('userInfo')).token;
        let url = `/Api/Doc/File/PreviewFileDownload?Id=${Id}&token=${token}`
        this.map.addLayer(new VectorLayer({
          source: new VectorSource({
            url: url,
            format: new KML()
          })
        }))
      }
    })
  }
  // 绘制平面图
  async displaStaticImage() {
    const { Data } = await getUplodedListApi({ BizId: this.mapParams.picFileBizId, BizCode: '' })
    const Id = Data[0].Id
    let token = JSON.parse(sessionStorage.getItem('userInfo')).token;
    let url = `/Api/Doc/File/PreviewFileDownload?Id=${Id}&token=${token}`
    // 创建对象
    let img = new Image()
    // 改变图片的src
    img.src = url
    // 加载完成执行
    img.onload = () => {
      const extent = [0, 0, img.width, img.height]
      const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      })
      // 平面图的layer
      const mapLayer = new ImageLayer({
        source: new Static({
          url: url,
          projection: projection,
          imageExtent: extent
        })
      })
      const center = getCenter(extent)
      const mapView = new View({
        projection: projection,
        center: [center[0], center[1] / 2.6],
        zoom: parseFloat(this.mapParams.scaling) || 2,
        maxZoom: 8
      })
      this.map.addLayer(mapLayer)
      this.map.setView(mapView)
    }
  }
  // 初始化overlay
  initOverLay(el, overlayId) {
    const overlay = new Overlay({
      element: el,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      },
      id: overlayId
    });
    overlay.set('id', overlayId)
    this.map.addOverlay(overlay)
    return overlay
  }
  /**
   * 根据传入的数据源和Id进行渲染数据源中的点定位信息
   * @param {数据源} dataSource 
   * @param {要添加的layer的Id用来未来操作layer时获取使用} layerId 
   */
  addLocationLayer(dataSource, layerId, featureType) {
    this.clearFeaturesByLayerId(layerId)
    let features = [];
    for (let i = 0; i < dataSource.length; ++i) {
      let data = dataSource[i];
      if (data.LocationPoint && data.LocationPoint.length > 5) {
        let temp = data.LocationPoint.split(',');
        let coordinates = fromLonLat([parseFloat(temp[0]), parseFloat(temp[1])]);
        let fea = new Feature(new Point(coordinates));
        fea.setId(data.Id);
        fea.set("featureType", featureType);
        features.push(fea);
      }
    }
    this.map.addLayer(new VectorLayer({
      source: new VectorSource({
        features: features
      }),
      style: new Style({
        image: new Icon({
          src: layerId === ENUM_LAYERID.WORKER ? workerIcon : carIcon,
        }),
      }),
      properties: { id: layerId }
    }))
  }
  // 获取地图的view方法
  get view() {
    return this.map.getView()
  }
  /**
   * 根据请求回来的标注数据给地图添加标注层
   * @param {数据源} data 
   */
  addMarkes(data) {
    const markSource = new VectorSource({ wrapX: false })
    const markLayer = new VectorLayer({
      className: "map-mask",
      source: markSource
    })
    data.forEach((item) => {
      if (item.Children && item.Children.length) {
        item.Children.forEach((itm) => {
          this.showFeatures(itm, markSource);
        });
      }
    });
    this.map.addLayer(markLayer)
  }
  showFeatures(item, source) {
    const drawT = item.DrawType;
    let feature = null;
    if (drawT === ENUM_DRAW_TYPE.POINT) {
      const coordinate = item.Coordinates[0];
      feature = new Feature({ //路线
        geometry: new Point(fromLonLat([coordinate['Longitude'], coordinate['Latitude']]))
      });
      feature.setId(item.Id);
    } else if (drawT === ENUM_DRAW_TYPE.POLYGON) {
      let _points = [];
      item.Coordinates.forEach(item => {
        _points.push(fromLonLat([item['Longitude'], item['Latitude']]))
      })
      _points = [_points]
      //多边形的数据格式是[[[lng,lat],[lng,lat]……]]外围两个中括号
      feature = new Feature({ //路线
        geometry: new Polygon(_points)
      });
    } else if (drawT === ENUM_DRAW_TYPE.LINESTRING) {
      const coorsArr = [];
      item.Coordinates.forEach(itm => {
        coorsArr.push(fromLonLat([itm['Longitude'], itm['Latitude']]))
      })
      feature = new Feature({ //路线
        geometry: new LineString(coorsArr)
      });
    }
    feature.set('item',item)
    feature.set('featureType',ENUM_FEATURE_TYPE.DEVICE)
    // 设置title和颜色
    feature.setStyle(generatStyle('green',item.Title))
    source.addFeature(feature);
  }
  /**
   * 添加轨迹
   */
  addTrackLayer(Polylines, Points) {
    this.removeLayerByLayerId(ENUM_LAYERID.TRACK)
    // 查看轨迹
    let source = new VectorSource();
    for (const item of Polylines) {
      let resPoly = item;
      let geometry = new LineString([]);
      for (const coor of resPoly) {
        geometry.appendCoordinate(fromLonLat([parseFloat(coor.Gps_Lng), parseFloat(coor.Gps_Lat)]))
      }
      let LineStringFeature = new Feature(geometry); //绘制线的数据
      source.addFeature(LineStringFeature);
    }
    const routeLayer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#5298ff',
          width: 4
        }),
        image: new Circle({
          radius: 2,
          fill: new Fill({
            color: '#f00'
          })
        })
      }),
      properties: { id: ENUM_LAYERID.TRACK }
    });
    this.map.addLayer(routeLayer); //将绘制层添加到地图容器中


    let features = [];
    for (const item of Points) {
      features.push({ "type": "Feature", "propertibnes": {}, "geometry": { type: "Point", "coordinates": fromLonLat([parseFloat(item.Gps_Lng), parseFloat(item.Gps_Lat)]) } })
    }
    let heatData = {
      type: "FeatureCollection",
      features
    };

    //矢量图层 获取gejson数据
    let vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(heatData, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })
    });
    // Heatmap热力图             
    const heatLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 4,
      radius: 2,
      properties: { id: ENUM_LAYERID.TRACK }
    });
    this.map.addLayer(heatLayer);
  }
  // 根据layerId移除layer
  removeLayerByLayerId(layerId) {
    const findLayers = []
    this.map.getLayers().forEach(layer => {
      if (layer.get('id') === layerId) {
        findLayers.push(layer)
      }
    })
    findLayers.forEach(layer => {
      this.map.removeLayer(layer);
    })
  }
  // 通过layerId清除所有的feature
  clearFeaturesByLayerId(layerId) {
    let findedLayer = null
    this.map.getLayers().forEach(layer => {
      if (layer.get('id') === layerId) {
        findedLayer = layer
      }
    })
    findedLayer && findedLayer?.getSource()?.clear()
  }
  // 隐藏所有的overlay
  removeAllOverlay() {
    this.removeLayerByLayerId(ENUM_LAYERID.TRACK)
    this.map.getOverlays().forEach(overlay => {
      overlay.setPosition(undefined)
    })
  }
}
export default JtMap