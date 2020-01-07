/**
 * controls - playCon 
 * 播放暂停按钮
 */

 import $ from './../../utils/dom-core';

//  构造函数
function PlayCon(video){
    this.video = video;
    this.text = '播放';
    this.$elem = $(`
        <div class='l-c-playCon'>

        </div>
    `);
    this.$text = $(`<p></p>`);
    this.$elem.append(this.$text);
    this.$text.innerText(this.text);
    this.isPlay = false;
    this.type = 'click';
};

// 修改原型
PlayCon.prototype = {

    constructor:PlayCon,

    // 点击事件
    onClick:function(){
        let {video, isPlay, text} = this;
        const {$videoElm} = video;
        if(isPlay){
            text = '播放';
            $videoElm.pause();
            this.isPlay = false;
        }else{
            text = '暂停';
            $videoElm.play();
            this.isPlay = true;
        };
        this.$text.innerText(text);
        video.isPlay = isPlay;
    },
};

export default PlayCon;