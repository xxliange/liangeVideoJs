/**
 * controls - speed
 * 播放速度
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {Object} video 
 * video 对象
 */
function Speed (video){
    this.video = video;
    this.$elem = $(`
        <div class='l-c-speed'> x1 </div> 
    `);

};

// 修改原型
Speed.prototype = {
    constructor : Speed
};

export default Speed;