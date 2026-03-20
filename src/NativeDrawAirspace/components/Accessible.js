// 普通空域/适飞空域/管制空域/试验区/磁异常区/电子围栏区

// 空域类型默认颜色
const colors = {
  "default": "#007AFF",
  "Accessible": "#01F4F4",
  "Controlled": "#FF6F00",
  "Test": "#AF82E7",
  "ElectronicFence": "#055FE7",
  "MagneticAnomaly": "#FF0000",
  "ElecAnomaly": "#FF7B1B"
};


export const Accessible = (options) => {
  if (options.shapeType == 'Circle') {
    options.initialData.center = new TMap.LatLng(options.initialData.center.lat, options.initialData.center.lng);
  } else {
    options.initialData = options.initialData.map(item => new TMap.LatLng(item.lat, item.lng));
  }
  let map = options.map;
  let shapeType = options.shapeType;
  let styleType = options.styleType;
  let initialData = options.initialData;
  let width = options.width;
  let color = colors[styleType] || colors["default"]

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

  // 多边形
  const drawPolygon = () => {
    const target = new TMap.MultiPolygon({
      map,
      geometries: [
        {
          styleId: ["MagneticAnomaly", "ElecAnomaly"].includes(styleType) ? "default1" : "default",
          paths: initialData,
        },
      ],
      styles: {
        default: new TMap.PolygonStyle({
          color: hexToRgba(color, 0.2),
          borderColor: color,
          borderWidth: 2,
        }),
        default1: new TMap.PolygonStyle({
          color: hexToRgba(color, 0.5),
          borderColor: color,
          borderWidth: 2,
          borderDashArray: [5, 5],
        }),
        hover: new TMap.PolygonStyle({
          color: hexToRgba(color, 0.4),
          borderColor: color,
          borderWidth: 4,
        }),
      },
    });

    // 电子围栏增加hover效果
    if (styleType == 'ElectronicFence') {
      listener(target)
    }
  };

  // 圆形
  const drawLineircle = () => {
    const target = new TMap.MultiCircle({
      map,
      styles: {
        default: new TMap.CircleStyle({
          color: hexToRgba(color, 0.2),
          showBorder: true,
          borderColor: color,
          borderWidth: 2,
        }),
        default1: new TMap.CircleStyle({
          color: hexToRgba(color, 0.5),
          borderColor: color,
          borderWidth: 2,
          borderDashArray: [5, 5],
        }),
        hover: new TMap.CircleStyle({
          color: hexToRgba(color, 0.4),
          borderColor: color,
          borderWidth: 4,
        }),
      },
      geometries: [
        {
          styleId: ["MagneticAnomaly", "ElecAnomaly"].includes(styleType) ? "default1" : "default",
          center: initialData.center,
          radius: initialData.radius || 500,
        },
      ],
    });

    // 电子围栏增加hover效果
    if (styleType == 'ElectronicFence') {
      listener(target)
    }
  };

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
            styleId: "hover",
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
              styleId: "default",
            },
          ]);
        });
      }
    });
  }

  if (shapeType == "Polygon") {
    drawPolygon();
  } else if (shapeType == "Circle") {
    drawLineircle()
  }
};