/**
 * 
 *  video插件构造函数
 * 
 */

import $ from './../utils/dom-core';
import VideoDom from './../video/index';
import Controls from './../controls/index';
import _config from './../config';

// id 累加
let videoId = 1;

 

function Video (selector, config){
    if(selector == null){
        throw new Error('错误: 初始化video时未传入参数!');
    };

    // 每创建一个新的video id累加 用来判断单个页面不同的video对象
    this.id = 'liangeVideo-' + videoId++;

    this.selector = selector;
    this.config = config;

};

Video.prototype = {

    // 初始化配置
    _initConfig:function(){
        let target = {};
        this.config = Object.assign(target, _config, this.config);
    },

    // 初始化DOM
    _initDom:function(){
        const selector = this.selector;
        const $selectore = $(selector);
        const config = this.config;
        
        let $controlsBar, $videoElm, $titleElm;
        // 创建控制器
        $controlsBar = $(`<div></div>`);
        // 创建video播放器
        $videoElm = $(`<video src=${config.url}></video>`);
        // 如果需要标题 则创建标题
        if(config.title !== null){
            $titleElm = $(`<div>
                <p>${config.title}</p>
            </div>`);
            $selectore.append($titleElm);
            $titleElm.addClass('l-title');
            this.$titleElm = $titleElm;
        }

        // 将控制器和播放器添加到dom上
        $selectore.append($controlsBar).append($videoElm);
        
        // 添加class
        $controlsBar.addClass('l-c-controlsBar');
        $videoElm.addClass('l-video');

        // 保存属性
        this.$controlsBar = $controlsBar;
        this.$videoElm = $videoElm;
        
    },

    // 初始化video
    _initVideo:function(){
        this.videoEl = new VideoDom(this);
        this.videoEl._init();
    },

    // 初始化控制器
    _initControls:function(){
        this.controls = new Controls(this);
        this.controls.init();
    },

    // 创建video
    create:function(){
        // 初始化配置
        this._initConfig();
        // 初始化DOM
        this._initDom();
        // 初始化video
        this._initVideo();
        // 初始化控制器
        this._initControls();
    }
};

export default Video;