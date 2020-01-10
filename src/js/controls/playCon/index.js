/**
 * controls - playCon 
 * 播放暂停按钮
 */

 import $ from './../../utils/dom-core';

//  构造函数
function PlayCon(video){
    this.video = video;
    this.$elem = $(`
        <div class='l-c-playCon'>

        </div>
    `);
    this.$font = $(`
        <i class='iconfont icon-play-circle' />
    `);
    this.$elem.append(this.$font);
    this.isPlay = false;
    this.type = 'click';

    video.$playFont = this.$font;
   
};

// 修改原型
PlayCon.prototype = {

    constructor:PlayCon,

    // 点击事件
    onClick:function(){
        const {video} = this;
        video.E.play();
    },
};

export default PlayCon;