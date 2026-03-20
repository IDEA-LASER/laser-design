/**
 * @Description: 原生地图线绘制工具
 */

// ==================== 线绘制工具相关类型 ====================

export interface NativeDrawLineOptions {
  /** 
   * 初始化数据
   * 支持两种格式：
   * 1. Array<Array<{lat, lng}>> - 多条航线的路径点数组
   * 2. Array<{lat, lng}> - 单条航线的路径点数组
   */
  initialData?:
    | Array<Array<{ lat: number; lng: number }>>
    | Array<{ lat: number; lng: number }>;
  /** 线样式配置 */
  lineStyle?: {
    color?: string;
    width?: number;
    borderWidth?: number;
    borderColor?: string;
    lineCap?: 'butt' | 'round' | 'square';
    /** 虚线配置，例如 [10, 10] 表示10像素实线+10像素间隔 */
    dashArray?: [number, number];
  };
}

export interface LineData {
  id: string;
  paths: Array<{ lat: number; lng: number }>;
}

/**
 * 原生地图线绘制工具类
 * 使用腾讯地图原生的 GeometryEditor 实现，和官方示例一致
 *
 * @example
 * // 使用默认样式
 * const drawer = new NativeDrawLine(nativeMap);
 * drawer.enable();
 * drawer.on('add', (data) => console.log('添加线:', data));
 *
 * @example
 * // 自定义部分样式（其他使用默认值）
 * const drawer = new NativeDrawLine(nativeMap, {
 *   lineStyle: {
 *     color: '#FF0000'  // 只改颜色
 *   }
 * });
 *
 * @example
 * // 使用初始化数据 - 格式1: Array<Array<{lat, lng}>> (多条航线)
 * const drawer1 = new NativeDrawLine(nativeMap, {
 *   initialData: [
 *     [
 *       { lat: 39.908, lng: 116.397 },
 *       { lat: 39.910, lng: 116.400 }
 *     ],
 *     [
 *       { lat: 39.915, lng: 116.405 },
 *       { lat: 39.917, lng: 116.407 }
 *     ]
 *   ]
 * });
 *
 * @example
 * // 使用初始化数据 - 格式2: Array<{lat, lng}> (单条航线，最简洁)
 * const drawer2 = new NativeDrawLine(nativeMap, {
 *   initialData: [
 *     { lat: 39.908, lng: 116.397 },
 *     { lat: 39.910, lng: 116.400 },
 *     { lat: 39.912, lng: 116.402 }
 *   ]
 * });
 *
 * @default lineStyle
 * - color: '#002FD7'
 * - width: 4
 * - borderWidth: 2
 * - borderColor: '#002FD7'
 * - lineCap: 'round'
 */
export class NativeDrawLine {
  protected map: any; // 改为 protected，允许子类访问
  private polylineLayer: any;
  private editor: any = null;
  private enabled: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private lines: LineData[] = [];
  private lineStyle: any;

  constructor(map: any, options: NativeDrawLineOptions = {}) {
    if (!map || !window.TMap) {
      throw new Error('地图实例或 TMap API 未准备好');
    }

    if (!window.TMap.tools) {
      throw new Error('TMap.tools 未加载，请确保加载地图 API 时包含 tools 库');
    }

    this.map = map;

    // 线样式配置（支持部分覆盖，用户传了的参数覆盖默认值）
    const defaultLineStyle = {
      color: '#002FD7',
      width: 4,
      borderWidth: 0,
      borderColor: '#002FD7',
      lineCap: 'round' as 'butt' | 'round' | 'square'
    };

    this.lineStyle = {
      ...defaultLineStyle,
      ...options.lineStyle
    };

    // 如果配置了 dashArray，添加到样式中
    if (options.lineStyle?.dashArray) {
      this.lineStyle.dashArray = options.lineStyle.dashArray;
    }

    // 创建折线图层
    this.polylineLayer = new window.TMap.MultiPolyline({
      id: `native-draw-line-${Date.now()}`,
      map: this.map,
      styles: {
        default: new window.TMap.PolylineStyle(this.lineStyle)
      },
      geometries: []
    });

    // 加载初始数据
    if (options.initialData && options.initialData.length > 0) {
      // 判断 initialData 的格式
      const firstItem = options.initialData[0];

      // 检查是否为单条航线格式：Array<{lat, lng}>
      if (
        firstItem &&
        typeof firstItem === 'object' &&
        'lat' in firstItem &&
        'lng' in firstItem
      ) {
        // 格式2: 单条航线的路径点数组 Array<{lat, lng}>
        this.addLine(options.initialData as Array<{ lat: number; lng: number }>);
      } else {
        // 格式1: Array<Array<{lat, lng}>>
        (options.initialData as Array<Array<{ lat: number; lng: number }>>).forEach(
          (paths) => {
            this.addLine(paths);
          }
        );
      }
    }

    console.log('✅ NativeDrawLine 初始化成功');
  }

  /**
   * 启用绘制功能（使用腾讯地图的 GeometryEditor）
   */
  enable(): void {
    if (this.enabled) {
      console.warn('线绘制功能已启用');
      return;
    }

    if (!this.map) {
      console.error('地图实例不存在，无法启用绘制功能');
      return;
    }

    if (!window.TMap || !window.TMap.tools) {
      console.error('TMap.tools 未加载，无法启用绘制功能');
      return;
    }

    try {
      // 创建几何图形编辑器
      this.editor = new window.TMap.tools.GeometryEditor({
        map: this.map,
        overlayList: [
          {
            overlay: this.polylineLayer,
            id: 'polyline'
          }
        ],
        actionMode: window.TMap.tools.constants.EDITOR_ACTION.DRAW, // 绘制模式
        activeOverlayId: 'polyline', // 激活折线图层
        snappable: true // 开启吸附
      });

      // 监听绘制完成事件
      this.editor.on('draw_complete', (geometry: any) => {
        console.log('=== 线绘制完成 ===', geometry);

        // 从图层中获取绘制的线数据
        const geo = this.polylineLayer.geometries.find(
          (item: any) => item.id === geometry.id
        );

        if (geo && geo.paths) {
          const lineData: LineData = {
            id: geometry.id,
            paths: geo.paths.map((p: any) => ({
              lat: p.lat || p.getLat(),
              lng: p.lng || p.getLng()
            }))
          };

          this.lines.push(lineData);

          console.log('线段坐标:', lineData.paths);
        }
      });

      this.enabled = true;
      console.log('🎯 线绘制功能已启用（双击完成绘制）');
    } catch (error) {
      console.error('启用线绘制功能失败:', error);
      throw error;
    }
  }

  /**
   * 禁用绘制功能
   */
  disable(): void {
    if (!this.enabled) {
      console.warn('线绘制功能未启用');
      return;
    }

    if (this.editor) {
      try {
        this.editor.destroy();
        this.editor = null;
      } catch (error) {
        console.error('销毁编辑器失败:', error);
      }
    }

    this.enabled = false;
    console.log('⏸️ 线绘制功能已禁用');
  }

  /**
   * 添加线（用于初始化数据）
   * @param paths 路径点数组
   * @param customId 可选的自定义 ID，不传则自动生成
   */
  private addLine(
    paths: Array<{ lat: number; lng: number }>,
    customId?: string
  ): LineData {
    const lineId = customId || `line-${Date.now()}-${Math.random()}`;
    const lineData: LineData = {
      id: lineId,
      paths: [...paths]
    };

    this.lines.push(lineData);

    // 添加到图层
    this.polylineLayer.add({
      id: lineId,
      styleId: 'default',
      paths: paths.map((p) => new window.TMap.LatLng(p.lat, p.lng))
    });

    return lineData;
  }

  /**
   * 清空所有线
   */
  clear(): void {
    if (this.lines.length === 0 && this.polylineLayer.geometries.length === 0) {
      return;
    }

    // 获取所有线的 ID
    const ids = this.polylineLayer.geometries.map((geo: any) => geo.id);
    if (ids.length > 0) {
      this.polylineLayer.remove(ids);
    }

    this.lines = [];

    console.log('🧹 已清空所有线');
  }

  /**
   * 获取所有线数据
   */
  getData(): LineData[] {
    return this.lines.map((line) => ({
      id: line.id,
      paths: [...line.paths]
    }));
  }

  /**
   * 监听事件
   * @param event 事件名称: 'add' | 'clear' | 'change'
   * @param callback 回调函数
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.disable();

    if (this.polylineLayer) {
      this.polylineLayer.setMap(null);
      this.polylineLayer = null;
    }

    this.eventListeners.clear();
    this.lines = [];
    console.log('🗑️ NativeDrawLine 已销毁');
  }
}
