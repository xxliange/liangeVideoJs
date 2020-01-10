/**
 * controls - timeText 
 * 视频时间显示
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {Object} video 
 * video 对象
 */
function TimeText(video){
    this.video = video;
    this.$durationTime = $(`
        <p> 0:00 </p>
    `);
    this.$playTime = $(`
        <p> 0:00 </p>
    `);
    this.$line = $('<p> / </p>')
    this.$elem = $(`
        <div class='l-c-timeText'></div>
    `);
    this.$elem.append(this.$playTime).append(this.$line).append(this.$durationTime);

    video.$durationTime = this.$durationTime;
    video.$playTime = this.$playTime;

};

TimeText.prototype = {
    constructor : TimeText
};

export default TimeText;