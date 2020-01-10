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

    /**
     * 
     * @param {Element} html 
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

    /**
     * 
     * @param {Object} selector 
     */
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

        /**
         * 
         * @param {function} fn 
         */
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

        // 获取第几个元素
        /**
         * 
         * @param {number} num 
         * 获取第几个元素
         */
        get: function get(num) {
            var length = this.length;
            if (num >= length) {
                num = num % length;
            }        return $(this[num]);
        },

        /**
         * 
         * @param {string} className
         * 需要添加的类名
         */

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

        /**
         * 
         * @param {string} className 
         * 移除类名
         */

        // 移除class
        removeClass: function removeClass(className) {
            if (!className) return this;
            return this.forEach(function (elem) {
                var arr = void 0,
                    i = void 0;
                arr = elem.className.split(/\s/);
                for (i = 0; i < arr.length; i += 1) {
                    var name = arr[i];
                    if (name === className) {
                        arr.splice(i, 1);
                    }
                }            elem.className = arr.join(' ');
            });
        },

        /**
         * 
         * @param {string} key 
         * @param {string} val
         * 
         * key 是需要修改样式名 val 是需要修改样式内容 
         */
        // 修改css
        css: function css(key, val) {
            var currentStyle = key + ':' + val;
            return this.forEach(function (elem) {
                var style = (elem.getAttribute('style') || '').trim();
                var styleArr = void 0,
                    resultArr = [];
                if (style) {
                    styleArr = style.split(';');
                    styleArr.forEach(function (item) {
                        var arr = item.split(':').map(function (i) {
                            return i.trim();
                        });
                        if (arr.length === 2) {
                            resultArr.push(arr[0] + ':' + arr[1]);
                        }                });
                    resultArr = resultArr.map(function (item) {
                        if (item.indexOf(key) === 0) {
                            return currentStyle;
                        } else {
                            return item;
                        }
                    });
                    if (resultArr.indexOf(currentStyle) < 0) {
                        resultArr.push(currentStyle);
                    }                elem.setAttribute('style', resultArr.join('; '));
                } else {
                    elem.setAttribute('style', currentStyle);
                }
            });
        },

        /**
         * 
         * @param {object} $children 
         * 需要添加的子节点
         */
        // 添加子节点
        append: function append($children) {
            return this.forEach(function (elem) {
                $children.forEach(function (child) {
                    elem.appendChild(child);
                });
            });
        },

        /**
         * 
         * @param {string} text 
         *  需要渲染的文字
         */
        innerText: function innerText(text) {
            return this.forEach(function (elem) {
                if (!text) return;
                elem.innerText = text;
            });
        },

        // 获取video对象
        getVideoEvent: function getVideoEvent() {
            var el = null;
            this.forEach(function (elem) {
                if (elem !== null) {
                    el = elem;
                }
            });
            return el;
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
     * video - event
     * 视频所有的操作事件
     */

    // 构造函数

    /**
     * 
     * @param {Object} video 
     * 视频对象 所要操作的对象
     */

    function Event(video) {
        this.video = video;
    }
    Event.prototype = {
        // 视频播放
        play: function play() {
            var _video = this.video,
                $videoElm = _video.$videoElm,
                isPlay = _video.isPlay,
                $playFont = _video.$playFont;

            if (isPlay) {
                $videoElm.pause();
                $playFont.removeClass('icon-timeout');
                $playFont.addClass('icon-play-circle');
                isPlay = false;
            } else {
                $playFont.removeClass('icon-play-circle');
                $playFont.addClass('icon-timeout');
                $videoElm.play();
                isPlay = true;
            }        video.isPlay = isPlay;
        },

        // 全屏
        fullScreen: function fullScreen() {
            var video = this.video;
            var $selector = video.$selector,
                isFull = video.isFull,
                $fullFont = video.$fullFont;

            this._requestFullScreen($selector.get(0)[0], isFull);
            if (isFull) {
                $fullFont.addClass('icon-fullscreen');
                $fullFont.removeClass('icon-fullscreen-exit');
                isFull = false;
            } else {
                $fullFont.addClass('icon-fullscreen-exit');
                $fullFont.removeClass('icon-fullscreen');
                isFull = true;
            }
            video.isFull = isFull;
        },
        _requestFullScreen: function _requestFullScreen(elemt, isFull) {
            var requestMethod = elemt.requestFullScreen || //w3c
            elemt.webkitRequestFullScreen || //firfox
            elemt.mozRequestFullScreen || //chorme
            elemt.msRequestFullScreen; //ie11
            if (requestMethod) {
                if (!isFull) {
                    requestMethod.call(elemt);
                } else {
                    document.exitFullscreen();
                }
            }    }
    };

    function E(video) {
        return new Event(video);
    }

    /**
     *  video 元素
     */

    function VideoDom(video) {
        this.video = video;
    }
    /**
     * @param {object} video 
     *  video 对象
     */

    VideoDom.prototype = {
        _init: function _init() {
            var _this = this;

            var video = this.video;
            var $videoElm = video.$videoElm;

            this.$event = $videoElm.getVideoEvent();
            $videoElm.on('loadedmetadata', function () {
                var duration = _this.$event.duration;

                var durationTime = _this._time2minute(duration);
                video.$durationTime.innerText(durationTime);
            });
            $videoElm.on('play', function () {
                _this.playTime = setInterval(function () {
                    video.$playTime.innerText(_this._time2minute(_this.$event.currentTime));
                }, 1000);
            });
            $videoElm.on('ended', function () {
                console.log('end');
            });

            // 保存属性
            video.playTime = this.playTime;
        },

        _time2minute: function _time2minute(time) {
            var second = parseInt(time % 60),
                minute = parseInt(time / 60);
            if (second < 10) {
                second = '0' + second;
            }
            var durationTime = minute + ':' + second;
            return durationTime;
        }

    };

    /**
     * controls - playCon 
     * 播放暂停按钮
     */

    //  构造函数
    function PlayCon(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-c-playCon\'>\n\n        </div>\n    ');
        this.$font = $('\n        <i class=\'iconfont icon-play-circle\' />\n    ');
        this.$elem.append(this.$font);
        this.isPlay = false;
        this.type = 'click';

        video.$playFont = this.$font;
    }
    // 修改原型
    PlayCon.prototype = {

        constructor: PlayCon,

        // 点击事件
        onClick: function onClick() {
            var video = this.video;

            video.E.play();
        }
    };

    /**
     * controls - voice
     * 声音调节
     */

    // 构造函数
    /**
     * 
     * @param {object} video 
     * video对象
     */
    function Voice(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-c-video\'>\n            <i class=\'iconfont icon-sound\' />\n        </div>\n    ');
    }
    Voice.prototype = {
        constructor: Voice
    };

    /**
     * controls - timeText 
     * 视频时间显示
     */

    // 构造函数
    /**
     * 
     * @param {Object} video 
     * video 对象
     */
    function TimeText(video) {
        this.video = video;
        this.$durationTime = $('\n        <p> 0:00 </p>\n    ');
        this.$playTime = $('\n        <p> 0:00 </p>\n    ');
        this.$line = $('<p> / </p>');
        this.$elem = $('\n        <div class=\'l-c-timeText\'></div>\n    ');
        this.$elem.append(this.$playTime).append(this.$line).append(this.$durationTime);

        video.$durationTime = this.$durationTime;
        video.$playTime = this.$playTime;
    }
    TimeText.prototype = {
        constructor: TimeText
    };

    /**
     * controls - loop
     * 循环播放
     */

    // 构造函数
    /**
     * 
     * @param {Object} video 
     * video 对象
     */
    function Loop(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-c-loop\'>\n            <i class=\'iconfont icon-repeat\' />\n        </div>\n    ');
    }
    // 修改原型
    Loop.prototype = {
        constructor: Loop
    };

    /**
     * controls - speed
     * 播放速度
     */

    // 构造函数
    /**
     * 
     * @param {Object} video 
     * video 对象
     */
    function Speed(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-c-speed\'> x1 </div> \n    ');
    }
    // 修改原型
    Speed.prototype = {
        constructor: Speed
    };

    /**
     * controls - fullScreen
     * 视频全屏
     */

    // 构造函数
    /**
     * 
     * @param {Object} video 
     * video 对象
     */
    function FullScreen(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-g-fullScreen\'>\n        </div>\n    ');
        this.$font = $('\n        <i class=\'iconfont icon-fullscreen\' />\n    ');
        this.$elem.append(this.$font);
        this.isFull = false;
        this.type = 'click';

        video.$fullFont = this.$font;
    }

    // 修改原型
    FullScreen.prototype = {
        constructor: FullScreen,

        // 点击事件
        onClick: function onClick() {
            var _video = video,
                E = _video.E;

            E.fullScreen();
        }
    };

    /**
     * controls - progressBar
     * 进度条
     */

    // 构造函数
    /**
     * 
     * @param {Object} video 
     * video 对象
     */
    function ProgressBar(video) {
        this.video = video;
        this.$elem = $('\n        <div class=\'l-c-progressBar\'></div>\n    ');
    }
    // 修改原型
    ProgressBar.prototype = {
        constructor: ProgressBar
    };

    /**
     * 所有控制器操作的汇总
     */

    // 存储控制器的构造函数
    var ControlsConstructors = {};
    ControlsConstructors.playCon = PlayCon;
    ControlsConstructors.voice = Voice;
    ControlsConstructors.timeText = TimeText;
    ControlsConstructors.loop = Loop;
    ControlsConstructors.speed = Speed;
    ControlsConstructors.fullScreen = FullScreen;
    ControlsConstructors.progressBar = ProgressBar;

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
            var $controlsMain = $('<div></div>');
            var $controlsProgress = $('<div></div>');
            $videoControls.append($controlsProgress);
            $videoControls.append($controlsMain);
            $controlsProgress.addClass('l-c-controlsProgress');
            $controlsMain.addClass('l-c-controlsMain');
            objForEach(controls, function (key, control) {
                var $elem = control.$elem;
                if ($elem) {
                    $controlsProgress.append($elem);
                }
                if (key === 'progressBar') ; else {
                    $controlsMain.append($elem);
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
        width: null,
        height: null,
        // 默认控制器配置
        controls: ['progressBar', //进度条
        'playCon', //播放暂停按钮
        'voice', // 声音控制
        // 'setting', //设置
        // 'playMode', //播放方式
        'timeText', //时间显示
        'loop', //循环
        'speed', //播放速度设置
        'fullScreen'],
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
        this.E = E(this);

        this.selector = selector;
        this.config = config;
        this.$selector = $(selector);
    }
    Video.prototype = {

        // 初始化配置
        _initConfig: function _initConfig() {
            var target = {};
            var $selector = this.$selector;
            this.config = Object.assign(target, config, this.config);
            var _config2 = this.config,
                width = _config2.width,
                height = _config2.height;

            // 设置播放器的宽度

            if (width !== null) {
                //如果用户配置了宽度
                if (width <= 350) {
                    // 播放器的最小宽度是350
                    width = 350;
                }
            } else {
                // 如果用户没有配置宽度 则默认为700
                width = 700;
            }        // 设置播放器的高度
            if (height !== null) {
                if (height <= 200) {
                    // 如果用户配置了高度
                    // 播放器的最小高度为200
                    height = 200;
                }
            } else {
                // 如果用户没有配置高度 则默认为200
                height = 480;
            }
            // 将配置配置到播放器上
            $selector.css('width', width + 'px').css('height', height + 'px');
        },

        // 初始化DOM
        _initDom: function _initDom() {
            var _this = this;

            var $selector = this.$selector;
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
            $videoElm.on('click', function () {
                _this.E.play();
            });
            $videoElm.on('dblclick', function () {
                _this.E.fullScreen();
            });
            window.addEventListener('keydown', function (e) {
                var keyCode = e.keyCode;

                if (keyCode === 32) {
                    _this.E.play();
                }
            });
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
    var index = window.liangeVideoJs || Video;

    return index;

})));
