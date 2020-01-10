/**
 * controls - progressBar
 * 进度条
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {Object} video 
 * video 对象
 */
function ProgressBar (video){
    this.video = video;
    this.$elem = $(`
        <div class='l-c-progressBar'></div>
    `);
};

// 修改原型
ProgressBar.prototype = {
    constructor:ProgressBar
};

export default ProgressBar;
