/**
 *  video 元素
 */

import $ from "../utils/dom-core";

function VideoDom (video){
    this.video = video;
};

VideoDom.prototype = {
    _init:function(){
        const {video} = this;
        const {$videoElm} = video;
        const videoEvent = $videoElm[0];
        $videoElm.on('loadedmetadata',this._videoLoad); 
    },

    _videoLoad:function(){
    }

};

export default VideoDom;