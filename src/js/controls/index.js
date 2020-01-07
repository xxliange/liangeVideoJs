/**
 * 
 * 控制器集合
 * 
 */

import ControlsConstructors from './controls-list';
import $ from './../utils/dom-core';
import { objForEach } from '../utils/utils';

//  控制器构造函数
function Controls (video){
    this.video = video;
    this.controls = {};
};

// 原型
Controls.prototype = {
    constructor : Controls,

    // 初始化控制器
    init:function(){    
        const video = this.video;
        const config = video.config || {};
        const configControls = config.controls || [];

        // 根据配置信息 创建控制器
        configControls.forEach(controlsKey =>{
            const ControlsConstructor = ControlsConstructors[controlsKey];
            if(typeof ControlsConstructor === 'function' && ControlsConstructor){
                // 创建单个控制器
                this.controls[controlsKey] = new ControlsConstructor(video);
            }
        });

        // 添加到控制器
        this._addToControlBar();

        // 绑定事件
        this._bindEvent();
    },

    // 添加到控制器
    _addToControlBar:function(){
        const video = this.video;
        const $videoControls = video.$controlsBar;
        const controls = this.controls;
        objForEach(controls, (key, control)=>{
            const $elem = control.$elem;
            if($elem){
                $videoControls.append($elem);
            }
        })
    },

    // 绑定事件
    _bindEvent:function(){
        const controls = this.controls;
        const video = this.video;
        objForEach(controls, (key, control)=>{
            const {type} = control;
            if(!type) return;

            const $elem = control.$elem;

            if(type === 'click' && control.onClick){
                $elem.on('click', e=>{
                    control.onClick(e);
                })
            }
        })
    }
};

export default Controls;