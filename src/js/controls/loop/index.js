/**
 * controls - loop
 * 循环播放
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {Object} video 
 * video 对象
 */
function Loop (video){
    this.video = video;
    this.$elem = $(`
        <div class='l-c-loop'>
            <i class='iconfont icon-repeat' />
        </div>
    `);
};

// 修改原型
Loop.prototype = {
    constructor : Loop,
};

export default Loop;