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

export {
  // 无人机图标
  UAVCompliant,
  UAVViolation,
  UAVMinorViolation,
  UAVNonCooperative,
  // 障碍物图标
  ObstacleGround,
  ObstacleAirborne,
  ObstacleAltitudeUnknown,
  ObstacleSuspected,
  ObstacleTemporary,
  ObstacleCritical,
  // 起降场图标
  VertiportAvailable,
  VertiportUnavailable,
  // 服务设施基础图标 - Available/Unavailable
  InfraChargingAvailable,
  InfraChargingUnavailable,
  InfraCommunicationAvailable,
  InfraCommunicationUnavailable,
  InfraConvergedAvailable,
  InfraConvergedUnavailable,
  InfraEnergyAvailable,
  InfraEnergyUnavailable,
  InfraH2Available,
  InfraH2Unavailable,
  InfraNavigationAvailable,
  InfraNavigationUnavailable,
  InfraSurveillanceAvailable,
  InfraSurveillanceUnavailable,
  InfraMeteorologyAvailable,
  InfraMeteorologyUnavailable,
  InfraAltitudeAvailable,
  InfraAltitudeUnavailable,
} from './src/iconDrawer';

// 空域绘制工具
export { NativeDrawAirspace } from "./src/NativeDrawAirspace/index"
//航线绘制
export { NativeDrawRoute } from "./src/NativeDrawRoute/index"
//航路绘制
export { NativeDrawRoad } from "./src/NativeDrawRoad/index"

// 障碍物集群处理
export { Obstacle } from "./src/obstacle"

