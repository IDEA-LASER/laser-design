// 绘制空域工具入口
import { Accessible } from "./components/Accessible.js"
import { BCGW } from "./components/BCGW.js"

// 构造函数（首字母大写，符合规范）
function NativeDrawAirspace(map, options) {
    // 接收参数
    this.map = map;
    this.shapeType = options?.shapeType || "Polygon";
    this.styleType = options?.styleType || "Normal";
    this.initialData = options?.initialData;
    this.width = options?.width || 5;

    // 内部执行初始化
    this.init();
}

// 把方法写在原型上（性能更好，标准构造函数写法）
NativeDrawAirspace.prototype.init = function () {
    try {
        // 参数验证
        if (!this.map || typeof this.map !== 'object') {
            console.warn("map 不能为空");
            return null;
        }
        if (!this.styleType || typeof this.styleType !== 'string') {
            console.warn("styleType 错误");
            return null;
        }
        if (!this.shapeType || typeof this.shapeType !== 'string') {
            console.warn("shapeType 错误");
            return null;
        }
        if (this.width !== undefined && (typeof this.width !== 'number' || this.width <= 0)) {
            console.warn("width 必须是正数");
            return null;
        }

        // 判断空域类型，再进行初始化
        if (["Normal", "Accessible", "Controlled", "Test", "ElectronicFence", "MagneticAnomaly", "ElecAnomaly"].includes(this.styleType)) {
            Accessible({ map: this.map, shapeType: this.shapeType, styleType: this.styleType, initialData: this.initialData, width: this.width });
        } else if (["B", 'C', 'G', 'W'].includes(this.styleType)) {
            BCGW({ map: this.map, shapeType: this.shapeType, styleType: this.styleType, initialData: this.initialData })
        }

    } catch (error) {
        console.log('参数错误', error);
        return null;
    }
};

export { NativeDrawAirspace };