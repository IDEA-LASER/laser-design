/**
 * @Description: 原生地图图标绘制工具
 */

import { NativeDrawImage } from './drawImage';

// 导入 SVG 图标
// 无人机图标
import UAVCompliantIcon from '../assets/icons/UAV-Compliant.svg';
import UAVViolationIcon from '../assets/icons/UAV-Violation.svg';
import UAVMinorViolationIcon from '../assets/icons/UAV-MinorViolation.svg';
import UAVNonCooperativeIcon from '../assets/icons/UAV-NonCooperative.svg';

// 障碍物图标
import ObstacleGroundIcon from '../assets/icons/Obstacle-Ground.svg';
import ObstacleAirborneIcon from '../assets/icons/Obstacle-Airborne.svg';
import ObstacleAltitudeUnknownIcon from '../assets/icons/Obstacle-AltitudeUnknown.svg';
import ObstacleSuspectedIcon from '../assets/icons/Obstacle-Suspected.svg';
import ObstacleTemporaryIcon from '../assets/icons/Obstacle-Temporary.svg';
import ObstacleCriticalIcon from '../assets/icons/Obstacle-Critical.svg';

// 起降场图标
import VertiportAvailableIcon from '../assets/icons/Vertiport-Available.svg';
import VertiportUnavailableIcon from '../assets/icons/Vertiport-Unavailable.svg';

// 基础设施图标
import InfraChargingAvailableIcon from '../assets/icons/Infra-Charging-Available.svg';
import InfraChargingUnavailableIcon from '../assets/icons/Infra-Charging-Unavailable.svg';
import InfraCommunicationAvailableIcon from '../assets/icons/Infra-Communication-Available.svg';
import InfraCommunicationUnavailableIcon from '../assets/icons/Infra-Communication-Unavailable.svg';
import InfraConvergedAvailableIcon from '../assets/icons/Infra-Converged-Available.svg';
import InfraConvergedUnavailableIcon from '../assets/icons/Infra-Converged-Unavailable.svg';
import InfraGasAvailableIcon from '../assets/icons/Infra-Gas-Available.svg';
import InfraGasUnavailableIcon from '../assets/icons/Infra-Gas-Unavailable.svg';
import InfraH2AvailableIcon from '../assets/icons/Infra-H2-Available.svg';
import InfraH2UnavailableIcon from '../assets/icons/Infra-H2-Unavailable.svg';
import InfraNavigationAvailableIcon from '../assets/icons/Infra-Navigation-Available.svg';
import InfraNavigationUnavailableIcon from '../assets/icons/Infra-Navigation-Unavailable.svg';
import InfraSurveillanceAvailableIcon from '../assets/icons/Infra-Surveillance-Available.svg';
import InfraSurveillanceUnavailableIcon from '../assets/icons/Infra-Surveillance-Unavailable.svg';
import InfraMeteorologAvailableIcon from '../assets/icons/Infra- Meteorology-Available.svg';
import InfraMeteorologUnavailableIcon from '../assets/icons/Infra- Meteorology-Unavailable.svg';
import InfraAltitudeAvailableIcon from '../assets/icons/Infra-Altitude-Available.svg';
import InfraAltitudeUnavailableIcon from '../assets/icons/Infra-Altitude-Unavailable.svg';
import UavcompliantIcon from '../assets/icons/Uavcompliant.svg';
import HelicopterIcon from '../assets/icons/HelicopterIcon.svg';
import GrasslandIcon from '../assets/icons/GrasslandIcon.svg';
import sandIcon from '../assets/icons/sandIcon.svg';
import PondingIcon from '../assets/icons/PondingIcon.svg';
import GIcon from '../assets/icons/gIcon.svg';
import BIcon from '../assets/icons/bIcon.svg';
import WIcon from '../assets/icons/wIcon.svg';
import CIcon from '../assets/icons/cIcon.svg';
import ArrowIcon from '../assets/icons/arrowIcon.svg';
import TakeOffIcon from '../assets/icons/takeOffIcon.svg';
import LandingIcon from '../assets/icons/landingIcon.svg';
import InflectionIcon from '../assets/icons/inflectionIcon.svg';
import IndexIcon from '../assets/icons/indexIcon.svg';
import GInflectionIcon from '../assets/icons/gInflectionIcon.svg';

// ==================== 图标基类相关类型 ====================

/**
 * 图标类型枚举
 */
export type IconType =
  | 'UAV-Compliant'
  | 'UAV-Violation'
  | 'UAV-MinorViolation'
  | 'UAV-NonCooperative'
  | 'ObstacleGround'
  | 'ObstacleAirborne'
  | 'ObstacleAltitudeUnknown'
  | 'ObstacleSuspected'
  | 'ObstacleTemporary'
  | 'ObstacleCritical'
  | 'Vertiport-Available'
  | 'Vertiport-Unavailable'
  | 'Infra-Charging-Available'
  | 'Infra-Charging-Unavailable'
  | 'Infra-Communication-Available'
  | 'Infra-Communication-Unavailable'
  | 'Infra-Converged-Available'
  | 'Infra-Converged-Unavailable'
  | 'Infra-Gas-Available'
  | 'Infra-Gas-Unavailable'
  | 'Infra-H2-Available'
  | 'Infra-H2-Unavailable'
  | 'Infra-Navigation-Available'
  | 'Infra-Navigation-Unavailable'
  | 'Infra-Surveillance-Available'
  | 'Infra-Surveillance-Unavailable'
  | 'Infra-Meteorology-Available'
  | 'Infra-Meteorology-Unavailable'
  | 'Infra-Altitude-Available'
  | 'Infra-Altitude-Unavailable'
  | 'Uavcompliant'
  | 'Helicopter'
  | 'Grassland'
  | 'Sand'
  | 'Ponding'
  | 'G-Icon'
  | 'B-Icon'
  | 'W-Icon'
  | 'C-Icon'
  | 'Arrow-Icon'
  | 'TakeOff-Icon'
  | 'Landing-Icon'
  | 'Inflection-Icon'
  | 'GInflection-Icon'
  | 'Index-Icon';

/**
 * 自定义样式接口
 * 扩展腾讯地图 TMap.MarkerStyle 的所有属性
 */
export interface IconCustomStyles {
  /** 图标颜色（通过 CSS filter 实现，支持: red, green, blue, yellow, orange, purple, pink, cyan, black, white, gray/grey） */
  color?: string;
  /** 标注点图片的锚点位置 */
  anchor?: { x: number; y: number };
  /** 标注点图片的朝向，可取'map'（贴地）或'screen'（直立），默认为'screen' */
  faceTo?: 'map' | 'screen';
  /** 标注点图片的旋转角度，单位为度，非负数；以锚点为旋转点，逆时针旋转为正 */
  rotate?: number;
  /** 标注点图片的透明度，取值0~1 */
  opacity?: number;
  /** 标注点文本描边颜色属性，支持rgb()，rgba()，#RRGGBB等形式 */
  strokeColor?: string;
  /** 标注点文本描边宽度，默认为1 */
  strokeWidth?: number;
  /** 标注点文本字号大小属性，默认为14 */
  size?: number;
  /** 标注点文本字号相对于标注点图片的方位 */
  direction?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  /** 标注点文本文字基于direction方位的偏移量 */
  offset?: { x: number; y: number };
  /** 标注点文本自动换行配置 */
  wrapOptions?: { width?: number; enableSoftWrap?: boolean } | null;
  /** 标注点文字背景框内边距，如: "15px" 或 "15px 20px" */
  padding?: string;
  /** 标注点文本背景的宽度，单位为像素 */
  backgroundWidth?: number;
  /** 标注点文本背景的高度，单位为像素 */
  backgroundHeight?: number;
  /** 标注点文本背景颜色属性 */
  backgroundColor?: string;
  /** 标注点文本背景框边线宽度，单位为像素 */
  backgroundBorderWidth?: number;
  /** 标注点文本背景框圆角，单位为像素 */
  backgroundBorderRadius?: number;
  /** 标注点文本背景描边颜色属性 */
  backgroundBorderColor?: string;
  /** 是否启动随地图大小缩小，默认为false */
  enableRelativeScale?: boolean;
  /** Marker的图像、文本随地图缩小大小的控制参数 */
  relativeScaleOptions?: { imageScale?: number; textScale?: number };
  /** 边框（如: '1px solid red', '2px dashed blue'）- 已废弃，使用 strokeColor 和 strokeWidth */
  border?: string;
  /** 圆角（如: '50%', '10px'）- 已废弃，使用 backgroundBorderRadius */
  borderRadius?: string;
  /** 其他CSS属性 */
  [key: string]: any;
}

/**
 * 图标尺寸类型
 */
export type IconSize = 'L' | 'M' | 'S';

/**
 * BaseIconDrawer 配置选项接口
 */
export interface BaseIconDrawerOptions {
  /** 地图实例 */
  map: any;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 图标宽度，默认30 */
  width?: number;
  /** 图标高度，默认30 */
  height?: number;
  /** 图标尺寸 (L: 54px, M: 36px, S: 24px)，优先于 width/height */
  size?: IconSize;
  /** 图标类型 */
  type?: IconType;
  /** 自定义样式 */
  customStyles?: IconCustomStyles;
  /** 自定义图片路径 */
  src?: string;
}

/**
 * 图标类型映射表
 */
const ICON_TYPE_MAP: Record<IconType, string> = {
  'UAV-Compliant': UAVCompliantIcon,
  'UAV-Violation': UAVViolationIcon,
  'UAV-MinorViolation': UAVMinorViolationIcon,
  'UAV-NonCooperative': UAVNonCooperativeIcon,
  ObstacleGround: ObstacleGroundIcon,
  ObstacleAirborne: ObstacleAirborneIcon,
  ObstacleAltitudeUnknown: ObstacleAltitudeUnknownIcon,
  ObstacleSuspected: ObstacleSuspectedIcon,
  ObstacleTemporary: ObstacleTemporaryIcon,
  ObstacleCritical: ObstacleCriticalIcon,
  'Vertiport-Available': VertiportAvailableIcon,
  'Vertiport-Unavailable': VertiportUnavailableIcon,
  'Infra-Charging-Available': InfraChargingAvailableIcon,
  'Infra-Charging-Unavailable': InfraChargingUnavailableIcon,
  'Infra-Communication-Available': InfraCommunicationAvailableIcon,
  'Infra-Communication-Unavailable': InfraCommunicationUnavailableIcon,
  'Infra-Converged-Available': InfraConvergedAvailableIcon,
  'Infra-Converged-Unavailable': InfraConvergedUnavailableIcon,
  'Infra-Gas-Available': InfraGasAvailableIcon,
  'Infra-Gas-Unavailable': InfraGasUnavailableIcon,
  'Infra-H2-Available': InfraH2AvailableIcon,
  'Infra-H2-Unavailable': InfraH2UnavailableIcon,
  'Infra-Navigation-Available': InfraNavigationAvailableIcon,
  'Infra-Navigation-Unavailable': InfraNavigationUnavailableIcon,
  'Infra-Surveillance-Available': InfraSurveillanceAvailableIcon,
  'Infra-Surveillance-Unavailable': InfraSurveillanceUnavailableIcon,
  'Infra-Meteorology-Available': InfraMeteorologAvailableIcon, // InfraMeteorologyAvailable
  'Infra-Meteorology-Unavailable': InfraMeteorologUnavailableIcon,
  'Infra-Altitude-Available': InfraAltitudeAvailableIcon,
  'Infra-Altitude-Unavailable': InfraAltitudeUnavailableIcon,
  Uavcompliant: UavcompliantIcon,
  Helicopter: HelicopterIcon,
  Grassland: GrasslandIcon,
  Sand: sandIcon,
  Ponding: PondingIcon,
  'G-Icon': GIcon,
  'B-Icon': BIcon,
  'W-Icon': WIcon,
  'C-Icon': CIcon,
  'Arrow-Icon': ArrowIcon,
  'TakeOff-Icon': TakeOffIcon,
  'Landing-Icon': LandingIcon,
  'Inflection-Icon': InflectionIcon,
  'GInflection-Icon': GInflectionIcon,
  'Index-Icon': IndexIcon
};

/**
 * 图标名称映射表（用于日志）
 */
const ICON_NAME_MAP: Record<IconType, string> = {
  'UAV-Compliant': 'UAV-Compliant',
  'UAV-Violation': 'UAV-Violation',
  'UAV-MinorViolation': 'UAV-MinorViolation',
  'UAV-NonCooperative': 'UAV-NonCooperative',
  ObstacleGround: 'Obstacle-Ground',
  ObstacleAirborne: 'Obstacle-Airborne',
  ObstacleAltitudeUnknown: 'Obstacle-AltitudeUnknown',
  ObstacleSuspected: 'Obstacle-Suspected',
  ObstacleTemporary: 'Obstacle-Temporary',
  ObstacleCritical: 'Obstacle-Critical',
  'Vertiport-Available': 'Vertiport-Available',
  'Vertiport-Unavailable': 'Vertiport-Unavailable',
  'Infra-Charging-Available': 'Infra-Charging-Available',
  'Infra-Charging-Unavailable': 'Infra-Charging-Unavailable',
  'Infra-Communication-Available': 'Infra-Communication-Available',
  'Infra-Communication-Unavailable': 'Infra-Communication-Unavailable',
  'Infra-Converged-Available': 'Infra-Converged-Available',
  'Infra-Converged-Unavailable': 'Infra-Converged-Unavailable',
  'Infra-Gas-Available': 'Infra-Gas-Available',
  'Infra-Gas-Unavailable': 'Infra-Gas-Unavailable',
  'Infra-H2-Available': 'Infra-H2-Available',
  'Infra-H2-Unavailable': 'Infra-H2-Unavailable',
  'Infra-Navigation-Available': 'Infra-Navigation-Available',
  'Infra-Navigation-Unavailable': 'Infra-Navigation-Unavailable',
  'Infra-Surveillance-Available': 'Infra-Surveillance-Available',
  'Infra-Surveillance-Unavailable': 'Infra-Surveillance-Unavailable',
  'Infra-Meteorology-Available': 'Infra-Meteorology-Available',
  'Infra-Meteorology-Unavailable': 'Infra-Meteorology-Unavailable',
  'Infra-Altitude-Available': 'Infra-Altitude-Available',
  'Infra-Altitude-Unavailable': 'Infra-Altitude-Unavailable',
  Uavcompliant: '无人机合规图标',
  Helicopter: '直升机图标',
  Grassland: '草原图标',
  Sand: '沙地图标',
  Ponding: '池塘图标',
  'G-Icon': 'G类空域图标',
  'B-Icon': 'B类空域图标',
  'W-Icon': 'W类空域图标',
  'C-Icon': 'C类空域图标',
  'Arrow-Icon': '箭头图标',
  'TakeOff-Icon': '起飞点图标',
  'Landing-Icon': '降落点图标',
  'Inflection-Icon': '拐点图标',
  'GInflection-Icon': '绿色拐点图标',
  'Index-Icon': '序号图标'
};

export class BaseIconDrawer {
  protected map: any;
  protected lat: number;
  protected lng: number;
  protected width: number;
  protected height: number;
  protected size?: IconSize;
  protected type?: IconType;
  protected customStyles?: IconCustomStyles;
  protected src?: string; // 自定义图片路径
  protected static imageDrawer: NativeDrawImage | null = null; // 改为静态，复用同一个实例

  constructor(options: BaseIconDrawerOptions) {
    const {
      map,
      lat,
      lng,
      width = 40,
      height = 40,
      size,
      type,
      customStyles,
      src
    } = options;

    if (!map || !window.TMap) {
      throw new Error('地图实例或 TMap API 未准备好');
    }

    this.map = map;
    this.lat = lat;
    this.lng = lng;
    this.size = size;

    // 根据 size 设置 width 和 height，优先于默认值和传入的 width/height
    if (size) {
      const sizeMap: Record<IconSize, number> = {
        L: 54,
        M: 36,
        S: 24
      };
      this.width = sizeMap[size];
      this.height = sizeMap[size];
    } else {
      this.width = width;
      this.height = height;
    }

    this.type = type;
    this.customStyles = customStyles;
    this.src = src;

    // 只创建一次 imageDrawer（静态复用）
    // if (!BaseIconDrawer.imageDrawer) {

    // }
    BaseIconDrawer.imageDrawer = new NativeDrawImage(this.map);
    // 添加图标
    this.addIcon();
  }

  /**
   * 获取图标资源
   * 优先级：自定义路径(src) > type 映射表
   */
  protected getIconSrc(): string {
    // 优先使用自定义图片路径
    if (this.src) {
      return this.src;
    }

    // 其次使用 type 映射表
    if (this.type) {
      const iconSrc = ICON_TYPE_MAP[this.type];
      if (!iconSrc) {
        throw new Error(`未找到图标类型: ${this.type}`);
      }
      return iconSrc;
    }

    throw new Error('必须提供 src 或 type 参数');
  }

  /**
   * 异步获取图标资源（支持自定义颜色）
   * 如果有自定义颜色，返回修改后的 SVG URL
   */
  protected async getIconSrcAsync(): Promise<string> {
    const originalSrc = this.getIconSrc();
    console.log('📝 原始图标路径:', originalSrc);

    // 否则返回原始路径
    console.log('📦 返回原始路径');
    return originalSrc;
  }

  /**
   * 获取图标名称（用于日志）
   * 如果有 type，从映射表中获取；否则返回类名
   */
  protected getIconName(): string {
    if (this.type) {
      return ICON_NAME_MAP[this.type] || this.type;
    }
    return this.constructor.name;
  }

  /**
   * 添加图标到地图
   */
  private addIcon(): void {
    // 只有当 customStyles 存在且有 color 属性时，才需要异步处理 SVG
    if (this.customStyles?.color) {
      console.log('→ 使用自定义颜色方案（异步处理 SVG）');
      // 异步调用，不阻塞构造函数
      this.addIconWithCustomStyles().catch((error) => {
        console.error('❌ 添加自定义样式图标失败:', error);
      });
    } else {
      console.log('→ 使用默认样式方案');
      // 默认使用图片 Marker，传递自定义样式
      BaseIconDrawer.imageDrawer!.addImage({
        lat: this.lat,
        lng: this.lng,
        src: this.getIconSrc(),
        width: this.width,
        height: this.height,
        styles: this.customStyles // 传递完整的样式配置
      });
      console.log(`✅ 已添加 ${this.getIconName()} 到地图`);
    }
  }

  /**
   * 添加带自定义样式的图标
   * 使用腾讯地图原生 Marker API
   */
  private async addIconWithCustomStyles(): Promise<void> {
    console.log('📦 开始处理自定义样式图标...');

    try {
      // 获取处理后的图标 URL（支持颜色自定义）
      // const iconSrc = await this.getIconSrcAsync();
      const iconSrc = this.getIconSrc();

      // 添加小延迟，确保地图完全准备好
      // await new Promise((resolve) => setTimeout(resolve, 100));

      // 使用腾讯地图原生 Marker 渲染，传递完整的样式配置
      BaseIconDrawer.imageDrawer!.addImage({
        lat: this.lat,
        lng: this.lng,
        src: iconSrc,
        width: this.width,
        height: this.height,
        styles: this.customStyles // 传递完整的样式配置
      });
    } catch (error) {
      console.error('❌ 处理图标失败:', error);
      throw error;
    }
  }
}


/**
 * UAV-Compliant
 */
export class UAVCompliant extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'UAV-Compliant' });
  }
}

/**
 * UAV-Violation
 */
export class UAVViolation extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'UAV-Violation' });
  }
}

/**
 * UAV-MinorViolation
 */
export class UAVMinorViolation extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'UAV-MinorViolation' });
  }
}

/**
 * UAV-NonCooperative
 */
export class UAVNonCooperative extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'UAV-NonCooperative' });
  }
}

/**
 * Obstacle-Ground
 */
export class ObstacleGround extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleGround' });
  }
}

/**
 * Obstacle-Airborne
 */
export class ObstacleAirborne extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleAirborne' });
  }
}

/**
 * Obstacle-AltitudeUnknown
 */
export class ObstacleAltitudeUnknown extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleAltitudeUnknown' });
  }
}

/**
 * Obstacle-Suspected
 */
export class ObstacleSuspected extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleSuspected' });
  }
}

/**
 * Obstacle-Temporary
 */
export class ObstacleTemporary extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleTemporary' });
  }
}
/**
 * Obstacle-Critical
 */
export class ObstacleCritical extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'ObstacleCritical' });
  }
}
/**
 * Vertiport-Available
 */
export class VertiportAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Vertiport-Available' });
  }
}

/**
 * Vertiport-Unavailable
 */
export class VertiportUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Vertiport-Unavailable' });
  }
}

/**
 * Infra-Charging-Available
 */
export class InfraChargingAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Charging-Available' });
  }
}

/**
 * Infra-Charging-Unavailable
 */
export class InfraChargingUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Charging-Unavailable' });
  }
}

/**
 * Infra-Communication-Available
 */
export class InfraCommunicationAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Communication-Available' });
  }
}

/**
 * Infra-Communication-Unavailable
 */
export class InfraCommunicationUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Communication-Unavailable' });
  }
}

/**
 * Infra-Converged-Available
 */
export class InfraConvergedAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Converged-Available' });
  }
}

/**
 * Infra-Converged-Unavailable
 */
export class InfraConvergedUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Converged-Unavailable' });
  }
}

/**
 * Infra-Gas-Available
 */
export class InfraEnergyAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Gas-Available' });
  }
}

/**
 * Infra-Gas-Unavailable
 */
export class InfraEnergyUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Gas-Unavailable' });
  }
}

/**
 * Infra-H2-Available
 */
export class InfraH2Available extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-H2-Available' });
  }
}

/**
 * Infra-H2-Unavailable
 */
export class InfraH2Unavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-H2-Unavailable' });
  }
}

/**
 * Infra-Navigation-Available
 */
export class InfraNavigationAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Navigation-Available' });
  }
}

/**
 * Infra-Navigation-Unavailable
 */
export class InfraNavigationUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Navigation-Unavailable' });
  }
}

/**
 * Infra-Surveillance-Available
 */
export class InfraSurveillanceAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Surveillance-Available' });
  }
}

/**
 * Infra-Surveillance-Unavailable
 */
export class InfraSurveillanceUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Surveillance-Unavailable' });
  }
}

/**
 * Infra-Meteorology-Available InfraMeteorologyAvailable
 */
export class InfraMeteorologyAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Meteorology-Available' });
  }
}

/**
 * Infra-Meteorology-Unavailable
 */
export class InfraMeteorologyUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Meteorology-Unavailable' });
  }
}

/**
 * Infra-Altitude-Available
 */
export class InfraAltitudeAvailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Altitude-Available' });
  }
}

/**
 * Infra-Altitude-Unavailable
 */
export class InfraAltitudeUnavailable extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Infra-Altitude-Unavailable' });
  }
}

/**
 * Uavcompliant
 */
export class NativeUavcompliantIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Uavcompliant' });
  }
}

/**
 * Helicopter
 */
export class NativeHelicopterIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Helicopter' });
  }
}

/**
 * Grassland
 */
export class NativeGrasslandIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Grassland' });
  }
}

/**
 * Sand
 */
export class NativeSandIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Sand' });
  }
}

/**
 * Ponding
 */
export class NativePondingIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Ponding' });
  }
}

/**
 * G-Icon
 */
export class NativeGIconIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'G-Icon' });
  }
}

/**
 * B-Icon
 */
export class NativeBIconIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'B-Icon' });
  }
}

/**
 * W-Icon
 */
export class NativeWIconIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'W-Icon' });
  }
}

/**
 * C-Icon
 */
export class NativeCIconIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'C-Icon' });
  }
}

/**
 * Arrow-Icon
 */
export class NativeArrowIconIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Arrow-Icon' });
  }
}

/**
 * TakeOff-Icon
 */
export class NativeTakeOffIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'TakeOff-Icon' });
  }
}

/**
 * Landing-Icon
 */
export class NativeLandingIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Landing-Icon' });
  }
}

/**
 * Inflection-Icon
 */
export class NativeInflectionIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Inflection-Icon' });
  }
}

/**
 * GInflection-Icon (绿色拐点图标)
 */
export class NativeGInflectionIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'GInflection-Icon' });
  }
}

/**
 * Index-Icon
 */
export class NativeIndexIcon extends BaseIconDrawer {
  constructor(
    options: Omit<BaseIconDrawerOptions, 'type'> & { type?: IconType }
  ) {
    super({ ...options, type: 'Index-Icon' });
  }
}
