/**
 * @Description: 障碍物统一管理工具（通过 type 区分线性障碍物和集群障碍物）
 */

import { ObstacleLinear, ObstacleLinearOptions } from './obstacleLinear';
import { ObstacleCluster, ObstacleRangeOptions } from './obstacleRange';
import { ObstacleUnit, ObstacleUnitOptions } from './obstacleUnit';
import { IconType } from './iconDrawer';

// ==================== 障碍物类型 ====================

export type ObstacleType = 'linear' | 'cluster' | 'unit';

// ==================== 障碍物统一配置选项 ====================

export interface ObstacleOptions {
  /**
   * 障碍物类型
   * - 'linear': 线性障碍物（在线段的每个点上绘制图标）
   * - 'cluster': 集群障碍物（在范围中心点绘制图标）
   * - 'unit': 单点障碍物（在指定位置渲染单个图标）
   * @default 'unit'
   */
  type?: ObstacleType;

  /**
   * 图标类型（快捷配置）
   * 如果指定了此属性，会自动设置到 iconStyle.type 中
   */
  iconType?: IconType;

  /**
   * 图标宽度（快捷配置）
   * 如果指定了此属性，会自动设置到 iconStyle.width 中
   * @default 25
   */
  width?: number;

  /**
   * 图标高度（快捷配置）
   * 如果指定了此属性，会自动设置到 iconStyle.height 中
   * @default 25
   */
  height?: number;

  /**
   * 初始化数据 - 单条线/单个区域的坐标数组
   * 格式：Array<{lat, lng}>
   */
  initialData?: Array<{ lat: number; lng: number }>;

  /** 线样式配置 */
  lineStyle?: {
    color?: string;
    width?: number;
    borderWidth?: number;
    borderColor?: string;
    lineCap?: 'butt' | 'round' | 'square';
    /** 虚线配置，例如 [5, 5] 表示5像素实线+5像素间隔 */
    dashArray?: [number, number];
  };

  /** 图标样式配置 */
  iconStyle?: {
    /** 图标宽度，默认25 */
    width?: number;
    /** 图标高度，默认25 */
    height?: number;
    /** 图标类型 */
    type?: IconType;
    /** 自定义图标路径 */
    src?: string;
    /** 自定义样式 */
    customStyles?: any;
  };
}

/**
 * 障碍物统一管理工具类
 * 通过 type 属性自动选择使用 ObstacleLinear、ObstacleCluster 或 ObstacleUnit
 *
 * @example
 * // 线性障碍物 - 在线段的每个点上绘制图标
 * const linearObstacle = new Obstacle(map, {
 *   type: 'linear',
 *   initialData: [
 *     { lat: 30.253, lng: 120.151 },
 *     { lat: 30.244, lng: 120.139 },
 *     { lat: 30.234, lng: 120.146 }
 *   ],
 *   lineStyle: {
 *     color: '#FF6F00',
 *     width: 2,
 *     dashArray: [5, 5]
 *   },
 *   iconStyle: {
 *     type: 'Obstacle-Critical',
 *     width: 25,
 *     height: 25
 *   }
 * });
 * linearObstacle.enable();
 *
 * @example
 * // 使用简写方式配置图标（iconType、width、height 会自动应用到 iconStyle）
 * const linearObstacle = new Obstacle(map, {
 *   type: 'linear',
 *   initialData: [
 *     { lat: 30.253, lng: 120.151 },
 *     { lat: 30.244, lng: 120.139 },
 *     { lat: 30.234, lng: 120.146 }
 *   ],
 *   iconType: 'ObstacleTemporary',
 *   width: 53,
 *   height: 53
 * });
 * linearObstacle.enable();
 *
 * @example
 * // 集群障碍物 - 在范围中心点绘制图标
 * const clusterObstacle = new Obstacle(map, {
 *   type: 'cluster',
 *   initialData: [
 *     { lat: 30.253, lng: 120.151 },
 *     { lat: 30.244, lng: 120.139 },
 *     { lat: 30.234, lng: 120.146 },
 *     { lat: 30.24, lng: 120.16 }
 *   ],
 *   lineStyle: {
 *     color: '#FF6F00',
 *     width: 2,
 *     dashArray: [5, 5]
 *   },
 *   iconStyle: {
 *     type: 'Obstacle-Temporary',
 *     width: 30,
 *     height: 30
 *   }
 * });
 * clusterObstacle.enable();
 *
 * @example
 * // 单点障碍物 - 在指定位置渲染单个图标
 * const unitObstacle = new Obstacle(map, {
 *   type: 'unit',
 *   initialData: [
 *     { lat: 30.253, lng: 120.151 }
 *   ],
 *   iconStyle: {
 *     type: 'Obstacle-Temporary',
 *     width: 30,
 *     height: 30
 *   }
 * });
 * unitObstacle.enable();
 *
 * @example
 * // 切换障碍物类型
 * const obstacle = new Obstacle(map, {
 *   type: 'linear',
 *   lineStyle: { color: '#FF0000' }
 * });
 * obstacle.enable();
 *
 * // 稍后切换为集群障碍物
 * obstacle.switchType('cluster');
 */
export class Obstacle {
  private map: any;
  private options: ObstacleOptions;
  private currentType: ObstacleType;
  private instance: ObstacleLinear | ObstacleCluster | ObstacleUnit | null =
    null;

  constructor(map: any, options: ObstacleOptions) {
    if (!map) {
      throw new Error('地图实例不能为空');
    }

    // 如果没有指定 type，默认为 'unit'
    if (!options.type) {
      options.type = 'unit';
    }

    // 如果指定了 iconType，自动应用到 iconStyle.type 中
    if (options.iconType) {
      if (!options.iconStyle) {
        options.iconStyle = {};
      }
      options.iconStyle.type = options.iconType;
    }

    // 如果指定了 width，自动应用到 iconStyle.width 中
    if (options.width !== undefined) {
      if (!options.iconStyle) {
        options.iconStyle = {};
      }
      options.iconStyle.width = options.width;
    }

    // 如果指定了 height，自动应用到 iconStyle.height 中
    if (options.height !== undefined) {
      if (!options.iconStyle) {
        options.iconStyle = {};
      }
      options.iconStyle.height = options.height;
    }

    this.map = map;
    this.options = options;
    this.currentType = options.type;

    // 初始化实例
    this.initInstance();
  }

  /**
   * 初始化障碍物实例
   */
  private initInstance(): void {
    // 销毁旧实例（如果存在）
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }

    // 准备底层类的配置选项
    // 底层类期望 initialData 格式为 Array<Array<{lat, lng}>>
    // 所以需要将 Array<{lat, lng}> 包装成 [[...]]
    const wrappedOptions = {
      ...this.options,
      initialData: this.options.initialData
        ? [this.options.initialData] // 包装成多条线格式
        : undefined
    };

    // 根据类型创建新实例
    switch (this.currentType) {
      case 'linear':
        // 为线性障碍物设置默认样式（虚线 + #FF6F00 颜色）
        if (!wrappedOptions.lineStyle) {
          wrappedOptions.lineStyle = {};
        }
        // 设置默认颜色和虚线，但允许用户传入的配置覆盖
        wrappedOptions.lineStyle = {
          color: '#FF6F00',
          dashArray: [5, 5] as [number, number],
          ...wrappedOptions.lineStyle
        };

        this.instance = new ObstacleLinear(
          this.map,
          wrappedOptions as ObstacleLinearOptions
        );
        console.log('✅ 已创建线性障碍物实例');
        break;

      case 'cluster':
        // 为集群障碍物设置默认样式（虚线 + #FF6F00 颜色）
        if (!wrappedOptions.lineStyle) {
          wrappedOptions.lineStyle = {};
        }
        // 设置默认颜色和虚线，但允许用户传入的配置覆盖
        wrappedOptions.lineStyle = {
          color: '#FF6F00',
          dashArray: [5, 5] as [number, number],
          ...wrappedOptions.lineStyle
        };

        this.instance = new ObstacleCluster(
          this.map,
          wrappedOptions as ObstacleRangeOptions
        );
        console.log('✅ 已创建集群障碍物实例');
        break;

      case 'unit':
        this.instance = new ObstacleUnit(
          this.map,
          wrappedOptions as ObstacleUnitOptions
        );
        console.log('✅ 已创建单点障碍物实例');
        break;

      default:
        throw new Error(`不支持的障碍物类型: ${this.currentType}`);
    }
  }

  /**
   * 切换障碍物类型
   * @param type 新的障碍物类型
   */
  switchType(type: ObstacleType): void {
    if (type === this.currentType) {
      console.warn('当前已经是该类型，无需切换');
      return;
    }

    console.log(`🔄 切换障碍物类型: ${this.currentType} -> ${type}`);

    this.currentType = type;
    this.options.type = type;

    // 重新初始化实例
    this.initInstance();
  }

  /**
   * 获取当前障碍物类型
   */
  getType(): ObstacleType {
    return this.currentType;
  }

  /**
   * 启用绘制功能
   */
  enable(): void {
    if (!this.instance) {
      console.error('实例不存在，无法启用绘制功能');
      return;
    }

    this.instance.enable();
    const typeNames = {
      linear: '线性',
      cluster: '集群',
      unit: '单点'
    };
    console.log(`🎯 已启用${typeNames[this.currentType]}障碍物绘制`);
  }

  /**
   * 禁用绘制功能
   */
  disable(): void {
    if (!this.instance) {
      console.error('实例不存在，无法禁用绘制功能');
      return;
    }

    this.instance.disable();
    const typeNames = {
      linear: '线性',
      cluster: '集群',
      unit: '单点'
    };
    console.log(`⏸️ 已禁用${typeNames[this.currentType]}障碍物绘制`);
  }

  /**
   * 获取绘制数据
   */
  getData(): any {
    if (!this.instance) {
      console.error('实例不存在，无法获取数据');
      return null;
    }

    return this.instance.getData();
  }

  /**
   * 清空绘制内容
   */
  clear(): void {
    if (!this.instance) {
      console.error('实例不存在，无法清空');
      return;
    }

    this.instance.clear();
    console.log('🧹 已清空障碍物');
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }

    console.log('🗑️ Obstacle 实例已销毁');
  }

  /**
   * 获取底层实例（供高级用户使用）
   */
  getInstance(): ObstacleLinear | ObstacleCluster | ObstacleUnit | null {
    return this.instance;
  }

  /**
   * 监听事件
   * 注意：只有 'unit' 类型支持完整的事件系统，其他类型仅支持 on 方法
   */
  on(event: string, callback: Function): void {
    if (!this.instance) {
      console.error('实例不存在，无法监听事件');
      return;
    }

    this.instance.on(event, callback);
  }

  /**
   * 取消监听事件
   * 注意：只有 'unit' 类型支持此方法
   */
  off(event: string, callback?: Function): void {
    if (!this.instance) {
      console.error('实例不存在，无法取消监听');
      return;
    }

    // 只有 ObstacleUnit 实现了 off 方法
    if (this.currentType === 'unit' && 'off' in this.instance) {
      (this.instance as ObstacleUnit).off(event, callback);
    } else {
      console.warn(`${this.currentType} 类型不支持 off 方法`);
    }
  }
}
