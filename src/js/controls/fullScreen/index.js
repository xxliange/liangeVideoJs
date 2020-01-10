/**
 * controls - fullScreen
 * 视频全屏
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {Object} video 
 * video 对象
 */
function FullScreen (video){
    this.video = video;
    this.$elem = $(`
        <div class='l-g-fullScreen'>
        </div>
    `);
    this.$font = $(`
        <i class='iconfont icon-fullscreen' />
    `);
    this.$elem.append(this.$font);
    this.isFull = false;
    this.type = 'click';

    video.$fullFont = this.$font;
}

// 修改原型
FullScreen.prototype = {
    constructor : FullScreen,

    // 点击事件
    onClick:function(){
        const {E} = video;
        E.fullScreen();
    },
};

export default FullScreen;