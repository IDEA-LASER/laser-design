/**
 * @Description: 障碍物线性标注工具 - 在线段的每个点上绘制图标
 */

import { NativeDrawLine, NativeDrawLineOptions, LineData } from './drawLine';
import { BaseIconDrawer, IconType } from './iconDrawer';

/**
 * 障碍物线性标注配置选项
 */
export interface ObstacleLinearOptions extends NativeDrawLineOptions {
  /** 图标样式配置 */
  iconStyle?: {
    /** 图标宽度，默认25 */
    width?: number;
    /** 图标高度，默认25 */
    height?: number;
    /** 图标类型，默认 'Obstacle-Ground' */
    type?: IconType;
    /** 自定义图标路径 */
    src?: string;
    /** 自定义样式 */
    customStyles?: any;
  };
}

/**
 * 障碍物线性标注工具类
 * 继承自 NativeDrawLine，在线段的每个点上绘制图标
 *
 * @example
 * const obstacleLinear = new ObstacleLinear(map, {
 *   initialData: [
 *     [
 *       { lat: 30.253581, lng: 120.151291 },
 *       { lat: 30.244548, lng: 120.139463 },
 *       { lat: 30.234182, lng: 120.146834 }
 *     ]
 *   ],
 *   lineStyle: {
 *     color: '#FF6F00',
 *     width: 2,
 *     lineCap: 'round',
 *     dashArray: [5, 5]
 *   },
 *   iconStyle: {
 *     width: 25,
 *     height: 25,
 *     type: 'Obstacle-Critical'
 *   }
 * });
 */
export class ObstacleLinear extends NativeDrawLine {
  private iconStyle: {
    width: number;
    height: number;
    type: IconType;
    src?: string;
    customStyles?: any;
  };
  private icons: BaseIconDrawer[] = []; // 存储所有图标实例

  constructor(map: any, options: ObstacleLinearOptions = {}) {
    // 调用父类构造函数
    super(map, options);

    // 设置图标样式配置（默认值）
    this.iconStyle = {
      width: options.iconStyle?.width ?? 25,
      height: options.iconStyle?.height ?? 25,
      type: options.iconStyle?.type ?? 'Obstacle-Ground',
      src: options.iconStyle?.src,
      customStyles: options.iconStyle?.customStyles
    };

    // 为初始数据添加图标
    if (options.initialData && options.initialData.length > 0) {
      options.initialData.forEach((paths) => {
        this.addIconsForLine(paths);
      });
    }

    console.log('✅ ObstacleLinear 初始化成功');
  }

  /**
   * 为线段的每个点添加图标
   * @param paths 线段的坐标点数组
   */
  private addIconsForLine(paths: Array<{ lat: number; lng: number }>): void {
    if (!paths || paths.length === 0) {
      return;
    }

    console.log(`📍 为 ${paths.length} 个点添加图标...`);

    paths.forEach((point, index) => {
      try {
        const icon = new BaseIconDrawer({
          map: this.map,
          lat: point.lat,
          lng: point.lng,
          width: this.iconStyle.width,
          height: this.iconStyle.height,
          type: this.iconStyle.type,
          src: this.iconStyle.src,
          customStyles: {
            ...this.iconStyle.customStyles,
            // 设置锚点为图标底部中心，使图标底端对齐线上的点
            anchor: {
              x: this.iconStyle.width / 2,
              y: this.iconStyle.height
            }
          }
        });

        this.icons.push(icon);
        console.log(
          `✅ 已添加图标 #${index + 1} at (${point.lat}, ${point.lng})`
        );
      } catch (error) {
        console.error(`❌ 添加图标 #${index + 1} 失败:`, error);
      }
    });
  }

  /**
   * 启用绘制功能
   * 重写父类方法，添加图标绘制逻辑
   */
  enable(): void {
    super.enable();

    // 监听绘制完成事件，为新绘制的线段添加图标
    this.on('draw_complete', (lineData: LineData) => {
      console.log('🎨 线段绘制完成，开始添加图标...');
      this.addIconsForLine(lineData.paths);
    });
  }

  /**
   * 清空所有线和图标
   * 重写父类方法
   */
  clear(): void {
    // 清空所有图标
    this.icons = [];
    console.log('🧹 已清空所有图标');

    // 调用父类的清空方法
    super.clear();
  }

  /**
   * 获取所有图标实例
   * @returns 图标实例数组
   */
  getIcons(): BaseIconDrawer[] {
    return [...this.icons];
  }

  /**
   * 获取图标数量
   * @returns 图标数量
   */
  getIconCount(): number {
    return this.icons.length;
  }

  /**
   * 销毁实例
   * 重写父类方法，清理图标
   */
  destroy(): void {
    // 清空图标
    this.icons = [];

    // 调用父类的销毁方法
    super.destroy();

    console.log('🗑️ ObstacleLinear 已销毁');
  }
}
