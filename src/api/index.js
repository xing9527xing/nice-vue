
import request from "@/utils/http";
// 获取已上传文件列表
export function getUplodedListApi(data) {
  return request({
    url: "/Api/Doc/File/GetListByCode",
    data
  });
}

// 登录
export function Login(data) {
  return request({
    url: "/Api/Auth/Account/Login",
    data
  });
}

// 获取地图基本配置
export function GetBroadSetting(data) {
  return request({
    url: "/Api/Basic/ProjectMap/GetBroadSetting",
    data
  })
}

// 获取项目所有人员信息
export function GetAllWorkerLocation(data) {
  return request({
    url: "/Api/BaseInfo/DataScreenBoard/GetAllWorkerLocation",
    data
  })
}
// 获取项目所有机械信息
export function GetAllCarLocation(data) {
  return request({
    url: "/Api/BaseInfo/DataScreenBoard/GetAllCarLocation",
    data
  })
}

// 获取劳务人员详细信息
export function GetUserDetailedInfo(data) {
  return request({
    url: "/Api/BaseInfo/DataScreenBoard/GetUserDetailedInfo",
    data
  })
}

// 获取劳务人员轨迹
export function GetUserPolylineById(data) {
  return request({
    url: "/Api/BaseInfo/DataScreenBoard/GetUserPolylineById",
    data
  })
}

// 获取当前项目已标记的地图元素
export function GetMarkedElements(data) {
  return request({
    url: "/Api/Basic/ProjectMap/GetMarkedElements",
    data
  })
}