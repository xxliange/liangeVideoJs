import Video from './core/index';

try {
    document;
} catch (error) {
    throw new Error('请在浏览器环境下运行');
};

const inlineCss = '__INLINE_CSS__',
    style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = inlineCss;
document.getElementsByTagName('HEAD').item(0).appendChild(style);

export default (window.liangeVideoJs || Video);