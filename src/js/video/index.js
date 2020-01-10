/**
 *  video 元素
 */

function VideoDom (video){
    this.video = video;
};

/**
 * @param {object} video 
 *  video 对象
 */

VideoDom.prototype = {
    _init:function(){
        const {video} = this;
        const {$videoElm} = video;
        this.$event = $videoElm.getVideoEvent();
        $videoElm.on('loadedmetadata', ()=>{
            const {duration} = this.$event;
            const durationTime = this._time2minute(duration);
            video.$durationTime.innerText(durationTime);
           
        });
        $videoElm.on('play', ()=>{
            this.playTime = setInterval(() => {
                video.$playTime.innerText(this._time2minute(this.$event.currentTime));
            }, 1000);
        });
        $videoElm.on('ended', ()=>{
            console.log('end');
        })
        
        // 保存属性
        video.playTime = this.playTime;
    },

    _time2minute:function(time){
        let second = parseInt(time % 60),
            minute = parseInt(time / 60);
        if(second<10){
            second = '0'+second;
        }
        const durationTime = `${minute}:${second}`;
        return durationTime;

    }

};

export default VideoDom;