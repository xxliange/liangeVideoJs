/**
 * 
 *  video插件构造函数
 * 
 */

import $ from './../utils/dom-core';
import E from './event/index';
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
    this.E = E(this);

    this.selector = selector;
    this.config = config;
    this.$selector = $(selector);

};

Video.prototype = {

    // 初始化配置
    _initConfig:function(){
        let target = {};
        const $selector = this.$selector;
        this.config = Object.assign(target, _config, this.config);
        let {width, height} = this.config;

        // 设置播放器的宽度
        if(width !== null){ //如果用户配置了宽度
            if(width <= 350){
                // 播放器的最小宽度是350
                width = 350;
            }
        }else{
            // 如果用户没有配置宽度 则默认为700
            width = 700;
        };
        // 设置播放器的高度
        if(height !== null){
            if(height <= 200){ // 如果用户配置了高度
                // 播放器的最小高度为200
                height = 200;
            }
        }else{
            // 如果用户没有配置高度 则默认为200
            height = 480;
        }
        // 将配置配置到播放器上
        $selector.css('width', width+'px').css('height', height+'px');
        
    },

    // 初始化DOM
    _initDom:function(){
        const $selector = this.$selector;
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
            $selector.append($titleElm);
            $titleElm.addClass('l-title');
            this.$titleElm = $titleElm;
        }

        // 将控制器和播放器添加到dom上
        $selector.append($controlsBar).append($videoElm);
        
        // 添加class
        $controlsBar.addClass('l-c-controlsBar');
        $videoElm.addClass('l-video');

        // 保存属性
        this.$controlsBar = $controlsBar;
        this.$videoElm = $videoElm;
        this.$selector = $selector;

        // 绑定事件
        $videoElm.on('click', ()=>{
            this.E.play();
        });
        $videoElm.on('dblclick', ()=>{
            this.E.fullScreen();
        })
        window.addEventListener('keydown', (e)=>{
            const {keyCode} = e;
            if(keyCode === 32){
                this.E.play();
            }
        });
        
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