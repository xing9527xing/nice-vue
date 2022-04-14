import { Style, Icon, Fill, Stroke, Circle, Text } from "ol/style";

// 设置feature样式的方法
const generatStyle = function (color = '#ffcc33', title = '') {
  const style = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color,
      width: 2,
    }),
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color,
      }),
    }),
    text: new Text({
      font: '14px Calibri,sans-serif',
      fill: new Fill({ color }),
      stroke: new Stroke({
        color: '#fff', width: 2
      }),
      text: title
    })
  })
  return style
}
export {generatStyle}