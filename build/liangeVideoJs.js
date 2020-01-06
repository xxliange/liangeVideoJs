(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    try {
        document;
    } catch (error) {
        throw new Error('请在浏览器环境下运行');
    }
    var inlineCss = '*{    margin: 0;    padding: 0;    color: #000;}',
        style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = inlineCss;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

})));
