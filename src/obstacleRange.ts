/**
 * @Description: 障碍物范围绘制工具（虚线边框 + 中心点图标）
 */

import { NativeDrawLine, NativeDrawLineOptions } from './drawLine';
import { BaseIconDrawer, BaseIconDrawerOptions, IconType } from './iconDrawer';

// ==================== 障碍物范围绘制工具相关类型 ====================

export interface ObstacleRangeOptions extends NativeDrawLineOptions {
  /** 图标样式配置 */
  iconStyle?: {
    /** 图标宽度 */
    width?: number;
    /** 图标高度 */
    height?: number;
    /** 图标类型 */
    type?: IconType;
    /** 自定义图片路径 */
    src?: string;
  };
}

/**
 * 障碍物范围绘制工具类
 * 继承自 NativeDrawLine，在绘制虚线边框的同时，在范围中心点绘制图标
 *
 * @example
 * const obstacleRange = new NativeDrawObstacleRange(map, {
 *   initialData: [[
 *     { lat: 30.253, lng: 120.151 },
 *     { lat: 30.244, lng: 120.139 },
 *     // ... 更多坐标
 *   ]],
 *   lineStyle: {
 *     color: '#FF6F00',
 *     width: 2,
 *     dashArray: [5, 5]
 *   },
 *   iconStyle: {
 *     width: 25,
 *     height: 25,
 *     type: 'Obstacle-Critical'
 *   }
 * });
 */
export class ObstacleCluster extends NativeDrawLine {
  private iconDrawers: BaseIconDrawer[] = [];
  private iconStyle: ObstacleRangeOptions['iconStyle'];

  constructor(map: any, options: ObstacleRangeOptions = {}) {
    // 调用父类构造函数，初始化线绘制功能
    super(map, options);

    // 设置默认图标样式，默认使用临时障碍物图标
    this.iconStyle = {
      width: 25,
      height: 25,
      type: 'Obstacle-Temporary', // 默认为临时障碍物图标
      ...options.iconStyle
    };

    // 如果有初始数据，为每个范围绘制中心点图标
    if (options.initialData && options.initialData.length > 0) {
      options.initialData.forEach((paths) => {
        this.addCenterIcon(paths);
      });
    }
  }

  /**
   * 计算多边形的中心点（几何中心）
   * @param paths 多边形路径坐标数组
   * @returns 中心点坐标 { lat, lng }
   */
  private calculateCenter(paths: Array<{ lat: number; lng: number }>): {
    lat: number;
    lng: number;
  } {
    if (!paths || paths.length === 0) {
      throw new Error('路径坐标数组不能为空');
    }

    // 计算所有点的平均值作为中心点
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    for (const point of paths) {
      if (point.lat != null && point.lng != null) {
        sumLat += point.lat;
        sumLng += point.lng;
        count++;
      }
    }

    if (count === 0) {
      throw new Error('没有有效的坐标点');
    }

    return {
      lat: sumLat / count,
      lng: sumLng / count
    };
  }

  /**
   * 计算多边形的质心（面积加权中心）
   * 使用更精确的质心算法，适用于不规则多边形
   * @param paths 多边形路径坐标数组
   * @returns 质心坐标 { lat, lng }
   */
  private calculateCentroid(paths: Array<{ lat: number; lng: number }>): {
    lat: number;
    lng: number;
  } {
    if (!paths || paths.length < 3) {
      // 如果点少于3个，使用简单平均值
      return this.calculateCenter(paths);
    }

    let area = 0;
    let centerLat = 0;
    let centerLng = 0;

    // 使用多边形质心公式
    for (let i = 0; i < paths.length - 1; i++) {
      const p1 = paths[i];
      const p2 = paths[i + 1];

      const cross = p1.lng * p2.lat - p2.lng * p1.lat;
      area += cross;
      centerLat += (p1.lat + p2.lat) * cross;
      centerLng += (p1.lng + p2.lng) * cross;
    }

    // 闭合多边形（最后一个点到第一个点）
    const p1 = paths[paths.length - 1];
    const p2 = paths[0];
    const cross = p1.lng * p2.lat - p2.lng * p1.lat;
    area += cross;
    centerLat += (p1.lat + p2.lat) * cross;
    centerLng += (p1.lng + p2.lng) * cross;

    area = area / 2;

    if (Math.abs(area) < 0.0000001) {
      // 如果面积接近0，使用简单平均值
      return this.calculateCenter(paths);
    }

    centerLat = centerLat / (6 * area);
    centerLng = centerLng / (6 * area);

    return {
      lat: centerLat,
      lng: centerLng
    };
  }

  /**
   * 在范围中心点添加图标
   * @param paths 多边形路径坐标数组
   */
  private addCenterIcon(paths: Array<{ lat: number; lng: number }>): void {
    try {
      // 计算中心点
      const center = this.calculateCentroid(paths);

      console.log('📍 障碍物范围中心点:', center);

      // 准备图标配置
      const iconOptions: BaseIconDrawerOptions = {
        map: this.map,
        lat: center.lat,
        lng: center.lng,
        width: this.iconStyle?.width || 25,
        height: this.iconStyle?.height || 25
      };

      // 添加图标类型或自定义路径
      if (this.iconStyle?.type) {
        iconOptions.type = this.iconStyle.type;
      }
      if (this.iconStyle?.src) {
        iconOptions.src = this.iconStyle.src;
      }

      // 创建图标
      const iconDrawer = new BaseIconDrawer(iconOptions);
      this.iconDrawers.push(iconDrawer);

      console.log('✅ 已在中心点添加图标');
    } catch (error) {
      console.error('添加中心点图标失败:', error);
    }
  }
}
