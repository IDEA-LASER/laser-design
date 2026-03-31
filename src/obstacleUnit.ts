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

import { BaseIconDrawer, IconType } from './iconDrawer';

/**
 * 单点障碍物配置选项
 */
export interface ObstacleUnitOptions {
  /**
   * 初始化数据 - 单个坐标点数组
   * 格式：Array<Array<{lat, lng}>>
   */
  initialData?: Array<Array<{ lat: number; lng: number }>>;

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
 * 单点障碍物工具类
 * 用于在指定位置渲染单个或多个独立的图标
 */
export class ObstacleUnit {
  protected map: any;
  private iconStyle: {
    width: number;
    height: number;
    type: IconType | string;
    src?: string;
    customStyles?: any;
  };
  private icons: BaseIconDrawer[] = []; // 存储所有图标实例
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(map: any, options: ObstacleUnitOptions = {}) {
    if (!map) {
      throw new Error('地图实例不能为空');
    }

    this.map = map;

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
      options.initialData.forEach((points) => {
        this.addIcons(points);
      });
    }

  }

  /**
   * 为指定的点添加图标
   * @param points 坐标点数组
   */
  private addIcons(points: Array<{ lat: number; lng: number }>): void {
    if (!points || points.length === 0) {
      return;
    }


    points.forEach((point, index) => {
      try {
        const icon = new BaseIconDrawer({
          map: this.map,
          lat: point.lat,
          lng: point.lng,
          width: this.iconStyle.width,
          height: this.iconStyle.height,
          type: this.iconStyle.type,
          src: this.iconStyle.src,
          customStyles: this.iconStyle.customStyles
        });

        this.icons.push(icon);

      } catch (error) {
      }
    });
  }

  /**
   * 启用功能（对于 unit 类型，这个方法主要用于保持接口一致性）
   */
  enable(): void {
  }

  /**
   * 禁用功能（隐藏所有图标）
   */
  disable(): void {
    // 清空所有图标
    this.icons = [];
  }

  /**
   * 获取数据
   * @returns 所有图标的坐标数据
   */
  getData(): Array<Array<{ lat: number; lng: number }>> {
    const data: Array<Array<{ lat: number; lng: number }>> = [];

    if (this.icons.length > 0) {
      const points = this.icons.map(icon => ({
        lat: icon['lat'] || 0,
        lng: icon['lng'] || 0
      }));
      data.push(points);
    }

    return data;
  }

  /**
   * 清空所有图标
   */
  clear(): void {
    this.icons = [];
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
   */
  destroy(): void {
    // 清空图标
    this.icons = [];

    // 清空事件处理器
    this.eventHandlers.clear();

  }

  /**
   * 监听事件
   */
  on(event: string, callback: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  /**
   * 取消监听事件
   */
  off(event: string, callback?: Function): void {
    if (!callback) {
      this.eventHandlers.delete(event);
      return;
    }

    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

