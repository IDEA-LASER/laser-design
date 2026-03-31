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

// B/C/G/W类空域
import BIcon from "./image/B.svg";
import CIcon from "./image/C.svg";
import GIcon from "./image/G.svg";
import WIcon from "./image/W.svg";
import * as turf from "@turf/turf";

// 空域类型默认颜色（B/C/G/W）
const colors = {
  B: "#FF0000",
  C: "#FFEC4E",
  G: "#33C01A",
  W: "#007AFF",
  default: "#007AFF",
};

// 空域（B/C/G/W）ICON
const icons = {
  B: BIcon,
  C: CIcon,
  G: GIcon,
  W: WIcon,
};

export const BCGW = (options) => {
  let map = options.map;
  let shapeType = options.shapeType;
  let styleType = options.styleType;
  let initialData = options.initialData;
  let color = colors[styleType] || colors["default"];

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

  // 绘制点标记聚合簇（核心通用函数）
  const drawPointCluster = (positions, icon) => {
    const markerCluster = new TMap.MarkerCluster({
      map,
      enableDefaultStyle: false,
      minimumClusterSize: 1,
      geometries: positions.map((item) => ({ position: item.position })),
      zoomOnClick: true,
      gridSize: 36,
      averageCenter: true,
    });

    let markerGeometries = [];
    let marker = null;

    // 缩放控制显示隐藏
    map.on("zoom", () => {
      if (map.getZoom() < 10.5) {
        marker?.setGeometries([]);
      } else {
        marker.setGeometries(markerGeometries);
      }
    });

    // 监听聚合簇变化更新标记
    markerCluster.on("cluster_changed", function (e) {
      markerGeometries = [];
      const clusters = markerCluster.getClusters();
      clusters.forEach((item) => {
        markerGeometries.push({ position: item.center });
      });

      if (marker) {
        marker.setGeometries(markerGeometries);
      } else {
        marker = new TMap.MultiMarker({
          map,
          styles: {
            default: new TMap.MarkerStyle({
              width: 24,
              height: 24,
              anchor: { x: 14, y: 14 },
              src: icon,
            }),
          },
          geometries: markerGeometries,
        });
      }
    });
  };

  // 绘制圆形（对齐Accessible.js的drawB函数）
  const drawCircle = (center, radius, icon) => {
    // 绘制圆形面
    new TMap.MultiCircle({
      map,
      styles: {
        default: new TMap.CircleStyle({
          color: hexToRgba(color, 0.2),
          showBorder: true,
          borderColor: color,
          borderWidth: 2,
        }),
      },
      geometries: [
        {
          styleId: "default",
          center: new TMap.LatLng(center.lat, center.lng),
          radius: radius,
        },
      ],
    });

    // 绘制圆形点位（中心点+四向点）
    const bearings = [0, 90, 180, 270];
    const point = turf.point([center.lng, center.lat]);
    const distance = radius / 1000;
    const options = { units: "kilometers" };
    const positions = [{ position: new TMap.LatLng(center.lat, center.lng) }];

    bearings.forEach((bearing) => {
      const destination = turf.destination(point, distance, bearing, options);
      positions.push({
        position: new TMap.LatLng(
          destination.geometry.coordinates[1],
          destination.geometry.coordinates[0]
        ),
      });
    });

    drawPointCluster(positions, icon);
  };

  // 绘制多边形（对齐Accessible.js的drawA函数）
  const drawPolygon = (icon) => {
    // 绘制多边形面
    new TMap.MultiPolygon({
      map,
      geometries: [
        {
          styleId: "default",
          paths: initialData
        },
      ],
      styles: {
        default: new TMap.PolygonStyle({
          color: hexToRgba(color, 0.2),
          borderColor: color,
          borderWidth: 2,
        }),
      },
    });

    // 绘制多边形点位
    const positions = initialData.map((item) => ({ position: item }));
    drawPointCluster(positions, icon);
  };

  if (shapeType == "Polygon") {
    initialData = initialData.map((item) => new TMap.LatLng(item.lat, item.lng));
    drawPolygon(icons[styleType]);
  } else if (shapeType == "Circle") {
    drawCircle(initialData.center, initialData.radius, icons[styleType]);
  }
};