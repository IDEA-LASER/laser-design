/**
 * @Description: 原生地图图片绘制工具
 */

// ==================== 图片绘制工具相关类型 ====================

/**
 * MarkerStyle 完整配置选项
 * 参考腾讯地图 TMap.MarkerStyle 文档
 */
export interface MarkerStyleOptions {
  /** 必需，标注点图片的宽度，默认为34 */
  width: number;
  /** 必需，标注点图片的高度，默认为50 */
  height: number;
  /** 必需，标注点图片url或base64地址 */
  src: string;
  /** 标注点图片的锚点位置，对象字母量(x:Number, y:Number)形式，在地图各种操作中，锚点的位置与标注位置是永远对应的；若没有锚点默认为(x: width/2, y: height )；锚点以图片左上角点为原点 */
  anchor?: { x: number; y: number };
  /** 标注点图片的朝向，可取'map'（贴地）或'screen'（直立），默认为'screen' */
  faceTo?: 'map' | 'screen';
  /** 标注点图片的旋转角度，单位为度，非负数；以锚点为旋转点，逆时针旋转为正 */
  rotate?: number;
  /** 标注点图片的透明度，取值0~1 */
  opacity?: number;
  /** 标注点文本颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,1) */
  color?: string;
  /** 标注点文本描边颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,0) */
  strokeColor?: string;
  /** 标注点文本描边宽度，默认为1 */
  strokeWidth?: number;
  /** 标注点文本字号大小属性，默认为14 */
  size?: number;
  /** 标注点文本字号相对于标注点图片的方位，可选位于标注点图片的center, top, bottom, left, right方位，默认位于图片的中心center */
  direction?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  /** 标注点文本文字基于direction方位的偏移量，单位为像素，以文本字中心为原点，x轴向右为正左为负，y轴向下为正上为负，默认为{x:0, y:0} */
  offset?: { x: number; y: number };
  /** 标注点文本自动换行，支持设置换行和硬换行，软换行行为'\n'，LabelWrapOptions如果为空表示以硬换行进行换行，如果为null或undefined则不换行 */
  wrapOptions?: LabelWrapOptions | null;
  /** 标注点文字背景框内边距，单位为像素，属性支持接受1~2个值，规则符合css规范
   * 例: "15px" 上下左右内边距为15px
   * 例: "15px 20px" 上下内边距为15px, 左右内边距为20px
   * 注意设置背景宽高后padding将不生效
   */
  padding?: string;
  /** 标注点文本背景的宽度，单位为像素，默认为0 */
  backgroundWidth?: number;
  /** 标注点文本背景的高度，单位为像素，默认为0 */
  backgroundHeight?: number;
  /** 标注点文本背景颜色属性，支持rgb()，rgba()，#RRGGBB等形式，该属性生效需要设置padding 或 backgroundWidth和backgroundHeight，默认为rgba(0,0,0,1) */
  backgroundColor?: string;
  /** 标注点文本背景框边线宽度，单位为像素; 该属性生效需要设置padding 或 backgroundWidth和backgroundHeight，默认为0 */
  backgroundBorderWidth?: number;
  /** 标注点文本背景框圆角，单位为像素; 该属性生效需要设置padding 或 backgroundWidth和backgroundHeight，默认为0 */
  backgroundBorderRadius?: number;
  /** 标注点文本背景描边颜色属性，支持rgb()，rgba()，#RRGGBB等形式，该属性生效需要设置padding 或 backgroundWidth和backgroundHeight，默认为rgba(0,0,0,0) */
  backgroundBorderColor?: string;
  /** 是否启动随地图大小缩小，默认为false（只针对非Marker生效） */
  enableRelativeScale?: boolean;
  /** Marker的图像、文本随地图缩小大小的控制参数（只针对非Marker生效） */
  relativeScaleOptions?: RelativeScaleOptions;
}

/**
 * 文本换行配置
 */
export interface LabelWrapOptions {
  /** 换行宽度，单位为像素 */
  width?: number;
  /** 是否启用软换行，默认为true */
  enableSoftWrap?: boolean;
}

/**
 * 相对缩放配置
 */
export interface RelativeScaleOptions {
  /** Marker图像的缩放比例，默认为1 */
  imageScale?: number;
  /** 文本缩放比例，默认为1 */
  textScale?: number;
}

export interface NativeDrawImageOptions {
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 图片地址 */
  src: string;
}

/**
 * 原生地图图片绘制工具类
 * 在地图上添加图片
 *
 * @example
 * const imageDrawer = new NativeDrawImage(map);
 * imageDrawer.addImage({
 *   lat: 30.244831,
 *   lng: 120.151634,
 *   src: 'https://example.com/icon.png',
 *   width: 50,
 *   height: 50
 * });
 */
export class NativeDrawImage {
  private map: any;
  private imageLayer: any;

  constructor(map: any) {
    if (!map || !window.TMap) {
      throw new Error('地图实例或 TMap API 未准备好');
    }

    this.map = map;

    // 创建图片图层
    this.imageLayer = new window.TMap.MultiMarker({
      id: `native-draw-image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      map: this.map,
      styles: {},
      geometries: []
    });

    console.log('✅ NativeDrawImage 初始化成功');
  }

  /**
   * 添加图片到地图
   * @param lat 纬度
   * @param lng 经度
   * @param src 图片地址
   * @param width 图片宽度，默认50
   * @param height 图片高度，默认50
   * @param styles 自定义MarkerStyle样式（可选）
   */
  addImage(options: {
    lat: number;
    lng: number;
    src: string;
    width?: number;
    height?: number;
    styles?: Partial<MarkerStyleOptions>;
  }): void {
    const { lat, lng, src, width = 50, height = 50, styles } = options;
    const imageId = `image-${Date.now()}-${Math.random()}`;
    const styleId = `style-${imageId}`;

    // 创建图片样式，合并用户提供的样式
    const markerStyle: Partial<MarkerStyleOptions> = {
      width,
      height,
      anchor: { x: width / 2, y: height / 2 },
      src,
      ...styles // 用户自定义样式会覆盖默认值
    };

    // 添加样式到图层
    this.imageLayer.setStyles({
      ...this.imageLayer.styles,
      [styleId]: new window.TMap.MarkerStyle(markerStyle)
    });

    // 添加图片到图层
    this.imageLayer.add({
      id: imageId,
      styleId: styleId,
      position: new window.TMap.LatLng(lat, lng)
    });

    console.log(`✅ 已添加图片: ${imageId}`);
  }
}
