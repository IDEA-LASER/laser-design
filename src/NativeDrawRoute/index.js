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