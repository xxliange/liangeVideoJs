/**
 * video - event
 * 视频所有的操作事件
 */

// 构造函数

/**
 * 
 * @param {Object} video 
 * 视频对象 所要操作的对象
 */

function Event (video){
    this.video = video;
};

Event.prototype = {
    // 视频播放
    play:function(){
        let {$videoElm, isPlay, $playFont} = this.video;
        if(isPlay){
            $videoElm.pause();
            $playFont.removeClass('icon-timeout');
            $playFont.addClass('icon-play-circle');
            isPlay = false;
        }else{
            $playFont.removeClass('icon-play-circle');
            $playFont.addClass('icon-timeout');
            $videoElm.play();
            isPlay = true;
        };
        video.isPlay = isPlay;
    },

    // 全屏
    fullScreen:function(){
        let {video} = this;
        let {$selector, isFull, $fullFont} = video;
        this._requestFullScreen($selector.get(0)[0], isFull);
        if(isFull){
            $fullFont.addClass('icon-fullscreen');
            $fullFont.removeClass('icon-fullscreen-exit');
            isFull = false;
        }else{
            $fullFont.addClass('icon-fullscreen-exit');
            $fullFont.removeClass('icon-fullscreen');
            isFull = true;
        }
        video.isFull = isFull;
    },
    _requestFullScreen:function(elemt, isFull){
        const requestMethod = elemt.requestFullScreen || //w3c
            elemt.webkitRequestFullScreen || //firfox
            elemt.mozRequestFullScreen || //chorme
            elemt.msRequestFullScreen; //ie11
        if(requestMethod){
            if(!isFull){
                requestMethod.call(elemt);
            }else{
                document.exitFullscreen();
            }
        };
    }
};

function E (video){
    return new Event(video);
}

export default  E;