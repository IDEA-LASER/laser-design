/*
 * Copyright 【2026】【粤港澳大湾区数字经济研究院-低空经济分院】
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * 补充说明：
 * 1. 本文件中涉及的腾讯地图相关功能，基于腾讯位置服务API开发，使用需遵守《腾讯位置服务开放API服务协议》及相关隐私服务协议，需申请并使用合法的腾讯地图API Key。
 * 2. 本组件库开发使用过程涉及React相关功能，需遵循相应的开源协议等，详见：https://github.com/facebook/react?tab=MIT-1-ov-file#readme
 * 3. 本组件库开发使用过程涉及node.js相关功能，需遵循相应的开源协议等，详见：https://github.com/nodejs/node?tab=License-1-ov-file#readme
 * 4. 本组件库开发使用过程涉及Turf.js相关功能，需遵循相应的开源协议等，详见：https://github.com/Turfjs/turf?tab=MIT-1-ov-file#readme
 */

// 航路绘制
import arrowIcon from "./image/arrow.svg";
import * as turf from "@turf/turf";

export const Draw = (options) => {
  let map = options.map;
  let shapeType = options.shapeType;
  let styleType = options.styleType;
  let initialData = options.initialData.map(item => new TMap.LatLng(item.lat, item.lng));
  let width = options.width;

  // 将颜色转换成rgba色
  const hexToRgba = (hex, alpha) => {
    // 移除#号
    hex = hex.replace("#", "");
    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // 返回RGBA格式
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // 绘制航路
  const drawLine = () => {
    new TMap.MultiPolyline({
      map,
      geometries: [
        {
          styleId: "default", // 样式id
          paths: initialData, // 多边形的位置信息
        },
      ],
      styles: {
        default: new TMap.PolylineStyle({
          color: "#002FD7", //线填充色
          width: 2, //折线宽度
          dashArray: [4, 8], // 虚线展示方式
        }),
      },
    });

    new TMap.MultiPolyline({
      map,
      geometries: [
        {
          styleId: "default", // 样式id
          paths: initialData, // 多边形的位置信息
        },
      ],
      styles: {
        default: new TMap.PolylineStyle({
          color: hexToRgba("#002FD7", 0.2), //线填充色
          width: width, //折线宽度
          borderWidth: 2, //边线宽度
          borderColor: "#002FD7",
        }),
      },
    });
  };

  // drawLine
  const drawLine2 = () => {
    new TMap.MultiPolyline({
      map,
      geometries: [
        {
          styleId: "default", // 样式id
          paths: initialData, // 多边形的位置信息
        },
      ],
      styles: {
        default: new TMap.PolylineStyle({
          color: hexToRgba("#002FD7", 0), //线填充色
          width: width + 4, //折线宽度
          borderWidth: 10, //边线宽度
          borderColor: "#FFC2A1",
        }),
      },
    });
  };

  // 绘制箭头
  const drawArrow = () => {
    const positions = [];
    const styles = {};
    initialData?.forEach((list, idx) => {
      if (idx != 0 && idx != initialData.length - 1) {
        var point1 = turf.point([list.lng, list.lat]);
        var point2 = turf.point([initialData[idx + 1].lng, initialData[idx + 1].lat]);
        var bearing = turf.bearing(point1, point2);
        styles[bearing] = new TMap.MarkerStyle({
          width: 12,
          height: 12,
          src: arrowIcon,
          anchor: { x: 6, y: 6 },
          rotate: 360 - bearing,
        });
        positions.push({
          position: list,
          styleId: bearing,
        });
      }
    });
    new TMap.MultiMarker({
      map,
      styles: styles,
      geometries: positions,
      isStopPropagation: true,
    });
  };

  // 绘制航路
  drawLine();

  // 绘制分隔带
  if (shapeType.indexOf("Separation") > -1) {
    drawLine2();
  }

  // 绘制箭头
  if (shapeType.indexOf("Arrow") > -1) {
    drawArrow();
  }
};