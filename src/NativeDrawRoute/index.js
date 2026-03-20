// 航线绘制入口
import { Draw } from "./components/draw.js"

// 构造函数（首字母大写，符合规范）
function NativeDrawRoute(map, options) {
    // 接收参数
    this.map = map;
    this.shapeType = options?.shapeType;
    this.styleType = options?.styleType || "Normal";
    this.initialData = options?.initialData;

    // 内部执行初始化
    this.init();
}

// 把方法写在原型上（性能更好，标准构造函数写法）
NativeDrawRoute.prototype.init = function () {
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

        // Draw 绘制
        Draw({ map: this.map, shapeType: this.shapeType, styleType: this.styleType, initialData: this.initialData })

    } catch (error) {
        console.log('参数错误', error);
        return null;
    }
};

export { NativeDrawRoute };