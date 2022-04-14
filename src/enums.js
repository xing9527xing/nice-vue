// layerid的枚举,用来区分layer使用
export const ENUM_LAYERID = {
  WORKER: 1, // 劳务人员定位
  CAR: 2, // 工程机械定位
  TRACK: 3, // 轨迹
  MARK: 4 // 设备标记
}
// 绘制方式枚举,
export const ENUM_DRAW_TYPE = {
  POINT: 1, // 点
  LINESTRING: 2, // 线
  POLYGON: 3, // 面
  CIRCLE: 4, // 圆
  TEXT: 5, // 文字
  NONE: 6, // 无
  1: "POINT",
  2: "LINESTRING",
  3: "POLYGON",
  4: "CIRCLE",
  5: "TEXT",
  6: "NONE",
}
// feture的类型
export const ENUM_FEATURE_TYPE = {
  DEVICE: 1, // 设备
  WORKER: 2, // 人员定位信息
  CAR: 3 // 车辆定位信息
}

export const ENUM_OVERLAY_ID = {
  WORKER: 1, // 人
  CAR: 2
}