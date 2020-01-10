/**
 * 所有控制器操作的汇总
 */

// 存储控制器的构造函数
const ControlsConstructors = {};

// playCon
import PlayCon from './playCon/index';
ControlsConstructors.playCon = PlayCon;

// voice
import Voice from './voice/index';
ControlsConstructors.voice = Voice;

// timeText
import TimeText from './timeText/index';
ControlsConstructors.timeText = TimeText;

// loop
import Loop from './loop/index';
ControlsConstructors.loop = Loop;

// speed 
import Speed from './speed/index';
ControlsConstructors.speed = Speed;

// fullScreen
import FullScreen from './fullScreen/index';
ControlsConstructors.fullScreen = FullScreen;

// progressBar 
import ProgressBar from './progressBar/index';
ControlsConstructors.progressBar = ProgressBar;

export default ControlsConstructors;