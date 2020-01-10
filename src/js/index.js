import Video from './core/index';

try {
    document;
} catch (error) {
    throw new Error('请在浏览器环境下运行');
};

export default (window.liangeVideoJs || Video);