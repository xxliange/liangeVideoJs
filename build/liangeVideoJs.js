(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.liangeVideoJs = factory());
}(this, (function () { 'use strict';

    /**
     * 
     * DOM 操作
     * 
     */

    function createElemByHTML(html) {
        var div = void 0;
        div = document.createElement('div');
        div.innerHTML = html;
        return div.children;
    }

    // 判断是否是domList
    function isDomList(selector) {
        if (!selector) return false;
        if (selector instanceof HTMLCollection || selector instanceof NodeList) {
            return true;
        }
        return false;
    }

    // 元素选择器
    function querySelectorAll(selector) {
        var result = document.querySelectorAll(selector);
        if (isDomList(result)) {
            return result;
        } else {
            return [result];
        }
    }

    // 创建构造函数

    function DomElement(selector) {

        if (!selector) return;

        // selector 本来就是DomElement对象 直接返回
        if (selector instanceof DomElement) return selector;

        this.selector = selector;
        var nodeType = selector.nodeType;

        // 根据selector 得出的结果 (如 DOM DOM list)
        var selectorResult = [];
        if (nodeType === 9) {
            // document 节点
            selectorResult = [selector];
        } else if (nodeType === 1) {
            // 单个dom节点
            selectorResult = [selector];
        } else if (typeof selector === 'string') {
            // 字符串
            selector = selector.replace('/\n/mg', '').trim(); //字符串去空
            if (selector.indexOf('<') === 0) {
                // 比如<div>
                selectorResult = createElemByHTML(selector);
            } else {
                // 如 # . 选择器
                selectorResult = querySelectorAll(selector);
            }    }
        var length = selectorResult.length;
        if (!length) return this; //空数组

        for (var i = 0; i < length; i++) {
            this[i] = selectorResult[i];
        }    this.length = length;
    }
    DomElement.prototype = {

        forEach: function forEach(fn) {
            for (var i = 0; i < this.length; i++) {
                var elem = this[i];
                var result = fn.call(elem, elem, i);
                if (result === false) {
                    break;
                }
            }        return this;
        },

        // 绑定事件
        on: function on(type, selector, fn) {
            if (!fn) {
                fn = selector;
                selector = null;
            }
            // type是否有多个
            var types = [];
            types = type.split(/\s+/);

            return this.forEach(function (elem) {
                types.forEach(function (type) {
                    if (!type) return;
                    if (!selector) {
                        elem.addEventListener(type, fn);
                        return;
                    }

                    elem.addEventListener(type, function (e) {
                        var target = e.target;
                        if (target.matches(selector)) {
                            fn.call(target, e);
                        }
                    });
                });
            });
        },

        // 获取子节点
        children: function children() {
            var elem = this[0];
            if (!elem) {
                return null;
            }        return $(elem.children);
        },

        // 添加class
        addClass: function addClass(className) {
            if (!className) return this;
            return this.forEach(function (elem) {
                var arr = void 0;
                if (elem.className) {
                    arr = elem.className.split(/\s/);
                    arr = arr.filter(function (item) {
                        return !!item.trim();
                    });
                    if (arr.indexOf(className) < 0) {
                        arr.push(className);
                    }                elem.className = arr.join(' ');
                } else {
                    elem.className = className;
                }
            });
        },

        // 添加子节点
        append: function append($children) {
            return this.forEach(function (elem) {
                $children.forEach(function (child) {
                    elem.appendChild(child);
                });
            });
        },

        innerText: function innerText(text) {
            return this.forEach(function (elem) {
                if (!text) return;
                elem.innerText = text;
            });
        },

        // 视频播放
        play: function play() {
            return this.forEach(function (elem) {
                elem.play();
            });
        },

        // 视频暂停
        pause: function pause() {
            return this.forEach(function (elem) {
                elem.pause();
            });
        }
    };

    function $(selector) {
        return new DomElement(selector);
    }

    /**
     *  video 元素
     */

    function VideoDom(video) {
        this.video = video;
    }
    VideoDom.prototype = {
        _init: function _init() {
            var video = this.video;
            var $videoElm = video.$videoElm;

            var videoEvent = $videoElm[0];
            $videoElm.on('loadedmetadata', this._videoLoad);
        },

        _videoLoad: function _videoLoad() {}

    };

    /**
     * controls - playCon 
     * 播放暂停按钮
     */

    //  构造函数
    function PlayCon(video) {
        this.video = video;
        this.text = '播放';
        this.$elem = $('\n        <div class=\'l-c-playCon\'>\n\n        </div>\n    ');
        this.$text = $('<p></p>');
        this.$elem.append(this.$text);
        this.$text.innerText(this.text);
        this.isPlay = false;
        this.type = 'click';
    }
    // 修改原型
    PlayCon.prototype = {

        constructor: PlayCon,

        // 点击事件
        onClick: function onClick() {
            var video = this.video,
                isPlay = this.isPlay,
                text = this.text;
            var $videoElm = video.$videoElm;

            if (isPlay) {
                text = '播放';
                $videoElm.pause();
                this.isPlay = false;
            } else {
                text = '暂停';
                $videoElm.play();
                this.isPlay = true;
            }        this.$text.innerText(text);
            video.isPlay = isPlay;
        }
    };

    /**
     * 所有控制器操作的汇总
     */

    // 存储控制器的构造函数
    var ControlsConstructors = {};
    ControlsConstructors.playCon = PlayCon;

    /**
     * 公共库
     */

    function objForEach(obj, fn) {
        var key = void 0,
            result = void 0;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                result = fn.call(obj, key, obj[key]);
                if (result === false) {
                    break;
                }
            }
        }
    }

    /**
     * 
     * 控制器集合
     * 
     */

    //  控制器构造函数
    function Controls(video) {
        this.video = video;
        this.controls = {};
    }
    // 原型
    Controls.prototype = {
        constructor: Controls,

        // 初始化控制器
        init: function init() {
            var _this = this;

            var video = this.video;
            var config = video.config || {};
            var configControls = config.controls || [];

            // 根据配置信息 创建控制器
            configControls.forEach(function (controlsKey) {
                var ControlsConstructor = ControlsConstructors[controlsKey];
                if (typeof ControlsConstructor === 'function' && ControlsConstructor) {
                    // 创建单个控制器
                    _this.controls[controlsKey] = new ControlsConstructor(video);
                }
            });

            // 添加到控制器
            this._addToControlBar();

            // 绑定事件
            this._bindEvent();
        },

        // 添加到控制器
        _addToControlBar: function _addToControlBar() {
            var video = this.video;
            var $videoControls = video.$controlsBar;
            var controls = this.controls;
            objForEach(controls, function (key, control) {
                var $elem = control.$elem;
                if ($elem) {
                    $videoControls.append($elem);
                }
            });
        },

        // 绑定事件
        _bindEvent: function _bindEvent() {
            var controls = this.controls;
            var video = this.video;
            objForEach(controls, function (key, control) {
                var type = control.type;

                if (!type) return;

                var $elem = control.$elem;

                if (type === 'click' && control.onClick) {
                    $elem.on('click', function (e) {
                        control.onClick(e);
                    });
                }
            });
        }
    };

    /**
     * 配置信息
     */

    var config = {

        // 默认控制器配置
        controls: ['progressBar', //进度条
        'playCon', //播放暂停按钮
        'voice', // 声音控制
        // 'setting', //设置
        'speed', //播放速度设置
        // 'playMode', //播放方式
        'fullScreen', //全屏
        'loop', //循环
        'timeText'],
        url: null,
        title: null
    };

    /**
     * 
     *  video插件构造函数
     * 
     */

    // id 累加
    var videoId = 1;

    function Video(selector, config) {
        if (selector == null) {
            throw new Error('错误: 初始化video时未传入参数!');
        }
        // 每创建一个新的video id累加 用来判断单个页面不同的video对象
        this.id = 'liangeVideo-' + videoId++;

        this.selector = selector;
        this.config = config;
    }
    Video.prototype = {

        // 初始化配置
        _initConfig: function _initConfig() {
            var target = {};
            this.config = Object.assign(target, config, this.config);
        },

        // 初始化DOM
        _initDom: function _initDom() {
            var selector = this.selector;
            var $selectore = $(selector);
            var config = this.config;

            var $controlsBar = void 0,
                $videoElm = void 0,
                $titleElm = void 0;
            // 创建控制器
            $controlsBar = $('<div></div>');
            // 创建video播放器
            $videoElm = $('<video src=' + config.url + '></video>');
            // 如果需要标题 则创建标题
            if (config.title !== null) {
                $titleElm = $('<div>\n                <p>' + config.title + '</p>\n            </div>');
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
        _initVideo: function _initVideo() {
            this.videoEl = new VideoDom(this);
            this.videoEl._init();
        },

        // 初始化控制器
        _initControls: function _initControls() {
            this.controls = new Controls(this);
            this.controls.init();
        },

        // 创建video
        create: function create() {
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

    try {
        document;
    } catch (error) {
        throw new Error('请在浏览器环境下运行');
    }
    var inlineCss = '*{    margin: 0;    padding: 0;    color: #000;}.video{    width: 700px;    height: 480px;    display: -webkit-box;    display: flex;    align-content: center;    -webkit-box-pack: center;            justify-content: center;    position: relative;    margin: 10px auto;}.l-video{    width: 100%;    height: 100%;    background-color: #000;}.video .l-title{    width: 100%;    box-sizing: border-box;    padding: 20px 20px;    position: absolute;    top: 0;    left: 0;    background:-webkit-gradient(linear, left top, left bottom, from(rgba(43,51,63,.7)), to(rgba(0,0,0,0.3)));    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#4c000000\', endColorstr=\'#4c000000\');    background:linear-gradient(to bottom, rgba(43,51,63,.7), rgba(0,0,0,0.3));    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#4c000000\', endColorstr=\'#4c000000\');    z-index: 9;}:root .video .l-title{    filter: none\\9;}:root .video .l-title{    filter: none\\9;}.video .l-title p{    font-size: 16px;    font-weight: 500;    color: #fff;    overflow: hidden;    white-space: nowrap;    text-overflow: ellipsis;}.video .l-c-controlsBar{    width: 100%;    padding: 20px 10px;    box-sizing: border-box;    background:-webkit-gradient(linear, left bottom, left top, from(rgba(43,51,63,.7)), to(rgba(0,0,0,0.3)));    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#4c000000\', endColorstr=\'#4c000000\');    background:linear-gradient(to top, rgba(43,51,63,.7), rgba(0,0,0,0.3));    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#4c000000\', endColorstr=\'#4c000000\');    position: absolute;    bottom: 0;    left: 0;    z-index: 9;}:root .video .l-c-controlsBar{    filter: none\\9;}:root .video .l-c-controlsBar{    filter: none\\9;}.video .l-c-controlsBar .l-c-playCon{    width: 40px;    height: 40px;    line-height: 40px;    text-align: center;    background:#fff;    border-radius: 100%;    cursor: pointer;    -webkit-user-select: none;       -moz-user-select: none;        -ms-user-select: none;            user-select: none;}.video .l-c-controlsBar .l-c-playCon p{    color: #000;    font-size: 12px;}',
        style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = inlineCss;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    var index = window.liangeVideoJs || Video;

    return index;

})));
