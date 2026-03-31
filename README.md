# LASER Design

LASER Design基于低空UI设计规范及其标准，为React开发者提供了一套功能完备、开箱即用的高质量组件集合，致力于将设计系统的一致性高效转化为代码实现。LASER Design将设计原则转化为可复用的代码标准，规范了低空领域界面视觉与开发的统一语言。通过标准化的文档说明，帮助低空行业的可视化开发者快速理解组件作用与可视化表现形式，赋能开发者，构建互联互通的低空未来。

## 前置准备

以腾讯地图为例，以下是一些前置准备工作。

### 1. 部署地图/位置服务（以腾讯地图为例）

*   注册并登录 腾讯位置服务控制台，成为腾讯位置服务开发者；&#x20;
*   展开应用管理菜单，并选择我的应用。点击右侧创建应用，如果已经创建过应用，可以直接选择添加Key。（Javascript API GL 并不需要勾选任何产品，直接创建 Key 就可以使用）&#x20;
*   引入 script 标签加载 API 服务，具体格式如下。其中的详细参数说明可参考相关文档。



```javascript
// 声明：获取和使用腾讯地图相关的账号及功能，需要遵循腾讯地图相关的隐私协议和服务协议
// 腾讯地图服务协议：https://rule.tencent.com/rule/0c5ee022-04cf-4614-a116-32d9f362552a
// 腾讯地图隐私协议：https://privacy.qq.com/document/preview/4cf61fd47f584dae83758bb0f11c1533

<script charset="utf-8" src="https://map.qq.com/api/gljs?v=1.exp&key=YOUR_KEY"></script>
```

### 2. 安装相关其他工具

*   安装Node.Js

    Node.Js 安装包及源码下载地址为：<https://nodejs.org/en/download/>

*   安装React

    React 下载地址：<https://react.dev/>

## 安装组件库

使用如下命令行安装组件库：

```bash
npm install laser-design
```

## 初始化地图

*   申明地图来源

    LASER Design 示例中，使用的地图相关组件均来自 腾讯地图 。

*   初始化地图

```javascript
import { useRef, useEffect } from 'react';

export default () => {
  // 地图容器ref
  const containerRef = useRef(null)

  useEffect(() => {

    // 初始化地图
    const map = new TMap.Map(containerRef.current, {
      zoom: 17, //地图缩放级别
      mapStyleId: 'style1', //地图样式id
      center: new TMap.LatLng(39.98210863924864, 116.31310899739151), //地图中心点经纬度
      pitch: 0, //地图俯仰角度，取值范围为0~80
      rotation: 0, //地图在水平面上的旋转角度
    });

    return () => { map.destroy() }

  }, [])

  return <div 
    ref={containerRef} 
    style={{ width: '100vw', height: '100vh' }} 
  />
}
```

## 基础图标绘制

```javascript
import { BaseIconDrawer } from 'laser-design';

const icon = new BaseIconDrawer({
  map: map,
  lat: 30.244831,
  lng: 120.151634,
  type: 'UAV-Compliant',
  width: 40,
  height: 40
});
```

## 开源协议声明

Laser Design 组件库使用Apache 2.0开源协议。详见：https://opensource.org/license/apache-2.0 
 * 补充说明：
    1. 本文件中涉及的腾讯地图相关功能，基于腾讯位置服务API开发，使用需遵守《腾讯位置服务开放API服务协议》及相关隐私服务协议，需申请并使用合法的腾讯地图API Key。
    2. 本组件库开发使用过程涉及React相关功能，需遵循相应的开源协议等，详见：<br>
    https://github.com/facebook/react?tab=MIT-1-ov-file#readme
    3. 本组件库开发使用过程涉及node.js相关功能，需遵循相应的开源协议等，详见：<br>
    https://github.com/nodejs/node?tab=License-1-ov-file#readme
    4. 本组件库开发使用过程涉及Turf.js相关功能，需遵循相应的开源协议等，详见：<br>
    https://github.com/Turfjs/turf?tab=MIT-1-ov-file#readme