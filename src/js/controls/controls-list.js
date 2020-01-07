/**
 * 所有控制器操作的汇总
 */

// 存储控制器的构造函数
const ControlsConstructors = {};

import PlayCon from './playCon/index';
ControlsConstructors.playCon = PlayCon;

export default ControlsConstructors;