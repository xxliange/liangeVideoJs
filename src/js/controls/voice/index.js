/**
 * controls - voice
 * 声音调节
 */

import $ from './../../utils/dom-core';

// 构造函数
/**
 * 
 * @param {object} video 
 * video对象
 */
function Voice (video){
    this.video = video;
    this.$elem = $(`
        <div class='l-c-video'>
            <i class='iconfont icon-sound' />
        </div>
    `);
    
};

Voice.prototype = {
    constructor : Voice
};

export default Voice;