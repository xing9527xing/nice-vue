import axios from 'axios'
let http = axios.create({
  timeout: 0,
  method: 'post'
});

// 请求拦截器
http.interceptors.request.use(function (config) {
  // 添加头信息
  if (!config.headers.noAuth) {
    let token = JSON.parse(sessionStorage.getItem('userInfo'))?.token;
    if (token) config.headers.auth = token;
  }
  return config;
})
// 相应拦截器
http.interceptors.response.use(function (res) {
  if (res.headers.auth) {
    let params = {token: res.headers.auth}
    sessionStorage.setItem('userInfo',JSON.stringify(params));
  }
  if(res.data.StatusCode=='304') {
    // Message.error('请重新登录以选择项目');
  }
  return res.data;
}, function (err) {
  console.log(err,'err');
  return Promise.reject(err);
})

export default http;