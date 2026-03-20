// 航线绘制
import navIcon from "./image/nav.svg";
import pointGreen from "./image/point_green.svg";
import startIcon from "./image/start.svg";
import endIcon from "./image/end.svg";
import pointIcon from "./image/point.svg";
import wayIcon from "./image/way.svg";
import * as turf from "@turf/turf";

// 航线颜色
const colors = {
  "default": "#002fd7",
  "Normal": "#002fd7",
  "Recommended": "#33c01a",
  "Temporary": "#002fd7",
};

// 节点
const icons = {
  "default": pointIcon,
  "Normal": pointIcon,
  "Recommended": pointGreen,
  "Temporary": pointIcon,
}


export const Draw = (options) => {
  // 默认数据
  let navRef = null;
  let map = options.map;
  let shapeType = options.shapeType;
  let styleType = options.styleType;
  let initialData = options.initialData.map(item => new TMap.LatLng(item.lat, item.lng));
  let color = colors[styleType] || colors["default"]

  // 鼠标移入移出
  const listener = (target) => {
    // 鼠标移入
    let hoverGeometry = {};
    target.on("hover", (evt) => {
      if (evt.geometry && evt.geometry.id) {
        hoverGeometry = evt.geometry;
        target.updateGeometries([
          {
            ...evt.geometry,
            styleId: styleType == "Temporary" ? "hover1" : "hover", // 切换到hover样式
          },
        ]);
        navRef.updateGeometries([
          {
            ...navRef.geometries[0],
            styleId: "hover", // 切换到hover样式
          },
        ]);
      }
    });

    // 鼠标移出
    target.on("mouseout", (evt) => {
      if (!evt.geometry) {
        setTimeout(() => {
          target.updateGeometries([
            {
              ...hoverGeometry,
              styleId: styleType == "Temporary" ? "default1" : "default", // 切换到hover样式
            },
          ]);
          navRef.updateGeometries([
            {
              ...navRef.geometries[0],
              styleId: "default", // 切换到hover样式
            },
          ]);
        });
      }
    });
  }

  // drawLine
  const drawLine = () => {
    const line = new TMap.MultiPolyline({
      map,
      geometries: [
        {
          styleId: styleType == "Temporary" ? "default1" : "default", // 样式id
          paths: initialData, // 多边形的位置信息
        },
      ],
      styles: {
        default: new TMap.PolylineStyle({
          color: color, //线填充色
          width: 4, //折线宽度
          borderWidth: 1, //边线宽度
          borderColor: "#fff",
        }),
        hover: new TMap.PolylineStyle({
          color: color, //线填充色
          width: 6, //折线宽度
          borderWidth: 2, //边线宽度
          borderColor: "#fff",
        }),
        default1: new TMap.PolylineStyle({
          color: color, //线填充色
          width: 4, //折线宽度
          borderWidth: 1, //边线宽度
          borderColor: "#fff",
          dashArray: [10, 10], // 虚线展示方式
        }),
        hover1: new TMap.PolylineStyle({
          color: color, //线填充色
          width: 6, //折线宽度
          borderWidth: 2, //边线宽度
          borderColor: "#fff",
          dashArray: [10, 10], // 虚线展示方式
        }),
      },
    });
    listener(line)
  };


  // drawNav
  const drawNav = () => {
    // 获取第一个跟第二个点的中心位置
    const features = turf.points([
      [initialData[0].lng, initialData[0].lat],
      [initialData[1].lng, initialData[1].lat],
    ]);
    const center = turf.center(features);
    const positions = [
      {
        position: new TMap.LatLng(center.geometry.coordinates[1], center.geometry.coordinates[0]),
        styleId: "default",
      },
    ];
    navRef = new TMap.MultiMarker({
      map,
      styles: {
        default: new TMap.MarkerStyle({
          width: 24,
          height: 24,
          src: navIcon,
          anchor: { x: 12, y: 12 },
        }),
        hover: new TMap.MarkerStyle({
          width: 36,
          height: 36,
          src: navIcon,
          anchor: { x: 18, y: 18 },
        }),
      },
      geometries: positions,
      isStopPropagation: true,
    });
  };

  // drawPoint
  const drawPoint = () => {
    const positions = initialData?.map((k) => {
      return { position: k, styleId: "default" };
    });
    new TMap.MultiMarker({
      map,
      styles: {
        default: new TMap.MarkerStyle({
          width: 14,
          height: 14,
          src: icons[styleType],
          anchor: { x: 7, y: 7 },
        }),
      },
      geometries: positions,
      isStopPropagation: true,
    });
  };

  // 绘制起飞降落点节点
  const drawStartEndPoint = () => {
    let positions = [];
    initialData?.forEach((list, idx) => {
      if (idx == 0) {
        positions.push({
          position: list,
          styleId: "start",
        });
      } else if (idx == initialData.length - 1) {
        positions.push({
          position: list,
          styleId: "end",
        });
      }
    });
    new TMap.MultiMarker({
      map,
      styles: {
        default: new TMap.MarkerStyle({
          width: 14,
          height: 14,
          src: icons[styleType],
          anchor: { x: 7, y: 7 },
        }),
      },
      geometries: positions,
      isStopPropagation: true,
    });
  };

  // draw起飞降落点
  const drawStartEnd = () => {
    const positions = [];
    initialData?.forEach((list, idx) => {
      if (idx == 0) {
        positions.push({
          position: list,
          styleId: "start",
        });
      } else if (idx == initialData.length - 1) {
        positions.push({
          position: list,
          styleId: "end",
        });
      }
    });
    new TMap.MultiMarker({
      map,
      styles: {
        start: new TMap.MarkerStyle({
          width: 40,
          height: 40,
          src: startIcon,
          anchor: { x: 20, y: 40 },
        }),
        end: new TMap.MarkerStyle({
          width: 40,
          height: 40,
          src: endIcon,
          anchor: { x: 20, y: 40 },
        }),
      },
      geometries: positions,
      isStopPropagation: true,
    });
  };

  // draw序号
  const drawNo = () => {
    // 用于存储标记位置信息的数组
    const positions = [];
    // 遍历路径点数组
    initialData?.forEach((list, idx) => {
      // 排除起点和终点，只处理中间点
      if (idx != 0 && idx != initialData.length - 1) {
        // 将位置信息添加到positions数组中
        positions.push({
          position: list,  // 位置坐标
          styleId: "default",  // 样式ID
          content: `${idx}`,  // 显示的内容（索引编号）
        });
      }
    });
    new TMap.MultiMarker({
      map,
      styles: {
        default: new TMap.MarkerStyle({
          width: 40,
          height: 40,
          src: wayIcon,
          anchor: { x: 20, y: 40 },
          size: 16,
          color: "#007AFF",
          direction: "center",
          offset: { x: 0, y: -2 },
        }),
      },
      geometries: positions,
      isStopPropagation: true,
    });
  };


  // 绘制航线
  drawLine();

  // 绘制nav图标
  drawNav();

  // 绘制节点
  if (["UnordedNode", "OrderedNode"].includes(shapeType)) {
    drawPoint();
  } else {
    drawStartEndPoint();
  }

  // 绘制起飞降落点
  drawStartEnd();

  // 绘制序号
  if (shapeType == "OrderedNode") {
    drawNo()
  }
};